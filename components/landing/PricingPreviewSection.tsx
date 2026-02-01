import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "9",
    description: "Για hosts με 1 ακίνητο",
    features: [
      "1 ακίνητο",
      "Κέρδος ανά κράτηση",
      "NFC Guest Page",
      "Μηνιαία αναφορά",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "Για επαγγελματίες hosts",
    features: [
      "Έως 5 ακίνητα",
      "Όλα τα Starter +",
      "Alerts χαμηλού margin",
      "Τάσεις κερδοφορίας",
      "Εξαγωγή δεδομένων",
    ],
    popular: true,
  },
  {
    name: "Operator",
    price: "49",
    description: "Για property managers",
    features: [
      "Απεριόριστα ακίνητα",
      "Όλα τα Pro +",
      "Multi-user access",
      "API access",
    ],
    popular: false,
  },
];

export function PricingPreviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Απλή τιμολόγηση</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ένα booking που σώθηκε, πληρώνει το εργαλείο
          </h2>

          <p className="text-lg text-muted-foreground">
            Τιμολόγηση ανά ακίνητο, ανά μήνα. 14 ημέρες δωρεάν δοκιμή χωρίς
            πιστωτική κάρτα.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-card rounded-2xl border p-6 ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  Δημοφιλές
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-display font-bold text-xl text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display font-bold text-4xl text-foreground">
                    €{plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/μήνα</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-profit flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/dashboard">
                <Button
                  variant={plan.popular ? "cta" : "outline"}
                  className="w-full"
                  size="sm"
                >
                  Ξεκίνα Δωρεάν
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            Δες αναλυτικά τα πλάνα
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
