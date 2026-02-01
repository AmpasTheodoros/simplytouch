import { BarChart3 } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "Σύνδεση Κρατήσεων",
    description: "Σύνδεσε Airbnb, PMS ή iCal. Όλες οι κρατήσεις εισάγονται αυτόματα με ένα κλικ.",
  },
  {
    number: "2",
    title: "Καταγραφή Κατανάλωσης",
    description: "Καταχώρησε μετρήσεις ρεύματος, νερού και σταθερά έξοδα. Εμείς κάνουμε τους υπολογισμούς.",
  },
  {
    number: "3",
    title: "Δες Καθαρό Κέρδος",
    description: "Κάθε κράτηση εμφανίζει αναλυτικά κόστη και το τελικό καθαρό κέρδος. Ξέρεις τι μένει.",
  },
];

export function StepsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">3 Βήματα</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Από κρατήσεις σε κέρδος με 3 βήματα
          </h2>

          <p className="text-lg text-muted-foreground">
            Μια απλή διαδικασία για να αποκτήσεις πλήρη εικόνα της κερδοφορίας σου
            σε λιγότερο από 5 λεπτά.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative text-center"
            >
              {/* Circle with number */}
              <div className="w-20 h-20 rounded-full border-2 border-primary bg-background flex items-center justify-center mx-auto mb-6 relative z-10">
                <span className="font-display font-bold text-3xl text-primary">
                  {step.number}
                </span>
              </div>

              <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                {step.title}
              </h3>

              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
