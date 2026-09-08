"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Font, Paper, Tone } from "@/lib/constants"
import { motion, AnimatePresence } from "motion/react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Download01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Alert02Icon,
  Cancel01Icon,
  Share01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import { useExport } from "@/hooks/use-export"
import {
  JpegExportBuffer,
  VideoOverlayBuffer,
} from "@/components/export-buffers"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  text: string
  font: Font
  paper: Paper
  tone: Tone
  inkMode: "ink-light" | "ink-dark"
  doodle: string | null
  author: string
  align: "left" | "center"
  bgOpacity: number
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
  const isDark = inkMode === "ink-light"

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
    cancelExport,
    shareFile,
    handleShare,
  } = useExport({ isOpen, paper })

  // Two live decoders + a 1080x1920 recording canvas is a thermal/jank storm
  // on phones — freeze the modal's preview video while the exporter records
  // its own copy of the same source.
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = previewVideoRef.current
    if (!v) return
    if (isBusy) v.pause()
    else v.play().catch(() => {})
  }, [isBusy])

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const sharedBufferProps = {
    text,
    font,
    inkMode,
    isDark,
    doodle,
    author,
    align,
  }

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
          {isVideoBackground ? (
            <VideoOverlayBuffer
              overlayRef={overlayRef}
              {...sharedBufferProps}
            />
          ) : (
            <JpegExportBuffer
              exportRef={exportRef}
              paper={paper}
              tone={tone}
              bgOpacity={bgOpacity}
              {...sharedBufferProps}
            />
          )}

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
            className="relative aspect-[9/16] w-[min(280px,65vw)] overflow-hidden rounded-[24px] shadow-[0_32px_96px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          >
            <div
              className={cn(
                "grain relative flex h-full w-full flex-col items-center justify-center px-8",
                paper.type === "image"
                  ? "bg-cover bg-center"
                  : paper.type === "video"
                    ? ""
                    : tone.class,
                inkMode
              )}
              style={{
                backgroundImage:
                  paper.type === "image" ? `url(${paper.path})` : undefined,
                opacity: bgOpacity,
              }}
            >
              {paper.type === "video" && (
                <video
                  ref={previewVideoRef}
                  src={paper.path}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div
                className={cn(
                  "absolute inset-0",
                  paper.type === "image" || paper.type === "video"
                    ? "opacity-20"
                    : "opacity-0",
                  isDark ? "bg-black" : "bg-white"
                )}
              />
              <div
                className={cn(
                  "z-10 w-full text-[18px] leading-[1.6] tracking-[0.03em] whitespace-pre-wrap italic",
                  align === "center" ? "text-center" : "text-left",
                  font.class
                )}
                style={{ fontFamily: `var(${font.variable})` }}
              >
                {text}
              </div>
              {(doodle || author) && (
                <div className="absolute right-0 bottom-6 left-0 z-10 flex flex-col items-center gap-2">
                  {doodle && (
                    <div
                      className={cn(
                        "h-8 w-8 opacity-40",
                        isDark ? "brightness-200 invert" : "brightness-0"
                      )}
                    >
                      <img
                        src={`/doodles/${doodle}`}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  {author && (
                    <span className="font-jost text-[6px] tracking-[0.3em] uppercase opacity-40">
                      {author.startsWith("@") ? author : `@${author}`}
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
                  <div className="h-[2px] w-[60%] overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[#f2ece0]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                  <p className="mt-4 font-jost text-[9px] tracking-[0.3em] text-white/50 uppercase">
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
            className="relative z-20 mt-10 flex w-full flex-col items-center gap-6 px-6"
          >
            <p className="font-jost text-[12px] font-bold tracking-[0.4em] text-[#f2ece0] uppercase opacity-40">
              {statusLabel}
            </p>

            {/* Duration Slider — video only */}
            {isVideoBackground && exportState === "idle" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full max-w-[280px] flex-col items-center gap-3"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-jost text-[9px] tracking-[0.25em] text-[#f2ece0] uppercase opacity-40">
                    duration
                  </span>
                  <span className="font-jost text-[9px] font-bold tracking-[0.25em] text-[#f2ece0] uppercase opacity-70">
                    {durationSecs}s
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={durationSecs}
                  onChange={(e) => setDurationSecs(Number(e.target.value))}
                  className="h-[2px] w-full cursor-pointer appearance-none rounded-full bg-white/10"
                />
                <div className="flex w-full justify-between">
                  {[5, 10, 15, 20, 25, 30].map((v) => (
                    <span
                      key={v}
                      className={cn(
                        "font-jost text-[9px] transition-all",
                        durationSecs === v
                          ? "text-[#f2ece0] opacity-100"
                          : "text-[#f2ece0] opacity-20"
                      )}
                    >
                      {v}s
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            <button
              disabled={isBusy}
              // When a finished file is armed for sharing, this tap carries the
              // fresh user gesture the Web Share API demands — that's why the
              // sheet opens here and not auto-magically after the encode.
              onClick={
                exportState === "done" && shareFile ? handleShare : handleExport
              }
              className={cn(
                "group relative flex w-full max-w-[320px] items-center justify-center gap-3 overflow-hidden rounded-full px-10 py-5 font-italiana text-lg tracking-[0.1em] shadow-2xl transition-all",
                // Monochrome status (palette rule: no greens/reds). Success and
                // error are carried by icon + label, not hue — same doctrine as
                // the clear button.
                exportState === "error"
                  ? "border border-[#f2ece0]/40 bg-transparent text-[#f2ece0]"
                  : "bg-[#f2ece0] text-black hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              <AnimatePresence mode="wait">
                {isBusy ? (
                  <motion.div
                    key="busy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      size={20}
                      className="animate-spin"
                    />
                    <span>
                      {exportState === "encoding"
                        ? `exporting... ${progress}%`
                        : "saving..."}
                    </span>
                  </motion.div>
                ) : exportState === "done" && shareFile ? (
                  // Share-capable mobile: the CTA IS the native sheet
                  // (Instagram, WhatsApp, Save Video — one tap away)
                  <motion.div
                    key="share"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Share01Icon}
                      size={20}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                    <span>share</span>
                  </motion.div>
                ) : exportState === "done" ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                    <span>saved to device</span>
                  </motion.div>
                ) : exportState === "error" ? (
                  // Previously error fell through to the idle label ("save as…")
                  // on a red background — state said one thing, words another.
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon icon={Alert02Icon} size={20} />
                    <span>export failed — try again</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={20}
                      className="transition-transform group-hover:translate-y-0.5"
                    />
                    <span>
                      {isVideoBackground
                        ? `save as ${durationSecs}s video`
                        : "save to phone"}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* A 30s encode with no way out is a hostage situation — offer an
                explicit cancel instead of just disabling the exit */}
            {exportState === "encoding" ? (
              <button
                onClick={cancelExport}
                className="flex items-center gap-2 py-2 font-jost text-[11px] tracking-[0.3em] uppercase opacity-60 transition-all hover:opacity-100"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
                <span>cancel export</span>
              </button>
            ) : (
              <button
                disabled={isBusy}
                onClick={onClose}
                className="flex items-center gap-2 py-2 font-jost text-[11px] tracking-[0.3em] uppercase opacity-40 transition-all hover:opacity-100 disabled:opacity-0"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                <span>back to editor</span>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
