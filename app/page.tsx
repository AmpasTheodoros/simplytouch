import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { CostAllocationSection } from "@/components/landing/CostAllocationSection";
import { StepsSection } from "@/components/landing/StepsSection";
import { EveryFeatureSection } from "@/components/landing/EveryFeatureSection";
import { NFCValueSection } from "@/components/landing/NFCValueSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingPreviewSection } from "@/components/landing/PricingPreviewSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <CostAllocationSection />
        <StepsSection />
        <EveryFeatureSection />
        <NFCValueSection />
        <TestimonialsSection />
        <PricingPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
