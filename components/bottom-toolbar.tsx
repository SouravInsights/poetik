"use client";

import { Font, Tone, Paper } from "@/lib/constants";
import { FontPicker } from "./font-picker";
import { BackgroundPicker } from "./background-picker";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, ArrowRight01Icon, ArrowUp01Icon, ArrowDown01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { useWebHaptics } from "web-haptics/react";
import { motion, AnimatePresence } from "motion/react";

interface BottomToolbarProps {
  isOpen: boolean;
  onOpenToggle: (open: boolean) => void;
  currentFont: Font;
  currentTone: Tone;
  currentPaper: Paper;
  dynamicPapers: Paper[];
  author: string;
  onAuthorChange: (val: string) => void;
  onFontSelect: (font: Font) => void;
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
  onExport: () => void;
  onDoodleToggle: () => void;
  uiVisible: boolean;
}

export function BottomToolbar({
  isOpen,
  onOpenToggle,
  currentFont,
  currentTone,
  currentPaper,
  dynamicPapers,
  author,
  onAuthorChange,
  onFontSelect,
  onToneSelect,
  onPaperSelect,
  onExport,
  onDoodleToggle,
  uiVisible,
}: BottomToolbarProps) {
  const { trigger } = useWebHaptics();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              trigger("selection");
              onOpenToggle(false);
            }}
            className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col items-center",
          !uiVisible && !isOpen && "translate-y-full opacity-0"
        )}
      >
        {!isOpen && (
          <button
            onClick={() => {
              trigger("selection");
              onOpenToggle(true);
            }}
            className={cn(
              "px-8 py-2.5 rounded-t-[20px] backdrop-blur-3xl transition-all duration-500 hover:py-3.5 hover:scale-105 active:scale-95 group",
              currentTone.ink === "ink-light" 
                ? "bg-white/[0.12] text-white/60 border-t border-x border-white/10" 
                : "bg-black/[0.06] text-black/50 border-t border-x border-black/10",
              !uiVisible && "translate-y-full"
            )}
          >
            <div className="flex flex-col items-center">
              <HugeiconsIcon icon={ArrowUp01Icon} size={20} className="opacity-100 transition-all group-hover:-translate-y-0.5" />
            </div>
          </button>
        )}

        <div 
          className={cn(
            "w-full transition-all duration-700 ease-out overflow-hidden bg-[#0D0B09]/98 backdrop-blur-3xl border-t border-white/10 shadow-2xl",
            isOpen ? "max-h-[600px] translate-y-0" : "max-h-0 translate-y-10"
          )}
        >
          <div className="pt-6 pb-[max(env(safe-area-inset-bottom),24px)] text-[#F5F0E8] space-y-6">
            {/* Header / Dismiss */}
            <div className="flex items-center justify-between px-8">
              <span className="font-italiana text-[10px] uppercase tracking-[0.3em] opacity-30">editing tools</span>
              <button 
                onClick={() => onOpenToggle(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
                aria-label="Close tools"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="opacity-40" />
              </button>
            </div>

            {/* Author Input Section */}
            <div className="px-8">
              <div className="relative group">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-20 group-focus-within:opacity-100 group-focus-within:text-accent transition-all">
                  <HugeiconsIcon icon={UserIcon} size={14} />
                  <span className="font-jost text-[10px] uppercase tracking-[0.2em]">@</span>
                </div>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => onAuthorChange(e.target.value)}
                  placeholder="USERNAME"
                  className="w-full bg-transparent border-b border-white/5 py-3 pl-10 outline-none font-jost text-[11px] tracking-[0.3em] uppercase placeholder:opacity-20 focus:border-accent/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-5">
              <FontPicker currentFont={currentFont} onSelect={onFontSelect} />
              
              <div className="h-[1px] bg-white/5 mx-8" />
              
              <BackgroundPicker 
                currentTone={currentTone} 
                currentPaper={currentPaper}
                dynamicPapers={dynamicPapers}
                onToneSelect={onToneSelect}
                onPaperSelect={onPaperSelect}
              />

              <div className="flex items-center justify-between px-8 pt-2">
                <button 
                  onClick={() => {
                    trigger("selection");
                    onDoodleToggle();
                  }}
                  className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-all py-2 group"
                >
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:border-white/30 transition-colors">
                    <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                  </div>
                  <span className="font-jost text-[10px] tracking-[0.2em] uppercase opacity-60">graphics</span>
                </button>

                <button
                  onClick={() => {
                    trigger("medium");
                    onExport();
                  }}
                  className="flex items-center gap-4 py-2 group transition-all"
                >
                  <span className="font-italiana text-xl tracking-[0.1em] opacity-80 group-hover:opacity-100 transition-all">export</span>
                  <div className="w-10 h-10 rounded-full bg-[#f2ece0] text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
