import { LandingNav } from "@/components/landing/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { TributeMarquee } from "@/components/landing/tribute-marquee";
import { PlaygroundDemo } from "@/components/landing/playground-demo";
import { ClosingSection } from "@/components/landing/closing-section";

export default function LandingPage() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <TributeMarquee />
      <PlaygroundDemo />
      <ClosingSection />
    </main>
  );
}
