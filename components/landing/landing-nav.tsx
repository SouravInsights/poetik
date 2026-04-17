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
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px clamp(28px, 7vw, 100px)",
        // No background — the hero video shows through
      }}
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
            fontSize: "16px",
            letterSpacing: "0.28em",
            color: "rgba(245,240,232,0.7)",
            textTransform: "uppercase",
          }}
        >
          poetik
        </span>
        <span
          style={{
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(245,240,232,0.7)",
            display: "inline-block",
            marginBottom: "3px",
            marginLeft: "2px",
          }}
        />
      </Link>

      {/* Ghost text link — editorial, no border fill */}
      <Link href="/" className="ghost-link">
        Open app ↗
      </Link>
    </nav>
  );
}
