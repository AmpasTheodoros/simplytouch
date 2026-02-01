import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-bold text-lg">P</span>
              </div>
              <span className="font-display font-bold text-xl">SimplyTouch</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Η πλατφόρμα που δείχνει το πραγματικό κέρδος ανά κράτηση. Όχι έσοδα.
              Πραγματικό κέρδος.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Προϊόν
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/features" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Χαρακτηριστικά
              </Link>
              <Link href="/how-it-works" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Πώς Λειτουργεί
              </Link>
              <Link href="/nfc" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                NFC Guest Page
              </Link>
              <Link href="/pricing" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Τιμολόγηση
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Εταιρεία
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Σχετικά
              </Link>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Blog
              </a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Επικοινωνία
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Νομικά
            </h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Όροι Χρήσης
              </a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Πολιτική Απορρήτου
              </a>
              <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                GDPR
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-sm text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} SimplyTouch. Όλα τα δικαιώματα διατηρούνται.
          </p>
        </div>
      </div>
    </footer>
  );
}
