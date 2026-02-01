import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OverviewView from "@/components/dashboard/OverviewView";
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
  
  // Format month name in Greek
  const monthNames = [
    "Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος",
    "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος",
    "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"
  ];
  const monthName = `${monthNames[month - 1]} ${year}`;

  // If no property, show empty state
  if (!property) {
    return (
      <DashboardLayout title="Επισκόπηση" subtitle="Δεν υπάρχουν ακίνητα">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Καλώς ήρθατε στο SimplyTouch!</h2>
          <p className="text-muted-foreground mb-4">
            Δημιουργήστε το πρώτο σας ακίνητο για να ξεκινήσετε.
          </p>
          <a 
            href="/dashboard/settings" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Προσθήκη Ακινήτου
          </a>
        </div>
      </DashboardLayout>
    );
  }

  const stats = await getOverviewStats(property.id, year, month);
  const bookings = await getMonthlyBookings(property.id, year, month);

  return (
    <DashboardLayout title="Επισκόπηση" subtitle={monthName}>
      <OverviewView 
        initialStats={stats}
        initialBookings={bookings}
        initialPropertyName={property.name}
      />
    </DashboardLayout>
  );
}
