"use client";

import { useState } from "react";
import { Smartphone, Wifi, FileText, Link, Leaf, Eye, Save, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface GuestPageContent {
  welcomeMessage: string;
  wifiName: string;
  wifiPassword: string;
  checkoutTime: string;
  houseRules: string;
  ecoMessage: string;
  showEcoMessage: boolean;
  customLinks: { label: string; url: string }[];
}

const defaultContent: GuestPageContent = {
  welcomeMessage: "Καλώς ήρθατε στο διαμέρισμά μας! Ελπίζουμε να περάσετε υπέροχα.",
  wifiName: "ApartmentWiFi_5G",
  wifiPassword: "welcome2025",
  checkoutTime: "11:00",
  houseRules: "• Μη κάπνισμα σε εσωτερικούς χώρους\n• Ησυχία μετά τις 22:00\n• Παρακαλούμε σβήστε τα φώτα όταν φεύγετε",
  ecoMessage: "Βοηθήστε μας να προστατεύσουμε το περιβάλλον! Σκεφτείτε την κατανάλωση νερού και ενέργειας.",
  showEcoMessage: true,
  customLinks: [
    { label: "Οδηγός Περιοχής", url: "https://example.com/guide" },
    { label: "Menu Εστιατορίων", url: "https://example.com/restaurants" },
  ],
};

export default function NFCEditorView() {
  const [content, setContent] = useState<GuestPageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const updateContent = (field: keyof GuestPageContent, value: unknown) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="font-display font-semibold text-lg text-foreground">NFC Guest Page Editor</h2>
          <p className="text-sm text-muted-foreground">Επεξεργαστείτε τη σελίδα που βλέπουν οι επισκέπτες όταν σκανάρουν το NFC tag</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveTab(activeTab === "editor" ? "preview" : "editor")}>
            <Eye className="w-4 h-4 mr-2" />
            {activeTab === "editor" ? "Preview" : "Editor"}
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Αποθήκευση
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className={`space-y-6 ${activeTab === "preview" ? "hidden lg:block" : ""}`}>
          {/* Welcome Message */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Μήνυμα Καλωσορίσματος</h3>
            </div>
            <Textarea
              value={content.welcomeMessage}
              onChange={(e) => updateContent("welcomeMessage", e.target.value)}
              rows={3}
              placeholder="Γράψτε ένα μήνυμα καλωσορίσματος..."
            />
          </div>

          {/* WiFi Details */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wifi className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">WiFi</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wifiName">Όνομα Δικτύου</Label>
                <Input
                  id="wifiName"
                  value={content.wifiName}
                  onChange={(e) => updateContent("wifiName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="wifiPassword">Κωδικός</Label>
                <Input
                  id="wifiPassword"
                  value={content.wifiPassword}
                  onChange={(e) => updateContent("wifiPassword", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* House Rules */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Κανόνες Σπιτιού</h3>
            </div>
            <Textarea
              value={content.houseRules}
              onChange={(e) => updateContent("houseRules", e.target.value)}
              rows={4}
              placeholder="Προσθέστε τους κανόνες..."
            />
          </div>

          {/* Eco Message */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-profit" />
                <h3 className="font-semibold text-foreground">Eco Μήνυμα</h3>
              </div>
              <Switch
                checked={content.showEcoMessage}
                onCheckedChange={(checked) => updateContent("showEcoMessage", checked)}
              />
            </div>
            {content.showEcoMessage && (
              <Textarea
                value={content.ecoMessage}
                onChange={(e) => updateContent("ecoMessage", e.target.value)}
                rows={2}
                placeholder="Προσθέστε ένα οικολογικό μήνυμα..."
              />
            )}
          </div>

          {/* Custom Links */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Custom Links</h3>
              </div>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Προσθήκη
              </Button>
            </div>
            <div className="space-y-3">
              {content.customLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input value={link.label} placeholder="Label" className="flex-1" readOnly />
                  <Input value={link.url} placeholder="URL" className="flex-1" readOnly />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${activeTab === "editor" ? "hidden lg:block" : ""}`}>
          <div className="sticky top-6">
            <div className="bg-secondary/50 rounded-2xl p-4 flex justify-center">
              {/* Phone Frame */}
              <div className="w-[280px] bg-foreground rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-card rounded-[2rem] overflow-hidden">
                  {/* Phone Notch */}
                  <div className="h-6 bg-foreground flex justify-center items-end pb-1">
                    <div className="w-20 h-4 bg-card rounded-full" />
                  </div>
                  
                  {/* Screen Content */}
                  <div className="p-4 space-y-4 min-h-[500px]">
                    {/* Header */}
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Smartphone className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">Κεντρικό Διαμέρισμα</h4>
                    </div>

                    {/* Welcome */}
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs text-foreground">{content.welcomeMessage}</p>
                    </div>

                    {/* WiFi */}
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Wifi className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-foreground">WiFi</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <strong>{content.wifiName}</strong><br />
                        Κωδικός: {content.wifiPassword}
                      </p>
                    </div>

                    {/* House Rules */}
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-foreground mb-1">Κανόνες</p>
                      <p className="text-xs text-muted-foreground whitespace-pre-line">{content.houseRules}</p>
                    </div>

                    {/* Eco Message */}
                    {content.showEcoMessage && (
                      <div className="bg-profit/5 rounded-lg p-3 border border-profit/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Leaf className="w-3 h-3 text-profit" />
                          <span className="text-xs font-medium text-profit">Eco</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{content.ecoMessage}</p>
                      </div>
                    )}

                    {/* Links */}
                    <div className="space-y-2">
                      {content.customLinks.map((link, index) => (
                        <div key={index} className="bg-secondary rounded-lg p-2 text-center">
                          <span className="text-xs font-medium text-primary">{link.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
