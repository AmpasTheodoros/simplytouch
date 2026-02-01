import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  Calculator,
  Zap,
  Droplets,
  Wifi,
  Bell,
  TrendingUp,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calculator,
    title: "Κέρδος ανά κράτηση",
    description:
      "Κάθε booking εμφανίζει έσοδα, αναλυτικά κόστη και το τελικό καθαρό κέρδος. Βλέπεις ακριβώς τι μένει.",
    preview: "€542 έσοδα → €387 καθαρό κέρδος",
  },
  {
    icon: Zap,
    title: "Ανάλυση ρεύματος",
    description:
      "Καταγράφεις μετρήσεις ρεύματος και το σύστημα υπολογίζει αυτόματα το κόστος ανά νύχτα διαμονής.",
    preview: "124 kWh × €0.18 = €22.32",
  },
  {
    icon: Droplets,
    title: "Κόστος νερού",
    description:
      "Παρακολούθηση κατανάλωσης νερού με αυτόματη κατανομή στις ημέρες παραμονής κάθε επισκέπτη.",
    preview: "3.2 m³ × €1.80 = €5.76",
  },
  {
    icon: Wifi,
    title: "Σταθερά έξοδα",
    description:
      "Internet, streaming, ασφάλεια, συνδρομές. Όλα κατανέμονται δίκαια στις κατειλημμένες νύχτες.",
    preview: "€45/μήνα ÷ 22 νύχτες = €2.05/νύχτα",
  },
  {
    icon: Bell,
    title: "Alerts ζημιογόνων κρατήσεων",
    description:
      'Λαμβάνεις ειδοποίηση όταν μια κράτηση έχει margin κάτω από το όριό σου ή είναι ζημιογόνα.',
    preview: "⚠️ Booking #127: Margin 8% (όριο: 40%)",
  },
  {
    icon: TrendingUp,
    title: "Τάσεις κερδοφορίας",
    description:
      "Δες πώς εξελίσσεται το κέρδος σου ανά μήνα, ανά ακίνητο. Εντόπισε patterns και βελτίωσε.",
    preview: "📈 +18% vs προηγούμενο μήνα",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Χαρακτηριστικά</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Όλα τα εργαλεία για πλήρη διαφάνεια
              </h1>

              <p className="text-xl text-muted-foreground">
                Μια πλατφόρμα σχεδιασμένη για hosts που θέλουν να ξέρουν τα
                πραγματικά τους νούμερα.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-card rounded-2xl border border-border p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4 p-4 rounded-xl bg-secondary/50 border border-border">
                    <code className="text-sm text-primary font-medium">
                      {feature.preview}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
                Dashboard Preview
              </h2>

              <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                {/* Dashboard Header Mock */}
                <div className="p-6 border-b border-border bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ιανουάριος 2025
                      </p>
                      <h3 className="font-display font-bold text-2xl text-foreground">
                        Επισκόπηση Κερδοφορίας
                      </h3>
                    </div>
                    <div className="flex gap-3">
                      <div className="px-4 py-2 rounded-lg bg-profit/10 text-profit font-medium text-sm">
                        +12.5% vs πέρυσι
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Κρατήσεις
                      </p>
                      <p className="font-display font-bold text-2xl">12</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Έσοδα
                      </p>
                      <p className="font-display font-bold text-2xl">€4,280</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/30">
                      <p className="text-xs text-muted-foreground mb-1">
                        Κόστη
                      </p>
                      <p className="font-display font-bold text-2xl">€1,120</p>
                    </div>
                    <div className="p-4 rounded-xl bg-profit/10">
                      <p className="text-xs text-muted-foreground mb-1">
                        Κέρδος
                      </p>
                      <p className="font-display font-bold text-2xl text-profit">
                        €3,160
                      </p>
                    </div>
                  </div>

                  {/* Table Preview */}
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left p-4 font-medium text-muted-foreground">
                            Επισκέπτης
                          </th>
                          <th className="text-left p-4 font-medium text-muted-foreground">
                            Ημ/νίες
                          </th>
                          <th className="text-right p-4 font-medium text-muted-foreground">
                            Έσοδα
                          </th>
                          <th className="text-right p-4 font-medium text-muted-foreground">
                            Κόστη
                          </th>
                          <th className="text-right p-4 font-medium text-muted-foreground">
                            Κέρδος
                          </th>
                          <th className="text-right p-4 font-medium text-muted-foreground">
                            Margin
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="p-4 font-medium">John Doe</td>
                          <td className="p-4 text-muted-foreground">
                            15-19 Ιαν
                          </td>
                          <td className="p-4 text-right">€480</td>
                          <td className="p-4 text-right text-muted-foreground">
                            €138
                          </td>
                          <td className="p-4 text-right font-semibold text-profit">
                            €342
                          </td>
                          <td className="p-4 text-right">
                            <span className="px-2 py-1 rounded-full bg-profit/10 text-profit text-xs font-medium">
                              71%
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="p-4 font-medium">Maria S.</td>
                          <td className="p-4 text-muted-foreground">
                            20-22 Ιαν
                          </td>
                          <td className="p-4 text-right">€240</td>
                          <td className="p-4 text-right text-muted-foreground">
                            €95
                          </td>
                          <td className="p-4 text-right font-semibold text-profit">
                            €145
                          </td>
                          <td className="p-4 text-right">
                            <span className="px-2 py-1 rounded-full bg-profit/10 text-profit text-xs font-medium">
                              60%
                            </span>
                          </td>
                        </tr>
                        <tr className="border-t border-border bg-accent/5">
                          <td className="p-4 font-medium">Alex K.</td>
                          <td className="p-4 text-muted-foreground">
                            25-26 Ιαν
                          </td>
                          <td className="p-4 text-right">€120</td>
                          <td className="p-4 text-right text-muted-foreground">
                            €98
                          </td>
                          <td className="p-4 text-right font-semibold text-warning">
                            €22
                          </td>
                          <td className="p-4 text-right">
                            <span className="px-2 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                              18% ⚠️
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 hero-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Δοκίμασε όλα τα χαρακτηριστικά δωρεάν
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              14 ημέρες δωρεάν δοκιμή. Χωρίς πιστωτική κάρτα.
            </p>
            <Link href="/dashboard">
              <Button variant="cta" size="xl">
                Ξεκίνα Δωρεάν
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
