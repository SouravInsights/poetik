"use client";

/**
 * SizePicker — the user's text-size preference.
 *
 * Compact by design: a row of "A" glyphs that grow, readable without a word
 * of copy. The active stop is a soft inset pill; the centre stop is "auto"
 * and carries a quiet dot. Inset + side padding keep the pill from being
 * shaved flat by the row's scroll clip.
 */

import { TEXT_SCALES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";

/** Visual weight of each "A" — grows with the stop so size is self-evident. */
const GLYPH_SIZES = [9, 11, 13, 15, 18];

interface SizePickerProps {
  currentScale: number;
  onSelect: (scale: number) => void;
}

export function SizePicker({ currentScale, onSelect }: SizePickerProps) {
  const { trigger } = useWebHaptics();

  return (
    <div className="flex items-center">
      {/* Fixed label — stays put while the stops scroll on tiny screens */}
      <span className="flex-shrink-0 pl-8 pr-4 font-jost text-[9px] font-bold tracking-[0.2em] uppercase opacity-40">
        size
      </span>
      <div className="flex items-center gap-0.5 overflow-x-auto px-1 py-0.5 pr-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {TEXT_SCALES.map((scale, i) => {
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
                  ? "auto text size"
                  : `text size ${Math.round(scale * 100)} percent`
              }
              aria-pressed={active}
              className={cn(
                "relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                !active && "hover:bg-white/5"
              )}
            >
              {active && (
                <motion.span
                  layoutId="size-selection"
                  className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/20 ring-inset"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span
                className={cn(
                  "relative font-jost font-bold leading-none transition-all duration-300",
                  active ? "opacity-100" : "opacity-35"
                )}
                style={{ fontSize: GLYPH_SIZES[i] }}
              >
                A
              </span>
              {/* Quiet marker on the middle stop: this is "auto" */}
              {scale === 1 && (
                <span
                  className={cn(
                    "absolute bottom-[3px] h-[3px] w-[3px] rounded-full bg-white transition-opacity",
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
