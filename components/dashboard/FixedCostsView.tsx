"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Wifi, Tv, Shield, Droplets, Flame, Phone, Package, Wrench, Loader2 } from "lucide-react";
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
import { EXPENSE_CATEGORIES } from "@/lib/constants";

interface Expense {
  id: string;
  propertyId: string;
  name: string;
  amountCents: number;
  frequency: "MONTHLY" | "YEARLY";
  category: string;
  active: boolean;
}

interface NewExpenseForm {
  name: string;
  amountCents: string;
  frequency: "MONTHLY" | "YEARLY";
  category: string;
  active: boolean;
}

// Icon mapping for categories
const categoryIcons: Record<string, typeof Wifi> = {
  utilities: Droplets,
  subscriptions: Tv,
  insurance: Shield,
  maintenance: Wrench,
  other: Package,
};

// Get icon based on expense name or category
function getExpenseIcon(name: string, category: string) {
  const nameLower = name.toLowerCase();
  if (nameLower.includes("internet") || nameLower.includes("wifi")) return Wifi;
  if (nameLower.includes("netflix") || nameLower.includes("tv") || nameLower.includes("streaming")) return Tv;
  if (nameLower.includes("ασφάλεια") || nameLower.includes("insurance")) return Shield;
  if (nameLower.includes("αέριο") || nameLower.includes("gas") || nameLower.includes("θέρμανση")) return Flame;
  if (nameLower.includes("τηλέφωνο") || nameLower.includes("phone")) return Phone;
  if (nameLower.includes("νερό") || nameLower.includes("water") || nameLower.includes("κοινόχρηστα")) return Droplets;
  return categoryIcons[category] || Package;
}

export default function FixedCostsView() {
  const { t } = useLanguage();
  const { properties } = useProperty();
  const [filterPropertyId, setFilterPropertyId] = useState<string>(ALL_PROPERTIES);
  
  const [costs, setCosts] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showNewExpenseDialog, setShowNewExpenseDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState<NewExpenseForm>({
    name: "",
    amountCents: "",
    frequency: "MONTHLY",
    category: "utilities",
    active: true,
  });

  // Fetch expenses when property filter changes
  useEffect(() => {
    async function fetchExpenses() {
      if (filterPropertyId === ALL_PROPERTIES) {
        if (properties.length === 0) {
          setCosts([]);
          setIsLoading(false);
          return;
        }
        // Fetch from all properties
        setIsLoading(true);
        try {
          const allExpenses: Expense[] = [];
          for (const prop of properties) {
            const res = await fetch(`/api/expenses?propertyId=${prop.id}`);
            if (res.ok) {
              const data = await res.json();
              allExpenses.push(...data);
            }
          }
          setCosts(allExpenses);
          setError(null);
        } catch (err) {
          console.error("Failed to fetch expenses:", err);
          setError("Failed to load expenses");
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/expenses?propertyId=${filterPropertyId}`);
        if (res.ok) {
          const data = await res.json();
          setCosts(data);
          setError(null);
        } else {
          setError("Failed to load expenses");
        }
      } catch (err) {
        console.error("Failed to fetch expenses:", err);
        setError("Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchExpenses();
  }, [filterPropertyId, properties]);

  // Calculate totals (only active expenses)
  const activeExpenses = costs.filter((c) => c.active);
  const totalMonthly = activeExpenses.reduce((sum, c) => {
    if (c.frequency === "MONTHLY") return sum + c.amountCents;
    return sum + c.amountCents / 12; // Convert yearly to monthly
  }, 0);
  const totalYearly = totalMonthly * 12;

  // Group by category
  const groupedCosts = costs.reduce((acc, cost) => {
    if (!acc[cost.category]) acc[cost.category] = [];
    acc[cost.category].push(cost);
    return acc;
  }, {} as Record<string, Expense[]>);

  // Handle form change
  const handleFormChange = (field: keyof NewExpenseForm, value: string | boolean) => {
    setNewExpense((prev) => ({ ...prev, [field]: value }));
  };

  // Handle create expense
  const handleCreateExpense = async () => {
    if (!filterPropertyId || filterPropertyId === ALL_PROPERTIES) {
      alert("Please select a property first");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: filterPropertyId,
          name: newExpense.name,
          amountCents: Math.round(parseFloat(newExpense.amountCents || "0") * 100),
          frequency: newExpense.frequency,
          category: newExpense.category,
          active: newExpense.active,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setCosts((prev) => [created, ...prev]);
        setShowNewExpenseDialog(false);
        setShowPreview(false);
        setNewExpense({
          name: "",
          amountCents: "",
          frequency: "MONTHLY",
          category: "utilities",
          active: true,
        });
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create expense");
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      alert("Failed to create expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm(t.delete + "?")) return;
    
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCosts((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setShowNewExpenseDialog(false);
    setShowPreview(false);
    setNewExpense({
      name: "",
      amountCents: "",
      frequency: "MONTHLY",
      category: "utilities",
      active: true,
    });
  };

  const canSubmit = newExpense.name && newExpense.amountCents;

  return (
    <div className="space-y-6">
      {/* Property Filter */}
      <PropertyFilter
        value={filterPropertyId}
        onChange={setFilterPropertyId}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.expenses?.monthlyTotal || "Μηνιαίο Σύνολο"}
          </p>
          <p className="font-display font-bold text-3xl text-foreground">
            €{(totalMonthly / 100).toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.expenses?.yearlyTotal || "Ετήσιο Σύνολο"}
          </p>
          <p className="font-display font-bold text-3xl text-foreground">
            €{(totalYearly / 100).toFixed(2)}
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">
            {t.expenses?.costPerNight || "Κόστος / Νύχτα"} (20 {t.expenses?.nightsAssumed || "νύχτες"})
          </p>
          <p className="font-display font-bold text-3xl text-primary">
            €{(totalMonthly / 100 / 20).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Add New Cost */}
      <div className="flex justify-end">
        <Button onClick={() => setShowNewExpenseDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t.expenses?.addExpense || "Προσθήκη Εξόδου"}
        </Button>
      </div>

      {/* Loading/Error/Empty States */}
      {isLoading ? (
        <div className="bg-card rounded-xl border border-border p-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          {error}
        </div>
      ) : costs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
          {t.noData || "Δεν υπάρχουν δεδομένα"}
        </div>
      ) : (
        /* Costs by Category */
        Object.entries(groupedCosts).map(([category, categoryCosts]) => (
          <div key={category} className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-secondary/30">
              <h3 className="font-semibold text-foreground">
                {t.expenses?.categories?.[category as keyof typeof t.expenses.categories] || category}
              </h3>
            </div>
            <div className="divide-y divide-border">
              {categoryCosts.map((cost) => {
                const Icon = getExpenseIcon(cost.name, cost.category);
                return (
                  <div
                    key={cost.id}
                    className={`p-4 flex items-center justify-between ${!cost.active ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{cost.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.expenses?.frequencies?.[cost.frequency] || cost.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-semibold text-foreground">
                        €{(cost.amountCents / 100).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button 
                          className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          onClick={() => handleDeleteExpense(cost.id)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Info Box */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <h4 className="font-semibold text-foreground mb-2">
          💡 {t.expenses?.howCalculated || "Πώς υπολογίζονται;"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t.expenses?.calculationExplanation || 
            "Τα σταθερά έξοδα κατανέμονται αναλογικά στις κρατήσεις βάσει των νυχτών διαμονής."}{" "}
          {t.expenses?.costPerNight ? "" : `Για παράδειγμα, αν έχεις 20 νύχτες κρατήσεις τον μήνα, κάθε νύχτα επιβαρύνεται με €${(totalMonthly / 100 / 20).toFixed(2)}.`}
        </p>
      </div>

      {/* New Expense Dialog */}
      <Dialog open={showNewExpenseDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-md">
          <DialogClose onClose={handleDialogClose} />
          <DialogHeader>
            <DialogTitle>
              {showPreview 
                ? (t.expenses?.previewTitle || "Προεπισκόπηση Εξόδου")
                : (t.expenses?.addExpense || "Προσθήκη Εξόδου")}
            </DialogTitle>
            <DialogDescription>
              {showPreview 
                ? (t.confirm || "Επιβεβαιώστε τα στοιχεία του εξόδου")
                : "Συμπληρώστε τα στοιχεία του εξόδου"}
            </DialogDescription>
          </DialogHeader>

          {!showPreview ? (
            // Form View
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>{t.expenses?.name || "Όνομα"} *</Label>
                <Input
                  value={newExpense.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
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
                    onChange={(e) => handleFormChange("amountCents", e.target.value)}
                    placeholder={t.expenses?.amountPlaceholder || "π.χ. 35"}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.expenses?.frequency || "Συχνότητα"}</Label>
                  <Select
                    value={newExpense.frequency}
                    onChange={(e) => handleFormChange("frequency", e.target.value)}
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
                  onChange={(e) => handleFormChange("category", e.target.value)}
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
                  onChange={(e) => handleFormChange("active", e.target.checked)}
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
                  onClick={handleCreateExpense} 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {t.expenses?.confirmCreate || "Δημιουργία Εξόδου"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
