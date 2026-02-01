import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FixedCostsView from "@/components/dashboard/FixedCostsView";

export default function DashboardFixedCosts() {
  return (
    <DashboardLayout title="Σταθερά Έξοδα" subtitle="Μηνιαία έξοδα & κατανομή">
      <FixedCostsView />
    </DashboardLayout>
  );
}
