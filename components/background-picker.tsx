"use client";

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

  // Only image textures from the fetched papers
  const canvasPapers = dynamicPapers.filter(p => p.type === "image");
  // Is the current background a canvas texture (image)?
  const isCanvasActive = currentPaper.type === "image";

  return (
    <div className="space-y-3">
      {/* Background Row — solid tones + canvas textures merged */}
      <div className="flex items-center py-1">
        <span className="flex-shrink-0 font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase pl-8 pr-4">
          bg
        </span>
        <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pl-3 pr-8 py-3">
          {/* Solid color swatches */}
          {TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => { trigger(35); onToneSelect(tone); }}
              className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border-2 transition-all duration-500",
                tone.class,
                !isCanvasActive && currentTone.id === tone.id
                  ? "border-[#F5F0E8] scale-[1.15] ring-2 ring-[#F5F0E8] ring-offset-2 ring-offset-[#161412]"
                  : "border-white/5 hover:border-white/20"
              )}
              title={tone.label}
            />
          ))}

          {/* Divider between solids and textures */}
          <div className="w-[1.5px] h-5 bg-white/10 flex-shrink-0" />

          {/* Canvas texture swatches */}
          {canvasPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => { trigger(35); onPaperSelect(paper); }}
              className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-500 overflow-hidden bg-white/5",
                isCanvasActive && currentPaper.id === paper.id
                  ? "border-[#F5F0E8] scale-[1.12] ring-2 ring-[#F5F0E8] ring-offset-4 ring-offset-[#161412]"
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <img src={paper.path} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Ink Row — independent text color direction */}
      <div className="flex items-center py-1">
        <span className="flex-shrink-0 font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase pl-8 pr-4">
          ink
        </span>
        <div className="flex gap-3 pl-3">
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
            <span>dark text</span>
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
            <span>light text</span>
          </button>
        </div>
      </div>
    </div>
  );
}
