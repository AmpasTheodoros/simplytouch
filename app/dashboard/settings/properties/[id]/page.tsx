"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Building, Zap, Link2, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Property = {
  id: string;
  name: string;
  timezone: string;
  pricePerWh: number;
  icalUrl: string | null;
};

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    timezone: "Europe/Athens",
    pricePerKwh: "0.15",
    icalUrl: "",
  });

  useEffect(() => {
    fetchProperty();
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${params.id}`);
      if (response.ok) {
        const property: Property = await response.json();
        setFormData({
          name: property.name,
          timezone: property.timezone,
          pricePerKwh: (property.pricePerWh / 100).toFixed(2),
          icalUrl: property.icalUrl || "",
        });
      } else if (response.status === 404) {
        router.push("/dashboard/settings/properties");
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          timezone: formData.timezone,
          pricePerWh: Math.round(parseFloat(formData.pricePerKwh) * 100),
          icalUrl: formData.icalUrl || null,
        }),
      });

      if (response.ok) {
        router.push("/dashboard/settings/properties");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("An error occurred while updating the property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t.settings.properties.confirmDelete)) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/properties/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard/settings/properties");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("An error occurred while deleting the property");
    } finally {
      setIsDeleting(false);
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

  if (loading) {
    return (
      <DashboardLayout title={t.settings.properties.title} subtitle="">
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t.editProperty.title} subtitle={t.editProperty.subtitle}>
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
          </div>

          {/* iCal URL */}
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

            <div>
              <Label htmlFor="icalUrl">iCal URL</Label>
              <Input
                id="icalUrl"
                name="icalUrl"
                type="url"
                value={formData.icalUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              {t.delete}
            </Button>

            <div className="flex gap-4">
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
                  t.save
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
