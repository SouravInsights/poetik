"use client";

import { Font, Tone, Paper } from "@/lib/constants";
import { FontPicker } from "./font-picker";
import { BackgroundPicker } from "./background-picker";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  PencilEdit01Icon, 
  ArrowRight01Icon, 
  ArrowUp01Icon, 
  ArrowDown01Icon, 
  UserIcon 
} from "@hugeicons/core-free-icons";
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
              trigger(10);
              onOpenToggle(false);
            }}
            className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center",
          !uiVisible && !isOpen && "translate-y-full opacity-0"
        )}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="peek-button"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={() => {
                trigger(20);
                onOpenToggle(true);
              }}
              className={cn(
                "px-8 py-2.5 rounded-t-[20px] backdrop-blur-3xl transition-all duration-500 hover:py-3.5 hover:scale-105 active:scale-95 group border-t border-x",
                currentTone.ink === "ink-light" 
                  ? "bg-white/[0.12] text-white/60 border-white/10" 
                  : "bg-black/[0.1] text-black/50 border-black/10"
              )}
            >
              <HugeiconsIcon icon={ArrowUp01Icon} size={20} className="transition-all group-hover:-translate-y-0.5" />
            </motion.button>
          ) : (
            <motion.div 
              key="toolbar-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-[#161412]/98 backdrop-blur-3xl border-t border-white/10 shadow-2xl rounded-t-[32px] overflow-hidden"
            >
              <div className="pt-6 pb-[max(env(safe-area-inset-bottom),20px)] text-[#F5F0E8] space-y-5">
                {/* Header / Dismiss */}
                <div className="flex items-center justify-between px-8">
                  <span className="font-jost text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">editing shelf</span>
                  <button 
                    onClick={() => {
                      trigger(10);
                      onOpenToggle(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Close tools"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="opacity-60" />
                  </button>
                </div>

                {/* Author Input Section */}
                <div className="px-8">
                  <div className="relative group">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-40 group-focus-within:opacity-100 group-focus-within:text-accent transition-all">
                      <HugeiconsIcon icon={UserIcon} size={15} strokeWidth={2.5} />
                      <span className="font-jost text-[10px] uppercase tracking-[0.2em] font-bold">@</span>
                    </div>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => onAuthorChange(e.target.value)}
                      placeholder="USERNAME"
                      className="w-full bg-transparent border-b-2 border-white/5 py-3 pl-12 outline-none font-jost text-[12px] tracking-[0.3em] uppercase placeholder:opacity-20 focus:border-accent/60 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-4">
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
                        trigger(20);
                        onDoodleToggle();
                      }}
                      className="flex items-center gap-4 transition-all py-2 group"
                    >
                      <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 group-hover:border-accent/40 transition-all shadow-lg">
                        <HugeiconsIcon icon={PencilEdit01Icon} size={18} strokeWidth={2} />
                      </div>
                      <span className="font-jost text-[11px] tracking-[0.3em] uppercase opacity-70 group-hover:opacity-100 font-bold">graphics</span>
                    </button>

                    <button
                      onClick={() => {
                        trigger("nudge");
                        onExport();
                      }}
                      className="flex items-center gap-5 py-2 group transition-all"
                    >
                      <span className="font-italiana text-2xl tracking-[0.1em] opacity-90 group-hover:opacity-100 transition-all group-hover:translate-x-[-4px]">export</span>
                      <div className="w-12 h-12 rounded-full bg-[#f2ece0] text-black flex items-center justify-center shadow-xl group-hover:scale-110 active:scale-95 transition-all">
                        <HugeiconsIcon icon={ArrowRight01Icon} size={22} strokeWidth={2.5} />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
