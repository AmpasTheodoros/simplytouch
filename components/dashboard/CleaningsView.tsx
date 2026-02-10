"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyFilter, { ALL_PROPERTIES } from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";
import { createCleaningEventSchema } from "@/lib/validation/cleaning";
import CleaningFormDialog from "@/components/dashboard/cleanings/CleaningFormDialog";
import CleaningsTable from "@/components/dashboard/cleanings/CleaningsTable";

interface CleaningEvent {
  id: string;
  propertyId: string;
  bookingId: string | null;
  scheduledAt: string;
  costCents: number;
  cleanerName: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  booking?: {
    id: string;
    guestName: string | null;
    startAt: string;
    endAt: string;
  } | null;
}

interface Booking {
  id: string;
  guestName: string | null;
  startAt: string;
  endAt: string;
}

interface NewCleaningForm {
  scheduledAt: string;
  costCents: string;
  cleanerName: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  bookingId: string;
}

export default function CleaningsView() {
  const { t } = useLanguage();
  const { properties } = useProperty();
  const [filterPropertyId, setFilterPropertyId] = useState<string>(ALL_PROPERTIES);
  
  const [events, setEvents] = useState<CleaningEvent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showNewCleaningDialog, setShowNewCleaningDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCleaning, setNewCleaning] = useState<NewCleaningForm>({
    scheduledAt: "",
    costCents: "",
    cleanerName: "",
    status: "SCHEDULED",
    bookingId: "",
  });

  // Fetch cleaning events when property filter changes
  useEffect(() => {
    async function fetchCleaningEvents() {
      if (filterPropertyId === ALL_PROPERTIES) {
        if (properties.length === 0) {
          setEvents([]);
          setIsLoading(false);
          return;
        }
        // Fetch from all properties
        setIsLoading(true);
        try {
          const allEvents: CleaningEvent[] = [];
          for (const prop of properties) {
            const res = await fetch(`/api/cleaning-events?propertyId=${prop.id}&pageSize=100`);
            if (res.ok) {
              const json = await res.json();
              allEvents.push(...(json.data || json));
            }
          }
          setEvents(allEvents);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch cleaning events:", err);
          setError("Failed to load cleaning events");
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const [eventsRes, bookingsRes] = await Promise.all([
          fetch(`/api/cleaning-events?propertyId=${filterPropertyId}&pageSize=100`),
          fetch(`/api/bookings?propertyId=${filterPropertyId}&pageSize=100`),
        ]);
        
        if (eventsRes.ok) {
          const json = await eventsRes.json();
          setEvents(json.data || json);
          setError(null);
        } else {
          setError("Failed to load cleaning events");
        }
        
        if (bookingsRes.ok) {
          const json = await bookingsRes.json();
          setBookings(json.data || json);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCleaningEvents();
  }, [filterPropertyId, properties]);

  // Stats
  const completedCount = events.filter((e) => e.status === "COMPLETED").length;
  const scheduledCount = events.filter((e) => e.status === "SCHEDULED").length;
  const totalCost = events.reduce((sum, e) => sum + e.costCents, 0);
  const avgCost = events.length > 0 ? totalCost / events.length : 0;

  // Handle form change
  const handleFormChange = (field: keyof NewCleaningForm, value: string) => {
    setNewCleaning((prev) => ({ ...prev, [field]: value }));
  };

  // Handle create cleaning
  const handleCreateCleaning = async () => {
    if (!filterPropertyId || filterPropertyId === ALL_PROPERTIES) {
      toast.error("Please select a property first");
      return;
    }

    const payload = {
      propertyId: filterPropertyId,
      scheduledAt: new Date(newCleaning.scheduledAt).toISOString(),
      costCents: Math.round(parseFloat(newCleaning.costCents || "0") * 100),
      cleanerName: newCleaning.cleanerName || undefined,
      status: newCleaning.status,
      bookingId: newCleaning.bookingId || undefined,
    };

    const validation = createCleaningEventSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation error";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cleaning-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => [created, ...prev]);
        setShowNewCleaningDialog(false);
        setShowPreview(false);
        setNewCleaning({
          scheduledAt: "",
          costCents: "",
          cleanerName: "",
          status: "SCHEDULED",
          bookingId: "",
        });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create cleaning event");
      }
    } catch (err) {
      console.error("Error creating cleaning event:", err);
      toast.error("Failed to create cleaning event");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setShowNewCleaningDialog(false);
    setShowPreview(false);
    setNewCleaning({
      scheduledAt: "",
      costCents: "",
      cleanerName: "",
      status: "SCHEDULED",
      bookingId: "",
    });
  };

  const canSubmit = newCleaning.scheduledAt && newCleaning.costCents;

  // Get selected booking info for preview
  const selectedBooking = bookings.find((b) => b.id === newCleaning.bookingId);

  return (
    <div className="space-y-6">
      {/* Property Filter */}
      <PropertyFilter
        value={filterPropertyId}
        onChange={setFilterPropertyId}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.cleanings?.totalCleanings || "Συνολικοί Καθαρισμοί"}
          </p>
          <p className="font-display font-bold text-3xl text-foreground">{events.length}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.cleanings?.completedCleanings || "Ολοκληρωμένοι"}
          </p>
          <p className="font-display font-bold text-3xl text-profit">{completedCount}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.cleanings?.scheduledCleanings || "Προγραμματισμένοι"}
          </p>
          <p className="font-display font-bold text-3xl text-primary">{scheduledCount}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.cleanings?.avgCost || "Μέσο Κόστος"}
          </p>
          <p className="font-display font-bold text-3xl text-foreground">
            €{(avgCost / 100).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="font-display font-semibold text-lg text-foreground">
          {t.cleanings?.turnoverEvents || "Turnover Events"}
        </h2>
        <Button onClick={() => setShowNewCleaningDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t.cleanings?.newCleaning || "Νέος Καθαρισμός"}
        </Button>
      </div>

      {/* Cleaning Events Table */}
      <CleaningsTable
        events={events}
        isLoading={isLoading}
        error={error}
      />

      {/* New Cleaning Dialog */}
      <CleaningFormDialog
        open={showNewCleaningDialog}
        showPreview={showPreview}
        isSubmitting={isSubmitting}
        newCleaning={newCleaning}
        bookings={bookings}
        canSubmit={!!canSubmit}
        selectedBooking={selectedBooking}
        onFormChange={handleFormChange}
        onDialogClose={handleDialogClose}
        onShowPreview={setShowPreview}
        onCreateCleaning={handleCreateCleaning}
      />
    </div>
  );
}
