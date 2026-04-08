"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "motion/react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  font: Font;
  paper: Paper;
  tone: Tone;
  doodle: string | null;
  align: "left" | "center";
}

export function ExportModal({
  isOpen,
  onClose,
  text,
  font,
  paper,
  tone,
  doodle,
  align,
}: ExportModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (exportRef.current === null) return;
    
    try {
      const dataUrl = await toPng(exportRef.current, {
        cacheBust: true,
        width: 1080,
        height: 1920,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
        }
      });
      const link = document.createElement("a");
      link.download = `poetik-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Oops, something went wrong!", err);
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
          className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 gap-10"
        >
          {/* Main Export Frame (Hidden from view but used for generation) */}
          <div className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: 1080, height: 1920 }}>
            <div 
              ref={exportRef}
              className={cn(
                "w-full h-full relative flex items-center justify-center p-20 grain",
                paper.type === "image" ? "bg-cover bg-center" : tone.class,
                tone.ink
              )}
              style={{
                backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
              }}
            >
               {doodle && (
                <div 
                  className={cn(
                    "absolute bottom-[160px] right-[100px] w-28 h-28 opacity-25 transition-opacity",
                    isDark ? "invert brightness-200" : "brightness-50"
                  )}
                >
                  <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div 
                className={cn(
                  "italic leading-[2] tracking-[0.02em] whitespace-pre-wrap break-words",
                  align === "center" ? "text-center" : "text-left",
                  font.class
                )}
                style={{ 
                  fontFamily: `var(${font.variable})`,
                  fontSize: "64px",
                  maxWidth: "900px"
                }}
              >
                {text}
              </div>
            </div>
          </div>

          {/* Preview Container (Visible) */}
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-[min(240px,50vw)] aspect-[9/16] rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10"
          >
            <div 
              className={cn(
                "w-full h-full relative flex items-center px-6 grain",
                align === "center" ? "justify-center" : "justify-start",
                paper.type === "image" ? "bg-cover bg-center" : tone.class,
                tone.ink
              )}
              style={{
                backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
              }}
            >
              <div 
                className={cn(
                  "italic leading-[2] tracking-[0.02em] text-[15px] whitespace-pre-wrap",
                  align === "center" ? "text-center" : "text-left",
                  font.class
                )}
                style={{ fontFamily: `var(${font.variable})` }}
              >
                {text}
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col items-center gap-6 w-full max-w-[220px]">
            <button
              onClick={handleDownload}
              className="font-italiana text-lg tracking-wider text-[#f2ece0]/80 hover:text-[#f2ece0] transition-colors relative pb-1 group"
            >
              save to photos
              <div className="absolute bottom-0 left-0 right-0 h-[0.5px] bg-accent opacity-70 scale-x-100 group-hover:scale-x-110 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="font-jost text-[11px] font-light tracking-[0.12em] lowercase text-[#f2ece0]/25 hover:text-[#f2ece0]/55 transition-colors"
            >
              dismiss
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
