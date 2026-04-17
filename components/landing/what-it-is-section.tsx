"use client";

import { Reveal } from "./reveal";

const tenets = [
  {
    doodle: "/doodles/feather-1.svg",
    headline: "Not a notes app.",
    body: "It is a quiet room. One you enter to sit with a feeling long enough to give it words.",
  },
  {
    doodle: "/doodles/moon-3.svg",
    headline: "The interface disappears.",
    body: "The top bar, font picker, toolbar — all fade to nothing after three seconds of stillness. Only your poem remains.",
  },
  {
    doodle: "/doodles/botanical-20.svg",
    headline: "No save button. Ever.",
    body: "Everything is saved silently, after every keystroke. The word \"Save\" will never appear here.",
  },
];

export function WhatItIsSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative botanical — top right */}
      <img
        src="/doodles/botanical-1.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "240px",
          opacity: 0.06,
          transform: "rotate(15deg)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
        }}
      >
        <Reveal>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#8C8278",
              marginBottom: "48px",
            }}
          >
            What this is
          </p>
        </Reveal>

        <Reveal delay={100}>
          <blockquote
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(22px, 4vw, 38px)",
              fontStyle: "italic",
              color: "#1A1714",
              lineHeight: 1.7,
              letterSpacing: "0.01em",
              marginBottom: "80px",
              maxWidth: "680px",
            }}
          >
            "The competition is not other apps. The competition is a blank paper notebook and a ballpoint pen. We must be at least as intimate."
          </blockquote>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "56px",
          }}
        >
          {tenets.map((t, i) => (
            <Reveal key={i} delay={i * 120}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <img
                  src={t.doodle}
                  alt=""
                  aria-hidden
                  style={{
                    width: "36px",
                    height: "36px",
                    objectFit: "contain",
                    opacity: 0.5,
                    filter: "brightness(0)",
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "20px",
                      fontStyle: "italic",
                      color: "#1A1714",
                      marginBottom: "10px",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t.headline}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "14px",
                      fontWeight: 300,
                      color: "#8C8278",
                      lineHeight: 1.8,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {t.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
