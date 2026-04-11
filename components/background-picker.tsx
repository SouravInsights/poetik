"use client";

import { useState } from "react";
import { TONES, Tone, Paper } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

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
  // Default to cinematic if active, else texture
  const [bgTab, setBgTab] = useState<"solid" | "texture" | "cinematic">(
    currentPaper.type === "video" ? "cinematic" : "texture"
  );

  // Modern backgrounds first, then paper textures
  const modernPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/modern-backgrounds/"));
  const classicPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/papers/"));
  const videoPapers = dynamicPapers.filter(p => p.type === "video");
  const canvasPapers = [...modernPapers, ...classicPapers];

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
                bgTab === "cinematic"
                  ? "bg-white/15 text-white"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              cinematic
            </button>
            <button
              onClick={() => { trigger(10); setBgTab("texture"); }}
              className={cn(
                "font-jost text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all",
                bgTab === "texture"
                  ? "bg-white/15 text-white"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              texture
            </button>
            <button
              onClick={() => { trigger(10); setBgTab("solid"); }}
              className={cn(
                "font-jost text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full transition-all",
                bgTab === "solid"
                  ? "bg-white/15 text-white"
                  : "text-white/30 hover:text-white/60"
              )}
            >
              solid
            </button>
          </div>
        </div>

        {/* py-4 gives enough room for ring-offset to breathe on all sides */}
        <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 py-4">
          {bgTab === "cinematic" ? (
            videoPapers.map((paper) => (
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
                <video src={paper.path} className="w-full h-full object-cover" muted playsInline />
              </button>
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

      {/* Ink override — only shown for textures since solid auto-manages ink */}
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
