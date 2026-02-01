"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecuritySettingsPage() {
  return (
    <DashboardLayout title="Ασφάλεια" subtitle="Ρυθμίσεις ασφαλείας">
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Πίσω στις Ρυθμίσεις
        </Link>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-6">Αλλαγή Κωδικού</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="currentPassword">Τρέχων Κωδικός</Label>
              <Input id="currentPassword" type="password" placeholder="••••••••" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">Νέος Κωδικός</Label>
                <Input id="newPassword" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button>Αλλαγή Κωδικού</Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 mt-4">
          <h3 className="font-semibold text-foreground mb-4">Διαγραφή Λογαριασμού</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Η διαγραφή του λογαριασμού σας είναι μόνιμη και δεν μπορεί να αναιρεθεί.
            Όλα τα δεδομένα σας θα διαγραφούν.
          </p>
          <Button variant="destructive">Διαγραφή Λογαριασμού</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
