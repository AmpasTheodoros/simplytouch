import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Smartphone, Check, ArrowRight, Leaf, Wifi, FileText } from "lucide-react";

export function NFCValueSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">NFC Guest Page</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Guest value meets host intelligence
              </h2>

              <p className="text-lg text-muted-foreground mb-8">
                Με ένα NFC tag στο κατάλυμα, ο επισκέπτης έχει πρόσβαση σε όλες
                τις πληροφορίες. Εσύ επεξεργάζεσαι το περιεχόμενο και
                παρακολουθείς τη χρήση.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-profit" />
                  </div>
                  <span className="text-foreground">
                    Εύκολη επεξεργασία κειμένων, εικόνων, links
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-profit" />
                  </div>
                  <span className="text-foreground">
                    Δομημένο UI, δεν χρειάζεσαι website builder
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-profit" />
                  </div>
                  <span className="text-foreground">
                    Eco μηνύματα για ενθάρρυνση εξοικονόμησης
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-profit/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-profit" />
                  </div>
                  <span className="text-foreground">
                    Preview σε πραγματικό χρόνο
                  </span>
                </li>
              </ul>

              <Link href="/nfc">
                <Button variant="outline-primary" size="lg">
                  Μάθε περισσότερα για NFC
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right - Phone Mockup */}
            <div className="relative flex justify-center">
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-72 bg-card rounded-[2.5rem] border-4 border-primary/20 p-3 shadow-2xl">
                  {/* Phone Screen */}
                  <div className="bg-secondary/50 rounded-[2rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="bg-primary/5 px-6 py-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-muted-foreground/30 rounded-sm" />
                        <div className="w-4 h-2 bg-muted-foreground/30 rounded-sm" />
                        <div className="w-6 h-3 bg-profit rounded-sm" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">🏠</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-foreground">
                          Καλώς ήρθατε!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Seaside Apartment
                        </p>
                      </div>

                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-xl bg-card border border-border text-center">
                          <Wifi className="w-5 h-5 text-primary mx-auto mb-1" />
                          <span className="text-xs text-foreground">Wi-Fi</span>
                        </div>
                        <div className="p-3 rounded-xl bg-card border border-border text-center">
                          <FileText className="w-5 h-5 text-primary mx-auto mb-1" />
                          <span className="text-xs text-foreground">Rules</span>
                        </div>
                      </div>

                      {/* Eco Message */}
                      <div className="p-3 rounded-xl bg-profit/10 border border-profit/20">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-profit" />
                          <span className="text-xs text-foreground">
                            Εξοικονόμηση νερού = μικρότερο αποτύπωμα
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-lg border border-border">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Powered by NFC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
