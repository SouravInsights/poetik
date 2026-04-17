"use client";

import { Reveal } from "./reveal";

const row1 = [
  {
    type: "video" as const,
    src: "/bg-videos/2.mp4",
    poem: "रात भर का है मेहमाँ\nअँधेरा",
    font: "--font-cormorant",
    textColor: "rgba(242,236,224,0.9)",
    overlay: "rgba(0,0,0,0.3)",
  },
  {
    type: "color" as const,
    bg: "linear-gradient(135deg, #0f0d14 0%, #1a1626 50%, #0d0b12 100%)",
    poem: "kuch toh hai\njis se mohabbat hai",
    font: "--font-lora",
    textColor: "rgba(242,236,224,0.85)",
    overlay: "transparent",
  },
  {
    type: "color" as const,
    bg: "#f0e8d8",
    poem: "कहाँ तो तय था\nचराग़ाँ हर एक घर के लिए",
    font: "--font-cormorant",
    textColor: "rgba(26,23,20,0.78)",
    overlay: "transparent",
  },
  {
    type: "video" as const,
    src: "/bg-videos/5.mp4",
    poem: "The wound is the place\nwhere Light enters.",
    font: "--font-playfair",
    textColor: "rgba(242,236,224,0.9)",
    overlay: "rgba(0,0,0,0.4)",
  },
  {
    type: "color" as const,
    bg: "linear-gradient(135deg, #0e1219 0%, #182030 50%, #0b0f18 100%)",
    poem: "woh jo hum mein\ntum mein qararr tha",
    font: "--font-cormorant",
    textColor: "rgba(242,236,224,0.88)",
    overlay: "transparent",
  },
];

const row2 = [
  {
    type: "color" as const,
    bg: "linear-gradient(135deg, #150d05 0%, #2a1508 50%, #120b04 100%)",
    poem: "aag ke paas baith ke\nlikhna",
    font: "--font-lora",
    textColor: "rgba(255,200,120,0.8)",
    overlay: "transparent",
  },
  {
    type: "color" as const,
    bg: "#ede0c4",
    poem: "arz kiya hai...",
    font: "--font-fell",
    textColor: "rgba(26,23,20,0.6)",
    overlay: "transparent",
  },
  {
    type: "video" as const,
    src: "/bg-videos/2.mp4",
    poem: "silence is\nalso\na poem",
    font: "--font-playfair",
    textColor: "rgba(242,236,224,0.82)",
    overlay: "rgba(0,0,0,0.45)",
  },
  {
    type: "color" as const,
    bg: "linear-gradient(135deg, #0f0d14 0%, #1e1830 100%)",
    poem: "بارش میں بھیگو\nکچھ الفاظ بھی\nبھیگ جاتے ہیں",
    font: "--font-cormorant",
    textColor: "rgba(186,210,240,0.75)",
    overlay: "transparent",
  },
  {
    type: "color" as const,
    bg: "#d8ccb4",
    poem: "ink on linen.\nyour words\ndeserve more.",
    font: "--font-fell",
    textColor: "rgba(26,23,20,0.7)",
    overlay: "transparent",
  },
];

function WallCard({ card }: { card: typeof row1[0] }) {
  const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

  return (
    <div
      style={{
        flexShrink: 0,
        width: "clamp(120px, 18vw, 180px)",
        aspectRatio: "9 / 16",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        margin: "0 8px",
      }}
    >
      {card.type === "video" ? (
        <video
          autoPlay loop muted playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src={(card as Extract<typeof card, { type: "video" }>).src} type="video/mp4" />
        </video>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: (card as Extract<typeof card, { type: "color" }>).bg }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: card.overlay, zIndex: 1 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, opacity: 0.04, zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 12px", zIndex: 3 }}>
        <p
          style={{
            fontFamily: `var(${card.font})`,
            fontSize: "clamp(10px, 1.8vw, 13px)",
            fontStyle: "italic",
            color: card.textColor,
            lineHeight: 1.8,
            letterSpacing: "0.01em",
            textAlign: "center",
            whiteSpace: "pre-wrap",
            textShadow: "0 1px 6px rgba(0,0,0,0.3)",
          }}
        >
          {card.poem}
        </p>
      </div>
    </div>
  );
}

export function WallsSection() {
  const doubled1 = [...row1, ...row1];
  const doubled2 = [...row2, ...row2];

  return (
    <section
      style={{
        background: "#0D0B09",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "clamp(60px, 10vw, 120px)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          borderBottom: "1px solid rgba(245,240,232,0.06)",
          padding: "clamp(24px, 4vw, 48px) clamp(28px, 7vw, 100px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", letterSpacing: "0.5em", textTransform: "uppercase", color: "#8C8278" }}>
          03 — The canvases
        </span>
        <span style={{ fontFamily: "var(--font-cormorant)", fontSize: "14px", fontStyle: "italic", color: "rgba(245,240,232,0.2)" }}>
          70+ backgrounds
        </span>
      </div>

      {/* Headline */}
      <Reveal>
        <div style={{ padding: "clamp(40px, 7vw, 88px) clamp(28px, 7vw, 100px) clamp(32px, 5vw, 64px)" }}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(32px, 6vw, 80px)",
              fontStyle: "italic",
              color: "#F5F0E8",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "700px",
            }}
          >
            Curated for feeling,
            <br />
            <span style={{ color: "rgba(245,240,232,0.35)" }}>not decoration.</span>
          </h2>
        </div>
      </Reveal>

      {/* Row 1 — scrolls left */}
      <div style={{ overflow: "hidden", marginBottom: "16px" }}>
        <div className="marquee-track" aria-label="Background examples">
          {doubled1.map((card, i) => (
            <WallCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ overflow: "hidden" }}>
        <div className="marquee-track-reverse" aria-label="More background examples">
          {doubled2.map((card, i) => (
            <WallCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Foot note */}
      <Reveal>
        <div style={{ padding: "clamp(32px, 5vw, 56px) clamp(28px, 7vw, 100px) 0" }}>
          <p
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "12px",
              fontWeight: 300,
              color: "rgba(245,240,232,0.2)",
              letterSpacing: "0.03em",
              maxWidth: "480px",
            }}
          >
            You choose by feel — not by thumbnail. Swipe full-screen, your words already on it.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
