import { DashboardOverviewPage } from "@/components/dashboard/DashboardOverviewPage";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { getAuthUser } from "@/lib/auth";
import { getDefaultProperty, getOverviewStats, getMonthlyBookings } from "@/lib/queries/dashboard";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/sign-in");
  }

  const property = await getDefaultProperty(user.id);
  
  // Get current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // If no property, show empty state
  if (!property) {
    return <DashboardEmptyState />;
  }

  const stats = await getOverviewStats(property.id, year, month);
  const bookings = await getMonthlyBookings(property.id, year, month);

  return (
    <DashboardOverviewPage
      initialStats={stats}
      initialBookings={bookings}
      initialPropertyName={property.name}
      monthIndex={month - 1}
      year={year}
    />
  );
}
