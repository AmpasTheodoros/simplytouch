"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FixedCostsView from "@/components/dashboard/FixedCostsView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardFixedCosts() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.expenses.title} subtitle={t.expenses.subtitle}>
      <FixedCostsView />
    </DashboardLayout>
  );
}
