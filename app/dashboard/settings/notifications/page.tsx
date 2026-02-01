"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function NotificationsSettingsPage() {
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReports: true,
    pushAlerts: true,
    weeklyDigest: false,
  });

  return (
    <DashboardLayout title="Ειδοποιήσεις" subtitle="Ρυθμίσεις ειδοποιήσεων">
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Πίσω στις Ρυθμίσεις
        </Link>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-6">Ρυθμίσεις Ειδοποιήσεων</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email για νέες κρατήσεις</p>
                <p className="text-sm text-muted-foreground">
                  Λάβετε email όταν γίνεται νέα κράτηση
                </p>
              </div>
              <Switch
                checked={notifications.emailBookings}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, emailBookings: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Μηνιαίες αναφορές</p>
                <p className="text-sm text-muted-foreground">Λάβετε μηνιαία σύνοψη κερδών</p>
              </div>
              <Switch
                checked={notifications.emailReports}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, emailReports: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push ειδοποιήσεις</p>
                <p className="text-sm text-muted-foreground">
                  Alerts για χαμηλό margin κρατήσεων
                </p>
              </div>
              <Switch
                checked={notifications.pushAlerts}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, pushAlerts: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Εβδομαδιαία σύνοψη στο email</p>
              </div>
              <Switch
                checked={notifications.weeklyDigest}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, weeklyDigest: checked }))
                }
              />
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
