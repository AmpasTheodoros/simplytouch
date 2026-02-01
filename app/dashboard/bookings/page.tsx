import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BookingsView from "@/components/dashboard/BookingsView";

export default function DashboardBookings() {
  return (
    <DashboardLayout title="Κρατήσεις" subtitle="Διαχείριση κρατήσεων">
      <BookingsView />
    </DashboardLayout>
  );
}
