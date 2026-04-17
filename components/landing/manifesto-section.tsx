"use client";

import { Reveal } from "./reveal";

const refusals = [
  "A feed of other people's shayaris",
  "Likes, comments, or followers",
  "AI generation or suggestions",
  "More than 4 fonts",
  "Custom color pickers",
  "Stickers, effects, or frames",
  "Notifications of any kind",
  "A logo watermark on the export",
];

export function ManifestoSection() {
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
          04 — The philosophy
        </span>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", fontStyle: "italic", color: "rgba(26,23,20,0.2)" }}>
          Less is the whole point
        </span>
      </div>

      {/* Headline */}
      <Reveal>
        <div style={{ padding: "clamp(48px, 8vw, 100px) clamp(28px, 7vw, 100px) clamp(32px, 5vw, 56px)" }}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 6.5vw, 88px)",
              fontStyle: "italic",
              color: "#1A1714",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Some things were
            <br />
            left out on purpose.
          </h2>
        </div>
      </Reveal>

      {/* The refusal list — full width, large, ruled */}
      <div style={{ borderTop: "1px solid rgba(26,23,20,0.08)" }}>
        {refusals.map((item, i) => (
          <Reveal key={i} delay={i * 40}>
            <div
              className="refusal-item"
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "clamp(20px, 5vw, 64px)",
                padding: "clamp(18px, 3vw, 28px) clamp(28px, 7vw, 100px)",
                borderBottom: "1px solid rgba(26,23,20,0.06)",
              }}
            >
              {/* Row number */}
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  color: "rgba(26,23,20,0.2)",
                  flexShrink: 0,
                  width: "24px",
                  fontWeight: 400,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <span
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "clamp(20px, 3.5vw, 44px)",
                  fontStyle: "italic",
                  color: "rgba(26,23,20,0.35)",
                  textDecoration: "line-through",
                  textDecorationColor: "rgba(26,23,20,0.12)",
                  textDecorationThickness: "1px",
                  letterSpacing: "0.01em",
                  lineHeight: 1.2,
                  flex: 1,
                }}
              >
                {item}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Footer copy */}
      <Reveal>
        <div style={{ padding: "clamp(40px, 6vw, 72px) clamp(28px, 7vw, 100px)" }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "12px",
              fontWeight: 300,
              color: "rgba(26,23,20,0.35)",
              letterSpacing: "0.04em",
              lineHeight: 1.8,
              maxWidth: "480px",
            }}
          >
            These are not "future considerations." They are active refusals. The product earns your trust by knowing when to stop.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
