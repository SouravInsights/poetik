"use client";

import Link from "next/link";
import { Reveal } from "./reveal";

export function ClosingSection() {
  return (
    <section
      style={{
        position: "relative",
        background: "#0D0B09",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        textAlign: "center",
      }}
    >
      {/* Decorative doodles scattered */}
      <img
        src="/doodles/flowers-14.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "60px",
          left: "5%",
          width: "180px",
          opacity: 0.04,
          filter: "brightness(10) saturate(0)",
          transform: "rotate(-15deg)",
          pointerEvents: "none",
        }}
      />
      <img
        src="/doodles/flowers-19.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: "60px",
          right: "5%",
          width: "200px",
          opacity: 0.04,
          filter: "brightness(10) saturate(0)",
          transform: "rotate(10deg)",
          pointerEvents: "none",
        }}
      />
      <img
        src="/doodles/bird-14.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "30%",
          right: "8%",
          width: "80px",
          opacity: 0.06,
          filter: "brightness(10)",
          pointerEvents: "none",
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.035,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "56px" }}>
        {/* Logo */}
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{
                fontFamily: "var(--font-italiana)",
                fontSize: "clamp(28px, 6vw, 56px)",
                letterSpacing: "0.3em",
                color: "#F5F0E8",
                textTransform: "uppercase",
                opacity: 0.9,
              }}
            >
              poetik
            </span>
            <span
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#F5F0E8",
                display: "inline-block",
                marginBottom: "8px",
                marginLeft: "2px",
                opacity: 0.9,
              }}
            />
          </div>
        </Reveal>

        {/* Final shayari */}
        <Reveal delay={150}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <p
              style={{
                fontFamily: "var(--font-fell)",
                fontSize: "clamp(18px, 4vw, 30px)",
                fontStyle: "italic",
                color: "rgba(237, 231, 217, 0.75)",
                lineHeight: 1.9,
                letterSpacing: "0.02em",
                maxWidth: "600px",
              }}
            >
              "A poet is someone who notices and is enormously taken by things that somebody else would walk by."
            </p>
            <span
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: "rgba(245,240,232,0.25)",
              }}
            >
              James Dickey
            </span>
          </div>
        </Reveal>

        {/* Divider */}
        <Reveal delay={250}>
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(245,240,232,0.12)",
            }}
          />
        </Reveal>

        {/* CTA */}
        <Reveal delay={300}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "var(--font-jost)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#F5F0E8",
                background: "rgba(139, 69, 19, 0.85)",
                border: "1px solid rgba(139, 69, 19, 0.5)",
                borderRadius: "100px",
                padding: "14px 40px",
                textDecoration: "none",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139, 69, 19, 1)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(139, 69, 19, 0.85)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Open poetik
            </Link>
            <p
              style={{
                fontFamily: "var(--font-jost)",
                fontSize: "10px",
                fontWeight: 300,
                letterSpacing: "0.15em",
                color: "rgba(245,240,232,0.2)",
              }}
            >
              Made for people who feel in verses
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
