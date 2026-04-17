"use client";

import { Reveal } from "./reveal";

export function WhatItIsSection() {
  return (
    <section
      style={{
        background: "#F5F0E8",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative botanical — very large, very faint */}
      <img
        src="/doodles/botanical-52.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "-80px",
          right: "-60px",
          width: "420px",
          opacity: 0.04,
          filter: "brightness(0)",
          transform: "rotate(8deg)",
          pointerEvents: "none",
        }}
      />

      {/* ── Section header — full width ruled line ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(26,23,20,0.1)",
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
          01 — What this is
        </span>
        <span
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(140,130,120,0.4)",
          }}
        >
          A tool made for feeling
        </span>
      </div>

      {/* ── Oversized pull-quote — breaks the grid ── */}
      <Reveal>
        <div
          style={{
            padding: "clamp(48px, 8vw, 100px) clamp(28px, 7vw, 100px)",
            borderBottom: "1px solid rgba(26,23,20,0.06)",
          }}
        >
          <blockquote
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(36px, 6.5vw, 88px)",
              fontStyle: "italic",
              color: "#1A1714",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "960px",
            }}
          >
            Not a notes app.
            <br />
            <span style={{ color: "rgba(26,23,20,0.35)" }}>
              Not a text editor.
            </span>
            <br />
            <span style={{ color: "rgba(26,23,20,0.18)" }}>
              Not a social media tool.
            </span>
          </blockquote>
        </div>
      </Reveal>

      {/* ── Two-column editorial body ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          borderBottom: "1px solid rgba(26,23,20,0.06)",
        }}
      >
        {/* Left — the statement */}
        <Reveal>
          <div
            style={{
              padding: "clamp(40px, 7vw, 88px) clamp(28px, 7vw, 100px)",
              borderRight: "1px solid rgba(26,23,20,0.06)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(18px, 2.5vw, 28px)",
                fontStyle: "italic",
                color: "#1A1714",
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                margin: 0,
              }}
            >
              "The competition is not other apps. The competition is a blank paper notebook and a ballpoint pen. We must be at least as intimate."
            </p>
          </div>
        </Reveal>

        {/* Right — the three truths */}
        <Reveal delay={120}>
          <div
            style={{
              padding: "clamp(40px, 7vw, 88px) clamp(28px, 7vw, 100px)",
              display: "flex",
              flexDirection: "column",
              gap: "0",
            }}
          >
            {[
              {
                n: "—",
                headline: "It is a quiet room.",
                body: "One you enter to sit with a feeling long enough to give it words. The product earns trust by disappearing.",
              },
              {
                n: "—",
                headline: "The interface fades.",
                body: "Top bar, toolbar, font picker — gone after three seconds. Only your poem remains.",
              },
              {
                n: "—",
                headline: "No save button. Ever.",
                body: "Everything saved silently, after every keystroke. The word “Save” will never appear.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  paddingTop: i === 0 ? 0 : "32px",
                  paddingBottom: "32px",
                  borderBottom: i < 2 ? "1px solid rgba(26,23,20,0.06)" : "none",
                  display: "flex",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "18px",
                    color: "rgba(26,23,20,0.2)",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  {item.n}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "16px",
                      fontStyle: "italic",
                      color: "#1A1714",
                      margin: "0 0 8px",
                    }}
                  >
                    {item.headline}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "13px",
                      fontWeight: 300,
                      color: "#8C8278",
                      lineHeight: 1.8,
                      letterSpacing: "0.015em",
                      margin: 0,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .what-two-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
