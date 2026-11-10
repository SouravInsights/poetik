"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone, poemBaseMax } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";
import { AnimatePresence, motion } from "motion/react";
import { getEraseAnimationPhysics } from "@/lib/erase-animations";
import { useParallax } from "@/hooks/use-parallax";
import { useAutoFit } from "@/hooks/use-autofit";
import useSound from "use-sound";

interface EditorCanvasProps {
  text: string;
  setText: (text: string) => void;
  font: Font;
  paper: Paper;
  tone: Tone;
  inkMode: "ink-light" | "ink-dark";
  doodle: string | null;
  author: string;
  align: "left" | "center";
  bgOpacity: number;
  /** User text-size preference multiplying the auto-fitted size (1 = auto). */
  textScale: number;
  /** User line-spacing preference multiplying the optical leading (1 = auto). */
  lineScale: number;
  atmosphere: "none" | "rain" | "fireplace";
  isClearing?: boolean;
  /** Reports textarea focus so the page can dissolve chrome while writing. */
  onFocusChange?: (focused: boolean) => void;
}

export function EditorCanvas({
  text,
  setText,
  font,
  paper,
  tone,
  inkMode,
  doodle,
  author,
  align,
  bgOpacity,
  textScale,
  lineScale,
  atmosphere,
  isClearing,
  onFocusChange,
}: EditorCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const { trigger } = useWebHaptics();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  // --- Content-aware typography (auto-fit) ---
  // Track the usable writing box. Height comes from the viewport minus its
  // vertical chrome padding; width from the max-800px text column. baseMax is
  // the responsive type ceiling (clamp(26px, 7.5vw, 52px)); the user's size
  // preference scales on top of whatever the fit produces.
  const [box, setBox] = useState({ width: 0, height: 0, baseMax: 26 });

  useEffect(() => {
    const outer = viewportRef.current;
    const inner = measureRef.current;
    if (!outer || !inner) return;

    const update = () => {
      const cs = getComputedStyle(outer);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBottom = parseFloat(cs.paddingBottom) || 0;
      const height = Math.max(0, outer.clientHeight - padTop - padBottom);
      const width = inner.clientWidth;
      const baseMax = poemBaseMax(window.innerWidth);
      setBox((b) =>
        b.width === width && b.height === height && b.baseMax === baseMax
          ? b
          : { width, height, baseMax }
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    ro.observe(inner);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // A doodle/author sits near the bottom edge — reserve a little room so a long
  // poem never runs underneath it.
  const authorReserve = doodle || author ? 56 : 0;
  const availableHeight = Math.max(0, box.height - authorReserve);
  const { size: poemSize, lineHeight: poemLeading, height: poemHeight } = useAutoFit({
    text,
    font,
    width: box.width,
    height: availableHeight,
    maxSize: box.baseMax,
    minSize: 18,
    letterSpacing: "0.01em",
    scale: textScale,
    lineScale,
  });

  // A book-length poem cannot physically fit one 9:16 canvas at a readable
  // size. Rather than clip it (the old behaviour), the canvas quietly becomes
  // scrollable only in that rare case; everything shorter stays centered.
  const overflowing = text.trim().length > 0 && poemHeight > availableHeight;

  // Size the invisible input from the fitted, measured text height. We must
  // NOT use `textarea.scrollHeight` here: it is a one-way ratchet — once the
  // box grows it never reports smaller, so after an auto-fit shrink it would
  // stay huge and shove the visual layer off-screen. Floor at one line so the
  // placeholder still has height when the poem is empty.
  const textareaHeight = Math.max(poemHeight, poemSize * poemLeading) + 2;

  // The signature scales with the poem's type. A long poem auto-shrinks its
  // font, and a fixed-size motif would then dwarf the words; tying it to
  // poemSize keeps the whole bottom mark in proportion. Capped at the original
  // size so short quotes look exactly as they always did.
  const motifSize = Math.max(18, Math.min(36, Math.round(poemSize * 1.2)));
  // The credit is set in the poem's own italic (simple, legible typography)
  // and sized to the words. A short hairline rule above it sets the name apart
  // as a signature block — a cleaner device than an em dash.
  const creditSize = Math.max(10, Math.min(28, Math.round(poemSize * 0.42)));
  const creditRuleWidth = Math.round(creditSize * 2.4);

  // --- Cinematic Audio Engine ---
  const [playRain, { stop: stopRain, sound: rainSound }] = useSound('/sounds/rain-ambient-cinematic.mp3', { 
    loop: true, 
    volume: 0.6 
  });
  const [playFireplace, { stop: stopFireplace, sound: fireplaceSound }] = useSound('/sounds/campfire-crackling.mp3', { 
    loop: true, 
    volume: 0.7 
  });

  useEffect(() => {
    // 1. Play Rain exclusively
    if (atmosphere === "rain") {
      stopFireplace();
      if (fireplaceSound) {
        fireplaceSound.stop();
      }
      if (rainSound) {
        rainSound.stop(); // Clear any ongoing fades
        rainSound.volume(0.6); // RESTORE volume from any past fades!
      }
      playRain();
    } 
    // 2. Play Fireplace exclusively
    else if (atmosphere === "fireplace") {
      stopRain();
      if (rainSound) {
        rainSound.stop();
      }
      if (fireplaceSound) {
        fireplaceSound.stop(); // Clear fades
        fireplaceSound.volume(0.7); // RESTORE volume
      }
      playFireplace();
    } 
    // 3. Absolute Silence Mode (Double-tap stop to kill async orphans gracefully)
    else {
      stopRain();
      if (rainSound) {
        rainSound.fade(0.6, 0, 800); // Premium fade out on stop
        setTimeout(() => rainSound.stop(), 800);
      }

      stopFireplace();
      if (fireplaceSound) {
        fireplaceSound.fade(0.7, 0, 800);
        setTimeout(() => fireplaceSound.stop(), 800);
      }
    }

    return () => {
      stopRain();
      stopFireplace();
    };
  }, [atmosphere, playRain, stopRain, rainSound, playFireplace, stopFireplace, fireplaceSound]);

  // Clean, separated Parallax logic
  const { bgX, bgY } = useParallax();
  const [variant, setVariant] = useState<1 | 2 | 3>(1); // Random physics variant
  
  // Randomize the wipe effect every time the user hits clear!
  useEffect(() => {
    if (isClearing) {
      setVariant(Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3);
    }
  }, [isClearing]);

  // Posterbridge: when a new video is selected, show the cached poster frame
  // immediately so there's no black flash while the new src buffers.
  // posterCache is the same module-level Map used in background-picker.tsx.
  const videoRef = useRef<HTMLVideoElement>(null);
  const [posterBridge, setPosterBridge] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const prevVideoSrc = useRef<string | null>(null);

  useEffect(() => {
    if (paper.type !== "video" || !paper.path) {
      setVideoReady(false);
      setPosterBridge(null);
      prevVideoSrc.current = null;
      return;
    }

    const src = paper.path;
    if (src === prevVideoSrc.current) return; // Same video, no-op
    prevVideoSrc.current = src;

    // Show a poster immediately as a bridge frame — prefer the pre-generated
    // API poster, fall back to whatever the picker captured client-side.
    const cached = paper.poster ?? (window as any).__posterCache?.get?.(src) ?? null;
    if (cached) setPosterBridge(cached);
    setVideoReady(false);

    const vid = videoRef.current;
    if (!vid) return;

    vid.src = src;
    vid.load();

    const onReady = () => {
      vid.play().catch(() => {});
      setVideoReady(true);
    };
    vid.addEventListener("canplay", onReady, { once: true });
    return () => vid.removeEventListener("canplay", onReady);
  }, [paper.path, paper.type, paper.poster]);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const textBeforeCursor = text.slice(0, textareaRef.current.selectionStart || 0);
      const lineIndex = textBeforeCursor.split('\n').length - 1;
      setActiveIndex(lineIndex);
    }
  };

  const handleTextChange = (val: string) => {
    trigger(15);
    setText(val);
    setTimeout(handleSelectionChange, 0); // Sync active index after render
  };

  const isDark = inkMode === "ink-light";

  return (
    <div className={cn("absolute inset-0", inkMode)}>
      {/* Background Layer */}
      <AnimatePresence>
        <motion.div
          key={`bg-${paper.id}-${paper.type}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: bgOpacity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className={cn(
            "absolute inset-0 grain overflow-hidden",
            paper.type === "image" ? "bg-cover bg-center" :
            paper.type === "video" ? "" : tone.class
          )}
          style={{
            backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
            x: bgX,
            y: bgY,
            scale: 1.1,
            // Composite this full-screen layer once — otherwise every sheet
            // animation frame can force a repaint of a *playing video* region.
            willChange: "transform",
          }}
        >
          {/* Persistent video element — src is swapped imperatively, never unmounted */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            crossOrigin="anonymous"
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              paper.type === "video" ? "block" : "hidden",
              videoReady ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Poster bridge — shows cached thumbnail while new video buffers */}
          {paper.type === "video" && posterBridge && !videoReady && (
            <img
              src={posterBridge}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            />
          )}
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              (paper.type === "image" || paper.type === "video") ? "opacity-20" : "opacity-0",
              isDark ? "bg-black" : "bg-white"
            )}
          />
        </motion.div>
      </AnimatePresence>


      {/* Atmospheric Subliminal Lighting (Does not Parallax, sits on the lens) */}
      <AnimatePresence>
        {atmosphere === "rain" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(15, 23, 42, 0.7) 120%)"
            }}
          />
        )}
        {atmosphere === "fireplace" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              // Radiates a pronounced, powerful cabin amber glow from the absolute bottom of the screen!
              background: "radial-gradient(ellipse 120% 90% at 50% 110%, rgba(255, 120, 40, 0.25) 0%, transparent 70%), radial-gradient(ellipse at 50% -20%, transparent 40%, rgba(15, 5, 0, 0.8) 120%)"
            }}
          />
        )}
      </AnimatePresence>

      <div
        ref={viewportRef}
        className={cn(
          "absolute inset-0 flex flex-col items-center px-8 pb-[90px] pt-[80px] z-10",
          overflowing ? "justify-start overflow-y-auto overscroll-contain" : "justify-center",
          isClearing && "pointer-events-none"
        )}
      >
        <div ref={measureRef} className="relative w-full max-w-[800px]">
          {/* Ghost Div: Visually renders the poetry with Focus 'Fade' Mode */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full whitespace-pre-wrap break-words pointer-events-none",
              "tracking-[0.01em] italic",
              align === "center" ? "text-center" : "text-left",
              font.class
            )}
            style={{
              fontFamily: `var(${font.variable})`,
              fontSize: poemSize,
              lineHeight: poemLeading,
            }}
          >
            {text === "" ? (
              <motion.span 
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                // 0.2 over video was illegible — 0.45 keeps the placeholder
                // clearly quieter than typed text but readable on any background.
                animate={{ opacity: 0.45, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }} // Lightning fast arrival (no artificial delay needed because 2.8s clear already passed)
                className="inline-block select-none"
                // Soft ambient shadow lifts the text off moving footage —
                // dark glow on dark ink mode, warm glow on light.
                style={{
                  textShadow: isDark
                    ? "0 1px 14px rgba(13, 11, 9, 0.5)"
                    : "0 1px 12px rgba(245, 240, 232, 0.4)",
                }}
              >
                arz kiya hai...
              </motion.span>
            ) : (
              text.split('\n').map((line, i, arr) => (
                <span
                  key={i}
                  className={cn(
                    "transition-opacity duration-1000",
                    isFocused && i !== activeIndex && !isClearing ? "opacity-30" : "opacity-100"
                  )}
                >
                  {/* While writing, the line is rendered as PLAIN TEXT so the
                      visible layer shares the textarea's exact metrics —
                      kerning, ligatures and all. Wrapping every glyph in an
                      inline-block (as the erase animation needs) changes those
                      metrics, which made the textarea believe a different
                      character sat under the user's finger. The per-character
                      tree is built only while the erase wipe is actually
                      playing, where a few milliseconds of reflow don't matter. */}
                  {isClearing ? (
                    line.split(/(\s+)/).map((word, wIdx) => {
                      if (!word.trim()) return <span key={wIdx} className="whitespace-pre">{word}</span>;

                      return (
                        <span key={wIdx} className="inline-block whitespace-pre">
                          {word.split('').map((char, cIdx) => {
                            const rest = getEraseAnimationPhysics(variant, i, wIdx, cIdx, false);
                            const erased = getEraseAnimationPhysics(variant, i, wIdx, cIdx, true);

                            return (
                              <motion.span
                                key={cIdx}
                                className="inline-block origin-center"
                                initial={rest.animate}
                                animate={erased.animate}
                                transition={erased.transition as any}
                              >
                                {char}
                              </motion.span>
                            );
                          })}
                        </span>
                      );
                    })
                  ) : (
                    line
                  )}
                  {i !== arr.length - 1 && <br />}
                </span>
              ))
            )}
          </div>

          {/* Invisible Textarea: Handles exact cursor positioning & native typing */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onSelect={handleSelectionChange}
            onFocus={() => { setIsFocused(true); handleSelectionChange(); onFocusChange?.(true); }}
            onBlur={() => { setIsFocused(false); onFocusChange?.(false); }}
            onKeyDown={handleSelectionChange}
            onClick={handleSelectionChange}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            className={cn(
              "w-full bg-transparent p-0 resize-none outline-none overflow-hidden break-words",
              "tracking-[0.01em] italic text-transparent caret-foreground",
              align === "center" ? "text-center" : "text-left",
              font.class
            )}
            style={{
              fontFamily: `var(${font.variable})`,
              fontSize: poemSize,
              lineHeight: poemLeading,
              height: textareaHeight,
              color: 'transparent',
              caretColor: isDark ? '#f2ece0' : '#1a1714'
            }}
            rows={1}
          />
        </div>

        {/* Signature: a frame-pinned mark at the bottom of the poster — but
            once the canvas scrolls, pinning would leave it floating while the
            poem slid underneath. In that case it joins the flow and travels
            with the poem instead. */}
        {(doodle || author) && (
          <div className={cn(
            "pointer-events-none z-10 flex flex-col items-center gap-1",
            overflowing
              ? "relative mt-10"
              : "absolute bottom-16 left-1/2 -translate-x-1/2",
            isClearing ? "transition-all duration-300 scale-95 blur-[8px] opacity-0 rotate-2" : "transition-all duration-700 opacity-100 scale-100 blur-0 rotate-0"
          )}>
            {doodle && (
              <div
                className={cn(
                  "opacity-40 transition-all duration-700",
                  isDark ? "invert brightness-200" : "brightness-0"
                )}
                style={{ width: motifSize, height: motifSize }}
              >
                <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            {author && (
              <span className="flex flex-col items-center gap-1">
                <span
                  aria-hidden
                  className={cn(isDark ? "bg-white/25" : "bg-black/25")}
                  style={{ width: creditRuleWidth, height: 1 }}
                />
                <span
                  className={cn("italic opacity-55", isDark ? "text-white" : "text-black")}
                  style={{
                    fontFamily: `var(${font.variable})`,
                    fontSize: creditSize,
                    letterSpacing: "0.02em",
                  }}
                >
                  {author}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
