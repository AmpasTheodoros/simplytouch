import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar skeleton */}
      <aside className="w-64 bg-sidebar flex-shrink-0 hidden lg:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="h-8 w-32 bg-sidebar-accent/50 rounded animate-pulse" />
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 bg-sidebar-accent/30 rounded-lg animate-pulse" />
          ))}
        </nav>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1 min-w-0">
        <header className="h-16 bg-card border-b border-border flex items-center px-6">
          <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        </header>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" role="status" />
          </div>
        </div>
      </main>
    </div>
  );
}
