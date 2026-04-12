/**
 * components/export-buffers.tsx
 *
 * WHAT ARE "BUFFERS"?
 * ===================
 * In graphics and video, a "buffer" is a holding area — a place where
 * you prepare something before it's shown or sent somewhere.
 * Think of it like a kitchen: the food is prepared in the back (buffer)
 * before it's plated and served to the table (shown to user).
 *
 * In our case, these buffers are invisible HTML <div> elements that
 * live hidden in the bottom-left corner of the page (opacity: 0).
 * They render content at full 1080×1920 export resolution so we can
 * "photograph" them using html-to-image when the user taps Export.
 *
 * WHY DO WE NEED HIDDEN DIVS AT ALL?
 * ====================================
 * The preview card in the Export Modal is small (~280px wide).
 * If we ran html-to-image on that, the exported image would be blurry
 * because we'd be scaling up a low-resolution render.
 *
 * So instead, we secretly render a second, full-sized version of the
 * composition at exactly 1080×1920 pixels — hidden from the user but
 * present in the DOM. We then take a "photo" of that hidden version.
 * This gives us a perfect, full-resolution export.
 *
 * BUFFER 1: JpegExportBuffer
 * ===========================
 * Used when the background is a static image or solid color.
 * Renders the full composition: background + text + doodle + author.
 * html-to-image captures this as a high-quality JPEG (98% quality).
 * The entire export happens in one shot — very fast (~1 second).
 *
 * BUFFER 2: VideoOverlayBuffer
 * =============================
 * Used when the background is a video.
 * Here we CANNOT include the video in the buffer, because html-to-image
 * cannot capture video frames — it would just get a black rectangle.
 *
 * So instead, this buffer renders ONLY the text/doodle/author layer
 * with a fully transparent background (no video, no color, nothing).
 * The result is a transparent PNG where only your poem text is visible.
 *
 * That transparent PNG is then manually layered over the video frames
 * in lib/video-exporter.ts using a canvas compositor. See that file for details.
 *
 * THE COST:
 * ==========
 * These buffers render in the browser — zero server cost.
 * They're hidden from view, so they don't impact visual performance.
 * Because they're fixed-size (1080×1920), they do use some RAM —
 * roughly 8MB of display memory (1080 × 1920 × 4 bytes per pixel).
 * This is negligible on any modern phone or laptop.
 */

import { RefObject } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";

/** Props shared by both buffer types — the text content of the poem card */
interface ExportBufferSharedProps {
  text: string;
  font: Font;
  inkMode: "ink-light" | "ink-dark";
  isDark: boolean;    // Precomputed: isDark = inkMode === "ink-light"
  doodle: string | null;
  author: string;
  align: "left" | "center";
}

// ─────────────────────────────────────────────────────────────────────────────
// BUFFER 1: JPEG EXPORT BUFFER
// Used for static image exports (image backgrounds or solid color tones)
// ─────────────────────────────────────────────────────────────────────────────

interface JpegBufferProps extends ExportBufferSharedProps {
  exportRef: RefObject<HTMLDivElement | null>; // React ref so use-export.ts can point html-to-image at this element
  paper: Paper;
  tone: Tone;
  bgOpacity: number;
}

export function JpegExportBuffer({
  exportRef,
  text,
  font,
  paper,
  tone,
  bgOpacity,
  inkMode,
  isDark,
  doodle,
  author,
  align,
}: JpegBufferProps) {
  return (
    // The outer wrapper positions this buffer off-screen and makes it invisible.
    // overflow-hidden ensures the 1080px-wide div doesn't create a horizontal scrollbar.
    <div className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: 1080, height: 1920 }}>
      {/*
        This is the actual element that html-to-image will "photograph".
        It's styled exactly like the live EditorCanvas — same classes, same layout.
        The ref lets use-export.ts pass this DOM node to toJpeg() from html-to-image.
      */}
      <div
        ref={exportRef}
        className={cn(
          "w-full h-full relative flex flex-col items-center justify-center px-[120px] grain overflow-hidden",
          paper.type === "image" ? "bg-cover bg-center" : tone.class,
          inkMode
        )}
        style={{
          backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
          opacity: bgOpacity,
        }}
      >
        {/* The dim overlay — matches the editor's 20% tint that makes text readable over busy backgrounds */}
        <div className={cn("absolute inset-0 transition-opacity", paper.type === "image" ? "opacity-20" : "opacity-0", isDark ? "bg-black" : "bg-white")} />

        {/* The poem text — rendered at a large fixed size suitable for 1080px width */}
        <div
          className={cn("italic leading-[1.6] tracking-[0.03em] whitespace-pre-wrap break-words w-full", align === "center" ? "text-center" : "text-left", font.class)}
          style={{ fontFamily: `var(${font.variable})`, fontSize: "80px" }}
        >
          {text}
        </div>

        {/* Doodle motif and author handle, if the user set them */}
        {(doodle || author) && (
          <div className="absolute bottom-[120px] left-0 right-0 flex flex-col items-center gap-8">
            {doodle && (
              <div className={cn("w-24 h-24 opacity-40", isDark ? "invert brightness-200" : "brightness-0")}>
                <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            {author && (
              <span className="font-jost text-[24px] tracking-[0.4em] uppercase opacity-40">
                {author.startsWith('@') ? author : `@${author}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUFFER 2: VIDEO TEXT OVERLAY BUFFER
// Used for cinematic video exports only
// ─────────────────────────────────────────────────────────────────────────────

interface VideoOverlayBufferProps extends ExportBufferSharedProps {
  overlayRef: RefObject<HTMLDivElement | null>; // React ref so use-export.ts can pass this to the video exporter
}

export function VideoOverlayBuffer({
  overlayRef,
  text,
  font,
  inkMode,
  isDark,
  doodle,
  author,
  align,
}: VideoOverlayBufferProps) {
  return (
    <div className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: 1080, height: 1920 }}>
      {/*
        KEY DIFFERENCE FROM THE JPEG BUFFER:
        This div has `background: "transparent"` — it has NO background color or image.
        It only renders the text, doodle, and author, floating on nothing.

        When html-to-image captures this, the output is a PNG file where:
          - Every pixel that is part of your text/doodle/author is opaque (visible)
          - Every other pixel is fully transparent (invisible)

        This transparent PNG is then used in lib/video-exporter.ts as Layer 2,
        stamped over each raw video frame. The transparency makes it blend perfectly.

        Think of it as a movie subtitle overlay, except it's your entire poem layout.
      */}
      <div
        ref={overlayRef}
        className={cn("w-full h-full relative flex flex-col items-center justify-center px-[120px]", inkMode)}
        style={{ background: "transparent" }}
      >
        {/*
          A subtle dim tint that matches the editor's atmosphere.
          This is semi-transparent black or white, so it slightly adjusts
          the contrast of the video behind the text without hiding it.
        */}
        <div className={cn("absolute inset-0", isDark ? "bg-black/20" : "bg-white/20")} />

        {/* Poem text — same styles as the JPEG buffer, same font, same layout */}
        <div
          className={cn("italic leading-[1.6] tracking-[0.03em] whitespace-pre-wrap break-words w-full z-10", align === "center" ? "text-center" : "text-left", font.class)}
          style={{ fontFamily: `var(${font.variable})`, fontSize: "80px" }}
        >
          {text}
        </div>

        {/* Doodle and author handle */}
        {(doodle || author) && (
          <div className="absolute bottom-[120px] left-0 right-0 flex flex-col items-center gap-8 z-10">
            {doodle && (
              <div className={cn("w-24 h-24 opacity-40", isDark ? "invert brightness-200" : "brightness-0")}>
                <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            {author && (
              <span className="font-jost text-[24px] tracking-[0.4em] uppercase opacity-40">
                {author.startsWith('@') ? author : `@${author}`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
