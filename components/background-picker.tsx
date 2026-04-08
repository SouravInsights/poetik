"use client";

import { TONES, Tone, Paper } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";

interface BackgroundPickerProps {
  currentTone: Tone;
  currentPaper: Paper;
  dynamicPapers: Paper[];
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
}

export function BackgroundPicker({
  currentTone,
  currentPaper,
  dynamicPapers,
  onToneSelect,
  onPaperSelect,
}: BackgroundPickerProps) {
  const { trigger } = useWebHaptics();

  const classicPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/papers/"));
  const modernPapers = dynamicPapers.filter(p => p.type === "image" && p.path?.includes("/modern-backgrounds/"));

  const renderSwatch = (paper: Paper) => (
    <button
      key={paper.id}
      onClick={() => {
        trigger("medium");
        onPaperSelect(paper);
      }}
      className={cn(
        "w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-500 overflow-hidden bg-white/5",
        currentPaper.id === paper.id
          ? "border-accent scale-[1.1] ring-2 ring-accent/10"
          : "border-white/10 hover:border-white/30"
      )}
    >
      <img src={paper.path} alt="" className="w-full h-full object-cover" />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Tones Row */}
      <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 py-3">
        <span className="font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 flex-shrink-0 uppercase pr-2">
          tones
        </span>
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => {
              trigger("medium");
              onToneSelect(tone);
            }}
            className={cn(
              "w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border-2 transition-all duration-500",
              tone.class,
              currentTone.id === tone.id
                ? "border-accent scale-[1.15] shadow-[0_0_15px_rgba(139,69,19,0.3)]"
                : "border-white/5 hover:border-white/20"
            )}
          />
        ))}
      </div>

      {/* Papers Row */}
      <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 py-3">
        <span className="font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 flex-shrink-0 uppercase pr-2">
          papers
        </span>
        {classicPapers.map(renderSwatch)}
        
        <div className="w-[1.5px] h-4 bg-white/10 flex-shrink-0 mx-2" />
        
        {modernPapers.map(renderSwatch)}
      </div>
    </div>
  );
}
