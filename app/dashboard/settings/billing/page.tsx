"use client";

import { CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";

export default function BillingSettingsPage() {
  return (
    <DashboardLayout title="Χρεώσεις" subtitle="Διαχείριση συνδρομής">
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Πίσω στις Ρυθμίσεις
        </Link>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Τρέχον Πλάνο</h3>
            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div>
                <p className="font-semibold text-foreground">Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  Δωρεάν για πάντα με βασικά χαρακτηριστικά
                </p>
              </div>
              <Button variant="outline">Αναβάθμιση</Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Μέθοδος Πληρωμής</h3>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Δεν έχετε προσθέσει μέθοδο πληρωμής.</p>
              <p className="text-sm mb-4">
                Προσθέστε κάρτα για να ενεργοποιήσετε premium χαρακτηριστικά.
              </p>
              <Button variant="outline">Προσθήκη Κάρτας</Button>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Ιστορικό Πληρωμών</h3>
            <div className="text-center py-8 text-muted-foreground">
              <p>Δεν υπάρχουν πληρωμές ακόμα.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
