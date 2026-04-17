"use client";

import { Reveal } from "./reveal";
import Image from "next/image";

export function AtmosphereSection() {
  return (
    <section
      style={{
        background: "#0D0B09",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section header */}
      <div
        style={{
          borderBottom: "1px solid rgba(245,240,232,0.06)",
          padding: "clamp(24px, 4vw, 48px) clamp(28px, 7vw, 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#8C8278" }}>
          05 — The atmosphere
        </span>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", fontStyle: "italic", color: "rgba(245,240,232,0.18)" }}>
          Some poems need weather
        </span>
      </div>

      {/* Headline + sub */}
      <Reveal>
        <div style={{ padding: "clamp(48px, 8vw, 100px) clamp(28px, 7vw, 100px) clamp(32px, 5vw, 56px)" }}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 6.5vw, 88px)",
              fontStyle: "italic",
              color: "#F5F0E8",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "780px",
            }}
          >
            Some poems need weather.
          </h2>
        </div>
      </Reveal>

      {/* Asymmetric two-pane — 60 / 40 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          borderTop: "1px solid rgba(245,240,232,0.06)",
        }}
      >
        {/* Left — Rain — wider, taller */}
        <Reveal>
          <div
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(15,23,42,0.85) 120%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              padding: "clamp(48px, 8vw, 96px) clamp(28px, 7vw, 80px)",
              borderRight: "1px solid rgba(245,240,232,0.04)",
              position: "relative",
              overflow: "hidden",
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {/* Grain */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", opacity: 0.05, pointerEvents: "none" }} />

            {/* Poem — large, top-left */}
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(24px, 4vw, 52px)",
                fontStyle: "italic",
                color: "rgba(186,210,240,0.82)",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
                whiteSpace: "pre-wrap",
                margin: "0 0 clamp(32px, 5vw, 56px)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {"baarish mein bheego\nkuch alfaaz bhi\nbheeg jaate hain"}
            </p>

            {/* Icon + label */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
              <Image src="/icons/cloud-with-rain-3d.png" alt="Rain" width={28} height={28} style={{ objectFit: "contain" }} />
              <div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(186,210,240,0.4)", display: "block" }}>
                  Rain
                </span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(186,210,240,0.2)" }}>
                  Ambient · Loop
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right — Campfire — narrower */}
        <Reveal delay={120}>
          <div
            style={{
              background:
                "radial-gradient(ellipse 120% 90% at 50% 110%, rgba(255,120,40,0.3) 0%, transparent 70%), radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(15,5,0,0.9) 120%), linear-gradient(180deg, #1a0a00 0%, #2d1200 100%)",
              padding: "clamp(48px, 8vw, 96px) clamp(28px, 5vw, 56px)",
              position: "relative",
              overflow: "hidden",
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", opacity: 0.05, pointerEvents: "none" }} />

            <p
              style={{
                fontFamily: "var(--font-lora)",
                fontSize: "clamp(18px, 3vw, 36px)",
                fontStyle: "italic",
                color: "rgba(255,200,120,0.8)",
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                whiteSpace: "pre-wrap",
                margin: "0 0 clamp(32px, 5vw, 56px)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {"aag ke paas baith ke\nlikhna\nshayari ko jila deta hai"}
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
              <Image src="/icons/fire-3d.png" alt="Campfire" width={24} height={24} style={{ objectFit: "contain" }} />
              <div>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,200,120,0.35)", display: "block" }}>
                  Campfire
                </span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 300, letterSpacing: "0.15em", color: "rgba(255,200,120,0.18)" }}>
                  Ambient · Loop
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Footer */}
      <Reveal>
        <div
          style={{
            borderTop: "1px solid rgba(245,240,232,0.06)",
            padding: "clamp(28px, 4vw, 48px) clamp(28px, 7vw, 100px)",
          }}
        >
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 300, color: "rgba(245,240,232,0.2)", letterSpacing: "0.04em", maxWidth: "480px" }}>
            Tap once to cycle. Silence → Rain → Campfire. Sound fades in slowly — no abrupt switches.
          </p>
        </div>
      </Reveal>

      <style>{`
        @media (max-width: 640px) {
          .atmos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
