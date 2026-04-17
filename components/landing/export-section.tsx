"use client";

import { Reveal } from "./reveal";
import Link from "next/link";

export function ExportSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          borderBottom: "1px solid rgba(26,23,20,0.08)",
          padding: "clamp(24px, 4vw, 48px) clamp(28px, 7vw, 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#8C8278" }}>
          06 — The export
        </span>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", fontStyle: "italic", color: "rgba(26,23,20,0.2)" }}>
          Two taps
        </span>
      </div>

      {/* Main grid — asymmetric */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          minHeight: "480px",
        }}
      >
        {/* Left — the copy */}
        <Reveal>
          <div
            style={{
              padding: "clamp(48px, 8vw, 100px) clamp(28px, 7vw, 100px)",
              borderRight: "1px solid rgba(26,23,20,0.08)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "48px",
              height: "100%",
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(40px, 7vw, 96px)",
                  fontStyle: "italic",
                  color: "#1A1714",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  margin: "0 0 clamp(32px, 5vw, 56px)",
                }}
              >
                Save to photos.
                <br />
                <span style={{ color: "rgba(26,23,20,0.3)" }}>That's it.</span>
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "#8C8278",
                  lineHeight: 1.9,
                  maxWidth: "420px",
                  letterSpacing: "0.015em",
                  margin: 0,
                }}
              >
                One gesture. Tap export → see full-screen preview → tap "Save to photos." No platform chooser. No share sheet. No watermark.
              </p>
            </div>

            {/* Specs as ruled lines */}
            <div style={{ borderTop: "1px solid rgba(26,23,20,0.08)" }}>
              {[
                ["Format", "1080 × 1920px — 9:16"],
                ["Watermark", "None. Your poem, your canvas."],
                ["Rendering", "Pixel-perfect, not a screenshot"],
              ].map(([label, value], i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    gap: "24px",
                    padding: "16px 0",
                    borderBottom: "1px solid rgba(26,23,20,0.06)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(26,23,20,0.3)", flexShrink: 0 }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 300, color: "rgba(26,23,20,0.6)", textAlign: "right" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Right — minimal phone silhouette with poem */}
        <Reveal delay={150}>
          <div
            style={{
              background: "linear-gradient(135deg, #0f0d14 0%, #1a1626 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(32px, 5vw, 56px) clamp(20px, 4vw, 40px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Grain */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", opacity: 0.04, pointerEvents: "none" }} />

            {/* Floating poem */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(15px, 2.2vw, 20px)",
                  fontStyle: "italic",
                  color: "rgba(237,231,217,0.88)",
                  lineHeight: 1.9,
                  letterSpacing: "0.01em",
                  whiteSpace: "pre-wrap",
                  textShadow: "0 1px 12px rgba(0,0,0,0.5)",
                }}
              >
                {"woh jo hum mein\ntum mein qararr tha\ntum hi bata\nwoh kaisa tha"}
              </p>

              <img src="/doodles/moon-6.svg" alt="" aria-hidden style={{ width: "18px", opacity: 0.25, filter: "brightness(10)" }} />

              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)" }}>
                @shayar
              </span>

              {/* Minimal "save to photos" indicator */}
              <div
                style={{
                  marginTop: "8px",
                  border: "1px solid rgba(245,240,232,0.12)",
                  borderRadius: "100px",
                  padding: "7px 20px",
                }}
              >
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(245,240,232,0.35)" }}>
                  Save to photos
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Ghost CTA */}
      <Reveal>
        <div
          style={{
            borderTop: "1px solid rgba(26,23,20,0.08)",
            padding: "clamp(28px, 4vw, 48px) clamp(28px, 7vw, 100px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 300, color: "rgba(26,23,20,0.35)", letterSpacing: "0.03em", margin: 0 }}>
            Your poetry. Your camera roll. Nothing in between.
          </p>
          <Link href="/" className="ghost-link ghost-link-dark">
            Try it now ↗
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
