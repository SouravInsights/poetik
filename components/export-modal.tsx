"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  font: Font;
  paper: Paper;
  tone: Tone;
  doodle: string | null;
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
  align,
  bgOpacity,
}: ExportModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { trigger } = useWebHaptics();

  const handleDownload = async () => {
    if (exportRef.current === null) return;
    trigger("success");
    
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
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center p-6 sm:p-10">
          {/* Main Export Frame (Hidden from view but used for generation) */}
          <div className="absolute opacity-0 pointer-events-none overflow-hidden" style={{ width: 1080, height: 1920 }}>
            <div 
              ref={exportRef}
              className={cn(
                "w-full h-full relative flex items-center px-[120px] grain",
                align === "center" ? "justify-center" : "justify-start",
                paper.type === "image" ? "bg-cover bg-center" : tone.class,
                tone.ink
              )}
              style={{ 
                backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
                opacity: bgOpacity,
              }}
            >
              <div 
                className={cn(
                  "absolute inset-0 transition-opacity",
                  paper.type === "image" ? "opacity-20" : "opacity-0",
                  isDark ? "bg-black" : "bg-white"
                )} 
              />
              {doodle && (
                <div 
                  className={cn(
                    "absolute bottom-[240px] right-[100px] w-40 h-40 opacity-30",
                    isDark ? "invert brightness-200" : "brightness-50"
                  )}
                >
                  <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <div 
                className={cn(
                  "italic leading-[1.8] tracking-[0.03em] whitespace-pre-wrap break-words",
                  align === "center" ? "text-center" : "text-left",
                  font.class
                )}
                style={{ 
                  fontFamily: `var(${font.variable})`,
                  fontSize: "80px",
                  maxWidth: "900px"
                }}
              >
                {text}
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              trigger("selection");
              onClose();
            }}
            className="absolute inset-0 bg-[#0D0B09]/95 backdrop-blur-3xl"
          />

          {/* Preview Container (Visible) */}
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-[min(280px,65vw)] aspect-[9/16] rounded-[24px] overflow-hidden shadow-[0_32px_96px_-16px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
          >
            <div 
              className={cn(
                "w-full h-full relative flex items-center px-8 grain",
                align === "center" ? "justify-center" : "justify-start",
                paper.type === "image" ? "bg-cover bg-center" : tone.class,
                tone.ink
              )}
              style={{
                backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
                opacity: bgOpacity,
              }}
            >
              <div 
                className={cn(
                  "absolute inset-0",
                  paper.type === "image" ? "opacity-20" : "opacity-0",
                  isDark ? "bg-black" : "bg-white"
                )} 
              />
              <div 
                className={cn(
                  "italic leading-[1.8] tracking-[0.03em] text-[18px] whitespace-pre-wrap z-10",
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
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-8 mt-12 relative z-20"
          >
            <p className="font-jost text-[12px] uppercase tracking-[0.4em] opacity-40 text-[#f2ece0] font-light">
              story ready
            </p>
            
            <button
              onClick={handleDownload}
              className="group flex items-center gap-3 px-10 py-5 bg-[#f2ece0] text-black font-italiana text-lg tracking-[0.1em] rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl"
            >
              <HugeiconsIcon icon={Download01Icon} size={20} className="transition-transform group-hover:translate-y-0.5" />
              <span>save to phone</span>
            </button>

            <button
              onClick={() => {
                trigger("selection");
                onClose();
              }}
              className="flex items-center gap-2 font-jost text-[12px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 transition-all py-2"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
              <span>back to edit</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
