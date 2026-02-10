"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import NFCEditorView from "@/components/dashboard/NFCEditorView";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function DashboardNFCEditor() {
  const { t } = useLanguage();

  return (
    <DashboardLayout title="NFC Guest Page" subtitle={t.nfcEditor.pageSubtitle}>
      <NFCEditorView />
    </DashboardLayout>
  );
}
