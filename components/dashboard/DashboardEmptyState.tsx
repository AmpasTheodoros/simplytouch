"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function DashboardEmptyState() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.nav.overview} subtitle={t.dashboard.noProperties}>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">{t.dashboard.welcome}</h2>
        <p className="text-muted-foreground mb-4">
          {t.dashboard.welcomeDesc}
        </p>
        <a 
          href="/dashboard/settings" 
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t.dashboard.addPropertyCta}
        </a>
      </div>
    </DashboardLayout>
  );
}
