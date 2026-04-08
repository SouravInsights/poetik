"use client";

import { Font, Tone, Paper } from "@/lib/constants";
import { FontPicker } from "./font-picker";
import { BackgroundPicker } from "./background-picker";
import { cn } from "@/lib/utils";

interface BottomToolbarProps {
  visible: boolean;
  currentFont: Font;
  currentTone: Tone;
  currentPaper: Paper;
  onFontSelect: (font: Font) => void;
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
  onExport: () => void;
  onDoodleToggle: () => void;
}

export function BottomToolbar({
  visible,
  currentFont,
  currentTone,
  currentPaper,
  onFontSelect,
  onToneSelect,
  onPaperSelect,
  onExport,
  onDoodleToggle,
}: BottomToolbarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] pb-[max(env(safe-area-inset-bottom),16px)] transition-all duration-400 ease-in-out",
        !visible && "opacity-0 pointer-events-none translate-y-[6px]"
      )}
    >
      <div className="h-[0.5px] bg-current opacity-[0.08] mx-5 mb-3" />
      
      <FontPicker currentFont={currentFont} onSelect={onFontSelect} />
      
      <BackgroundPicker 
        currentTone={currentTone} 
        currentPaper={currentPaper}
        onToneSelect={onToneSelect}
        onPaperSelect={onPaperSelect}
      />

      <div className="flex items-center justify-between px-6">
        <button 
          onClick={onDoodleToggle}
          className="flex items-center gap-2 opacity-35 hover:opacity-70 transition-opacity"
        >
          <span className="font-jost text-[11px] font-light tracking-[0.1em] lowercase flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            doodle
          </span>
        </button>

        <button
          onClick={onExport}
          className="font-italiana text-base tracking-[0.06em] opacity-50 hover:opacity-90 transition-opacity relative pb-1"
        >
          export
          <div className="absolute bottom-0.5 left-0 right-0 h-[0.5px] bg-accent opacity-70" />
        </button>
      </div>
    </div>
  );
}
