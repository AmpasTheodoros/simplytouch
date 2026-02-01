"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Smartphone,
  TrendingUp,
  Receipt,
  Zap,
  Bell,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Επισκόπηση", path: "/dashboard" },
  { icon: Calendar, label: "Κρατήσεις", path: "/dashboard/bookings" },
  { icon: Receipt, label: "Σταθερά Έξοδα", path: "/dashboard/fixed-costs" },
  { icon: Zap, label: "Καθαρισμοί", path: "/dashboard/cleanings" },
  { icon: Smartphone, label: "NFC Guest Page", path: "/dashboard/nfc-editor" },
  { icon: TrendingUp, label: "Τάσεις", path: "/dashboard/trends" },
  { icon: Settings, label: "Ρυθμίσεις", path: "/dashboard/settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <span className="text-sidebar-primary-foreground font-bold text-lg">
                P
              </span>
            </div>
            <span className="font-display font-bold text-lg text-sidebar-foreground">
              ProfitBnB
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.emailAddresses[0]?.emailAddress || ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">P</span>
                </div>
              </Link>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
            </button>
            <Button variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Νέα Κράτηση
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
