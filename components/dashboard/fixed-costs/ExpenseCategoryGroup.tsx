"use client";

import { Edit, Trash2, Wifi, Tv, Shield, Droplets, Flame, Phone, Package, Wrench } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Expense {
  id: string;
  propertyId: string;
  name: string;
  amountCents: number;
  frequency: "MONTHLY" | "YEARLY";
  category: string;
  active: boolean;
}

interface ExpenseCategoryGroupProps {
  groupedCosts: Record<string, Expense[]>;
  onDeleteExpense: (id: string) => void;
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

export default function ExpenseCategoryGroup({
  groupedCosts,
  onDeleteExpense,
}: ExpenseCategoryGroupProps) {
  const { t } = useLanguage();

  return (
    <>
      {Object.entries(groupedCosts).map(([category, categoryCosts]) => (
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
                      <button className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="Edit">
                        <Edit className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                        aria-label="Delete"
                        onClick={() => onDeleteExpense(cost.id)}
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
      ))}
    </>
  );
}
