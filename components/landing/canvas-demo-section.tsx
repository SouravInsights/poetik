"use client";

import { Reveal } from "./reveal";

const fontRows = [
  {
    font: "--font-cormorant",
    label: "Cormorant",
    sublabel: "Ghazal · Delicate longing",
    poem: "हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले",
    size: "clamp(28px, 5.5vw, 72px)",
    dark: true,
    bg: "#0D0B09",
    fg: "rgba(237,231,217,0.88)",
    align: "left" as const,
  },
  {
    font: "--font-fell",
    label: "IM Fell",
    sublabel: "Nazm · Ink on old paper",
    poem: "Words pressed into old paper.\nSlightly imperfect —\nthat's the point.",
    size: "clamp(24px, 4vw, 52px)",
    dark: false,
    bg: "#EDE7D9",
    fg: "rgba(26,23,20,0.85)",
    align: "right" as const,
  },
  {
    font: "--font-playfair",
    label: "Playfair",
    sublabel: "Bold statements · High contrast",
    poem: "kuch toh hai jis se mohabbat hai mujhe",
    size: "clamp(32px, 6vw, 80px)",
    dark: true,
    bg: "#1A1714",
    fg: "rgba(245,240,232,0.9)",
    align: "center" as const,
  },
  {
    font: "--font-lora",
    label: "Lora",
    sublabel: "Warm · Everyday shayari",
    poem: "kuch log waqt ki tarah hote hain\ngujar jaate hain, yaad rehte hain",
    size: "clamp(22px, 3.5vw, 48px)",
    dark: false,
    bg: "#F5F0E8",
    fg: "rgba(26,23,20,0.8)",
    align: "left" as const,
  },
];

export function CanvasDemoSection() {
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
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "9px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: "#8C8278",
          }}
        >
          02 — The writing experience
        </span>
        <span
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "14px",
            fontStyle: "italic",
            color: "rgba(245,240,232,0.2)",
          }}
        >
          Four fonts. Each is a mood.
        </span>
      </div>

      {/* Font rows — full bleed, alternating light/dark */}
      {fontRows.map((f, i) => (
        <Reveal key={i} delay={i * 60}>
          <div
            style={{
              background: f.bg,
              padding: "clamp(48px, 8vw, 96px) clamp(28px, 7vw, 100px)",
              borderBottom: "1px solid rgba(245,240,232,0.04)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Grain */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                opacity: 0.035,
                pointerEvents: "none",
              }}
            />

            {/* Font label — top right or left, alternating */}
            <div
              style={{
                display: "flex",
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                marginBottom: "clamp(24px, 4vw, 48px)",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: i % 2 === 0 ? "flex-start" : "flex-end" }}>
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    color: f.dark ? "rgba(245,240,232,0.25)" : "rgba(26,23,20,0.25)",
                  }}
                >
                  {f.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "9px",
                    fontWeight: 300,
                    letterSpacing: "0.2em",
                    color: f.dark ? "rgba(245,240,232,0.15)" : "rgba(26,23,20,0.15)",
                  }}
                >
                  {f.sublabel}
                </span>
              </div>
            </div>

            {/* The poem — large, breathing */}
            <p
              style={{
                fontFamily: `var(${f.font})`,
                fontSize: f.size,
                fontStyle: "italic",
                color: f.fg,
                lineHeight: 1.4,
                letterSpacing: "0.01em",
                textAlign: f.align,
                whiteSpace: "pre-wrap",
                margin: 0,
                position: "relative",
              }}
            >
              {f.poem}
            </p>
          </div>
        </Reveal>
      ))}

      {/* Footer note */}
      <div
        style={{
          padding: "clamp(32px, 5vw, 64px) clamp(28px, 7vw, 100px)",
          borderTop: "1px solid rgba(245,240,232,0.06)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "12px",
            fontWeight: 300,
            color: "rgba(245,240,232,0.2)",
            letterSpacing: "0.04em",
            maxWidth: "520px",
          }}
        >
          Tap a font. Your poem re-renders instantly. No modal, no confirmation. Like turning a page.
        </p>
      </div>
    </section>
  );
}
