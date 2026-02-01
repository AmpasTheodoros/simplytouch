import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 hero-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm text-primary-foreground/80">
              Ξεκίνα δωρεάν σήμερα
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Σταμάτα να μαντεύεις.
            <br />
            Ξέρε τα νούμερά σου.
          </h2>

          <p className="text-lg text-primary-foreground/70 mb-10 max-w-xl mx-auto">
            Δοκίμασε το ProfitBnB δωρεάν για 14 ημέρες. Δες πώς μοιάζει η
            πραγματική κερδοφορία των ακινήτων σου.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="cta" size="xl">
                Δες το πραγματικό σου κέρδος
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="hero-outline" size="xl">
                Δες τα πλάνα τιμολόγησης
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
