import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NFCEditorView from "@/components/dashboard/NFCEditorView";

export default function DashboardNFCEditor() {
  return (
    <DashboardLayout title="NFC Guest Page" subtitle="Επεξεργασία σελίδας επισκέπτη">
      <NFCEditorView />
    </DashboardLayout>
  );
}
