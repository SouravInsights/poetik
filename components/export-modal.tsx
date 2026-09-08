"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Download01Icon, 
  ArrowLeft01Icon, 
  CheckmarkCircle02Icon, 
  Alert02Icon,
  Loading03Icon 
} from "@hugeicons/core-free-icons";
import { useExport } from "@/hooks/use-export";
import { JpegExportBuffer, VideoOverlayBuffer } from "@/components/export-buffers";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  font: Font;
  paper: Paper;
  tone: Tone;
  inkMode: "ink-light" | "ink-dark";
  doodle: string | null;
  author: string;
  align: "left" | "center";
  bgOpacity: number;
}

export function ExportModal({
  isOpen,
  onClose,
  text,
  font,
  paper,
  tone,
  inkMode,
  doodle,
  author,
  align,
  bgOpacity,
}: ExportModalProps) {
  const isDark = inkMode === "ink-light";

  const {
    exportRef,
    overlayRef,
    exportState,
    progress,
    durationSecs,
    setDurationSecs,
    isVideoBackground,
    isBusy,
    statusLabel,
    handleExport,
  } = useExport({ isOpen, paper });

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const sharedBufferProps = { text, font, inkMode, isDark, doodle, author, align };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 sm:p-10"
        >
          {/* Off-screen rendering buffers — invisible, used only for export */}
          {isVideoBackground
            ? <VideoOverlayBuffer overlayRef={overlayRef} {...sharedBufferProps} />
            : <JpegExportBuffer exportRef={exportRef} paper={paper} tone={tone} bgOpacity={bgOpacity} {...sharedBufferProps} />
          }

          {/* Modal Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isBusy && onClose()} 
            className="absolute inset-0 bg-[#0D0B09]/98 backdrop-blur-3xl" 
          />

          {/* Preview Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-[min(280px,65vw)] aspect-[9/16] rounded-[24px] overflow-hidden shadow-[0_32px_96px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10" 
          >
            <div
              className={cn(
                "w-full h-full relative flex flex-col items-center justify-center px-8 grain",
                paper.type === "image" ? "bg-cover bg-center" :
                paper.type === "video" ? "" : tone.class,
                inkMode
              )}
              style={{ backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined, opacity: bgOpacity }}
            >
              {paper.type === "video" && (
                <video src={paper.path} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
              )}
              <div className={cn("absolute inset-0", (paper.type === "image" || paper.type === "video") ? "opacity-20" : "opacity-0", isDark ? "bg-black" : "bg-white")} />
              <div
                className={cn("italic leading-[1.6] tracking-[0.03em] text-[18px] whitespace-pre-wrap w-full z-10", align === "center" ? "text-center" : "text-left", font.class)}
                style={{ fontFamily: `var(${font.variable})` }}
              >
                {text}
              </div>
              {(doodle || author) && (
                <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 z-10">
                  {doodle && (
                    <div className={cn("w-8 h-8 opacity-40", isDark ? "invert brightness-200" : "brightness-0")}>
                      <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {author && (
                    <span className="font-jost text-[6px] tracking-[0.3em] uppercase opacity-40">
                      {author.startsWith('@') ? author : `@${author}`}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Encoding Progress Overlay */}
            <AnimatePresence>
              {exportState === "encoding" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <div className="w-[60%] h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#f2ece0] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <p className="font-jost text-[9px] uppercase tracking-[0.3em] text-white/50 mt-4">
                    {progress}%
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Actions Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-6 mt-10 relative z-20 w-full px-6" 
          >
            <p className="font-jost text-[12px] uppercase tracking-[0.4em] opacity-40 text-[#f2ece0] font-bold">
              {statusLabel}
            </p>

            {/* Duration Slider — video only */}
            {isVideoBackground && exportState === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-3 w-full max-w-[280px]"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-jost text-[9px] uppercase tracking-[0.25em] opacity-40 text-[#f2ece0]">duration</span>
                  <span className="font-jost text-[9px] uppercase tracking-[0.25em] text-[#f2ece0] opacity-70 font-bold">{durationSecs}s</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={durationSecs}
                  onChange={(e) => setDurationSecs(Number(e.target.value))}
                  className="w-full h-[2px] bg-white/10 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between w-full">
                  {[5, 10, 15, 20, 25, 30].map(v => (
                    <span key={v} className={cn(
                      "font-jost text-[9px] transition-all",
                      durationSecs === v ? "text-[#f2ece0] opacity-100" : "text-[#f2ece0] opacity-20"
                    )}>{v}s</span>
                  ))}
                </div>
              </motion.div>
            )}

            <button 
              disabled={isBusy} 
              onClick={handleExport} 
              className={cn( 
                "group relative flex items-center justify-center gap-3 px-10 py-5 font-italiana text-lg tracking-[0.1em] rounded-full transition-all shadow-2xl w-full max-w-[320px] overflow-hidden", 
                // Monochrome status (palette rule: no greens/reds). Success and
                // error are carried by icon + label, not hue — same doctrine as
                // the clear button.
                exportState === "error"
                  ? "bg-transparent border border-[#f2ece0]/40 text-[#f2ece0]"
                  : "bg-[#f2ece0] text-black hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
              )} 
            >
              <AnimatePresence mode="wait">
                {isBusy ? (
                  <motion.div key="busy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin" />
                    <span>{exportState === "encoding" ? `exporting... ${progress}%` : "saving..."}</span>
                  </motion.div>
                ) : exportState === "done" ? (
                  <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                    <span>saved to device</span>
                  </motion.div>
                ) : exportState === "error" ? (
                  // Previously error fell through to the idle label ("save as…")
                  // on a red background — state said one thing, words another.
                  <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Alert02Icon} size={20} />
                    <span>export failed — try again</span>
                  </motion.div>
                ) : (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Download01Icon} size={20} className="transition-transform group-hover:translate-y-0.5" />
                    <span>{isVideoBackground ? `save as ${durationSecs}s video` : "save to phone"}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button 
              disabled={isBusy} 
              onClick={onClose} 
              className="flex items-center gap-2 font-jost text-[11px] uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all py-2 disabled:opacity-0"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              <span>back to editor</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
