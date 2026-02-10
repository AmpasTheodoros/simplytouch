"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyFilter, { ALL_PROPERTIES } from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";
import { createExpenseSchema } from "@/lib/validation/expense";
import ExpenseFormDialog from "@/components/dashboard/fixed-costs/ExpenseFormDialog";
import ExpenseCategoryGroup from "@/components/dashboard/fixed-costs/ExpenseCategoryGroup";

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
            const res = await fetch(`/api/expenses?propertyId=${prop.id}&pageSize=100`);
            if (res.ok) {
              const json = await res.json();
              allExpenses.push(...(json.data || json));
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
        const res = await fetch(`/api/expenses?propertyId=${filterPropertyId}&pageSize=100`);
        if (res.ok) {
          const json = await res.json();
          setCosts(json.data || json);
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
      toast.error("Please select a property first");
      return;
    }

    const payload = {
      propertyId: filterPropertyId,
      name: newExpense.name,
      amountCents: Math.round(parseFloat(newExpense.amountCents || "0") * 100),
      frequency: newExpense.frequency,
      category: newExpense.category,
      active: newExpense.active,
    };

    const validation = createExpenseSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation error";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        toast.error(err.error || "Failed to create expense");
      }
    } catch (err) {
      console.error("Error creating expense:", err);
      toast.error("Failed to create expense");
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
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" />
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
        <ExpenseCategoryGroup
          groupedCosts={groupedCosts}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {/* Info Box */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <h4 className="font-semibold text-foreground mb-2">
          💡 {t.expenses?.howCalculated || "Πώς υπολογίζονται;"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t.expenses.calculationExplanation}{" "}
          {t.expenses.allocationExample}
        </p>
      </div>

      {/* New Expense Dialog */}
      <ExpenseFormDialog
        open={showNewExpenseDialog}
        showPreview={showPreview}
        isSubmitting={isSubmitting}
        newExpense={newExpense}
        canSubmit={!!canSubmit}
        onFormChange={handleFormChange}
        onDialogClose={handleDialogClose}
        onShowPreview={setShowPreview}
        onCreateExpense={handleCreateExpense}
      />
    </div>
  );
}
