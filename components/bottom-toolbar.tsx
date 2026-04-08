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
            <motion.div
              key="peek-button"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={cn(
                "flex items-center gap-0 rounded-t-[20px] overflow-hidden border-t border-x backdrop-blur-3xl shadow-lg",
                currentTone.ink === "ink-light"
                  ? "bg-white/[0.12] border-white/10"
                  : "bg-black/[0.12] border-black/10"
              )}
            >
              {/* Shelf toggle */}
              <button
                onClick={() => { trigger(20); onOpenToggle(true); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 min-h-[52px] transition-all hover:bg-white/10 font-jost text-[11px] font-bold tracking-[0.15em] uppercase select-none",
                  currentTone.ink === "ink-light" ? "text-white/80" : "text-black/70"
                )}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} size={16} strokeWidth={2.5} />
                <span>style</span>
              </button>

              {/* Divider */}
              <div className={cn("w-[1px] h-5 self-center", currentTone.ink === "ink-light" ? "bg-white/10" : "bg-black/10")} />

              {/* Export — always visible */}
              <button
                onClick={() => { trigger("nudge"); onExport(); }}
                className="flex items-center gap-2 px-6 py-4 min-h-[52px] transition-all hover:bg-[#F5F0E8]/10 font-jost text-[11px] font-bold tracking-[0.15em] uppercase select-none text-[#F5F0E8]"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2.5} />
                <span>export</span>
              </button>
            </motion.div>
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
                      className="flex items-center gap-2 font-jost text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2 px-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 select-none"
                    >
                      <HugeiconsIcon icon={PencilEdit01Icon} size={13} strokeWidth={2.5} />
                      <span className="mt-0.5">graphics</span>
                    </button>

                    <button
                      onClick={() => {
                        trigger("nudge");
                        onExport();
                      }}
                      className="flex items-center gap-2 font-jost text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2 px-4 rounded-full bg-[#F5F0E8] text-[#1A1714] hover:bg-white active:scale-95 select-none shadow-md"
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} size={13} strokeWidth={2.5} />
                      <span className="mt-0.5">export</span>
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
