"use client";

import Link from "next/link";
import { Reveal } from "./reveal";

export function ClosingSection() {
  return (
    <section
      style={{
        background: "#0D0B09",
        position: "relative",
        overflow: "hidden",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >


      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.035,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Large decorative doodles */}
      <img
        src="/doodles/flowers-35.svg"
        alt="" aria-hidden
        style={{ position: "absolute", top: "15%", left: "-40px", width: "260px", opacity: 0.035, filter: "brightness(10) saturate(0)", transform: "rotate(-8deg)", pointerEvents: "none", zIndex: 0 }}
      />
      <img
        src="/doodles/botanical-42.svg"
        alt="" aria-hidden
        style={{ position: "absolute", bottom: "10%", right: "-30px", width: "300px", opacity: 0.04, filter: "brightness(10) saturate(0)", transform: "rotate(5deg)", pointerEvents: "none", zIndex: 0 }}
      />

      {/* Main content — bottom-weighted like hero */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 clamp(28px, 7vw, 100px) clamp(56px, 10vh, 120px)",
        }}
      >
        {/* Final quote — editorial, not centered */}
        <Reveal>
          <div style={{ marginBottom: "clamp(40px, 7vh, 80px)", maxWidth: "720px" }}>
            <p
              style={{
                fontFamily: "var(--font-fell)",
                fontSize: "clamp(20px, 3.5vw, 40px)",
                fontStyle: "italic",
                color: "rgba(237,231,217,0.6)",
                lineHeight: 1.75,
                letterSpacing: "0.01em",
                margin: "0 0 16px",
              }}
            >
              "A poet is someone who notices — and is enormously taken by things that somebody else would walk by."
            </p>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)" }}>
              James Dickey
            </span>
          </div>
        </Reveal>

        {/* Bottom row — wordmark + CTA */}
        <Reveal delay={150}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {/* Wordmark — big */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  fontFamily: "var(--font-italiana)",
                  fontSize: "clamp(48px, 10vw, 120px)",
                  letterSpacing: "0.12em",
                  lineHeight: 0.9,
                  color: "rgba(245,240,232,0.9)",
                  textTransform: "uppercase",
                }}
              >
                poetik
              </span>
              <span
                style={{
                  width: "clamp(6px, 1.2vw, 12px)",
                  height: "clamp(6px, 1.2vw, 12px)",
                  borderRadius: "50%",
                  background: "rgba(245,240,232,0.9)",
                  display: "inline-block",
                  marginBottom: "clamp(8px, 1.5vw, 16px)",
                }}
              />
            </div>

            {/* Ghost CTA — right-aligned */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
              <Link href="/" className="ghost-link" style={{ fontSize: "11px" }}>
                Open poetik
                <span style={{ fontSize: "15px", letterSpacing: 0, fontWeight: 300 }}>↗</span>
              </Link>
              <span
                style={{
                  fontFamily: "var(--font-jost)",
                  fontSize: "9px",
                  fontWeight: 300,
                  letterSpacing: "0.2em",
                  color: "rgba(245,240,232,0.15)",
                }}
              >
                Made for people who feel in verses
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
