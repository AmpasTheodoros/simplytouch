import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { NFCLiveEditor } from "@/components/nfc/NFCLiveEditor";
import {
  Smartphone,
  Wifi,
  Image,
  FileText,
  Link as LinkIcon,
  Leaf,
  ArrowRight,
  Menu,
  MapPin,
  Phone,
} from "lucide-react";

// Default background for guest page preview
const PREVIEW_BG = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

const editableElements = [
  { icon: FileText, label: "House rules & οδηγίες" },
  { icon: Image, label: "Φωτογραφίες καταλύματος" },
  { icon: Wifi, label: "Wi-Fi κωδικός" },
  { icon: LinkIcon, label: "Links (check-in, upsells)" },
  { icon: Leaf, label: "Eco μηνύματα" },
];

export default function NFCPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-medium">NFC Guest Page</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Εσύ ελέγχεις τι βλέπει ο επισκέπτης
              </h1>

              <p className="text-xl text-muted-foreground">
                Μια δομημένη σελίδα καταλύματος που επεξεργάζεσαι εύκολα. Δεν
                είναι website builder. Είναι πρακτικό εργαλείο επικοινωνίας.
              </p>
            </div>
          </div>
        </section>

        {/* Explainer */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                <div>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                    Πώς λειτουργεί το NFC
                  </h2>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Ο επισκέπτης σκανάρει το NFC tag
                        </h3>
                        <p className="text-muted-foreground">
                          Τοποθετείς ένα NFC tag στο κατάλυμα (πόρτα, τραπέζι,
                          ψυγείο).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Ανοίγει η Guest Page
                        </h3>
                        <p className="text-muted-foreground">
                          Χωρίς app, χωρίς login — απευθείας στον browser.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Εσύ ελέγχεις το περιεχόμενο
                        </h3>
                        <p className="text-muted-foreground">
                          Από το dashboard επεξεργάζεσαι κείμενα, photos, links.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                      <Smartphone className="w-8 h-8 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">
                          Guest Page Preview
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          yourproperty.SimplyTouch.app
                        </p>
                      </div>
                    </div>

                    {/* Mock Phone Screen - New Hero Design */}
                    <div 
                      className="rounded-xl overflow-hidden"
                      style={{
                        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("${PREVIEW_BG}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-white text-sm font-medium">Seaside Apartment</span>
                          <span className="text-rose-400 text-xs">&#10047;</span>
                        </div>
                        <Menu className="w-4 h-4 text-white" />
                      </div>

                      {/* Title */}
                      <div className="text-center py-6">
                        <h5 className="font-serif italic text-white text-2xl mb-1">Seaside</h5>
                        <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase">Apartment</p>
                      </div>

                      {/* Nav Links */}
                      <div className="flex flex-col items-center gap-2 pb-4">
                        <span className="text-white text-xs tracking-[0.15em]">WELCOME</span>
                        <span className="text-white text-xs tracking-[0.15em]">HOUSE RULES</span>
                        <span className="text-white text-xs tracking-[0.15em]">AMENITIES</span>
                        <span className="text-white text-xs tracking-[0.15em]">EXPLORE</span>
                        <span className="text-white/40 text-xs tracking-[0.15em]">GALLERY</span>
                      </div>

                      {/* Bottom Buttons */}
                      <div className="flex justify-center gap-2 px-4 pb-4">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-white/90 rounded-full">
                          <MapPin className="w-3 h-3 text-gray-700" />
                          <span className="text-[10px] text-gray-700 font-medium">Location</span>
                        </div>
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-primary rounded-full">
                          <Phone className="w-3 h-3 text-white" />
                          <span className="text-[10px] text-white font-medium">Contact</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Editable */}
              <div className="bg-secondary/30 rounded-2xl p-8 lg:p-12">
                <h3 className="font-display text-2xl font-bold text-foreground mb-8 text-center">
                  Τι μπορείς να επεξεργαστείς
                </h3>

                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {editableElements.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                    >
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-center text-muted-foreground">
                    <strong className="text-foreground">Σημαντικό:</strong> Δεν
                    είναι website builder. Είναι δομημένη σελίδα με
                    προκαθορισμένα sections που συμπληρώνεις.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Editor Section */}
        <NFCLiveEditor />

        {/* CTA */}
        <section className="py-20 lg:py-28 hero-gradient">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Δημιούργησε τη Guest Page σου
            </h2>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto">
              Περιλαμβάνεται σε όλα τα πλάνα. Ενεργοποίησε NFC σήμερα.
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
