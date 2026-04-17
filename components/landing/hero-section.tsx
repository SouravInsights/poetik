"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const rotatingLines = [
  { line: "हज़ारों ख़्वाहिशें ऐसी कि हर ख़्वाहिश पे दम निकले", author: "Mirza Ghalib" },
  { line: "iqraar karna bhi wafa ka ek roop hai", author: "Faiz Ahmad Faiz" },
  { line: "A poem begins as a lump in the throat.", author: "Robert Frost" },
  { line: "The poet is a liar who always speaks the truth.", author: "Jean Cocteau" },
  { line: "رنج کی کاشت کریں گے تو شادمانی کویا ملے گی", author: "Faiz Ahmad Faiz" },
];

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [lineIdx, setLineIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLineIdx((i) => (i + 1) % rotatingLines.length);
        setVisible(true);
      }, 700);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Scroll cue appearance
  useEffect(() => {
    const timer = setTimeout(() => setHasScrolled(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        minHeight: "600px",
        background: "#0D0B09",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Cinematic video background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.35,
          filter: "grayscale(20%)",
        }}
      >
        <source src="/bg-videos/2.mp4" type="video/mp4" />
      </video>

      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.04,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Dark vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(13,11,9,0.8) 100%)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 24px",
          gap: "48px",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            animation: "fadeInUp 1.2s ease-out both",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-italiana)",
              fontSize: "clamp(36px, 8vw, 72px)",
              letterSpacing: "0.3em",
              color: "#F5F0E8",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            poetik
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#F5F0E8",
                display: "inline-block",
                marginBottom: "6px",
                marginLeft: "2px",
              }}
            />
          </span>
        </div>

        {/* Rotating line of poetry */}
        <div
          style={{
            height: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            animation: "fadeInUp 1.2s 0.3s ease-out both",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(18px, 4vw, 28px)",
              fontStyle: "italic",
              color: "#EDE7D9",
              maxWidth: "680px",
              lineHeight: 1.7,
              letterSpacing: "0.01em",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {rotatingLines[lineIdx].line}
          </p>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#F5F0E8",
              opacity: visible ? 0.3 : 0,
              transition: "opacity 0.7s ease",
            }}
          >
            {rotatingLines[lineIdx].author}
          </span>
        </div>

        {/* CTA */}
        <div style={{ animation: "fadeInUp 1.2s 0.6s ease-out both" }}>
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
              padding: "14px 36px",
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
            Begin writing
          </Link>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          opacity: hasScrolled ? 0.4 : 0,
          transition: "opacity 1.5s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "1px",
            height: "40px",
            background: "linear-gradient(to bottom, transparent, #F5F0E8)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  );
}
