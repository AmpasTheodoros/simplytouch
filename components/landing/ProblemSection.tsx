"use client";

import { XCircle } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function ProblemSection() {
  const { t } = useLanguage();

  // Cost breakdown data (for visual demonstration)
  const revenue = 450;
  const costs = {
    electricity: 28,
    water: 12,
    cleaning: 65,
    other: 15,
  };
  const totalCosts = Object.values(costs).reduce((a, b) => a + b, 0);
  const netProfit = revenue - totalCosts;
  const margin = ((netProfit / revenue) * 100).toFixed(1);

  // Calculate percentages for the progress bar
  const profitPercent = (netProfit / revenue) * 100;
  const electricityPercent = (costs.electricity / revenue) * 100;
  const waterPercent = (costs.water / revenue) * 100;
  const cleaningPercent = (costs.cleaning / revenue) * 100;
  const otherPercent = (costs.other / revenue) * 100;

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-primary-foreground mb-6">
              <span className="text-sm font-medium">{t.problem.badge}</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {t.problem.headline}
            </h2>

            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              {t.problem.description}
            </p>

            {/* Pain Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{t.problem.point1}</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{t.problem.point2}</span>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{t.problem.point3}</span>
              </div>
            </div>
          </div>

          {/* Right Content - Cost Breakdown Card */}
          <div className="bg-card rounded-2xl p-6 lg:p-8 shadow-lg border border-border">
            <h3 className="font-display font-semibold text-lg text-foreground mb-6">
              {t.problem.cardTitle}
            </h3>

            {/* Stacked Progress Bar */}
            <div className="h-4 rounded-full overflow-hidden flex mb-8">
              <div
                className="bg-profit"
                style={{ width: `${profitPercent}%` }}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${electricityPercent}%` }}
              />
              <div
                className="bg-teal-500"
                style={{ width: `${waterPercent}%` }}
              />
              <div
                className="bg-slate-500"
                style={{ width: `${cleaningPercent}%` }}
              />
              <div
                className="bg-slate-300"
                style={{ width: `${otherPercent}%` }}
              />
            </div>

            {/* Cost Items */}
            <div className="space-y-4">
              {/* Revenue */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{t.problem.revenue}</span>
                </div>
                <span className="font-semibold text-foreground">€{revenue}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Electricity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-muted-foreground">{t.problem.electricity}</span>
                </div>
                <span className="font-medium text-destructive">-€{costs.electricity}</span>
              </div>

              {/* Water */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-teal-500" />
                  <span className="text-muted-foreground">{t.problem.water}</span>
                </div>
                <span className="font-medium text-destructive">-€{costs.water}</span>
              </div>

              {/* Cleaning */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-muted-foreground">{t.problem.cleaning}</span>
                </div>
                <span className="font-medium text-destructive">-€{costs.cleaning}</span>
              </div>

              {/* Other */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="text-muted-foreground">{t.problem.other}</span>
                </div>
                <span className="font-medium text-destructive">-€{costs.other}</span>
              </div>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Net Profit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-profit" />
                  <div>
                    <span className="font-semibold text-foreground">{t.problem.netProfit}</span>
                    <p className="text-xs text-muted-foreground">{margin}% {t.problem.margin}</p>
                  </div>
                </div>
                <span className="font-bold text-xl text-profit">€{netProfit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
