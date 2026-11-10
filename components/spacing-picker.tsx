"use client";

/**
 * SpacingPicker — the user's line-spacing preference.
 *
 * Sits beside the size control and multiplies the optical leading. Five stops
 * drawn as three ruled lines opening up, so tighter/airier reads at a glance.
 * The centre stop is "auto", marked with the same quiet dot as the size row.
 */

import { LINE_SCALES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";

/** Vertical gap (px) between the three rule marks for each stop. */
const GAPS = [1, 2, 3.5, 5, 6.5];

interface SpacingPickerProps {
  currentScale: number;
  onSelect: (scale: number) => void;
}

export function SpacingPicker({ currentScale, onSelect }: SpacingPickerProps) {
  const { trigger } = useWebHaptics();

  return (
    <div className="flex items-center">
      <span className="flex-shrink-0 pl-8 pr-4 font-jost text-[9px] font-bold tracking-[0.2em] uppercase opacity-40">
        spacing
      </span>
      <div className="flex items-center gap-1 overflow-x-auto pr-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {LINE_SCALES.map((scale, i) => {
          const active = currentScale === scale;
          return (
            <button
              key={scale}
              type="button"
              onClick={() => {
                if (active) return;
                trigger(15);
                onSelect(scale);
              }}
              aria-label={
                scale === 1
                  ? "auto line spacing"
                  : `${Math.round(scale * 100)} percent line spacing`
              }
              aria-pressed={active}
              className={cn(
                "relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                !active && "hover:bg-white/5"
              )}
            >
              {active && (
                <motion.span
                  layoutId="spacing-selection"
                  className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className="relative flex flex-col items-center"
                style={{ gap: GAPS[i] }}
              >
                {[0, 1, 2].map((k) => (
                  <span
                    key={k}
                    className={cn(
                      "h-[1.5px] w-[18px] rounded-full bg-white transition-opacity duration-300",
                      active ? "opacity-90" : "opacity-35"
                    )}
                  />
                ))}
              </span>
              {/* Quiet marker on the middle stop: this is "auto" */}
              {scale === 1 && (
                <span
                  className={cn(
                    "absolute bottom-[5px] h-1 w-1 rounded-full bg-white transition-opacity",
                    active ? "opacity-70" : "opacity-30"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
