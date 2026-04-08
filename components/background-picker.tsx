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
    <div className="space-y-3">
      {/* Tones Row */}
      <div className="flex gap-3 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8">
        <span className="font-jost text-[8px] font-medium tracking-[0.2em] opacity-20 flex-shrink-0 uppercase pr-1">
          tones
        </span>
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => {
              trigger("medium");
              onToneSelect(tone);
              onPaperSelect(dynamicPapers[0]);
            }}
            className={cn(
              "w-7 h-7 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-500",
              tone.class,
              currentTone.id === tone.id && currentPaper.type === "color"
                ? "border-accent scale-[1.1]"
                : "border-white/10 hover:border-white/30"
            )}
          />
        ))}
      </div>

      {/* Papers Row */}
      <div className="flex gap-3 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8">
        <span className="font-jost text-[8px] font-medium tracking-[0.2em] opacity-20 flex-shrink-0 uppercase pr-1">
          papers
        </span>
        {classicPapers.map(renderSwatch)}
        
        <div className="w-[1px] h-4 bg-white/5 flex-shrink-0 mx-1" />
        
        {modernPapers.map(renderSwatch)}
      </div>
    </div>
  );
}
