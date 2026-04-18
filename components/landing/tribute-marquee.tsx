"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LazyVideo } from "./lazy-video";

// A curated list of profound poetic lines from all-time greats
const classicPoems = [
  { text: "Out beyond ideas of wrongdoing and rightdoing,\nthere is a field. I'll meet you there.", author: "@rumi", font: "--font-cormorant", color: "rgba(245,240,232,0.9)", ink: "light" },
  { text: "I took a deep breath and listened to the old brag of my heart.\nI am, I am, I am.", author: "@sylvia.plath", font: "--font-lora", color: "rgba(245,240,232,0.85)", ink: "light" },
  { text: "हज़ारों ख़्वाहिशें ऐसी कि\nहर ख़्वाहिश पे दम निकले", author: "@mirza.ghalib", font: "--font-playfair", color: "rgba(26,23,20,0.85)", ink: "dark" },
  { text: "The wound is the place\nwhere the Light enters you.", author: "@rumi", font: "--font-cormorant", color: "rgba(245,240,232,0.8)", ink: "light" },
  { text: "Don't ask me for that first love again.", author: "@faiz.ahmad.faiz", font: "--font-fell", color: "rgba(26,23,20,0.8)", ink: "dark" },
  { text: "It is a serious thing\njust to be alive\non this fresh morning\nin this broken world.", author: "@mary.oliver", font: "--font-lora", color: "rgba(245,240,232,0.9)", ink: "light" },
  { text: "Do not go gentle into that good night.", author: "@dylan.thomas", font: "--font-playfair", color: "rgba(245,240,232,0.85)", ink: "light" },
  { text: "In three words I can sum up everything I've learned about life:\nit goes on.", author: "@robert.frost", font: "--font-cormorant", color: "rgba(26,23,20,0.85)", ink: "dark" },
  { text: "We cast a shadow on something wherever we stand", author: "@e.m.forster", font: "--font-fell", color: "rgba(245,240,232,0.85)", ink: "light" },
  { text: "What happens to a dream deferred?\nDoes it dry up\nlike a raisin in the sun?", author: "@langston.hughes", font: "--font-lora", color: "rgba(26,23,20,0.8)", ink: "dark" },
  { text: "I have measured out my life with coffee spoons.", author: "@t.s.eliot", font: "--font-cormorant", color: "rgba(245,240,232,0.85)", ink: "light" },
  { text: "And still, after all this time,\nthe sun never says to the earth,\n\"You owe me.\"", author: "@hafiz", font: "--font-playfair", color: "rgba(245,240,232,0.9)", ink: "light" },
];

export function TributeMarquee() {
  const [videos, setVideos] = useState<{ path: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const res = await fetch("/api/assets");
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          // Shuffle videos safely
          const shuffled = [...data.videos].sort(() => 0.5 - Math.random());
          setVideos(shuffled);
        }
      } catch (error) {
        console.error("Failed to load marquee assets", error);
      } finally {
        setLoading(false);
      }
    }
    loadAssets();
  }, []);

  // For the dark/light ink toggle of doodles
  const doodleOpacity = 0.3;

  if (loading) {
    return <div style={{ height: "600px", background: "#0D0B09" }} />;
  }

  // Marquee needs enough content to span endlessly, so we'll duplicate if needed
  const marqueeItems = [...classicPoems, ...classicPoems];

  return (
    <section
      style={{
        background: "#0D0B09",
        position: "relative",
        overflow: "hidden",
        padding: "clamp(80px, 12vh, 160px) 0",
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "clamp(48px, 8vh, 80px)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(24px, 4vw, 36px)",
            fontStyle: "italic",
            color: "rgba(245,240,232,0.4)",
            lineHeight: 1.5,
          }}
        >
          A quiet room for loud feelings.
        </p>
      </div>

      <div style={{ overflow: "hidden", display: "flex" }}>
        <div className="marquee-track" style={{ gap: "32px", paddingLeft: "32px" }}>
          {marqueeItems.map((poem, i) => {
            // Assign a video or background (looping through available videos safely)
            const videoAsset = videos.length > 0 ? videos[i % videos.length] : undefined;
            const fallbackBg = poem.ink === "light" ? "#1a1a1a" : "#EBE5DF";

            return (
              <div
                key={i}
                style={{
                  width: "clamp(280px, 22vw, 360px)",
                  aspectRatio: "9 / 16",
                  position: "relative",
                  borderRadius: "20px",
                  overflow: "hidden",
                  flexShrink: 0,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                  background: fallbackBg,
                }}
              >
                {/* Background Image/Video */}
                {videoAsset && (
                  <LazyVideo
                    src={videoAsset.path}
                    className="lazy-video-container"
                    style={{
                      filter: poem.ink === "dark" ? "brightness(1.2)" : "brightness(0.6) contrast(1.1)",
                    }}
                  />
                )}

                {/* Overlays to ensure text legibility */}
                <div style={{ position: "absolute", inset: 0, background: poem.ink === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.2)" }} />

                {/* Exact UI matching the Poetik export layout */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "15% 10%",
                  }}
                >
                  <div /> {/* Spacer for top */}
                  
                  {/* The Poem */}
                  <p
                    style={{
                      fontFamily: `var(${poem.font})`,
                      fontSize: "clamp(18px, 1.8vw, 24px)",
                      fontStyle: "italic",
                      color: poem.color,
                      lineHeight: 1.6,
                      letterSpacing: "0.01em",
                      textAlign: "center",
                      whiteSpace: "pre-wrap",
                      textShadow: poem.ink === "light" ? "0 1px 12px rgba(0,0,0,0.6)" : "none",
                    }}
                  >
                    {poem.text}
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%" }}>
                    {/* The Doodle */}
                    <Image
                      src={i % 2 === 0 ? "/doodles/moon-1.svg" : "/doodles/feather-1.svg"}
                      alt=""
                      width={24}
                      height={24}
                      style={{
                        opacity: doodleOpacity,
                        filter: poem.ink === "light" ? "brightness(10)" : "brightness(0)",
                      }}
                    />
                    
                    {/* The Username/Author */}
                    <span
                      style={{
                        fontFamily: "var(--font-jost)",
                        fontSize: "9px",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        color: poem.color,
                        opacity: 0.6,
                      }}
                    >
                      {poem.author}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
