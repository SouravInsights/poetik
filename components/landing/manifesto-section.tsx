"use client";

import { Reveal } from "./reveal";

const refusals = [
  "A feed or gallery of other people's shayaris",
  "Likes, comments, followers, or any social layer",
  "AI generation or \"complete my shayari\" suggestions",
  "More than 4 fonts",
  "Custom color pickers",
  "Stickers, effects, frames, or decorations",
  "Notifications of any kind",
  "A logo watermark on the export",
  "Landscape mode",
];

export function ManifestoSection() {
  return (
    <section
      style={{
        background: "#0D0B09",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Large decorative doodle — behind content */}
      <img
        src="/doodles/botanical-52.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: "-60px",
          width: "340px",
          transform: "translateY(-50%)",
          opacity: 0.04,
          filter: "brightness(10) saturate(0)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Reveal>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#8C8278",
              marginBottom: "20px",
            }}
          >
            The philosophy
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontStyle: "italic",
              color: "#F5F0E8",
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              marginBottom: "16px",
            }}
          >
            Some things were left out on purpose.
          </h2>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "14px",
              fontWeight: 300,
              color: "#8C8278",
              lineHeight: 1.8,
              marginBottom: "64px",
              maxWidth: "480px",
            }}
          >
            These are not "future considerations." They are active refusals. Less isn't a limitation here. It's the whole point.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {refusals.map((item, i) => (
            <Reveal key={i} delay={i * 60}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "18px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* The strike */}
                <div
                  style={{
                    width: "24px",
                    height: "1px",
                    background: "rgba(139, 69, 19, 0.5)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "clamp(13px, 2vw, 15px)",
                    fontWeight: 300,
                    color: "rgba(245, 240, 232, 0.35)",
                    letterSpacing: "0.02em",
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(139, 69, 19, 0.3)",
                    textDecorationThickness: "1px",
                  }}
                >
                  {item}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
