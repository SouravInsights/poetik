"use client";

import { Reveal } from "./reveal";
import { PhoneMockup } from "./phone-mockup";

export function ExportSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative doodle */}
      <img
        src="/doodles/wing-1.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: "40px",
          right: "40px",
          width: "120px",
          opacity: 0.07,
          filter: "brightness(0)",
          transform: "rotate(-20deg)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "clamp(40px, 8vw, 100px)",
          alignItems: "center",
        }}
      >
        {/* Text side */}
        <div>
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
              The export
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontStyle: "italic",
                color: "#1A1714",
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                marginBottom: "32px",
              }}
            >
              Save to photos.
              <br />
              That's it.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "14px",
                fontWeight: 300,
                color: "#8C8278",
                lineHeight: 1.9,
                maxWidth: "440px",
                letterSpacing: "0.02em",
                marginBottom: "48px",
              }}
            >
              The export is one gesture. Tap export → see a full-screen preview on the 9:16 canvas → tap "Save to photos." Two taps. No social platform chooser. No share sheet beyond the system default.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "1080 × 1920px — the only export size",
                "No watermark. Your poem, your canvas.",
                "Text is pixel-perfect, not a screenshot",
              ].map((point, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "4px",
                      borderRadius: "50%",
                      background: "#8B4513",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "#1A1714",
                      letterSpacing: "0.02em",
                      opacity: 0.7,
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Phone mockup — export preview */}
        <Reveal delay={200}>
          <div style={{ flexShrink: 0 }}>
            <PhoneMockup dark={false}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(135deg, #0f0d14 0%, #1a1626 50%, #0d0b12 100%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 24px 70px",
                  gap: "16px",
                }}
              >
                {/* The poem inside */}
                <p
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "15px",
                    fontStyle: "italic",
                    color: "rgba(242,236,224,0.92)",
                    lineHeight: 1.9,
                    letterSpacing: "0.01em",
                    textAlign: "center",
                    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  woh jo hum mein{"\n"}tum mein qararr tha{"\n"}tum hi bata{"\n"}woh kaisa tha
                </p>

                {/* Doodle motif */}
                <img
                  src="/doodles/moon-6.svg"
                  alt=""
                  aria-hidden
                  style={{
                    width: "20px",
                    opacity: 0.3,
                    filter: "brightness(10)",
                  }}
                />

                {/* Author */}
                <span
                  style={{
                    fontFamily: "var(--font-jost)",
                    fontSize: "7px",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.25)",
                  }}
                >
                  @shayar
                </span>

                {/* Export button at bottom */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(245,240,232,0.12)",
                    border: "1px solid rgba(245,240,232,0.12)",
                    borderRadius: "100px",
                    padding: "6px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "7px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(245,240,232,0.6)",
                    }}
                  >
                    Save to photos
                  </span>
                </div>
              </div>
            </PhoneMockup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
