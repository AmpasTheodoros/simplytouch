"use client";

import { useState, useEffect } from "react";
import { Plus, Check, Clock, AlertCircle, User, Calendar, Euro, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import PropertyFilter, { ALL_PROPERTIES } from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

const statusConfig: Record<string, { label: string; icon: typeof Check; className: string }> = {
  COMPLETED: { label: "Ολοκληρώθηκε", icon: Check, className: "bg-profit/10 text-profit" },
  SCHEDULED: { label: "Προγραμματισμένο", icon: Clock, className: "bg-primary/10 text-primary" },
  CANCELLED: { label: "Ακυρώθηκε", icon: AlertCircle, className: "bg-accent/10 text-accent" },
};

function formatDateTime(dateStr: string, locale: string = "el-GR"): { date: string; time: string } {
  const date = new Date(dateStr);
  return {
    date: date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
  };
}

function formatDate(dateStr: string, locale: string = "el-GR"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
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
            const res = await fetch(`/api/cleaning-events?propertyId=${prop.id}`);
            if (res.ok) {
              const data = await res.json();
              allEvents.push(...data);
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
          fetch(`/api/cleaning-events?propertyId=${filterPropertyId}`),
          fetch(`/api/bookings?propertyId=${filterPropertyId}`),
        ]);
        
        if (eventsRes.ok) {
          const data = await eventsRes.json();
          setEvents(data);
          setError(null);
        } else {
          setError("Failed to load cleaning events");
        }
        
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data);
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
      alert("Please select a property first");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cleaning-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: filterPropertyId,
          scheduledAt: new Date(newCleaning.scheduledAt).toISOString(),
          costCents: Math.round(parseFloat(newCleaning.costCents || "0") * 100),
          cleanerName: newCleaning.cleanerName || undefined,
          status: newCleaning.status,
          bookingId: newCleaning.bookingId || undefined,
        }),
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
        alert(err.error || "Failed to create cleaning event");
      }
    } catch (err) {
      console.error("Error creating cleaning event:", err);
      alert("Failed to create cleaning event");
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

      {/* Cleaning Events */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-muted-foreground">{error}</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t.noData || "Δεν υπάρχουν δεδομένα"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.cleanings?.date || "Ημερομηνία"}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.cleanings?.turnover || "Turnover"}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.cleanings?.cleaner || "Καθαριστής/τρια"}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                    {t.cleanings?.cost || "Κόστος"}
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.status || "Κατάσταση"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const StatusIcon = statusConfig[event.status]?.icon || Clock;
                  const { date, time } = formatDateTime(event.scheduledAt);
                  
                  return (
                    <tr key={event.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{date}</p>
                            <p className="text-xs text-muted-foreground">{time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {event.booking ? (
                          <div className="text-sm">
                            <p className="text-muted-foreground">
                              <span className="text-accent">{t.cleanings?.out || "OUT"}:</span>{" "}
                              {event.booking.guestName || "—"}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-foreground">{event.cleanerName || "—"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Euro className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">
                            {(event.costCents / 100).toFixed(0)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[event.status]?.className || ""}`}>
                          <StatusIcon className="w-3 h-3" />
                          {t.cleanings?.statusLabels?.[event.status] || statusConfig[event.status]?.label || event.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Cleaning Dialog */}
      <Dialog open={showNewCleaningDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogClose onClose={handleDialogClose} />
          <DialogHeader>
            <DialogTitle>
              {showPreview 
                ? (t.cleanings?.previewTitle || "Προεπισκόπηση Καθαρισμού")
                : (t.cleanings?.newCleaning || "Νέος Καθαρισμός")}
            </DialogTitle>
            <DialogDescription>
              {showPreview 
                ? (t.confirm || "Επιβεβαιώστε τα στοιχεία του καθαρισμού")
                : "Συμπληρώστε τα στοιχεία του καθαρισμού"}
            </DialogDescription>
          </DialogHeader>

          {!showPreview ? (
            // Form View
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>{t.cleanings?.scheduledAt || "Ημ/νία & Ώρα"} *</Label>
                <Input
                  type="datetime-local"
                  value={newCleaning.scheduledAt}
                  onChange={(e) => handleFormChange("scheduledAt", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.cleanings?.cleanerName || "Όνομα Καθαριστή"}</Label>
                <Input
                  value={newCleaning.cleanerName}
                  onChange={(e) => handleFormChange("cleanerName", e.target.value)}
                  placeholder={t.cleanings?.cleanerNamePlaceholder || "π.χ. Μαρία Κ."}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.cleanings?.cost || "Κόστος"} (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCleaning.costCents}
                  onChange={(e) => handleFormChange("costCents", e.target.value)}
                  placeholder={t.cleanings?.costPlaceholder || "π.χ. 45"}
                />
              </div>

              <div className="space-y-2">
                <Label>{t.bookings?.status || "Κατάσταση"}</Label>
                <Select
                  value={newCleaning.status}
                  onChange={(e) => handleFormChange("status", e.target.value as NewCleaningForm["status"])}
                >
                  <option value="SCHEDULED">
                    {t.cleanings?.statusLabels?.SCHEDULED || "Προγραμματισμένο"}
                  </option>
                  <option value="COMPLETED">
                    {t.cleanings?.statusLabels?.COMPLETED || "Ολοκληρώθηκε"}
                  </option>
                  <option value="CANCELLED">
                    {t.cleanings?.statusLabels?.CANCELLED || "Ακυρώθηκε"}
                  </option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t.cleanings?.linkedBooking || "Συνδεδεμένη Κράτηση"}</Label>
                <Select
                  value={newCleaning.bookingId}
                  onChange={(e) => handleFormChange("bookingId", e.target.value)}
                >
                  <option value="">{t.cleanings?.selectBooking || "Επιλέξτε κράτηση (προαιρετικό)"}</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guestName || "—"} ({formatDate(booking.startAt)} - {formatDate(booking.endAt)})
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          ) : (
            // Preview View
            <div className="p-6 space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cleanings?.scheduledAt || "Ημ/νία & Ώρα"}:</span>
                  <span className="font-medium">
                    {newCleaning.scheduledAt 
                      ? new Date(newCleaning.scheduledAt).toLocaleString("el-GR")
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cleanings?.cleanerName || "Καθαριστής"}:</span>
                  <span className="font-medium">{newCleaning.cleanerName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.cleanings?.cost || "Κόστος"}:</span>
                  <span className="font-medium">€{newCleaning.costCents || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.status || "Κατάσταση"}:</span>
                  <span className="font-medium">
                    {t.cleanings?.statusLabels?.[newCleaning.status] || newCleaning.status}
                  </span>
                </div>
                {selectedBooking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.cleanings?.linkedBooking || "Κράτηση"}:</span>
                    <span className="font-medium">{selectedBooking.guestName || "—"}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {!showPreview ? (
              <>
                <Button variant="outline" onClick={handleDialogClose}>
                  {t.cancel || "Ακύρωση"}
                </Button>
                <Button 
                  onClick={() => setShowPreview(true)} 
                  disabled={!canSubmit}
                >
                  {t.preview || "Προεπισκόπηση"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  {t.back || "Πίσω"}
                </Button>
                <Button 
                  onClick={handleCreateCleaning} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t.cleanings?.confirmCreate || "Δημιουργία Καθαρισμού"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
