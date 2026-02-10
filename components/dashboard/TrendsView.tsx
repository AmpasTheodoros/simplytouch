"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Calendar, Euro, Percent, BarChart3, Loader2 } from "lucide-react";
import PropertyFilter, { ALL_PROPERTIES } from "@/components/dashboard/PropertyFilter";
import { useProperty } from "@/components/providers/PropertyProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface MonthlyData {
  month: string;
  revenue: number;
  costs: number;
  profit: number;
}

interface CostBreakdown {
  category: string;
  current: number;
  previous: number;
  change: number;
}

interface OccupancyData {
  month: string;
  rate: number;
}

export default function TrendsView() {
  const { t } = useLanguage();
  const { properties } = useProperty();
  const [filterPropertyId, setFilterPropertyId] = useState<string>(ALL_PROPERTIES);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);

  // Fetch trends data when property filter changes
  useEffect(() => {
    async function fetchTrendsData() {
      setIsLoading(true);
      
      // For now, show empty state since trends API doesn't exist yet
      // In the future, this would fetch from /api/trends?propertyId=...
      try {
        // Placeholder: Reset data when switching properties
        setMonthlyData([]);
        setCostBreakdown([]);
        setOccupancyData([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (properties.length > 0) {
      fetchTrendsData();
    } else {
      setIsLoading(false);
    }
  }, [filterPropertyId, properties]);

  // Calculate stats (with fallbacks for empty data)
  const currentMonthProfit = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2].profit : 0;
  const previousMonthProfit = monthlyData.length >= 3 ? monthlyData[monthlyData.length - 3].profit : 0;
  const profitChange = previousMonthProfit > 0 
    ? ((currentMonthProfit - previousMonthProfit) / previousMonthProfit) * 100 
    : 0;

  const avgMargin = monthlyData.length > 0
    ? monthlyData.reduce((sum, m) => sum + (m.revenue > 0 ? (m.profit / m.revenue) * 100 : 0), 0) / monthlyData.length
    : 0;

  const hasData = monthlyData.length > 0 || costBreakdown.length > 0 || occupancyData.length > 0;

  return (
    <div className="space-y-6">
      {/* Property Filter */}
      <PropertyFilter
        value={filterPropertyId}
        onChange={setFilterPropertyId}
      />

      {isLoading ? (
        <div className="bg-card rounded-xl border border-border p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" role="status" />
        </div>
      ) : !hasData ? (
        <div className="bg-card rounded-xl border border-border p-12">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">
              {t.noData}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t.trends.emptyDescription}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t.trends.monthProfit}</p>
                {profitChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-profit" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-accent" />
                )}
              </div>
              <p className="font-display font-bold text-3xl text-foreground">{currentMonthProfit}</p>
              <p className={`text-sm mt-1 ${profitChange >= 0 ? "text-profit" : "text-accent"}`}>
                {profitChange >= 0 ? "+" : ""}{profitChange.toFixed(1)}% {t.trends.vsPrevious}
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t.trends.avgMargin}</p>
                <Percent className="w-4 h-4 text-primary" />
              </div>
              <p className="font-display font-bold text-3xl text-foreground">{avgMargin.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-1">{t.trends.average}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t.trends.occupancy}</p>
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="font-display font-bold text-3xl text-foreground">
                {occupancyData.length > 0 ? `${occupancyData[occupancyData.length - 1].rate}%` : "\u2014"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{t.trends.currentMonth}</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t.trends.profitPerNight}</p>
                <Euro className="w-4 h-4 text-profit" />
              </div>
              <p className="font-display font-bold text-3xl text-profit">
                {monthlyData.length > 0 ? `\u20AC${(currentMonthProfit / 10).toFixed(1)}` : "\u2014"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{t.trends.average}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue & Profit Table */}
            {monthlyData.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">{t.trends.revenueVsProfit}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" aria-label={t.trends.revenueVsProfit}>
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground">{t.trends.month}</th>
                        <th className="text-right py-2 text-muted-foreground">{t.trends.revenue}</th>
                        <th className="text-right py-2 text-muted-foreground">{t.trends.costs}</th>
                        <th className="text-right py-2 text-muted-foreground">{t.trends.profit}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((row) => (
                        <tr key={row.month} className="border-b border-border/50">
                          <td className="py-2 font-medium">{row.month}</td>
                          <td className="text-right py-2">{row.revenue}</td>
                          <td className="text-right py-2 text-muted-foreground">{row.costs}</td>
                          <td className="text-right py-2 text-profit font-semibold">{row.profit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            {costBreakdown.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4">{t.trends.costAnalysisVsPrev}</h3>
                <div className="space-y-4">
                  {costBreakdown.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <span className="text-foreground">{item.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{item.previous}</span>
                        <span className="font-semibold">{item.current}</span>
                        <span className={`text-sm ${item.change < 0 ? "text-profit" : item.change > 0 ? "text-accent" : "text-muted-foreground"}`}>
                          {item.change > 0 ? "+" : ""}{item.change.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Occupancy */}
          {occupancyData.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">{t.trends.occupancy}</h3>
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
          )}

          {/* Insights */}
          <div className="bg-primary/5 rounded-xl border border-primary/20 p-6">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">{t.trends.insights}</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.trends.insightsDescription}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
