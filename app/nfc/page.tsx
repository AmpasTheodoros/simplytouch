import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Edit3,
  Eye,
  Wifi,
  Image,
  FileText,
  Link as LinkIcon,
  Leaf,
  ArrowRight,
  Check,
} from "lucide-react";

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
                          yourproperty.profitbnb.app
                        </p>
                      </div>
                    </div>

                    {/* Mock Phone Screen */}
                    <div className="bg-secondary/50 rounded-xl p-4 space-y-4">
                      <div className="h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-primary/50" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-foreground">
                          Καλώς ήρθατε!
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          Wi-Fi: MyNetwork • Pass: guest123
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-card rounded-lg text-center text-sm">
                          🏠 House Rules
                        </div>
                        <div className="p-3 bg-card rounded-lg text-center text-sm">
                          🚿 Οδηγίες
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

        {/* Editor vs Guest View */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
                Host Editor vs Guest View
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 bg-primary text-primary-foreground flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    <span className="font-semibold">Host Editor</span>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Τίτλος καλωσορίσματος
                      </label>
                      <input
                        type="text"
                        defaultValue="Καλώς ήρθατε στο κατάλυμά μας!"
                        className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-foreground"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Wi-Fi Password
                      </label>
                      <input
                        type="text"
                        defaultValue="guest2025"
                        className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-foreground"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        House Rules
                      </label>
                      <textarea
                        defaultValue="• Απαγορεύεται το κάπνισμα&#10;• Ησυχία μετά τις 23:00&#10;• Check-out στις 11:00"
                        className="w-full p-3 rounded-lg border border-border bg-secondary/30 text-foreground h-24 resize-none"
                        readOnly
                      />
                    </div>
                    <Button className="w-full" variant="default">
                      Αποθήκευση Αλλαγών
                    </Button>
                  </div>
                </div>

                {/* Guest View */}
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                  <div className="p-4 bg-secondary flex items-center gap-2">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      Guest View
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="bg-primary/5 rounded-xl p-6 text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🏠</span>
                      </div>
                      <h3 className="font-display font-bold text-xl text-foreground mb-2">
                        Καλώς ήρθατε στο κατάλυμά μας!
                      </h3>
                      <p className="text-muted-foreground">
                        Ελπίζουμε να περάσετε υπέροχα!
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                        <Wifi className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Wi-Fi</p>
                          <p className="font-medium text-foreground">
                            Password: guest2025
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground mb-2">
                          House Rules
                        </p>
                        <ul className="text-sm text-foreground space-y-1">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-profit" />
                            Απαγορεύεται το κάπνισμα
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-profit" />
                            Ησυχία μετά τις 23:00
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-profit" />
                            Check-out στις 11:00
                          </li>
                        </ul>
                      </div>
                    </div>
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
