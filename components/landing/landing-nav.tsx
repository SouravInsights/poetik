"use client";

import Link from "next/link";

export function LandingNav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px clamp(24px, 6vw, 80px)",
        // Glassmorphic — blends with both dark hero and light sections
        background: "rgba(13, 11, 9, 0)",
        transition: "background 0.5s ease",
      }}
      id="landing-nav"
    >
      <Link
        href="/landing"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-italiana)",
            fontSize: "18px",
            letterSpacing: "0.3em",
            color: "#F5F0E8",
            textTransform: "uppercase",
            mixBlendMode: "normal",
          }}
        >
          poetik
        </span>
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: "#F5F0E8",
            display: "inline-block",
            marginBottom: "4px",
            marginLeft: "2px",
          }}
        />
      </Link>

      <Link
        href="/"
        style={{
          fontFamily: "var(--font-jost)",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#F5F0E8",
          textDecoration: "none",
          opacity: 0.6,
          transition: "opacity 0.2s ease",
          padding: "8px 16px",
          borderRadius: "100px",
          border: "1px solid rgba(245,240,232,0.15)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
          (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,240,232,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = "0.6";
          (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
        }}
      >
        Open app
      </Link>
    </nav>
  );
}
