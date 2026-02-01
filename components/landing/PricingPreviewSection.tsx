"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PRICING_PLANS } from "@/lib/pricing";

export function PricingPreviewSection() {
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t.pricing.badge}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {t.pricing.previewHeadline}
          </h2>

          <p className="text-lg text-muted-foreground">
            {t.pricing.previewSubheadline}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {PRICING_PLANS.map((plan) => {
            const planT = t.pricing.plans[plan.id];
            const isPopular = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  isPopular
                    ? "bg-foreground border-foreground shadow-lg scale-105 text-background"
                    : "bg-card border-border"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {t.pricing.mostPopular}
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3
                    className={`font-display font-bold text-xl mb-1 ${
                      isPopular ? "text-background" : "text-foreground"
                    }`}
                  >
                    {planT.name}
                  </h3>
                  <p
                    className={`text-sm mb-4 ${
                      isPopular ? "text-background/80" : "text-muted-foreground"
                    }`}
                  >
                    {planT.description}
                  </p>
                  <div
                    className={`flex flex-col items-center gap-0 ${
                      isPopular ? "text-background" : "text-foreground"
                    }`}
                  >
                    <span className="font-display font-bold text-4xl">
                      €{plan.oneTimeCents / 100}
                    </span>
                    <span
                      className={`text-sm ${
                        isPopular ? "text-background/80" : "text-muted-foreground"
                      }`}
                    >
                      /{t.pricing.oneTime}
                    </span>
                    <p
                      className={`text-xs mt-1 ${
                        isPopular ? "text-background/80" : "text-muted-foreground"
                      }`}
                    >
                      {t.pricing.platformFee.replace(
                        "{amount}",
                        String(plan.monthlyCents / 100)
                      )}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.featureKeys.map((key) => (
                    <li
                      key={key}
                      className={`flex items-center gap-2 text-sm ${
                        isPopular ? "text-background" : "text-foreground"
                      }`}
                    >
                      <Check
                        className={`w-4 h-4 flex-shrink-0 ${
                          isPopular ? "text-primary" : "text-profit"
                        }`}
                      />
                      <span>
                        {t.pricing.features[key as keyof typeof t.pricing.features]}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link href="/pricing">
                  <Button
                    variant={isPopular ? "cta" : "outline-primary"}
                    className="w-full"
                    size="sm"
                  >
                    {t.pricing.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            {t.pricing.seeAllPlans}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
