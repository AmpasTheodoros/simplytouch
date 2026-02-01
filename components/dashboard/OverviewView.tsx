"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronDown } from "lucide-react";
import type { OverviewStats, BookingWithAllocation } from "@/lib/queries/dashboard";

interface OverviewViewProps {
  stats?: OverviewStats;
  bookings?: BookingWithAllocation[];
  propertyName?: string;
}

// Helper to format cents as euros
function formatCents(cents: number): string {
  return `€${(cents / 100).toLocaleString("el-GR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Helper to get initials from name
function getInitials(name: string | null): string {
  if (!name) return "??";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// Helper to format date range
function formatDateRange(startAt: Date, endAt: Date): string {
  const start = new Date(startAt);
  const end = new Date(endAt);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = start.toLocaleDateString("el-GR", { month: "short" });
  return `${startDay}-${endDay} ${month}`;
}

export default function OverviewView({ stats, bookings = [], propertyName }: OverviewViewProps) {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  // Use provided stats or defaults
  const totalRevenue = stats?.totalRevenueCents ?? 0;
  const totalCosts = stats?.totalCostsCents ?? 0;
  const totalProfit = stats?.totalProfitCents ?? 0;
  const avgMargin = stats?.avgMarginPercent ?? 0;
  const totalBookings = stats?.totalBookings ?? bookings.length;

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Κρατήσεις</p>
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {totalBookings}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Συνολικά Έσοδα</p>
            <ArrowUpRight className="w-4 h-4 text-profit" />
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {formatCents(totalRevenue)}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Συνολικά Κόστη</p>
            <ArrowDownRight className="w-4 h-4 text-accent" />
          </div>
          <p className="font-display font-bold text-3xl text-foreground">
            {formatCents(totalCosts)}
          </p>
        </div>

        <div className="bg-profit/5 rounded-xl border border-profit/20 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Καθαρό Κέρδος</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-profit/20 text-profit font-medium">
              {avgMargin.toFixed(1)}% margin
            </span>
          </div>
          <p className="font-display font-bold text-3xl text-profit">
            {formatCents(totalProfit)}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-foreground">
            Κρατήσεις Μήνα
          </h2>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            Φίλτρα
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Δεν υπάρχουν κρατήσεις αυτόν τον μήνα
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  Επισκέπτης
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground text-sm">
                  Ημ/νίες
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  Έσοδα
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  Κόστη
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  Κέρδος
                </th>
                <th className="text-right p-4 font-medium text-muted-foreground text-sm">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const costs = booking.costAllocation?.totalCostCents ?? 0;
                const profit = booking.costAllocation?.profitCents ?? (booking.payoutCents - booking.platformFeeCents);
                const margin = booking.costAllocation?.marginPercent ?? 
                  (booking.payoutCents > 0 ? (profit / booking.payoutCents) * 100 : 0);
                const isLowMargin = margin < 50;
                
                return (
                <tr
                  key={booking.id}
                  className={`border-t border-border hover:bg-secondary/30 cursor-pointer transition-colors ${
                    isLowMargin ? "bg-warning/5" : ""
                  } ${selectedBooking === booking.id ? "bg-primary/5" : ""}`}
                  onClick={() =>
                    setSelectedBooking(
                      selectedBooking === booking.id ? null : booking.id
                    )
                  }
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {getInitials(booking.guestName)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {booking.guestName || "Άγνωστος"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.nights} νύχτ{booking.nights > 1 ? "ες" : "α"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {formatDateRange(booking.startAt, booking.endAt)}
                  </td>
                  <td className="p-4 text-right font-medium">
                    {formatCents(booking.payoutCents)}
                  </td>
                  <td className="p-4 text-right text-muted-foreground">
                    {formatCents(costs)}
                  </td>
                  <td
                    className={`p-4 text-right font-semibold ${
                      isLowMargin ? "text-warning" : "text-profit"
                    }`}
                  >
                    {formatCents(profit)}
                  </td>
                  <td className="p-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        margin >= 70
                          ? "bg-profit/10 text-profit"
                          : margin >= 50
                          ? "bg-primary/10 text-primary"
                          : "bg-warning/10 text-warning"
                      }`}
                    >
                      {margin.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        )}

        {/* Booking Detail */}
        {selectedBooking && (
          <div className="border-t border-border p-6 bg-secondary/20">
            {(() => {
              const booking = bookings.find((b) => b.id === selectedBooking);
              if (!booking) return null;

              const allocation = booking.costAllocation;

              return (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">
                    Ανάλυση Κόστους: {booking.guestName || "Άγνωστος"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm text-muted-foreground">
                          Ρεύμα
                        </span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatCents(allocation?.electricityCostCents ?? 0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🧹</span>
                        <span className="text-sm text-muted-foreground">
                          Καθαρισμός
                        </span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatCents(allocation?.cleaningCostCents ?? 0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📅</span>
                        <span className="text-sm text-muted-foreground">
                          Σταθερά
                        </span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatCents(allocation?.fixedCostCents ?? 0)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💰</span>
                        <span className="text-sm text-muted-foreground">
                          Platform Fee
                        </span>
                      </div>
                      <p className="font-semibold text-foreground">
                        {formatCents(booking.platformFeeCents)}
                      </p>
                    </div>
                  </div>
                  {!allocation && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Το κόστος δεν έχει υπολογιστεί ακόμα. Θα υπολογιστεί αυτόματα μετά τη λήξη της κράτησης.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}
