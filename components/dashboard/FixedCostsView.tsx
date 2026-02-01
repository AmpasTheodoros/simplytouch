"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Wifi, Tv, Shield, Droplets, Flame, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const fixedCostsData = [
  {
    id: 1,
    name: "Internet",
    icon: Wifi,
    amount: 35,
    frequency: "Μηνιαία",
    category: "utilities",
    active: true,
  },
  {
    id: 2,
    name: "Netflix",
    icon: Tv,
    amount: 13.99,
    frequency: "Μηνιαία",
    category: "subscriptions",
    active: true,
  },
  {
    id: 3,
    name: "Ασφάλεια Ακινήτου",
    icon: Shield,
    amount: 45,
    frequency: "Μηνιαία",
    category: "insurance",
    active: true,
  },
  {
    id: 4,
    name: "Κοινόχρηστα",
    icon: Droplets,
    amount: 80,
    frequency: "Μηνιαία",
    category: "utilities",
    active: true,
  },
  {
    id: 5,
    name: "Φυσικό Αέριο (πάγιο)",
    icon: Flame,
    amount: 12,
    frequency: "Μηνιαία",
    category: "utilities",
    active: true,
  },
  {
    id: 6,
    name: "Τηλέφωνο",
    icon: Phone,
    amount: 25,
    frequency: "Μηνιαία",
    category: "utilities",
    active: false,
  },
];

const categories: Record<string, string> = {
  utilities: "Πάροχοι",
  subscriptions: "Συνδρομές",
  insurance: "Ασφάλειες",
};

export default function FixedCostsView() {
  const [costs] = useState(fixedCostsData);

  const totalMonthly = costs.filter((c) => c.active).reduce((sum, c) => sum + c.amount, 0);
  const totalYearly = totalMonthly * 12;

  const groupedCosts = costs.reduce((acc, cost) => {
    if (!acc[cost.category]) acc[cost.category] = [];
    acc[cost.category].push(cost);
    return acc;
  }, {} as Record<string, typeof costs>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Μηνιαίο Σύνολο</p>
          <p className="font-display font-bold text-3xl text-foreground">€{totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Ετήσιο Σύνολο</p>
          <p className="font-display font-bold text-3xl text-foreground">€{totalYearly.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm text-muted-foreground mb-2">Κόστος / Νύχτα (20 νύχτες)</p>
          <p className="font-display font-bold text-3xl text-primary">€{(totalMonthly / 20).toFixed(2)}</p>
        </div>
      </div>

      {/* Add New Cost */}
      <div className="flex justify-end">
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Προσθήκη Εξόδου
        </Button>
      </div>

      {/* Costs by Category */}
      {Object.entries(groupedCosts).map(([category, categoryCosts]) => (
        <div key={category} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border bg-secondary/30">
            <h3 className="font-semibold text-foreground">{categories[category]}</h3>
          </div>
          <div className="divide-y divide-border">
            {categoryCosts.map((cost) => (
              <div
                key={cost.id}
                className={`p-4 flex items-center justify-between ${!cost.active ? "opacity-50" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cost.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{cost.name}</p>
                    <p className="text-sm text-muted-foreground">{cost.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-foreground">€{cost.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Info Box */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <h4 className="font-semibold text-foreground mb-2">💡 Πώς υπολογίζονται;</h4>
        <p className="text-sm text-muted-foreground">
          Τα σταθερά έξοδα κατανέμονται αναλογικά στις κρατήσεις βάσει των νυχτών διαμονής. 
          Για παράδειγμα, αν έχεις 20 νύχτες κρατήσεις τον μήνα, κάθε νύχτα επιβαρύνεται με €{(totalMonthly / 20).toFixed(2)}.
        </p>
      </div>
    </div>
  );
}
