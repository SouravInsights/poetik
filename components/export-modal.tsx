"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { toJpeg } from "html-to-image";
import { motion, AnimatePresence } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Download01Icon, 
  ArrowLeft01Icon, 
  CheckmarkCircle02Icon, 
  Loading03Icon 
} from "@hugeicons/core-free-icons";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  font: Font;
  paper: Paper;
  tone: Tone;
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
  doodle,
  author,
  align,
  bgOpacity,
}: ExportModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { trigger } = useWebHaptics();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleDownload = async () => {
    if (exportRef.current === null || isSaving) return;
    setIsSaving(true);
    trigger("medium");
    try {
      await new Promise(r => setTimeout(r, 600));
      const dataUrl = await toJpeg(exportRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1920,
        quality: 0.98,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        }
      });
      const link = document.createElement("a");
      link.download = `poetik-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      trigger("success");
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isDark = tone.ink === "ink-light";

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
          {/* Hidden High-Res Export Buffer */}
          <div className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: 1080, height: 1920 }}>
            <div 
              ref={exportRef}
              className={cn(
                "w-full h-full relative flex flex-col items-center justify-center px-[120px] grain",
                paper.type === "image" ? "bg-cover bg-center" : tone.class,
                tone.ink
              )}
              style={{ 
                backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
                opacity: bgOpacity 
              }}
            >
              <div className={cn("absolute inset-0 transition-opacity", paper.type === "image" ? "opacity-20" : "opacity-0", isDark ? "bg-black" : "bg-white")} />
              <div 
                className={cn("italic leading-[1.6] tracking-[0.03em] whitespace-pre-wrap break-words w-full", align === "center" ? "text-center" : "text-left", font.class)}
                style={{ fontFamily: `var(${font.variable})`, fontSize: "80px" }}
              >
                {text}
              </div>
              {(doodle || author) && (
                <div className="mt-[120px] flex flex-col items-center gap-8">
                  {doodle && (
                    <div className={cn("w-24 h-24 opacity-40 transition-all", isDark ? "invert brightness-200" : "brightness-0")}>
                      <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {author && (
                    <span className="font-jost text-[24px] tracking-[0.4em] uppercase opacity-40">
                      {author.startsWith('@') ? author : `@${author}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Modal Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSaving && onClose()} 
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
            <div className={cn("w-full h-full relative flex flex-col items-center justify-center px-8 grain", paper.type === "image" ? "bg-cover bg-center" : tone.class, tone.ink )} style={{ backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined, opacity: bgOpacity }} >
              <div className={cn("absolute inset-0", paper.type === "image" ? "opacity-20" : "opacity-0", isDark ? "bg-black" : "bg-white")} />
              <div className={cn("italic leading-[1.6] tracking-[0.03em] text-[18px] whitespace-pre-wrap w-full z-10", align === "center" ? "text-center" : "text-left", font.class)} style={{ fontFamily: `var(${font.variable})` }} >
                {text}
              </div>
              {(doodle || author) && (
                <div className="mt-8 flex flex-col items-center gap-3 z-10">
                  {doodle && (
                    <div className={cn("w-8 h-8 opacity-40 transition-all", isDark ? "invert brightness-200" : "brightness-0")}>
                      <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
                    </div>
                  )}
                  {author && (
                    <span className="font-jost text-[6px] tracking-[0.3em] uppercase opacity-40">{author.startsWith('@') ? author : `@${author}`}</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center gap-8 mt-12 relative z-20 w-full px-6" 
          >
            <div className="space-y-1 text-center">
              <p className="font-jost text-[12px] uppercase tracking-[0.4em] opacity-40 text-[#f2ece0] font-bold">
                {isSaving ? "capturing essence" : isSaved ? "saved successfully" : "ready to share"}
              </p>
            </div>
            
            <button 
              disabled={isSaving} 
              onClick={handleDownload} 
              className={cn( 
                "group relative flex items-center justify-center gap-3 px-10 py-5 font-italiana text-lg tracking-[0.1em] rounded-full transition-all shadow-2xl w-full max-w-[320px] overflow-hidden", 
                isSaved 
                  ? "bg-green-500 text-white" 
                  : "bg-[#f2ece0] text-black hover:scale-105 active:scale-95" 
              )} 
            >
              <AnimatePresence mode="wait">
                {isSaving ? (
                  <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Loading03Icon} size={20} className="animate-spin" />
                    <span>generating...</span>
                  </motion.div>
                ) : isSaved ? (
                  <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                    <span>save successful</span>
                  </motion.div>
                ) : (
                  <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <HugeiconsIcon icon={Download01Icon} size={20} className="transition-transform group-hover:translate-y-0.5" />
                    <span>save to phone</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button 
              disabled={isSaving} 
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
