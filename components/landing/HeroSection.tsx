import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Calculator, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-profit animate-pulse" />
              <span className="text-sm text-primary-foreground/80">
                Για Airbnb hosts που θέλουν διαφάνεια
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Γνώρισε το πραγματικό σου{" "}
              <span className="relative">
                κέρδος
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-accent/30 -z-10 rounded" />
              </span>{" "}
              ανά κράτηση
            </h1>

            <p className="text-lg sm:text-xl text-primary-foreground/70 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Όχι απλά έσοδα. Πραγματικά κόστη, πραγματικό κέρδος — αυτόματα.
              Ρεύμα, νερό, καθαρισμός, όλα υπολογισμένα.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/dashboard">
                <Button variant="cta" size="xl" className="w-full sm:w-auto">
                  Δες το πραγματικό σου κέρδος
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Δες demo dashboard
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2 text-primary-foreground/60">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Δωρεάν δοκιμή 14 ημερών</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/60">
                <Calculator className="w-5 h-5" />
                <span className="text-sm">Χωρίς πιστωτική κάρτα</span>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="dashboard-container bg-card p-6 lg:p-8 rounded-2xl shadow-2xl">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Ιανουάριος 2025</p>
                  <h3 className="font-display font-bold text-2xl text-foreground">
                    Επισκόπηση Κερδοφορίας
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-profit/10 text-profit text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  +12.5%
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="stat-card">
                  <p className="text-xs text-muted-foreground mb-1">Συνολικά Έσοδα</p>
                  <p className="font-display font-bold text-xl text-foreground">€4,280</p>
                </div>
                <div className="stat-card">
                  <p className="text-xs text-muted-foreground mb-1">Συνολικά Κόστη</p>
                  <p className="font-display font-bold text-xl text-foreground">€1,120</p>
                </div>
                <div className="stat-card bg-profit/5 border-profit/20">
                  <p className="text-xs text-muted-foreground mb-1">Καθαρό Κέρδος</p>
                  <p className="font-display font-bold text-xl text-profit">€3,160</p>
                </div>
              </div>

              {/* Sample Booking Row */}
              <div className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">JD</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">John Doe</p>
                      <p className="text-xs text-muted-foreground">15-19 Ιαν • 4 νύχτες</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Καθαρό κέρδος</p>
                    <p className="font-bold text-profit">€342</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profit Margin</p>
                  <p className="font-bold text-foreground">73.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
