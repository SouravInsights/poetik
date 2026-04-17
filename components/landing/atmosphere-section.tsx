"use client";

import { Reveal } from "./reveal";
import Image from "next/image";

const moods = [
  {
    id: "rain",
    icon: "/icons/cloud-with-rain-3d.png",
    name: "Rain",
    description: "A slow drizzle against glass. The kind of night when words come on their own.",
    gradient: "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(15, 23, 42, 0.85) 100%), linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    poem: "baarish mein bheego\nkuch alfaaz bhi\nbheeg jaate hain",
    font: "--font-cormorant",
    textColor: "rgba(186,210,240,0.85)",
  },
  {
    id: "fireplace",
    icon: "/icons/fire-3d.png",
    name: "Campfire",
    description: "Amber warmth. The crackle of wood. Words that glow before they cool.",
    gradient: "radial-gradient(ellipse 120% 90% at 50% 110%, rgba(255,120,40,0.3) 0%, transparent 70%), radial-gradient(ellipse at 50% -20%, transparent 40%, rgba(15,5,0,0.9) 120%), linear-gradient(135deg, #1a0a00 0%, #2d1200 100%)",
    poem: "aag ke paas baith ke\nlikhna\nshayari ko\njila deta hai",
    font: "--font-lora",
    textColor: "rgba(255,200,120,0.85)",
  },
];

export function AtmosphereSection() {
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
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "64px" }}>
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
              The atmosphere
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontStyle: "italic",
                color: "#F5F0E8",
                lineHeight: 1.3,
                letterSpacing: "0.01em",
              }}
            >
              Some poems need weather.
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {moods.map((mood, i) => (
            <Reveal key={mood.id} delay={i * 150}>
              <div
                style={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: mood.gradient,
                  padding: "48px 36px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "32px",
                  position: "relative",
                  minHeight: "360px",
                }}
              >
                {/* Grain */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                    opacity: 0.05,
                    pointerEvents: "none",
                    borderRadius: "24px",
                  }}
                />

                {/* Icon + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative", zIndex: 1 }}>
                  <Image
                    src={mood.icon}
                    alt={mood.name}
                    width={36}
                    height={36}
                    style={{ objectFit: "contain" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.5)",
                    }}
                  >
                    {mood.name}
                  </span>
                </div>

                {/* Poem sample */}
                <p
                  style={{
                    fontFamily: `var(${mood.font})`,
                    fontSize: "clamp(18px, 3vw, 24px)",
                    fontStyle: "italic",
                    color: mood.textColor,
                    lineHeight: 1.9,
                    letterSpacing: "0.01em",
                    whiteSpace: "pre-wrap",
                    position: "relative",
                    zIndex: 1,
                    textShadow: "0 1px 12px rgba(0,0,0,0.5)",
                  }}
                >
                  {mood.poem}
                </p>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "13px",
                    fontWeight: 300,
                    color: "rgba(245,240,232,0.35)",
                    lineHeight: 1.7,
                    letterSpacing: "0.02em",
                    position: "relative",
                    zIndex: 1,
                    marginTop: "auto",
                  }}
                >
                  {mood.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "13px",
              fontWeight: 300,
              color: "#8C8278",
              lineHeight: 1.8,
              marginTop: "48px",
              maxWidth: "520px",
              letterSpacing: "0.02em",
            }}
          >
            Tap once to cycle through silence, rain, and campfire. Ambient sound fades in slowly — premium crossfades, not abrupt switches.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
