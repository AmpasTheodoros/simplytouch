"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingsView from "@/components/dashboard/BookingsView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardBookings() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title={t.bookings.title} subtitle={t.bookings.subtitle}>
      <BookingsView />
    </DashboardLayout>
  );
}
