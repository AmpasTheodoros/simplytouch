"use client";

import { Loader2 } from "lucide-react";
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
import { useLanguage } from "@/components/providers/LanguageProvider";

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

interface CleaningFormDialogProps {
  open: boolean;
  showPreview: boolean;
  isSubmitting: boolean;
  newCleaning: NewCleaningForm;
  bookings: Booking[];
  canSubmit: boolean;
  selectedBooking: Booking | undefined;
  onFormChange: (field: keyof NewCleaningForm, value: string) => void;
  onDialogClose: () => void;
  onShowPreview: (show: boolean) => void;
  onCreateCleaning: () => void;
}

function formatDate(dateStr: string, locale: string = "el-GR"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export default function CleaningFormDialog({
  open,
  showPreview,
  isSubmitting,
  newCleaning,
  bookings,
  canSubmit,
  selectedBooking,
  onFormChange,
  onDialogClose,
  onShowPreview,
  onCreateCleaning,
}: CleaningFormDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClose={onDialogClose} />
        <DialogHeader>
          <DialogTitle>
            {showPreview
              ? (t.cleanings?.previewTitle || "Προεπισκόπηση Καθαρισμού")
              : (t.cleanings?.newCleaning || "Νέος Καθαρισμός")}
          </DialogTitle>
          <DialogDescription>
            {showPreview
              ? t.confirm
              : t.cleanings.dialogDescription}
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
                onChange={(e) => onFormChange("scheduledAt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.cleanings?.cleanerName || "Όνομα Καθαριστή"}</Label>
              <Input
                value={newCleaning.cleanerName}
                onChange={(e) => onFormChange("cleanerName", e.target.value)}
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
                onChange={(e) => onFormChange("costCents", e.target.value)}
                placeholder={t.cleanings?.costPlaceholder || "π.χ. 45"}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.bookings?.status || "Κατάσταση"}</Label>
              <Select
                value={newCleaning.status}
                onChange={(e) => onFormChange("status", e.target.value as NewCleaningForm["status"])}
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
                onChange={(e) => onFormChange("bookingId", e.target.value)}
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
              <Button variant="outline" onClick={onDialogClose}>
                {t.cancel || "Ακύρωση"}
              </Button>
              <Button
                onClick={() => onShowPreview(true)}
                disabled={!canSubmit}
              >
                {t.preview || "Προεπισκόπηση"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onShowPreview(false)}>
                {t.back || "Πίσω"}
              </Button>
              <Button
                onClick={onCreateCleaning}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" role="status" />
                ) : null}
                {t.cleanings?.confirmCreate || "Δημιουργία Καθαρισμού"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
