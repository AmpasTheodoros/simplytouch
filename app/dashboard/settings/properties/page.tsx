"use client";

import { useEffect, useState } from "react";
import { Building, ArrowLeft, Plus, Loader2, Trash2, Edit, Calendar, Users } from "lucide-react";
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
  createdAt: string;
  _count: {
    bookings: number;
    guestPages: number;
  };
};

export default function PropertiesSettingsPage() {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm(t.settings.properties.confirmDelete)) return;
    
    setDeleting(propertyId);
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== propertyId));
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete property");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("An error occurred while deleting the property");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <DashboardLayout title={t.settings.properties.title} subtitle={t.settings.properties.description}>
      <div className="max-w-2xl">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.settings.backToSettings}
        </Link>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{t.settings.properties.myProperties}</h3>
              <Link href="/dashboard/settings/properties/new">
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.settings.properties.addProperty}
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t.settings.properties.noProperties}</p>
                <p className="text-sm">{t.settings.properties.addFirst}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{property.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {property._count.bookings} {t.settings.properties.bookings}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {property._count.guestPages} {t.settings.properties.guestPages}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/settings/properties/${property.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        disabled={deleting === property.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deleting === property.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">{t.settings.properties.defaultCostSettings}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="electricityRate">{t.settings.properties.electricityRate}</Label>
                <Input id="electricityRate" type="number" step="0.01" placeholder="0.15" />
              </div>
              <div>
                <Label htmlFor="waterRate">{t.settings.properties.waterRate}</Label>
                <Input id="waterRate" type="number" step="0.01" placeholder="2.50" />
              </div>
              <div>
                <Label htmlFor="cleaningCost">{t.settings.properties.cleaningCost}</Label>
                <Input id="cleaningCost" type="number" placeholder="45" />
              </div>
              <div>
                <Label htmlFor="defaultCheckout">{t.settings.properties.defaultCheckout}</Label>
                <Input id="defaultCheckout" type="time" defaultValue="11:00" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>{t.save}</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
