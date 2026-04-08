"use client";

import { Tone, DARK_DOODLE_COLORS, LIGHT_DOODLE_COLORS } from "@/lib/constants";
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
  currentDoodleColor: string;
  onColorSelect: (color: string) => void;
  tone: Tone;
  dynamicDoodles: string[];
}

export function DoodleDrawer({
  isOpen,
  onClose,
  currentDoodle,
  onSelect,
  currentDoodleColor,
  onColorSelect,
  tone,
  dynamicDoodles,
}: DoodleDrawerProps) {
  const { trigger } = useWebHaptics();
  const palette = tone.ink === "ink-light" ? DARK_DOODLE_COLORS : LIGHT_DOODLE_COLORS;

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
            {/* Color Palette */}
            <div className="flex flex-col gap-4 mb-8">
              <span className="font-jost text-[10px] font-medium tracking-[0.3em] lowercase text-[#f2ece0]/30 uppercase px-2">
                fill color
              </span>
              <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2 py-1">
                {palette.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => {
                      trigger("medium");
                      onColorSelect(color);
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border-2 transition-all duration-300",
                      currentDoodleColor === color
                        ? "border-white scale-125 shadow-lg shadow-white/10"
                        : "border-white/10 hover:border-white/30"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 px-2">
              <span className="font-jost text-[10px] font-medium tracking-[0.3em] lowercase text-[#f2ece0]/30 uppercase">
                doodle graphics
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

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3 max-h-[40dvh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 px-2">
              <button
                onClick={() => {
                  trigger("selection");
                  onSelect(null);
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
                  }}
                  className={cn(
                    "aspect-square rounded-xl border p-2 transition-all duration-300 flex items-center justify-center group",
                    currentDoodle === doodle
                      ? "border-accent bg-accent/20"
                      : "border-white/5 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100"
                  )}
                >
                  <div 
                    className="w-full h-full transition-all duration-500 group-hover:scale-110"
                    style={{
                      WebkitMaskImage: `url(/doodles/${doodle})`,
                      maskImage: `url(/doodles/${doodle})`,
                      WebkitMaskSize: 'contain',
                      maskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      maskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskPosition: 'center',
                      backgroundColor: currentDoodleColor
                    }}
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
