"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CleaningsView from "@/components/dashboard/CleaningsView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardCleanings() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.cleanings.title} subtitle={t.cleanings.subtitle}>
      <CleaningsView />
    </DashboardLayout>
  );
}
