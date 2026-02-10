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
import { EXPENSE_CATEGORIES } from "@/lib/constants";

interface NewExpenseForm {
  name: string;
  amountCents: string;
  frequency: "MONTHLY" | "YEARLY";
  category: string;
  active: boolean;
}

interface ExpenseFormDialogProps {
  open: boolean;
  showPreview: boolean;
  isSubmitting: boolean;
  newExpense: NewExpenseForm;
  canSubmit: boolean;
  onFormChange: (field: keyof NewExpenseForm, value: string | boolean) => void;
  onDialogClose: () => void;
  onShowPreview: (show: boolean) => void;
  onCreateExpense: () => void;
}

export default function ExpenseFormDialog({
  open,
  showPreview,
  isSubmitting,
  newExpense,
  canSubmit,
  onFormChange,
  onDialogClose,
  onShowPreview,
  onCreateExpense,
}: ExpenseFormDialogProps) {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onDialogClose}>
      <DialogContent className="max-w-md">
        <DialogClose onClose={onDialogClose} />
        <DialogHeader>
          <DialogTitle>
            {showPreview
              ? (t.expenses?.previewTitle || "Προεπισκόπηση Εξόδου")
              : (t.expenses?.addExpense || "Προσθήκη Εξόδου")}
          </DialogTitle>
          <DialogDescription>
            {showPreview
              ? t.confirm
              : t.expenses.dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          // Form View
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label>{t.expenses?.name || "Όνομα"} *</Label>
              <Input
                value={newExpense.name}
                onChange={(e) => onFormChange("name", e.target.value)}
                placeholder={t.expenses?.namePlaceholder || "π.χ. Internet"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.expenses?.amount || "Ποσό"} (€) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpense.amountCents}
                  onChange={(e) => onFormChange("amountCents", e.target.value)}
                  placeholder={t.expenses?.amountPlaceholder || "π.χ. 35"}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.expenses?.frequency || "Συχνότητα"}</Label>
                <Select
                  value={newExpense.frequency}
                  onChange={(e) => onFormChange("frequency", e.target.value)}
                >
                  <option value="MONTHLY">
                    {t.expenses?.frequencies?.MONTHLY || "Μηνιαία"}
                  </option>
                  <option value="YEARLY">
                    {t.expenses?.frequencies?.YEARLY || "Ετήσια"}
                  </option>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.expenses?.category || "Κατηγορία"}</Label>
              <Select
                value={newExpense.category}
                onChange={(e) => onFormChange("category", e.target.value)}
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.expenses?.categories?.[cat as keyof typeof t.expenses.categories] || cat}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={newExpense.active}
                onChange={(e) => onFormChange("active", e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <Label htmlFor="active" className="cursor-pointer">
                {t.expenses?.active || "Ενεργό"}
              </Label>
            </div>
          </div>
        ) : (
          // Preview View
          <div className="p-6 space-y-4">
            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.expenses?.name || "Όνομα"}:</span>
                <span className="font-medium">{newExpense.name || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.expenses?.amount || "Ποσό"}:</span>
                <span className="font-medium">€{newExpense.amountCents || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.expenses?.frequency || "Συχνότητα"}:</span>
                <span className="font-medium">
                  {t.expenses?.frequencies?.[newExpense.frequency] || newExpense.frequency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.expenses?.category || "Κατηγορία"}:</span>
                <span className="font-medium">
                  {t.expenses?.categories?.[newExpense.category as keyof typeof t.expenses.categories] || newExpense.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t.expenses?.active || "Ενεργό"}:</span>
                <span className="font-medium">{newExpense.active ? "✓" : "✗"}</span>
              </div>
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
                onClick={onCreateExpense}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" role="status" />
                ) : null}
                {t.expenses?.confirmCreate || "Δημιουργία Εξόδου"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
