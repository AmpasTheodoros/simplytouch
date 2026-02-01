"use client";

import { User, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfileSettingsPage() {
  return (
    <DashboardLayout title="Προφίλ" subtitle="Ρυθμίσεις λογαριασμού">
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Πίσω στις Ρυθμίσεις
        </Link>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-6">Πληροφορίες Προφίλ</h3>
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <Button variant="outline" size="sm">
                Αλλαγή Φωτογραφίας
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG ή GIF. Μέγιστο 2MB.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Όνομα</Label>
              <Input id="firstName" placeholder="Το όνομά σας" />
            </div>
            <div>
              <Label htmlFor="lastName">Επώνυμο</Label>
              <Input id="lastName" placeholder="Το επώνυμό σας" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="phone">Τηλέφωνο</Label>
              <Input id="phone" placeholder="+30 698 123 4567" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Αποθήκευση
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
