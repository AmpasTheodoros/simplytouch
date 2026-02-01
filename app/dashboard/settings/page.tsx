import Link from "next/link";
import { User, Building, Bell, CreditCard, Shield, Palette, ChevronRight } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const settingsSections = [
  {
    id: "profile",
    label: "Προφίλ",
    description: "Διαχείριση πληροφοριών λογαριασμού",
    icon: User,
    href: "/dashboard/settings/profile",
  },
  {
    id: "properties",
    label: "Ακίνητα",
    description: "Διαχείριση ακινήτων και ρυθμίσεων κόστους",
    icon: Building,
    href: "/dashboard/settings/properties",
  },
  {
    id: "notifications",
    label: "Ειδοποιήσεις",
    description: "Ρυθμίσεις email και push ειδοποιήσεων",
    icon: Bell,
    href: "/dashboard/settings/notifications",
  },
  {
    id: "billing",
    label: "Χρεώσεις",
    description: "Διαχείριση συνδρομής και πληρωμών",
    icon: CreditCard,
    href: "/dashboard/settings/billing",
  },
  {
    id: "security",
    label: "Ασφάλεια",
    description: "Κωδικός πρόσβασης και ασφάλεια λογαριασμού",
    icon: Shield,
    href: "/dashboard/settings/security",
  },
  {
    id: "appearance",
    label: "Εμφάνιση",
    description: "Θέμα και γλώσσα εφαρμογής",
    icon: Palette,
    href: "/dashboard/settings/appearance",
  },
];

export default function DashboardSettings() {
  return (
    <DashboardLayout title="Ρυθμίσεις" subtitle="Διαχείριση λογαριασμού">
      <div className="max-w-2xl">
        <div className="bg-card rounded-xl border border-border divide-y divide-border">
          {settingsSections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{section.label}</p>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
