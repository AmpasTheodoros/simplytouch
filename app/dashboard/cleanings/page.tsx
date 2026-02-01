import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CleaningsView from "@/components/dashboard/CleaningsView";

export default function DashboardCleanings() {
  return (
    <DashboardLayout title="Καθαρισμοί" subtitle="Turnover events & ομάδα καθαρισμού">
      <CleaningsView />
    </DashboardLayout>
  );
}
