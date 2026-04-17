"use client";

import { Reveal } from "./reveal";

export function PlaygroundDemo() {
  return (
    <section
      style={{
        background: "#F5F0E8", // Muted light paper background to contrast with the app
        position: "relative",
        padding: "clamp(80px, 12vh, 160px) clamp(24px, 5vw, 60px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "clamp(48px, 8vh, 80px)" }}>
        <Reveal>
          <span
            style={{
              fontFamily: "var(--font-jost)",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#8C8278",
              display: "block",
              marginBottom: "24px",
            }}
          >
            Don't read about it.
          </span>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(40px, 6vw, 80px)",
              fontStyle: "italic",
              color: "#1A1714",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Feel it.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={150}>
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            // Classic macOS window styling but modern and glassmorphic
            background: "rgba(13, 11, 9, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* macOS Title Bar */}
          <div
            style={{
              height: "40px",
              background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: "8px",
            }}
          >
            {/* Traffic Lights */}
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FF5F56", border: "1px solid rgba(0,0,0,0.1)" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#FFBD2E", border: "1px solid rgba(0,0,0,0.1)" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27C93F", border: "1px solid rgba(0,0,0,0.1)" }} />
            
            {/* Title */}
            <div style={{ flex: 1, textAlign: "center", paddingRight: "56px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", letterSpacing: "0.2em", color: "rgba(245,240,232,0.4)", textTransform: "uppercase" }}>
                poetik
              </span>
            </div>
          </div>

          {/* Iframe Container */}
          <div style={{ width: "100%", height: "clamp(600px, 80vh, 850px)", position: "relative" }}>
            <iframe
              src="/"
              title="Poetik Interactive Demo"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#0D0B09" // Prevents white flash before load
              }}
              loading="lazy"
            />
          </div>
        </div>
      </Reveal>
      
      {/* Footer hint */}
      <Reveal delay={300}>
        <p
          style={{
            fontFamily: "var(--font-jost)",
            fontSize: "12px",
            color: "#8C8278",
            marginTop: "32px",
            fontWeight: 300,
            letterSpacing: "0.02em",
            textAlign: "center"
          }}
        >
          Fully functional demo. Sounds, haptics, and exports work directly in the browser.
        </p>
      </Reveal>
    </section>
  );
}
