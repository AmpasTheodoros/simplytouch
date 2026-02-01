import { AlertTriangle, Eye, TrendingDown } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Το πρόβλημα</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Το Airbnb δείχνει{" "}
            <span className="text-muted-foreground line-through decoration-accent/50">
              έσοδα
            </span>
            . Όχι κέρδος.
          </h2>

          <p className="text-lg text-muted-foreground">
            Βλέπεις €500 από μια κράτηση. Αλλά πόσο έμεινε στην τσέπη σου;
            Ρεύμα, νερό, καθαρισμός, internet — ποιος τα υπολογίζει;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Problem 1 */}
          <div className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <Eye className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-3">
              Αόρατα κόστη
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Η κατανάλωση ρεύματος και νερού κρύβεται στους μηνιαίους
              λογαριασμούς. Δεν ξέρεις πόσο στοίχισε κάθε επισκέπτης.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <TrendingDown className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-3">
              Ψευδαισθήσεις εσόδων
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Μια κράτηση φαίνεται καλή, αλλά μετά τα κόστη μένει ελάχιστο
              κέρδος. Ή ακόμα χειρότερα — ζημιά.
            </p>
          </div>

          {/* Problem 3 */}
          <div className="group p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <AlertTriangle className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-3">
              Λάθος αποφάσεις τιμολόγησης
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Χωρίς σωστά δεδομένα, βάζεις λάθος τιμές. Χάνεις χρήματα χωρίς
              να το ξέρεις.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
