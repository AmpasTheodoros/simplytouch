import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link as LinkIcon, Calendar, BarChart3, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: LinkIcon,
    title: "Συνδέεις κρατήσεις",
    description:
      "Σύνδεσε το Airbnb, το PMS σου ή εισάγε iCal links. Όλες οι κρατήσεις εμφανίζονται αυτόματα.",
    details: [
      "Άμεση σύνδεση με Airbnb API",
      "Υποστήριξη για iCal feeds",
      "Συμβατότητα με δημοφιλή PMS",
    ],
  },
  {
    number: "02",
    icon: Calendar,
    title: "Παρακολουθείς κατανάλωση & έξοδα",
    description:
      "Καταχώρησε μετρήσεις ρεύματος, νερού και σταθερά μηνιαία έξοδα. Εμείς αναλαμβάνουμε τους υπολογισμούς.",
    details: [
      "Κατανάλωση ρεύματος (kWh)",
      "Κατανάλωση νερού (m³)",
      "Σταθερά έξοδα (internet, συνδρομές)",
      "Καθαρισμός ως turnover event",
    ],
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Βλέπεις καθαρό κέρδος ανά κράτηση",
    description:
      "Κάθε κράτηση εμφανίζεται με αναλυτικά κόστη και το τελικό καθαρό κέρδος. Ξέρεις τι μένει.",
    details: [
      "Αναλυτική κατανομή κόστους",
      "Profit margin ανά booking",
      "Alerts για χαμηλή κερδοφορία",
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Απλή διαδικασία</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Πώς Λειτουργεί
              </h1>

              <p className="text-xl text-muted-foreground">
                Τρία απλά βήματα για να δεις το πραγματικό κέρδος από κάθε κράτηση.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-16">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold mb-4">
                      Βήμα {step.number}
                    </div>

                    <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                      {step.title}
                    </h2>

                    <p className="text-lg text-muted-foreground mb-6">
                      {step.description}
                    </p>

                    <ul className="space-y-3">
                      {step.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-center gap-3 text-foreground"
                        >
                          <CheckCircle2 className="w-5 h-5 text-profit flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className={`${
                      index % 2 === 1 ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <step.icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="h-32 bg-secondary/50 rounded-xl flex items-center justify-center">
                        <span className="text-muted-foreground">
                          [Preview UI]
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cost Allocation */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
                Πώς κατανέμονται τα κόστη
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="text-4xl mb-4">⚡💧</div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    Ρεύμα & Νερό
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Υπολογίζεται η κατανάλωση μεταξύ <strong>check-in</strong> και{" "}
                    <strong>check-out</strong>. Κάθε νύχτα λαμβάνει το ανάλογο μερίδιο.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    Σταθερά Μηνιαία
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Internet, συνδρομές, κ.λπ. μοιράζονται στις{" "}
                    <strong>κατειλημμένες νύχτες</strong> του μήνα.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="text-4xl mb-4">🧹</div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                    Καθαρισμός
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Καταγράφεται ως <strong>turnover event</strong> — χρεώνεται
                    ολόκληρο στην εκάστοτε κράτηση.
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
              Έτοιμος να δεις τα αληθινά νούμερα;
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Ξεκίνα δωρεάν και δες το πραγματικό κέρδος από κάθε κράτηση.
            </p>
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
