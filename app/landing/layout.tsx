import type { Metadata } from "next";
import { ScrollUnlock } from "@/components/landing/scroll-unlock";

export const metadata: Metadata = {
  title: "poetik — a quiet room for shayars",
  description:
    "A distraction-free writing space for poets and shayars. Pick a canvas, choose a voice, and give your feeling words.",
  openGraph: {
    title: "poetik",
    description: "A quiet room for poets. Not an app. A space.",
    images: ["/og-bg.jpg"],
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Unlocks body scroll that the editor's globals.css locks */}
      <ScrollUnlock />
      {children}
    </>
  );
}
