import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Target, Eye, BarChart3, ArrowRight, Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Σχετικά με εμάς</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Έσοδα ≠ Κέρδος
              </h1>

              <p className="text-xl text-muted-foreground">
                Μια απλή αλήθεια που αλλάζει τον τρόπο που βλέπεις την
                επιχείρησή σου.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                Η ιστορία μας
              </h2>

              <div className="space-y-6 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Ξεκινήσαμε ως hosts. Είχαμε καλά έσοδα, ή τουλάχιστον έτσι
                  νομίζαμε. Κάθε μήνα βλέπαμε τα νούμερα στο Airbnb και
                  νιώθαμε ικανοποιημένοι.
                </p>

                <p className="text-lg leading-relaxed">
                  Μέχρι που καθίσαμε και υπολογίσαμε τα πραγματικά κόστη.
                  Ρεύμα, νερό, καθαρισμός, internet, συντηρήσεις. Τα νούμερα
                  ήταν πολύ διαφορετικά.
                </p>

                <p className="text-lg leading-relaxed font-medium text-foreground">
                  Κάποιες κρατήσεις που φαίνονταν καλές, στην πραγματικότητα
                  μας έφερναν ζημιά.
                </p>

                <p className="text-lg leading-relaxed">
                  Έτσι δημιουργήσαμε το ProfitBnB. Ένα εργαλείο που κάνει
                  αυτό που κάναμε χειροκίνητα — αλλά αυτόματα, με ακρίβεια,
                  για κάθε κράτηση.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
                Η φιλοσοφία μας
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Eye className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-4">
                    Διαφάνεια
                  </h3>
                  <p className="text-muted-foreground">
                    Οι hosts αξίζουν να ξέρουν τα πραγματικά τους νούμερα. Όχι
                    εκτιμήσεις, αλλά δεδομένα.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-4">
                    Απλότητα
                  </h3>
                  <p className="text-muted-foreground">
                    Χωρίς περιττή πολυπλοκότητα. Καταχώρησε, δες, αποφάσισε.
                    Τίποτα παραπάνω.
                  </p>
                </div>

                <div className="bg-card rounded-2xl border border-border p-8 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-4">
                    Αποφάσεις βάσει δεδομένων
                  </h3>
                  <p className="text-muted-foreground">
                    Τα δεδομένα οδηγούν σε καλύτερες αποφάσεις. Τιμολόγηση,
                    διαχείριση, ανάπτυξη.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <blockquote className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6 italic">
                &ldquo;Δεν μπορείς να βελτιώσεις αυτό που δεν μετράς.&rdquo;
              </blockquote>
              <p className="text-muted-foreground">
                — Peter Drucker
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 hero-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Ξεκίνα να μετράς σωστά
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Δες το πραγματικό κέρδος από κάθε κράτηση.
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
