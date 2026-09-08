"use client"

import { Font, Tone, Paper } from "@/lib/constants"
import { FontPicker } from "./font-picker"
import { BackgroundPicker } from "./background-picker"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PencilEdit01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { useWebHaptics } from "web-haptics/react"
import { motion, AnimatePresence } from "motion/react"

interface BottomToolbarProps {
  isOpen: boolean
  onOpenToggle: (open: boolean) => void
  currentFont: Font
  currentTone: Tone
  currentPaper: Paper
  inkMode: "ink-light" | "ink-dark"
  dynamicPapers: Paper[]
  author: string
  onAuthorChange: (val: string) => void
  onFontSelect: (font: Font) => void
  onToneSelect: (tone: Tone) => void
  onPaperSelect: (paper: Paper) => void
  onInkModeChange: (mode: "ink-light" | "ink-dark") => void
  onExport: () => void
  onDoodleToggle: () => void
  uiVisible: boolean
  /** False when the canvas is empty — exporting blank poetry is meaningless. */
  canExport: boolean
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
  const { trigger } = useWebHaptics()
  const isDark = inkMode === "ink-light"

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
            onClick={() => {
              trigger(10)
              onOpenToggle(false)
            }}
            className="fixed inset-0 z-[90] bg-black/10 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div
        className={cn(
          // The wrapper needs its own transition — without it the dissolve
          // while writing snaps instead of gliding (TopBar already had one).
          "fixed right-0 bottom-0 left-0 z-[100] flex flex-col items-center transition-all duration-500 ease-in-out",
          !uiVisible &&
            !isOpen &&
            "pointer-events-none translate-y-full opacity-0"
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
              exit={{
                y: 14,
                opacity: 0,
                transition: { duration: 0.15, ease: [0.4, 0, 1, 1] },
              }}
              // Swipe UP on the pill opens the sheet — the native bottom-sheet
              // gesture mobile users reach for. Elastic upward give sells that
              // it's grabbable; horizontal is locked so taps/scrolls never fight.
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.35, bottom: 0 }}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.y < -32 || info.velocity.y < -400) {
                  trigger(20)
                  onOpenToggle(true)
                }
              }}
              className={cn(
                // backdrop-blur-3xl (64px) over a playing video is very
                // expensive to composite — xl (24px) reads nearly identical.
                "flex items-center gap-0 overflow-hidden rounded-t-[20px] border-x border-t shadow-lg backdrop-blur-xl",
                isDark
                  ? "border-white/10 bg-white/[0.12]"
                  : "border-black/10 bg-black/[0.12]"
              )}
            >
              <button
                onClick={() => {
                  trigger(20)
                  onOpenToggle(true)
                }}
                className={cn(
                  "flex min-h-[52px] items-center gap-2 px-6 py-4 font-jost text-[11px] font-bold tracking-[0.15em] uppercase transition-all select-none hover:bg-white/10",
                  isDark ? "text-white/80" : "text-black/70"
                )}
              >
                <HugeiconsIcon
                  icon={ArrowUp01Icon}
                  size={16}
                  strokeWidth={2.5}
                />
                <span>style</span>
              </button>

              <div
                className={cn(
                  "h-5 w-[1px] self-center",
                  isDark ? "bg-white/10" : "bg-black/10"
                )}
              />

              <button
                disabled={!canExport}
                onClick={() => {
                  trigger("nudge")
                  onExport()
                }}
                title={canExport ? undefined : "write something first"}
                className={cn(
                  "flex min-h-[52px] items-center gap-2 px-6 py-4 font-jost text-[11px] font-bold tracking-[0.15em] text-[#F5F0E8] uppercase transition-all select-none",
                  canExport
                    ? "hover:bg-[#F5F0E8]/10"
                    : "cursor-not-allowed opacity-30"
                )}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  strokeWidth={2.5}
                />
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
              exit={{
                y: "100%",
                transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
              }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              // The headline mobile gesture: swipe the sheet DOWN to dismiss.
              // Anchored at the top — no upward stretch. A quick flick
              // (velocity) or a decent pull (offset) commits the dismiss;
              // anything less springs back. dragDirectionLock keeps the
              // horizontal swatch rows scrolling instead of moving the sheet.
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 550) {
                  trigger(15)
                  onOpenToggle(false)
                }
              }}
              // Promote to its own composited layer — the sheet (with its many
              // decoded swatch images) then moves as one GPU texture instead
              // of being repainted every frame over the playing video.
              className="w-full overflow-hidden rounded-t-[32px] border-t border-white/10 bg-[#161412] shadow-2xl will-change-transform"
            >
              <div className="space-y-5 pt-2 pb-[max(env(safe-area-inset-bottom),20px)] text-[#F5F0E8]">
                {/* Grabber — the affordance that says "drag me" without words */}
                <div className="flex justify-center pb-1">
                  <div className="h-1 w-10 rounded-full bg-white/20" />
                </div>
                {/* Header / Dismiss */}
                <div className="flex items-center justify-between px-8">
                  <span className="font-jost text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">
                    style
                  </span>
                  <button
                    onClick={() => {
                      trigger(10)
                      onOpenToggle(false)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10"
                    aria-label="Close tools"
                  >
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={14}
                      className="opacity-60"
                    />
                  </button>
                </div>

                {/* Signature Row: author + motif */}
                <div className="flex items-center gap-3 px-8">
                  <div className="group relative flex-1">
                    <div className="pointer-events-none absolute top-1/2 left-0 flex -translate-y-1/2 items-center gap-2 opacity-40 transition-all group-focus-within:text-accent group-focus-within:opacity-100">
                      <HugeiconsIcon
                        icon={UserIcon}
                        size={15}
                        strokeWidth={2.5}
                      />
                      <span className="font-jost text-[10px] font-bold tracking-[0.2em] uppercase">
                        @
                      </span>
                    </div>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => onAuthorChange(e.target.value)}
                      placeholder="USERNAME"
                      className="w-full border-b-2 border-white/5 bg-transparent py-3 pl-12 font-jost text-[12px] font-medium tracking-[0.3em] uppercase transition-all outline-none placeholder:opacity-20 focus:border-accent/60"
                    />
                  </div>
                  <button
                    onClick={() => {
                      trigger(20)
                      onDoodleToggle()
                    }}
                    className="flex flex-shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-jost text-[10px] font-bold tracking-[0.2em] uppercase transition-all select-none hover:border-white/20 hover:bg-white/10"
                  >
                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      size={13}
                      strokeWidth={2.5}
                    />
                    <span>motif</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <FontPicker
                    currentFont={currentFont}
                    onSelect={onFontSelect}
                  />

                  <div className="mx-8 h-[1px] bg-white/5" />

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
  )
}
