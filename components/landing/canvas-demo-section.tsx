"use client";

import { Reveal } from "./reveal";
import { PhoneMockup } from "./phone-mockup";

const fontShowcase = [
  {
    font: "--font-cormorant",
    fontClass: "font-cormorant",
    label: "Cormorant",
    sublabel: "Ghazal · Delicate longing",
    poem: "तू नहीं तो कोई बात नहीं\nदिल तो है, हज़ारों में बात है",
    dark: true,
    bg: "#0D0B09",
    textColor: "rgba(242, 236, 224, 0.92)",
  },
  {
    font: "--font-lora",
    fontClass: "font-lora",
    label: "Lora",
    sublabel: "Warm · Everyday shayari",
    poem: "kuch log waqt ki tarah hote hain\ngujar jaate hain, yaad rehte hain",
    dark: false,
    bg: "#EDE7D9",
    textColor: "rgba(28,22,16,0.88)",
  },
  {
    font: "--font-fell",
    fontClass: "font-fell",
    label: "IM Fell",
    sublabel: "Nazm · Classical, earthy",
    poem: "Words pressed\ninto old paper.\nSlightly imperfect —\nthat's the point.",
    dark: true,
    bg: "#161210",
    textColor: "rgba(242, 236, 224, 0.9)",
  },
  {
    font: "--font-playfair",
    fontClass: "font-playfair",
    label: "Playfair",
    sublabel: "Bold statements",
    poem: "The wound is the place\nwhere the Light\nenters you.",
    dark: false,
    bg: "#F5F0E8",
    textColor: "rgba(28,22,16,0.88)",
  },
];

export function CanvasDemoSection() {
  return (
    <section
      style={{
        background: "#EDE7D9",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 6vw, 80px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Doodle decoration */}
      <img
        src="/doodles/bird-1.svg"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: "60px",
          left: "40px",
          width: "100px",
          opacity: 0.07,
          filter: "brightness(0)",
          transform: "rotate(-10deg)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ marginBottom: "64px" }}>
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
              The writing experience
            </p>
            <h2
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontStyle: "italic",
                color: "#1A1714",
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                maxWidth: "540px",
              }}
            >
              Four fonts. Each is a mood.
            </h2>
          </div>
        </Reveal>

        {/* Phone grid */}
        <div
          style={{
            display: "flex",
            gap: "clamp(20px, 4vw, 48px)",
            overflowX: "auto",
            paddingBottom: "24px",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
        >
          {fontShowcase.map((f, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                }}
              >
                <PhoneMockup dark={f.dark}>
                  {/* Phone interior */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: f.bg,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "32px 20px 60px",
                    }}
                  >
                    {/* Mini top bar simulation */}
                    <div
                      style={{
                        position: "absolute",
                        top: "24px",
                        left: "20px",
                        fontFamily: "var(--font-italiana)",
                        fontSize: "11px",
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: f.dark ? "rgba(245,240,232,0.3)" : "rgba(26,23,20,0.25)",
                      }}
                    >
                      poetik·
                    </div>

                    <p
                      style={{
                        fontFamily: `var(${f.font})`,
                        fontSize: "clamp(13px, 3.5vw, 16px)",
                        fontStyle: "italic",
                        color: f.textColor,
                        lineHeight: 1.8,
                        letterSpacing: "0.01em",
                        textAlign: "center",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {f.poem}
                    </p>

                    {/* Mini bottom toolbar simulation */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                      }}
                    >
                      {[0, 1, 2, 3].map((d) => (
                        <div
                          key={d}
                          style={{
                            width: d === 0 ? "28px" : "20px",
                            height: "4px",
                            borderRadius: "2px",
                            background: f.dark
                              ? d === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.08)"
                              : d === 0 ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.06)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </PhoneMockup>

                {/* Label */}
                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#1A1714",
                      marginBottom: "4px",
                    }}
                  >
                    {f.label}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-jost)",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      color: "#8C8278",
                      fontWeight: 300,
                    }}
                  >
                    {f.sublabel}
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
              marginTop: "56px",
              maxWidth: "520px",
              letterSpacing: "0.02em",
            }}
          >
            Tap a font. See your feeling change in real time. No preview modal, no confirmation. Like turning a page.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
