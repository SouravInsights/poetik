"use client";

import { TONES, PAPERS, Tone, Paper } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BackgroundPickerProps {
  currentTone: Tone;
  currentPaper: Paper;
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
}

export function BackgroundPicker({
  currentTone,
  currentPaper,
  onToneSelect,
  onPaperSelect,
}: BackgroundPickerProps) {
  return (
    <div className="flex gap-2 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 pb-4">
      <span className="font-jost text-[9px] font-light tracking-[0.16em] lowercase opacity-30 text-inherit flex-shrink-0 pr-1 truncate">
        tone
      </span>
      {TONES.map((tone) => (
        <button
          key={tone.id}
          onClick={() => {
            onToneSelect(tone);
            // reset paper if tone is selected
            onPaperSelect(PAPERS[0]);
          }}
          className={cn(
            "w-[26px] h-[26px] rounded-[3px] flex-shrink-0 cursor-pointer border transition-all duration-200",
            tone.class,
            currentTone.id === tone.id && currentPaper.type === "color"
              ? "border-accent scale-[1.14]"
              : "border-transparent hover:scale-[1.12]"
          )}
        />
      ))}
      <div className="w-[0.5px] h-5 bg-current opacity-15 flex-shrink-0" />
      <span className="font-jost text-[9px] font-light tracking-[0.16em] lowercase opacity-30 text-inherit flex-shrink-0 pr-1 truncate">
        paper
      </span>
      {PAPERS.filter(p => p.type === "image").map((paper) => (
        <button
          key={paper.id}
          onClick={() => onPaperSelect(paper)}
          className={cn(
            "w-[26px] h-[26px] rounded-[3px] flex-shrink-0 cursor-pointer border transition-all duration-200 overflow-hidden bg-white",
            currentPaper.id === paper.id
              ? "border-accent scale-[1.14]"
              : "border-transparent hover:scale-[1.12]"
          )}
        >
          <img src={paper.path} alt="" className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}
