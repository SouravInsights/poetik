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
  inkMode: "ink-light" | "ink-dark";
  dynamicPapers: Paper[];
  author: string;
  onAuthorChange: (val: string) => void;
  onFontSelect: (font: Font) => void;
  onToneSelect: (tone: Tone) => void;
  onPaperSelect: (paper: Paper) => void;
  onInkModeChange: (mode: "ink-light" | "ink-dark") => void;
  onExport: () => void;
  onDoodleToggle: () => void;
  uiVisible: boolean;
  /** False when the canvas is empty — exporting blank poetry is meaningless. */
  canExport: boolean;
}

export function BottomToolbar({
  isOpen,
  onOpenToggle,
  currentFont,
  currentTone,
  currentPaper,
  inkMode,
  dynamicPapers,
  author,
  onAuthorChange,
  onFontSelect,
  onToneSelect,
  onPaperSelect,
  onInkModeChange,
  onExport,
  onDoodleToggle,
  uiVisible,
  canExport,
}: BottomToolbarProps) {
  const { trigger } = useWebHaptics();
  const isDark = inkMode === "ink-light";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // Fades out just ahead of the sheet's accelerated exit, so the
            // backdrop never outlives what it was dimming.
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={() => { trigger(10); onOpenToggle(false); }}
            className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          // The wrapper needs its own transition — without it the dissolve
          // while writing snaps instead of gliding (TopBar already had one).
          "fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center transition-all duration-500 ease-in-out",
          !uiVisible && !isOpen && "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        {/* mode="wait" sequences the two states instead of overlapping them:
            the sheet fully exits BEFORE the pill even mounts — nothing else is
            animating during the sheet's final frames. The old overlap stacked a
            blur-over-video entrance on top of the exit and read as stutter. */}
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="peek-button"
              initial={{ y: 14, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
                // Entering element → decelerate (the mirror of the exit curve).
                transition: { duration: 0.22, ease: "easeOut" },
              }}
              // Leaving element → accelerate away, quickly.
              exit={{ y: 14, opacity: 0, transition: { duration: 0.15, ease: [0.4, 0, 1, 1] } }}
              className={cn(
                // backdrop-blur-3xl (64px) over a playing video is very
                // expensive to composite — xl (24px) reads nearly identical.
                "flex items-center gap-0 rounded-t-[20px] overflow-hidden border-t border-x backdrop-blur-xl shadow-lg",
                isDark
                  ? "bg-white/[0.12] border-white/10"
                  : "bg-black/[0.12] border-black/10"
              )}
            >
              <button
                onClick={() => { trigger(20); onOpenToggle(true); }}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 min-h-[52px] transition-all hover:bg-white/10 font-jost text-[11px] font-bold tracking-[0.15em] uppercase select-none",
                  isDark ? "text-white/80" : "text-black/70"
                )}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} size={16} strokeWidth={2.5} />
                <span>style</span>
              </button>

              <div className={cn("w-[1px] h-5 self-center", isDark ? "bg-white/10" : "bg-black/10")} />

              <button
                disabled={!canExport}
                onClick={() => { trigger("nudge"); onExport(); }}
                title={canExport ? undefined : "write something first"}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 min-h-[52px] transition-all font-jost text-[11px] font-bold tracking-[0.15em] uppercase select-none text-[#F5F0E8]",
                  canExport
                    ? "hover:bg-[#F5F0E8]/10"
                    : "opacity-30 cursor-not-allowed"
                )}
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
              // Exit doctrine (Material / iOS sheets): leaving elements
              // ACCELERATE off-screen, they never decelerate to a stop inside
              // the viewport. An ease-out (or spring tail) means the last ~10%
              // of the close crawls — that lingering sliver is exactly what
              // reads as unpolished. The sheet exits with momentum instead.
              exit={{ y: "100%", transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              // Promote to its own composited layer — the sheet (with its many
              // decoded swatch images) then moves as one GPU texture instead
              // of being repainted every frame over the playing video.
              className="w-full bg-[#161412] border-t border-white/10 shadow-2xl rounded-t-[32px] overflow-hidden will-change-transform"
            >
              <div className="pt-6 pb-[max(env(safe-area-inset-bottom),20px)] text-[#F5F0E8] space-y-5">
                {/* Header / Dismiss */}
                <div className="flex items-center justify-between px-8">
                  <span className="font-jost text-[10px] uppercase tracking-[0.4em] opacity-40 font-bold">style</span>
                  <button 
                    onClick={() => { trigger(10); onOpenToggle(false); }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    aria-label="Close tools"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="opacity-60" />
                  </button>
                </div>

                {/* Signature Row: author + motif */}
                <div className="px-8 flex items-center gap-3">
                  <div className="relative group flex-1">
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
                  <button
                    onClick={() => { trigger(20); onDoodleToggle(); }}
                    className="flex-shrink-0 flex items-center gap-2 font-jost text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-3 px-5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 select-none"
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={13} strokeWidth={2.5} />
                    <span>motif</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <FontPicker currentFont={currentFont} onSelect={onFontSelect} />
                  
                  <div className="h-[1px] bg-white/5 mx-8" />
                  
                  <BackgroundPicker 
                    currentTone={currentTone}
                    currentPaper={currentPaper}
                    inkMode={inkMode}
                    dynamicPapers={dynamicPapers}
                    onToneSelect={onToneSelect}
                    onPaperSelect={onPaperSelect}
                    onInkModeChange={onInkModeChange}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
