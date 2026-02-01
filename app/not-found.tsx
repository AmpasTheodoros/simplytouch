import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30">
      <div className="text-center">
        <h1 className="font-display text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">
          Η σελίδα δεν βρέθηκε
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          Η σελίδα που ψάχνεις δεν υπάρχει ή έχει μετακινηθεί.
        </p>
        <Link href="/">
          <Button variant="default" size="lg">
            <Home className="w-4 h-4 mr-2" />
            Επιστροφή στην Αρχική
          </Button>
        </Link>
      </div>
    </div>
  );
}
