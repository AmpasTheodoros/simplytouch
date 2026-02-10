"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building, Zap, Calendar, Link2, Loader2 } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";
import { createPropertySchema } from "@/lib/validation/property";

export default function AddPropertyPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    timezone: "Europe/Athens",
    pricePerKwh: "0.15",
    waterRate: "2.50",
    cleaningCost: "45",
    defaultCheckout: "11:00",
    airbnbIcal: "",
    bookingIcal: "",
    otherIcal: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      timezone: formData.timezone,
      pricePerWh: Math.round(parseFloat(formData.pricePerKwh) * 100),
    };

    const validation = createPropertySchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation error";
      toast.error(firstError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/dashboard/settings/properties");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      toast.error("An error occurred while creating the property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const timezones = [
    "Europe/Athens",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Europe/Rome",
    "Europe/Madrid",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];

  return (
    <DashboardLayout title={t.addProperty.title} subtitle={t.addProperty.subtitle}>
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings/properties"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.settings.backToSettings}
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.addProperty.basicInfo}</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t.addProperty.propertyName} *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.addProperty.propertyNamePlaceholder}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">{t.addProperty.address}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t.addProperty.addressPlaceholder}
                />
              </div>

              <div>
                <Label htmlFor="timezone">{t.addProperty.timezone}</Label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {timezones.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cost Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.addProperty.costSettings}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricePerKwh">{t.addProperty.electricityRate}</Label>
                <Input
                  id="pricePerKwh"
                  name="pricePerKwh"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.pricePerKwh}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="waterRate">{t.addProperty.waterRate}</Label>
                <Input
                  id="waterRate"
                  name="waterRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.waterRate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="cleaningCost">{t.addProperty.cleaningCost}</Label>
                <Input
                  id="cleaningCost"
                  name="cleaningCost"
                  type="number"
                  min="0"
                  value={formData.cleaningCost}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="defaultCheckout">{t.addProperty.defaultCheckout}</Label>
                <Input
                  id="defaultCheckout"
                  name="defaultCheckout"
                  type="time"
                  value={formData.defaultCheckout}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* iCal URLs */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{t.addProperty.icalUrls}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6 ml-13">
              {t.addProperty.icalHint}
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="airbnbIcal">{t.addProperty.airbnbUrl}</Label>
                <Input
                  id="airbnbIcal"
                  name="airbnbIcal"
                  type="url"
                  value={formData.airbnbIcal}
                  onChange={handleChange}
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                />
              </div>

              <div>
                <Label htmlFor="bookingIcal">{t.addProperty.bookingUrl}</Label>
                <Input
                  id="bookingIcal"
                  name="bookingIcal"
                  type="url"
                  value={formData.bookingIcal}
                  onChange={handleChange}
                  placeholder="https://admin.booking.com/..."
                />
              </div>

              <div>
                <Label htmlFor="otherIcal">{t.addProperty.otherUrl}</Label>
                <Input
                  id="otherIcal"
                  name="otherIcal"
                  type="url"
                  value={formData.otherIcal}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/settings/properties")}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.loading}
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  {t.addProperty.createProperty}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
