"use client";

import {
  Zap,
  Droplets,
  Wifi,
  Sparkles as SparklesIcon,
  TrendingUp,
  Bell,
  Target,
} from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function EveryFeatureSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t.features.electricityTitle,
      description: t.features.electricityDesc,
    },
    {
      icon: Droplets,
      title: t.features.waterTitle,
      description: t.features.waterDesc,
    },
    {
      icon: SparklesIcon,
      title: t.features.cleaningTitle,
      description: t.features.cleaningDesc,
    },
    {
      icon: Wifi,
      title: t.features.fixedMonthlyTitle,
      description: t.features.fixedMonthlyDesc,
    },
    {
      icon: TrendingUp,
      title: t.features.profitTrendsTitle,
      description: t.features.profitTrendsDesc,
    },
    {
      icon: Bell,
      title: t.features.lowMarginAlertsTitle,
      description: t.features.lowMarginAlertsDesc,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">{t.features.badge}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t.features.headline}
          </h2>

          <p className="text-lg text-muted-foreground">
            {t.features.subheadline}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
