import { HeroSection } from "@/components/landing/hero-section";
import { WhatItIsSection } from "@/components/landing/what-it-is-section";
import { CanvasDemoSection } from "@/components/landing/canvas-demo-section";
import { WallsSection } from "@/components/landing/walls-section";
import { ManifestoSection } from "@/components/landing/manifesto-section";
import { AtmosphereSection } from "@/components/landing/atmosphere-section";
import { ExportSection } from "@/components/landing/export-section";
import { ClosingSection } from "@/components/landing/closing-section";
import { LandingNav } from "@/components/landing/landing-nav";

export default function LandingPage() {
  return (
    <main>
      <LandingNav />
      <HeroSection />
      <WhatItIsSection />
      <CanvasDemoSection />
      <WallsSection />
      <ManifestoSection />
      <AtmosphereSection />
      <ExportSection />
      <ClosingSection />
    </main>
  );
}
