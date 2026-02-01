import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SettingsView from "@/components/dashboard/SettingsView";

export default function DashboardSettings() {
  return (
    <DashboardLayout title="Ρυθμίσεις" subtitle="Διαχείριση λογαριασμού">
      <SettingsView />
    </DashboardLayout>
  );
}
