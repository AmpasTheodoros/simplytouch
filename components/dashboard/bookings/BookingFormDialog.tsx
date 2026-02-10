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
import { BOOKING_SOURCES } from "@/lib/constants";

interface NewBookingForm {
  guestName: string;
  startAt: string;
  endAt: string;
  payoutCents: string;
  platformFeeCents: string;
  source: string;
}

function formatDate(dateStr: string, locale: string = "el-GR"): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
}

export interface BookingFormDialogProps {
  open: boolean;
  onClose: () => void;
  showPreview: boolean;
  onShowPreviewChange: (show: boolean) => void;
  formData: NewBookingForm;
  onFormChange: (field: keyof NewBookingForm, value: string) => void;
  previewNights: number;
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export default function BookingFormDialog({
  open,
  onClose,
  showPreview,
  onShowPreviewChange,
  formData,
  onFormChange,
  previewNights,
  canSubmit,
  isSubmitting,
  onSubmit,
}: BookingFormDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClose={onClose} />
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
                value={formData.guestName}
                onChange={(e) => onFormChange("guestName", e.target.value)}
                placeholder={t.bookings?.guestNamePlaceholder || "π.χ. John Doe"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.bookings?.checkIn || "Check-in"} *</Label>
                <Input
                  type="date"
                  value={formData.startAt}
                  onChange={(e) => onFormChange("startAt", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.bookings?.checkOut || "Check-out"} *</Label>
                <Input
                  type="date"
                  value={formData.endAt}
                  onChange={(e) => onFormChange("endAt", e.target.value)}
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
                  value={formData.payoutCents}
                  onChange={(e) => onFormChange("payoutCents", e.target.value)}
                  placeholder={t.bookings?.payoutPlaceholder || "π.χ. 150"}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.bookings?.platformFee || "Platform Fee"} (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.platformFeeCents}
                  onChange={(e) => onFormChange("platformFeeCents", e.target.value)}
                  placeholder={t.bookings?.platformFeePlaceholder || "π.χ. 15"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.bookings?.source || "Πηγή"}</Label>
              <Select
                value={formData.source}
                onChange={(e) => onFormChange("source", e.target.value)}
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
                <span className="font-medium">{formData.guestName || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.checkIn || "Check-in"}:</span>
                <span className="font-medium">{formData.startAt ? formatDate(formData.startAt) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.checkOut || "Check-out"}:</span>
                <span className="font-medium">{formData.endAt ? formatDate(formData.endAt) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.nights || "Νύχτες"}:</span>
                <span className="font-medium">{previewNights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.payout || "Πληρωμή"}:</span>
                <span className="font-medium">€{formData.payoutCents || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.platformFee || "Platform Fee"}:</span>
                <span className="font-medium">€{formData.platformFeeCents || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.bookings?.source || "Πηγή"}:</span>
                <span className="font-medium capitalize">
                  {t.bookings?.sources?.[formData.source as keyof typeof t.bookings.sources] || formData.source}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {!showPreview ? (
            <>
              <Button variant="outline" onClick={onClose}>
                {t.cancel || "Ακύρωση"}
              </Button>
              <Button
                onClick={() => onShowPreviewChange(true)}
                disabled={!canSubmit}
              >
                {t.preview || "Προεπισκόπηση"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onShowPreviewChange(false)}>
                {t.back || "Πίσω"}
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" role="status" />
                ) : null}
                {t.bookings?.confirmCreate || "Δημιουργία Κράτησης"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
