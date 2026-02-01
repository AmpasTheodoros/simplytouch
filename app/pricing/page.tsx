import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "9",
    description: "Για hosts με 1 ακίνητο που ξεκινούν.",
    features: [
      "1 ακίνητο",
      "Κέρδος ανά κράτηση",
      "Καταχώρηση κόστους",
      "Μηνιαία αναφορά",
      "NFC Guest Page",
    ],
    cta: "Ξεκίνα Δωρεάν",
    popular: false,
  },
  {
    name: "Pro",
    price: "19",
    description: "Για επαγγελματίες hosts με περισσότερα ακίνητα.",
    features: [
      "Έως 5 ακίνητα",
      "Όλα τα Starter +",
      "Alerts χαμηλού margin",
      "Τάσεις κερδοφορίας",
      "Εξαγωγή δεδομένων",
      "Priority support",
    ],
    cta: "Δοκίμασε Pro",
    popular: true,
  },
  {
    name: "Operator",
    price: "49",
    description: "Για property managers με πολλά ακίνητα.",
    features: [
      "Απεριόριστα ακίνητα",
      "Όλα τα Pro +",
      "Multi-user access",
      "API access",
      "Custom reports",
      "Dedicated support",
    ],
    cta: "Επικοινώνησε",
    popular: false,
  },
];

export default function Pricing() {
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
                <span className="text-sm font-medium">Τιμολόγηση</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Απλή τιμολόγηση, σαφές ROI
              </h1>

              <p className="text-xl text-muted-foreground">
                Ένα booking που σώθηκε, πληρώνει το εργαλείο.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-card rounded-2xl border p-8 ${
                    plan.popular
                      ? "border-primary shadow-xl scale-105"
                      : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      Δημοφιλές
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-2xl text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-display font-bold text-5xl text-foreground">
                        €{plan.price}
                      </span>
                      <span className="text-muted-foreground">/μήνα</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ανά ακίνητο
                    </p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-foreground"
                      >
                        <Check className="w-5 h-5 text-profit flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/dashboard" className="block">
                    <Button
                      variant={plan.popular ? "cta" : "outline-primary"}
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>

            {/* ROI Callout */}
            <div className="mt-16 max-w-3xl mx-auto">
              <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center">
                <h3 className="font-display font-bold text-2xl text-foreground mb-4">
                  Πόσο κοστίζει να μην ξέρεις;
                </h3>
                <p className="text-muted-foreground mb-6">
                  Μια κράτηση με κρυφό κόστος €100 είναι €100 λιγότερο κέρδος.
                  <br />
                  Με €19/μήνα, αρκεί να εντοπίσεις <strong>1 τέτοια κράτηση</strong>{" "}
                  για να έχεις ROI.
                </p>
                <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">
                      Μέσο όφελος ανά host
                    </p>
                    <p className="font-display font-bold text-2xl text-profit">
                      €240/μήνα
                    </p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="font-display font-bold text-2xl text-foreground">
                      12x
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
                Συχνές Ερωτήσεις
              </h2>

              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Υπάρχει δωρεάν δοκιμή;
                  </h4>
                  <p className="text-muted-foreground">
                    Ναι, 14 ημέρες δωρεάν σε όλα τα πλάνα. Χωρίς πιστωτική κάρτα.
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Μπορώ να αλλάξω πλάνο;
                  </h4>
                  <p className="text-muted-foreground">
                    Φυσικά. Αναβάθμιση ή υποβάθμιση οποιαδήποτε στιγμή.
                  </p>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h4 className="font-semibold text-foreground mb-2">
                    Χρειάζεται τεχνικές γνώσεις;
                  </h4>
                  <p className="text-muted-foreground">
                    Καθόλου. Σύνδεση με ένα κλικ, απλή καταχώρηση δεδομένων.
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
              Ξεκίνα σήμερα με 14 ημέρες δωρεάν
            </h2>
            <Link href="/dashboard">
              <Button variant="cta" size="xl">
                Δοκίμασε Δωρεάν
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
