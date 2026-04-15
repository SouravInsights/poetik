"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TONES, Tone, Paper } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

// ---------------------------------------------------------------------------
// Hook: generate a static poster frame for a video URL using one shared
// off-screen <video> element. Thumbnails are cached in a module-level Map
// so they survive tab switches and re-renders.
// ---------------------------------------------------------------------------
const posterCache = new Map<string, string>(); // url → dataURL

function useVideoPoster(src: string | undefined): string | null {
  const [poster, setPoster] = useState<string | null>(
    src ? (posterCache.get(src) ?? null) : null
  );

  useEffect(() => {
    if (!src) return;
    if (posterCache.has(src)) {
      setPoster(posterCache.get(src)!);
      return;
    }

    let cancelled = false;
    const video = document.createElement("video");
    // crossOrigin="anonymous" is required for R2 (cross-origin).
    // Your R2 bucket must have CORS configured (Allow-Origin: *) for this to work.
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.src = src;

    const capture = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, 80, 80);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        posterCache.set(src, dataUrl);
        setPoster(dataUrl);
      } catch (err) {
        // Most likely a CORS error — R2 bucket needs Access-Control-Allow-Origin: *
        console.warn("[VideoSwatch] Poster capture failed (check R2 CORS config):", err);
      } finally {
        video.src = "";
      }
    };

    // Seek to 0.1s so the browser has a decoded frame to draw.
    // Listening to 'seeked' is more reliable than 'loadeddata' for this purpose.
    video.addEventListener("loadedmetadata", () => {
      if (!cancelled) video.currentTime = 0.1;
    }, { once: true });
    video.addEventListener("seeked", capture, { once: true });
    video.load();

    return () => {
      cancelled = true;
      video.src = "";
    };
  }, [src]);

  return poster;
}


// ---------------------------------------------------------------------------
// Single video thumbnail swatch
// ---------------------------------------------------------------------------
function VideoSwatch({
  paper,
  isSelected,
  onClick,
}: {
  paper: Paper;
  isSelected: boolean;
  onClick: () => void;
}) {
  const poster = useVideoPoster(paper.path);

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-300 overflow-hidden bg-white/5 relative group",
        isSelected
          ? "border-[#F5F0E8] scale-[1.12] ring-2 ring-[#F5F0E8] ring-offset-[5px] ring-offset-[#161412]"
          : "border-white/10 hover:border-white/30"
      )}
    >
      {poster ? (
        /* Static image — zero buffering overhead */
        <img
          src={poster}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        /* Skeleton shimmer while the poster is being captured */
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-full" />
      )}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface BackgroundPickerProps {
  currentTone: Tone;
  currentPaper: Paper;
  inkMode: "ink-light" | "ink-dark";
  dynamicPapers: Paper[];
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
  onInkModeChange: (mode: "ink-light" | "ink-dark") => void;
}

export function BackgroundPicker({
  currentTone,
  currentPaper,
  inkMode,
  dynamicPapers,
  onToneSelect,
  onPaperSelect,
  onInkModeChange,
}: BackgroundPickerProps) {
  const { trigger } = useWebHaptics();
  const isCanvasActive = currentPaper.type === "image" || currentPaper.type === "video";
  const [bgTab, setBgTab] = useState<"solid" | "texture" | "cinematic">(
    currentPaper.type === "video" ? "cinematic" : "texture"
  );

  const modernPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/modern-backgrounds/"));
  const classicPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/papers/"));
  const videoPapers = dynamicPapers.filter(p => p.type === "video");
  const canvasPapers = [...modernPapers, ...classicPapers];

  const handleVideoSelect = useCallback((paper: Paper) => {
    trigger(35);
    onPaperSelect(paper);
  }, [trigger, onPaperSelect]);

  return (
    <div className="space-y-3">
      {/* Background section */}
      <div className="space-y-2">
        {/* Header: label + segmented tab */}
        <div className="flex items-center justify-between pl-8 pr-8">
          <span className="font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">
            background
          </span>
          <div className="flex items-center gap-0 bg-white/5 rounded-full p-0.5 border border-white/5">
            <button
              onClick={() => { trigger(10); setBgTab("cinematic"); }}
              className={cn(
                "font-jost text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all",
                bgTab === "cinematic" ? "bg-white/15 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              cinematic
            </button>
            <button
              onClick={() => { trigger(10); setBgTab("texture"); }}
              className={cn(
                "font-jost text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all",
                bgTab === "texture" ? "bg-white/15 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              texture
            </button>
            <button
              onClick={() => { trigger(10); setBgTab("solid"); }}
              className={cn(
                "font-jost text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all",
                bgTab === "solid" ? "bg-white/15 text-white" : "text-white/30 hover:text-white/60"
              )}
            >
              solid
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 py-4">
          {bgTab === "cinematic" ? (
            videoPapers.map((paper) => (
              <VideoSwatch
                key={paper.id}
                paper={paper}
                isSelected={currentPaper.id === paper.id}
                onClick={() => handleVideoSelect(paper)}
              />
            ))
          ) : bgTab === "texture" ? (
            canvasPapers.map((paper) => (
              <button
                key={paper.id}
                onClick={() => { trigger(35); onPaperSelect(paper); }}
                className={cn(
                  "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-500 overflow-hidden bg-white/5",
                  currentPaper.id === paper.id
                    ? "border-[#F5F0E8] scale-[1.12] ring-2 ring-[#F5F0E8] ring-offset-[5px] ring-offset-[#161412]"
                    : "border-white/10 hover:border-white/30"
                )}
              >
                <img src={paper.path} alt="" className="w-full h-full object-cover" />
              </button>
            ))
          ) : (
            TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => { trigger(35); onToneSelect(tone); }}
                title={tone.label}
                className={cn(
                  "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border-2 transition-all duration-500",
                  tone.class,
                  !isCanvasActive && currentTone.id === tone.id
                    ? "border-[#F5F0E8] scale-[1.15] ring-2 ring-[#F5F0E8] ring-offset-[5px] ring-offset-[#161412]"
                    : "border-white/5 hover:border-white/20"
                )}
              />
            ))
          )}
        </div>
      </div>

      {/* Ink override — only shown for textures */}
      {bgTab === "texture" && (
        <>
          <div className="h-[1px] bg-white/5 mx-8" />
          <div className="space-y-2">
            <div className="pl-8">
              <span className="font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase">
                ink
              </span>
            </div>
            <div className="flex gap-3 pl-8">
              <button
                onClick={() => onInkModeChange("ink-dark")}
                className={cn(
                  "flex items-center gap-2 font-jost text-[10px] font-bold tracking-[0.15em] uppercase transition-all py-2 px-4 rounded-full border",
                  inkMode === "ink-dark"
                    ? "bg-[#F5F0E8] text-[#1A1714] border-[#F5F0E8]"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                )}
              >
                <span className="text-[12px] font-black leading-none">A</span>
                <span>dark</span>
              </button>
              <button
                onClick={() => onInkModeChange("ink-light")}
                className={cn(
                  "flex items-center gap-2 font-jost text-[10px] font-bold tracking-[0.15em] uppercase transition-all py-2 px-4 rounded-full border",
                  inkMode === "ink-light"
                    ? "bg-[#1A1714] text-[#F5F0E8] border-[#F5F0E8]/30"
                    : "bg-white/5 text-white/50 border-white/10 hover:border-white/20"
                )}
              >
                <span className="text-[12px] font-black leading-none">A</span>
                <span>light</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
