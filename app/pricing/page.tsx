"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { PRICING_PLANS } from "@/lib/pricing";

export default function Pricing() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">{t.pricing.badge}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                {t.pricing.headline}
              </h1>

              <p className="text-xl text-muted-foreground">
                {t.pricing.subheadline}
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {PRICING_PLANS.map((plan) => {
                const planT = t.pricing.plans[plan.id];
                const isPopular = plan.popular;
                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border p-8 ${
                      isPopular
                        ? "bg-foreground border-foreground shadow-xl scale-105 text-background"
                        : "bg-card border-border"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                        {t.pricing.mostPopular}
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3
                        className={`font-display font-bold text-2xl mb-2 ${
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
                        <span className="font-display font-bold text-5xl">
                          €{plan.oneTimeCents / 100}
                        </span>
                        <span
                          className={
                            isPopular ? "text-background/80" : "text-muted-foreground"
                          }
                        >
                          /{t.pricing.oneTime}
                        </span>
                        <p
                          className={`text-sm mt-1 ${
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

                    <ul className="space-y-3 mb-8">
                      {plan.featureKeys.map((key) => (
                        <li
                          key={key}
                          className={`flex items-center gap-3 ${
                            isPopular ? "text-background" : "text-foreground"
                          }`}
                        >
                          <Check
                            className={`w-5 h-5 flex-shrink-0 ${
                              isPopular ? "text-primary" : "text-profit"
                            }`}
                          />
                          <span className="text-sm">
                            {t.pricing.features[key as keyof typeof t.pricing.features]}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/dashboard" className="block">
                      <Button
                        variant={isPopular ? "cta" : "outline-primary"}
                        className="w-full"
                        size="lg"
                      >
                        {t.pricing.cta}
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* ROI Callout */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center">
                <h3 className="font-display font-bold text-2xl text-foreground mb-4">
                  {t.pricing.roi.headline}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t.pricing.roi.description}
                  <br />
                  {t.pricing.roi.roiLine}
                </p>
                <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      {t.pricing.roi.avgBenefit}
                    </p>
                    <p className="font-display font-bold text-2xl text-profit">
                      {t.pricing.roi.avgValue}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      {t.pricing.roi.roiLabel}
                    </p>
                    <p className="font-display font-bold text-2xl text-foreground">
                      {t.pricing.roi.roiValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
                {t.pricing.faq.title}
              </h2>

              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t.pricing.faq.trial.q}
                  </h4>
                  <p className="text-muted-foreground">
                    {t.pricing.faq.trial.a}
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t.pricing.faq.change.q}
                  </h4>
                  <p className="text-muted-foreground">
                    {t.pricing.faq.change.a}
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    {t.pricing.faq.technical.q}
                  </h4>
                  <p className="text-muted-foreground">
                    {t.pricing.faq.technical.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 hero-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              {t.pricing.ctaSection.headline}
            </h2>
            <Link href="/dashboard">
              <Button variant="cta" size="xl">
                {t.pricing.ctaSection.button}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
