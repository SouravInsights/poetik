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
        trigger(35);
        onPaperSelect(paper);
      }}
      className={cn(
        "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border transition-all duration-500 overflow-hidden bg-white/5",
        currentPaper.id === paper.id
          ? "border-[#F5F0E8] scale-[1.12] ring-2 ring-[#F5F0E8] ring-offset-4 ring-offset-[#161412]"
          : "border-white/10 hover:border-white/30"
      )}
    >
      <img src={paper.path} alt="" className="w-full h-full object-cover" />
    </button>
  );

  return (
    <div className="space-y-3">
      {/* Tones Row */}
      <div className="flex items-center py-1">
        <span className="flex-shrink-0 font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase pl-8 pr-4">
          tones
        </span>
        {/* pl-3 ensures ring-offset isn't clipped on first item */}
        <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pl-3 pr-8 py-3">
          {TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => {
                trigger(35);
                onToneSelect(tone);
              }}
              className={cn(
                "w-10 h-10 rounded-full flex-shrink-0 cursor-pointer border-2 transition-all duration-500",
                tone.class,
                currentTone.id === tone.id
                  ? "border-[#F5F0E8] scale-[1.15] ring-2 ring-[#F5F0E8] ring-offset-2 ring-offset-[#161412]"
                  : "border-white/5 hover:border-white/20"
              )}
            />
          ))}
        </div>
      </div>

      {/* Canvas Row */}
      <div className="flex items-center py-1">
        <span className="flex-shrink-0 font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase pl-8 pr-4">
          canvas
        </span>
        <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pl-3 pr-8 py-3">
          {classicPapers.map(renderSwatch)}
          <div className="w-[1.5px] h-5 bg-white/10 flex-shrink-0" />
          {modernPapers.map(renderSwatch)}
        </div>
      </div>
    </div>
  );
}
