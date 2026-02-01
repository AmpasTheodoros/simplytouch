import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrendsView from "@/components/dashboard/TrendsView";

export default function DashboardTrends() {
  return (
    <DashboardLayout title="Τάσεις" subtitle="Ανάλυση κερδοφορίας">
      <TrendsView />
    </DashboardLayout>
  );
}
