"use client";

import { TrendingUp, TrendingDown, Calendar, Euro, Percent, BarChart3 } from "lucide-react";

const monthlyData = [
  { month: "Σεπ", revenue: 1200, costs: 380, profit: 820 },
  { month: "Οκτ", revenue: 1450, costs: 420, profit: 1030 },
  { month: "Νοε", revenue: 980, costs: 340, profit: 640 },
  { month: "Δεκ", revenue: 1680, costs: 510, profit: 1170 },
  { month: "Ιαν", revenue: 1200, costs: 317, profit: 883 },
  { month: "Φεβ", revenue: 1350, costs: 390, profit: 960 },
];

const costBreakdown = [
  { category: "Ρεύμα", current: 60, previous: 72, change: -16.7 },
  { category: "Νερό", current: 16, previous: 19, change: -15.8 },
  { category: "Καθαρισμός", current: 180, previous: 180, change: 0 },
  { category: "Σταθερά", current: 61, previous: 61, change: 0 },
];

const occupancyData = [
  { month: "Σεπ", rate: 65 },
  { month: "Οκτ", rate: 78 },
  { month: "Νοε", rate: 52 },
  { month: "Δεκ", rate: 85 },
  { month: "Ιαν", rate: 33 },
  { month: "Φεβ", rate: 45 },
];

export default function TrendsView() {
  const currentMonthProfit = monthlyData[monthlyData.length - 2].profit;
  const previousMonthProfit = monthlyData[monthlyData.length - 3].profit;
  const profitChange = ((currentMonthProfit - previousMonthProfit) / previousMonthProfit) * 100;

  const avgMargin = monthlyData.reduce((sum, m) => sum + (m.profit / m.revenue) * 100, 0) / monthlyData.length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Κέρδος Ιανουαρίου</p>
            {profitChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-profit" />
            ) : (
              <TrendingDown className="w-4 h-4 text-accent" />
            )}
          </div>
          <p className="font-display font-bold text-3xl text-foreground">€{currentMonthProfit}</p>
          <p className={`text-sm mt-1 ${profitChange >= 0 ? "text-profit" : "text-accent"}`}>
            {profitChange >= 0 ? "+" : ""}{profitChange.toFixed(1)}% vs Δεκέμβριο
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Μέσο Margin</p>
            <Percent className="w-4 h-4 text-primary" />
          </div>
          <p className="font-display font-bold text-3xl text-foreground">{avgMargin.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground mt-1">6μηνο μέσος όρος</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Πληρότητα Ιαν</p>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <p className="font-display font-bold text-3xl text-foreground">33%</p>
          <p className="text-sm text-muted-foreground mt-1">10/31 νύχτες</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Κέρδος/Νύχτα</p>
            <Euro className="w-4 h-4 text-profit" />
          </div>
          <p className="font-display font-bold text-3xl text-profit">€88.3</p>
          <p className="text-sm text-muted-foreground mt-1">Μέσος Ιανουαρίου</p>
        </div>
      </div>

      {/* Charts Grid - Simple Tables instead of Recharts for now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Profit Table */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Έσοδα vs Κέρδος</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground">Μήνας</th>
                  <th className="text-right py-2 text-muted-foreground">Έσοδα</th>
                  <th className="text-right py-2 text-muted-foreground">Κόστη</th>
                  <th className="text-right py-2 text-muted-foreground">Κέρδος</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((row) => (
                  <tr key={row.month} className="border-b border-border/50">
                    <td className="py-2 font-medium">{row.month}</td>
                    <td className="text-right py-2">€{row.revenue}</td>
                    <td className="text-right py-2 text-muted-foreground">€{row.costs}</td>
                    <td className="text-right py-2 text-profit font-semibold">€{row.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Ανάλυση Κόστους (vs προηγ. μήνα)</h3>
          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-foreground">{item.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">€{item.previous}</span>
                  <span className="font-semibold">€{item.current}</span>
                  <span className={`text-sm ${item.change < 0 ? "text-profit" : item.change > 0 ? "text-accent" : "text-muted-foreground"}`}>
                    {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Occupancy */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Πληρότητα (6μηνο)</h3>
        <div className="flex items-end justify-between h-[200px] gap-4">
          {occupancyData.map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-primary rounded-t"
                style={{ height: `${item.rate * 1.8}px` }}
              />
              <span className="text-xs text-muted-foreground">{item.month}</span>
              <span className="text-xs font-semibold">{item.rate}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h4 className="font-semibold text-foreground">Insights</h4>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>📉 Η κατανάλωση ρεύματος μειώθηκε 16.7% σε σχέση με τον προηγούμενο μήνα</li>
          <li>💡 Οι κρατήσεις 1 νύχτας έχουν χαμηλότερο margin λόγω σταθερού κόστους καθαρισμού</li>
          <li>📈 Ο Δεκέμβριος ήταν ο πιο κερδοφόρος μήνας με €1,170 καθαρό κέρδος</li>
        </ul>
      </div>
    </div>
  );
}
