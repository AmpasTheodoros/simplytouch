"use client";

import { useState, useEffect } from "react";
import { Calendar, Search, Filter, Eye, Edit, Trash2, Plus, Loader2 } from "lucide-react";
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
import { BOOKING_SOURCES } from "@/lib/constants";

interface Booking {
  id: string;
  guestName: string | null;
  startAt: string;
  endAt: string;
  nights: number;
  payoutCents: number;
  platformFeeCents: number;
  source: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  propertyId: string;
}

interface NewBookingForm {
  guestName: string;
  startAt: string;
  endAt: string;
  payoutCents: string;
  platformFeeCents: string;
  source: string;
}

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-muted text-muted-foreground",
  ACTIVE: "bg-profit/10 text-profit",
  UPCOMING: "bg-primary/10 text-primary",
  CANCELLED: "bg-accent/10 text-accent",
};

function getInitials(name: string | null): string {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatDate(dateStr: string, locale: string = "el-GR"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

function calculateNights(startAt: string, endAt: string): number {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export default function BookingsView() {
  const { t } = useLanguage();
  const { properties, selectedPropertyId } = useProperty();
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
  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    guestName: "",
    startAt: "",
    endAt: "",
    payoutCents: "",
    platformFeeCents: "",
    source: "manual",
  });

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
            const res = await fetch(`/api/bookings?propertyId=${prop.id}`);
            if (res.ok) {
              const data = await res.json();
              allBookings.push(...data);
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
        const res = await fetch(`/api/bookings?propertyId=${filterPropertyId}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
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
      alert("Please select a property first");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: filterPropertyId,
          guestName: newBooking.guestName || undefined,
          startAt: new Date(newBooking.startAt).toISOString(),
          endAt: new Date(newBooking.endAt).toISOString(),
          payoutCents: Math.round(parseFloat(newBooking.payoutCents || "0") * 100),
          platformFeeCents: Math.round(parseFloat(newBooking.platformFeeCents || "0") * 100),
          source: newBooking.source,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setBookings((prev) => [created, ...prev]);
        setShowNewBookingDialog(false);
        setShowPreview(false);
        setNewBooking({
          guestName: "",
          startAt: "",
          endAt: "",
          payoutCents: "",
          platformFeeCents: "",
          source: "manual",
        });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create booking");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      alert("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setShowNewBookingDialog(false);
    setShowPreview(false);
    setNewBooking({
      guestName: "",
      startAt: "",
      endAt: "",
      payoutCents: "",
      platformFeeCents: "",
      source: "manual",
    });
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
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-muted-foreground">{error}</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {t.noData || "Δεν υπάρχουν δεδομένα"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.guest || "Επισκέπτης"}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.checkIn || "Check-in"}
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.checkOut || "Check-out"}
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.nights || "Νύχτες"}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.revenue || "Έσοδα"}
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.source || "Πηγή"}
                  </th>
                  <th className="text-center p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.status || "Κατάσταση"}
                  </th>
                  <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                    {t.bookings?.actions || "Ενέργειες"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {getInitials(booking.guestName)}
                          </span>
                        </div>
                        <span className="font-medium text-foreground">
                          {booking.guestName || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{formatDate(booking.startAt)}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(booking.endAt)}</td>
                    <td className="p-4 text-center text-foreground">{booking.nights}</td>
                    <td className="p-4 text-right font-medium text-foreground">
                      €{(booking.payoutCents / 100).toFixed(0)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-foreground capitalize">
                        {t.bookings?.sources?.[booking.source as keyof typeof t.bookings.sources] || booking.source}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                        {t.bookings?.statusLabels?.[booking.status] || booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Booking Dialog */}
      <Dialog open={showNewBookingDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogClose onClose={handleDialogClose} />
          <DialogHeader>
            <DialogTitle>
              {showPreview 
                ? (t.bookings?.previewTitle || "Προεπισκόπηση Κράτησης")
                : (t.bookings?.newBooking || "Νέα Κράτηση")}
            </DialogTitle>
            <DialogDescription>
              {showPreview 
                ? (t.confirm || "Επιβεβαιώστε τα στοιχεία της κράτησης")
                : "Συμπληρώστε τα στοιχεία της κράτησης"}
            </DialogDescription>
          </DialogHeader>

          {!showPreview ? (
            // Form View
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>{t.bookings?.guestName || "Όνομα Επισκέπτη"}</Label>
                <Input
                  value={newBooking.guestName}
                  onChange={(e) => handleFormChange("guestName", e.target.value)}
                  placeholder={t.bookings?.guestNamePlaceholder || "π.χ. John Doe"}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.bookings?.checkIn || "Check-in"} *</Label>
                  <Input
                    type="date"
                    value={newBooking.startAt}
                    onChange={(e) => handleFormChange("startAt", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.bookings?.checkOut || "Check-out"} *</Label>
                  <Input
                    type="date"
                    value={newBooking.endAt}
                    onChange={(e) => handleFormChange("endAt", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.bookings?.payout || "Πληρωμή"} (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBooking.payoutCents}
                    onChange={(e) => handleFormChange("payoutCents", e.target.value)}
                    placeholder={t.bookings?.payoutPlaceholder || "π.χ. 150"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.bookings?.platformFee || "Platform Fee"} (€)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBooking.platformFeeCents}
                    onChange={(e) => handleFormChange("platformFeeCents", e.target.value)}
                    placeholder={t.bookings?.platformFeePlaceholder || "π.χ. 15"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.bookings?.source || "Πηγή"}</Label>
                <Select
                  value={newBooking.source}
                  onChange={(e) => handleFormChange("source", e.target.value)}
                >
                  {BOOKING_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {t.bookings?.sources?.[source as keyof typeof t.bookings.sources] || source}
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
                  <span className="text-muted-foreground">{t.bookings?.guest || "Επισκέπτης"}:</span>
                  <span className="font-medium">{newBooking.guestName || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.checkIn || "Check-in"}:</span>
                  <span className="font-medium">{newBooking.startAt ? formatDate(newBooking.startAt) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.checkOut || "Check-out"}:</span>
                  <span className="font-medium">{newBooking.endAt ? formatDate(newBooking.endAt) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.nights || "Νύχτες"}:</span>
                  <span className="font-medium">{previewNights}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.payout || "Πληρωμή"}:</span>
                  <span className="font-medium">€{newBooking.payoutCents || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.platformFee || "Platform Fee"}:</span>
                  <span className="font-medium">€{newBooking.platformFeeCents || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t.bookings?.source || "Πηγή"}:</span>
                  <span className="font-medium capitalize">
                    {t.bookings?.sources?.[newBooking.source as keyof typeof t.bookings.sources] || newBooking.source}
                  </span>
                </div>
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
                  onClick={handleCreateBooking} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t.bookings?.confirmCreate || "Δημιουργία Κράτησης"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
