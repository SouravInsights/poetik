"use client";

import { Tone } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useWebHaptics } from "web-haptics/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

interface DoodleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDoodle: string | null;
  onSelect: (doodle: string | null) => void;
  tone: Tone;
  dynamicDoodles: string[];
}

export function DoodleDrawer({
  isOpen,
  onClose,
  currentDoodle,
  onSelect,
  tone,
  dynamicDoodles,
}: DoodleDrawerProps) {
  const { trigger } = useWebHaptics();
  const isDark = tone.ink === "ink-light";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              trigger("selection");
              onClose();
            }}
            className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[200] bg-[#0D0B09]/98 backdrop-blur-3xl border-t border-white/10 p-6 pb-[max(env(safe-area-inset-bottom),20px)] rounded-t-[24px]"
          >
            <div className="flex items-center justify-between mb-6 px-2">
              <span className="font-jost text-[10px] font-medium tracking-[0.3em] lowercase text-[#f2ece0]/30 uppercase">
                graphics & doodles
              </span>
              <button
                onClick={() => {
                  trigger("selection");
                  onClose();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-[#f2ece0]/40 hover:text-[#f2ece0] transition-all"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3 max-h-[45dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 px-2">
              <button
                onClick={() => {
                  trigger("selection");
                  onSelect(null);
                  onClose();
                }}
                className={cn(
                  "aspect-square rounded-xl border flex items-center justify-center transition-all duration-300",
                  currentDoodle === null
                    ? "border-accent bg-accent/20 text-accent"
                    : "border-white/5 bg-white/5 hover:bg-white/10 text-white/20"
                )}
              >
                <span className="font-jost text-[8px] uppercase tracking-tighter">none</span>
              </button>
              {dynamicDoodles.map((doodle) => (
                <button
                  key={doodle}
                  onClick={() => {
                    trigger("light");
                    onSelect(doodle);
                    onClose();
                  }}
                  className={cn(
                    "aspect-square rounded-xl border p-2 transition-all duration-300 flex items-center justify-center group",
                    currentDoodle === doodle
                      ? "border-accent bg-accent/20"
                      : "border-white/5 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100"
                  )}
                >
                  <img 
                    src={`/doodles/${doodle}`}
                    alt=""
                    className="w-full h-full object-contain invert brightness-200 opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
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
