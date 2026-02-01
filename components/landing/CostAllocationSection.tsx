import { Zap, Droplets, Calendar, Sparkles } from "lucide-react";

const allocations = [
  {
    icon: Zap,
    title: "Ρεύμα με τη νύχτα",
    description:
      "Μετρήσεις kWh μεταξύ check-in και check-out, κατανεμημένες δίκαια σε κάθε νύχτα διαμονής.",
  },
  {
    icon: Droplets,
    title: "Νερό με κατανάλωση",
    description:
      "Καταγραφή m³ ανά περίοδο, αυτόματη αναλογία στις ημέρες παραμονής του επισκέπτη.",
  },
  {
    icon: Calendar,
    title: "Σταθερά μοιρασμένα",
    description:
      "Internet, συνδρομές, ασφάλεια — κατανέμονται μόνο στις κατειλημμένες νύχτες του μήνα.",
  },
];

export function CostAllocationSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Αυτόματη κατανομή</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Αυτόματη κατανομή κόστους ανά κράτηση
          </h2>

          <p className="text-lg text-muted-foreground">
            Το ProfitBnB κατανέμει αυτόματα τα έξοδα ρεύματος, νερού και σταθερών
            σε κάθε booking. Εσύ βλέπεις μόνο το καθαρό κέρδος.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {allocations.map((item) => (
            <div
              key={item.title}
              className="text-center group"
            >
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
