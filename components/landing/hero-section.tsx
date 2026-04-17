"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Poetic dedications — an Apple/Nike style tribute to the user
const dedications = [
  "FOR THE UNSENT DRAFTS",
  "FOR THE 3 AM THOUGHTS",
  "FOR THE WORDS YOU COULDN'T SAY ALOUD",
  "FOR THE FEELINGS THAT LINGER",
  "FOR THE QUIET MOMENTS",
  "FOR THE INK ON NAPKINS",
  "FOR THE HEAVY HEARTS",
  "FOR THOSE WHO FEEL IN VERSES",
];

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "640px",
        background: "#0D0B09",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Full-bleed cinematic video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.85, // Much brighter
        }}
      >
        <source src="https://pub-a2400708ea4441fd9bc815d8295f7417.r2.dev/bg-videos/14.mp4" type="video/mp4" />
      </video>

      {/* Dark gradient — heavier at top and bottom, light in center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(13,11,9,0.5) 0%, transparent 20%, transparent 70%, rgba(13,11,9,0.95) 100%)",
          zIndex: 1,
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── Main editorial content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 clamp(28px, 7vw, 100px) clamp(56px, 10vh, 120px)",
        }}
      >
        {/* Massive wordmark — left-aligned, takes up the frame */}
        <div
          style={{
            overflow: "hidden",
            marginBottom: "clamp(20px, 4vh, 48px)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-italiana)",
              fontSize: "clamp(72px, 17vw, 220px)",
              letterSpacing: "0.08em",
              lineHeight: 0.9,
              color: "#F5F0E8",
              textTransform: "uppercase",
              margin: 0,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1), transform 1.4s cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform",
            }}
          >
            poetik
            <span
              style={{
                display: "inline-block",
                width: "clamp(8px, 1.5vw, 18px)",
                height: "clamp(8px, 1.5vw, 18px)",
                borderRadius: "50%",
                background: "#F5F0E8",
                verticalAlign: "middle",
                marginLeft: "0.06em",
                marginBottom: "0.12em",
              }}
            />
          </h1>
        </div>

        {/* Bottom row: tagline left + CTA right */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 1.2s 0.4s cubic-bezier(0.16,1,0.3,1), transform 1.2s 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Thin accent line */}
            <div
              style={{
                width: "32px",
                height: "1px",
                background: "rgba(245,240,232,0.3)",
                transformOrigin: "left",
                animation: mounted ? "lineGrow 0.8s 0.8s cubic-bezier(0.16,1,0.3,1) both" : "none",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(16px, 2.2vw, 22px)",
                fontStyle: "italic",
                color: "rgba(237, 231, 217, 0.65)",
                lineHeight: 1.5,
                letterSpacing: "0.02em",
                maxWidth: "380px",
                margin: 0,
              }}
            >
              A quiet room for shayars and poets.
              <br />Not a tool. A feeling.
            </p>
          </div>

          {/* Ghost CTA — no orange, no filled button */}
          <Link href="/" className="ghost-link">
            Begin writing
            <span style={{ fontSize: "14px", letterSpacing: 0, fontWeight: 300 }}>↗</span>
          </Link>
        </div>
      </div>

      {/* ── Scrolling mood words strip ── */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          borderTop: "1px solid rgba(245,240,232,0.05)",
          padding: "14px 0",
          overflow: "hidden",
          background: "rgba(13,11,9,0.75)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="marquee-track" aria-hidden>
          {[...dedications, ...dedications].map((phrase, i) => (
            <span
              key={i}
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.85)",
                padding: "0 clamp(16px, 3vw, 36px)",
                whiteSpace: "nowrap",
              }}
            >
              {phrase}
              <span style={{ marginLeft: "clamp(16px, 3vw, 36px)", opacity: 0.3 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lineGrow {
          from { transform: scaleX(0); opacity: 0; }
          to   { transform: scaleX(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
