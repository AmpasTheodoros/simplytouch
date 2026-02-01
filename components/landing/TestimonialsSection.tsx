import { Star, Users } from "lucide-react";

const testimonials = [
  {
    quote:
      "Επιτέλους ξέρω πόσο μου μένει. Είχα κρατήσεις που νόμιζα ότι είναι καλές αλλά τελικά με ζημίωναν.",
    author: "Μαρία Π.",
    role: "Host, 2 ακίνητα",
    profit: "+€420",
    period: "/μήνα",
  },
  {
    quote:
      "Το NFC είναι game changer. Οι επισκέπτες βρίσκουν τα πάντα χωρίς να με ρωτάνε συνέχεια.",
    author: "Γιώργος Κ.",
    role: "Superhost, 5 ακίνητα",
    profit: "+€890",
    period: "/μήνα",
  },
  {
    quote:
      "Απλό, καθαρό, χωρίς περιττά. Ακριβώς αυτό που χρειαζόμουν για να δω τα νούμερά μου.",
    author: "Ελένη Δ.",
    role: "Host, 1 ακίνητο",
    profit: "+€180",
    period: "/μήνα",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Testimonials</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Hosts που ξέρουν τα νούμερά τους
          </h2>

          <p className="text-lg text-muted-foreground">
            Δες πώς άλλοι hosts βελτίωσαν την κερδοφορία τους με το SimplyTouch.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-8 relative"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-warning text-warning"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-xl text-profit">
                    {testimonial.profit}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.period}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
