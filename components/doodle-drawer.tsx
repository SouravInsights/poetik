"use client";

import { DOODLES, Tone } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface DoodleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoodle: string | null;
  onSelect: (doodle: string | null) => void;
  tone: Tone;
}

export function DoodleDrawer({
  isOpen,
  onClose,
  currentDoodle,
  onSelect,
  tone,
}: DoodleDrawerProps) {
  const isDark = tone.ink === "ink-light";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[200] bg-[#0c0a08]/95 backdrop-blur-2xl border-t border-white/5 p-6 pb-[max(env(safe-area-inset-bottom),24px)]"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-jost text-[10px] font-light tracking-[0.18em] lowercase text-[#f2ece0]/35 uppercase">
                doodles
              </span>
              <button
                onClick={onClose}
                className="font-jost text-[11px] font-light tracking-[0.1em] lowercase text-[#f2ece0]/35 hover:text-[#f2ece0]/70 transition-colors"
              >
                close
              </button>
            </div>

            <div className="grid grid-cols-6 gap-3 max-h-[40dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => {
                  onSelect(null);
                  onClose();
                }}
                className={cn(
                  "aspect-square rounded-md border flex items-center justify-center transition-all duration-200",
                  currentDoodle === null
                    ? "border-accent bg-accent/15"
                    : "border-white/5 hover:bg-white/5"
                )}
              >
                <span className="font-jost text-[10px] opacity-40">none</span>
              </button>
              {DOODLES.map((doodle) => (
                <button
                  key={doodle}
                  onClick={() => {
                    onSelect(doodle);
                    onClose();
                  }}
                  className={cn(
                    "aspect-square rounded-md border p-1.5 transition-all duration-200 flex items-center justify-center",
                    currentDoodle === doodle
                      ? "border-accent bg-accent/15"
                      : "border-white/5 hover:bg-white/5 opacity-45 hover:opacity-85"
                  )}
                >
                  <img
                    src={`/doodles/${doodle}`}
                    alt=""
                    className="w-full h-full object-contain invert brightness-200"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
