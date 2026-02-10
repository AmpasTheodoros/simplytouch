"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyFilter, { ALL_PROPERTIES } from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";
import { createBookingSchema } from "@/lib/validation/booking";
import BookingsTable from "@/components/dashboard/bookings/BookingsTable";
import BookingFormDialog from "@/components/dashboard/bookings/BookingFormDialog";
import type { Booking } from "@/components/dashboard/bookings/BookingsTable";

interface NewBookingForm {
  guestName: string;
  startAt: string;
  endAt: string;
  payoutCents: string;
  platformFeeCents: string;
  source: string;
}

function calculateNights(startAt: string, endAt: string): number {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

const EMPTY_FORM: NewBookingForm = {
  guestName: "",
  startAt: "",
  endAt: "",
  payoutCents: "",
  platformFeeCents: "",
  source: "manual",
};

export default function BookingsView() {
  const { t } = useLanguage();
  const { properties } = useProperty();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPropertyId, setFilterPropertyId] = useState<string>(ALL_PROPERTIES);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBooking, setNewBooking] = useState<NewBookingForm>({ ...EMPTY_FORM });

  // Fetch bookings when property filter changes
  useEffect(() => {
    async function fetchBookings() {
      // Need a specific property to fetch bookings
      if (filterPropertyId === ALL_PROPERTIES) {
        // If "all properties", fetch from first property or show empty
        if (properties.length === 0) {
          setBookings([]);
          setIsLoading(false);
          return;
        }
        // Fetch from all properties
        setIsLoading(true);
        try {
          const allBookings: Booking[] = [];
          for (const prop of properties) {
            const res = await fetch(`/api/bookings?propertyId=${prop.id}&pageSize=100`);
            if (res.ok) {
              const json = await res.json();
              allBookings.push(...(json.data || json));
            }
          }
          setBookings(allBookings);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch bookings:", err);
          setError("Failed to load bookings");
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/bookings?propertyId=${filterPropertyId}&pageSize=100`);
        if (res.ok) {
          const json = await res.json();
          setBookings(json.data || json);
          setError(null);
        } else {
          setError("Failed to load bookings");
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBookings();
  }, [filterPropertyId, properties]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = !searchQuery ||
      (booking.guestName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Stats for tabs
  const stats = {
    all: bookings.length,
    upcoming: bookings.filter((b) => b.status === "UPCOMING").length,
    active: bookings.filter((b) => b.status === "ACTIVE").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  // Handle form change
  const handleFormChange = (field: keyof NewBookingForm, value: string) => {
    setNewBooking((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate preview nights
  const previewNights = newBooking.startAt && newBooking.endAt
    ? calculateNights(newBooking.startAt, newBooking.endAt)
    : 0;

  // Handle create booking
  const handleCreateBooking = async () => {
    if (!filterPropertyId || filterPropertyId === ALL_PROPERTIES) {
      toast.error("Please select a property first");
      return;
    }

    const payload = {
      propertyId: filterPropertyId,
      guestName: newBooking.guestName || undefined,
      startAt: new Date(newBooking.startAt).toISOString(),
      endAt: new Date(newBooking.endAt).toISOString(),
      payoutCents: Math.round(parseFloat(newBooking.payoutCents || "0") * 100),
      platformFeeCents: Math.round(parseFloat(newBooking.platformFeeCents || "0") * 100),
      source: newBooking.source,
    };

    const validation = createBookingSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation error";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const created = await res.json();
        setBookings((prev) => [created, ...prev]);
        setShowNewBookingDialog(false);
        setShowPreview(false);
        setNewBooking({ ...EMPTY_FORM });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create booking");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setShowNewBookingDialog(false);
    setShowPreview(false);
    setNewBooking({ ...EMPTY_FORM });
  };

  const canSubmit = newBooking.startAt && newBooking.endAt && previewNights > 0;

  return (
    <div className="space-y-6">
      {/* Property Filter */}
      <PropertyFilter
        value={filterPropertyId}
        onChange={setFilterPropertyId}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t.bookings?.searchGuest || "Αναζήτηση επισκέπτη..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            {t.bookings?.filters || "Φίλτρα"}
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            {t.bookings?.calendar || "Ημερολόγιο"}
          </Button>
          <Button onClick={() => setShowNewBookingDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t.bookings?.newBooking || "Νέα Κράτηση"}
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !filterStatus ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.bookings?.all || "Όλες"} ({stats.all})
        </button>
        <button
          onClick={() => setFilterStatus("UPCOMING")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "UPCOMING" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.bookings?.upcoming || "Επερχόμενες"} ({stats.upcoming})
        </button>
        <button
          onClick={() => setFilterStatus("ACTIVE")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "ACTIVE" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.bookings?.active || "Ενεργές"} ({stats.active})
        </button>
        <button
          onClick={() => setFilterStatus("COMPLETED")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === "COMPLETED" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.bookings?.completed || "Ολοκληρωμένες"} ({stats.completed})
        </button>
      </div>

      {/* Bookings Table */}
      <BookingsTable
        bookings={filteredBookings}
        isLoading={isLoading}
        error={error}
      />

      {/* New Booking Dialog */}
      <BookingFormDialog
        open={showNewBookingDialog}
        onClose={handleDialogClose}
        showPreview={showPreview}
        onShowPreviewChange={setShowPreview}
        formData={newBooking}
        onFormChange={handleFormChange}
        previewNights={previewNights}
        canSubmit={!!canSubmit}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateBooking}
      />
    </div>
  );
}
