"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrendsView from "@/components/dashboard/TrendsView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardTrends() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.trends.title} subtitle={t.trends.subtitle}>
      <TrendsView />
    </DashboardLayout>
  );
}
