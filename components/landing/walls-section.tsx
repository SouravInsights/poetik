"use client";

import { Reveal } from "./reveal";

// A selection of video thumbnails — we'll use video poster frames captured as CSS backgrounds
// Using actual bg-video files with a static poster feel via object-fit cover
const wallCards = [
  {
    type: "video",
    src: "/bg-videos/2.mp4",
    poem: "रात भर का है मेहमाँ\nअँधेरा",
    font: "--font-cormorant",
    textColor: "rgba(242,236,224,0.92)",
    overlay: "rgba(0,0,0,0.35)",
  },
  {
    type: "color",
    bg: "linear-gradient(135deg, #0f0d14 0%, #1a1626 50%, #0d0b12 100%)",
    poem: "kuch toh hai\njis se mohabbat hai\nmujhe",
    font: "--font-lora",
    textColor: "rgba(242,236,224,0.88)",
    overlay: "transparent",
  },
  {
    type: "video",
    src: "/bg-videos/5.mp4",
    poem: "The wound is the place\nwhere Light enters.",
    font: "--font-playfair",
    textColor: "rgba(242,236,224,0.92)",
    overlay: "rgba(0,0,0,0.4)",
  },
  {
    type: "color",
    bg: "linear-gradient(135deg, #150d05 0%, #2a1508 50%, #120b04 100%)",
    poem: "arz kiya hai...",
    font: "--font-fell",
    textColor: "rgba(242,236,224,0.75)",
    overlay: "transparent",
  },
  {
    type: "color",
    bg: "linear-gradient(135deg, #0e1219 0%, #182030 50%, #0b0f18 100%)",
    poem: "woh jo hum mein tum mein\nqaraar tha",
    font: "--font-cormorant",
    textColor: "rgba(242,236,224,0.9)",
    overlay: "transparent",
  },
  {
    type: "color",
    bg: "#f0e8d8",
    poem: "कहाँ तो तय था\nचराग़ाँ हर एक घर के लिए",
    font: "--font-cormorant",
    textColor: "rgba(26,23,20,0.82)",
    overlay: "transparent",
  },
];

export function WallsSection() {
  return (
    <section
      style={{
        background: "#0D0B09",
        padding: "clamp(80px, 12vw, 160px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Doodle accent */}
      <img
        src="/doodles/moon-1.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "48px",
          right: "48px",
          width: "60px",
          opacity: 0.08,
          filter: "brightness(10)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 clamp(24px, 6vw, 80px)",
          marginBottom: "56px",
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
              marginBottom: "20px",
            }}
          >
            The canvases
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontStyle: "italic",
              color: "#F5F0E8",
              lineHeight: 1.3,
              letterSpacing: "0.01em",
              maxWidth: "600px",
            }}
          >
            70+ backgrounds. Curated for feeling, not decoration.
          </h2>
        </Reveal>
      </div>

      {/* Horizontal scroll strip */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingBottom: "8px",
        }}
      >
        {wallCards.map((card, i) => (
          <Reveal key={i} delay={i * 80}>
            <div
              style={{
                flexShrink: 0,
                width: "clamp(150px, 25vw, 210px)",
                aspectRatio: "9 / 16",
                borderRadius: "20px",
                overflow: "hidden",
                position: "relative",
                scrollSnapAlign: "start",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              }}
            >
              {/* Background */}
              {card.type === "video" ? (
                <video
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
                  }}
                >
                  <source src={card.src} type="video/mp4" />
                </video>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: card.bg,
                  }}
                />
              )}

              {/* Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: card.overlay,
                  zIndex: 1,
                }}
              />

              {/* Grain */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                  opacity: 0.04,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />

              {/* Poem text */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "20px 16px",
                  zIndex: 3,
                }}
              >
                <p
                  style={{
                    fontFamily: `var(${card.font})`,
                    fontSize: "clamp(11px, 2vw, 14px)",
                    fontStyle: "italic",
                    color: card.textColor,
                    lineHeight: 1.8,
                    letterSpacing: "0.01em",
                    textAlign: "center",
                    whiteSpace: "pre-wrap",
                    textShadow: "0 1px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {card.poem}
                </p>
              </div>
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
            padding: "0 clamp(24px, 6vw, 80px)",
            maxWidth: "580px",
            letterSpacing: "0.02em",
          }}
        >
          When choosing a background, you swipe between full-screen previews with your text already on them. You choose what feels right — not what looks like a thumbnail.
        </p>
      </Reveal>
    </section>
  );
}
