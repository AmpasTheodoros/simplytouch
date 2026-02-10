"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OverviewView from "@/components/dashboard/OverviewView";
import { useLanguage } from "@/components/providers/LanguageProvider";
import type { OverviewStats, BookingWithAllocation } from "@/lib/queries/dashboard";

interface DashboardOverviewPageProps {
  initialStats: OverviewStats;
  initialBookings: BookingWithAllocation[];
  initialPropertyName: string;
  monthIndex: number;
  year: number;
}

export function DashboardOverviewPage({
  initialStats,
  initialBookings,
  initialPropertyName,
  monthIndex,
  year,
}: DashboardOverviewPageProps) {
  const { t } = useLanguage();

  const monthName = `${t.dashboard.monthNames[monthIndex]} ${year}`;

  return (
    <DashboardLayout title={t.nav.overview} subtitle={monthName}>
      <OverviewView
        initialStats={initialStats}
        initialBookings={initialBookings}
        initialPropertyName={initialPropertyName}
        monthIndex={monthIndex}
        year={year}
      />
    </DashboardLayout>
  );
}
