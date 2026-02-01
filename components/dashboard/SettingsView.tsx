"use client";

import { useState } from "react";
import { User, Building, Bell, CreditCard, Shield, Palette, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const settingsSections = [
  { id: "profile", label: "Προφίλ", icon: User },
  { id: "properties", label: "Ακίνητα", icon: Building },
  { id: "notifications", label: "Ειδοποιήσεις", icon: Bell },
  { id: "billing", label: "Χρεώσεις", icon: CreditCard },
  { id: "security", label: "Ασφάλεια", icon: Shield },
  { id: "appearance", label: "Εμφάνιση", icon: Palette },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReports: true,
    pushAlerts: true,
    weeklyDigest: false,
  });

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <div className="bg-card rounded-xl border border-border p-2">
          {settingsSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                activeSection === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">Πληροφορίες Προφίλ</h3>
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <Button variant="outline" size="sm">Αλλαγή Φωτογραφίας</Button>
                <p className="text-xs text-muted-foreground mt-2">JPG, PNG ή GIF. Μέγιστο 2MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Όνομα</Label>
                <Input id="firstName" defaultValue="Demo" />
              </div>
              <div>
                <Label htmlFor="lastName">Επώνυμο</Label>
                <Input id="lastName" defaultValue="User" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="demo@profitbnb.app" />
              </div>
              <div>
                <Label htmlFor="phone">Τηλέφωνο</Label>
                <Input id="phone" defaultValue="+30 698 123 4567" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Αποθήκευση
              </Button>
            </div>
          </div>
        )}

        {/* Properties Section */}
        {activeSection === "properties" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Τα Ακίνητά μου</h3>
                <Button size="sm">Προσθήκη Ακινήτου</Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                      <Building className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Κεντρικό Διαμέρισμα</p>
                      <p className="text-sm text-muted-foreground">Αθήνα, Κέντρο • 2 υπνοδωμάτια</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Επεξεργασία</Button>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Ρυθμίσεις Κόστους</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="electricityRate">Τιμή ρεύματος (€/kWh)</Label>
                  <Input id="electricityRate" type="number" step="0.01" defaultValue="0.15" />
                </div>
                <div>
                  <Label htmlFor="waterRate">Τιμή νερού (€/m³)</Label>
                  <Input id="waterRate" type="number" step="0.01" defaultValue="2.50" />
                </div>
                <div>
                  <Label htmlFor="cleaningCost">Κόστος καθαρισμού (€)</Label>
                  <Input id="cleaningCost" type="number" defaultValue="45" />
                </div>
                <div>
                  <Label htmlFor="defaultCheckout">Ώρα Check-out</Label>
                  <Input id="defaultCheckout" type="time" defaultValue="11:00" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === "notifications" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">Ρυθμίσεις Ειδοποιήσεων</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email για νέες κρατήσεις</p>
                  <p className="text-sm text-muted-foreground">Λάβετε email όταν γίνεται νέα κράτηση</p>
                </div>
                <Switch
                  checked={notifications.emailBookings}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailBookings: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Μηνιαίες αναφορές</p>
                  <p className="text-sm text-muted-foreground">Λάβετε μηνιαία σύνοψη κερδών</p>
                </div>
                <Switch
                  checked={notifications.emailReports}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, emailReports: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Push ειδοποιήσεις</p>
                  <p className="text-sm text-muted-foreground">Alerts για χαμηλό margin κρατήσεων</p>
                </div>
                <Switch
                  checked={notifications.pushAlerts}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, pushAlerts: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Εβδομαδιαία σύνοψη στο email</p>
                </div>
                <Switch
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weeklyDigest: checked }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Billing Section */}
        {activeSection === "billing" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Τρέχον Πλάνο</h3>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div>
                  <p className="font-semibold text-foreground">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">€19/μήνα • Ανανέωση 15 Φεβ 2025</p>
                </div>
                <Button variant="outline">Αλλαγή Πλάνου</Button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Μέθοδος Πληρωμής</h3>
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-secondary rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Λήξη 12/26</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Επεξεργασία</Button>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === "security" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">Ασφάλεια Λογαριασμού</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Τρέχων Κωδικός</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="newPassword">Νέος Κωδικός</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Επιβεβαίωση Κωδικού</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button>Αλλαγή Κωδικού</Button>
            </div>
          </div>
        )}

        {/* Appearance Section */}
        {activeSection === "appearance" && (
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-6">Εμφάνιση</h3>
            <div className="space-y-6">
              <div>
                <p className="font-medium text-foreground mb-3">Θέμα</p>
                <div className="flex gap-4">
                  <button className="p-4 rounded-lg border-2 border-primary bg-card">
                    <div className="w-20 h-14 rounded bg-background border border-border mb-2" />
                    <p className="text-xs font-medium text-foreground">Light</p>
                  </button>
                  <button className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="w-20 h-14 rounded bg-foreground mb-2" />
                    <p className="text-xs font-medium text-foreground">Dark</p>
                  </button>
                  <button className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                    <div className="w-20 h-14 rounded bg-gradient-to-b from-background to-foreground mb-2" />
                    <p className="text-xs font-medium text-foreground">System</p>
                  </button>
                </div>
              </div>
              <div>
                <p className="font-medium text-foreground mb-3">Γλώσσα</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                    🇬🇷 Ελληνικά
                  </button>
                  <button className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:border-primary/50 transition-colors">
                    🇬🇧 English
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
