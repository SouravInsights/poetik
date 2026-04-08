"use client";

import { FONTS, Font } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useWebHaptics } from "web-haptics/react";

interface FontPickerProps {
  currentFont: Font;
  onSelect: (font: Font) => void;
}

export function FontPicker({ currentFont, onSelect }: FontPickerProps) {
  const { trigger } = useWebHaptics();

  return (
    <div className="flex items-center">
      {/* Fixed label — stays put while items scroll */}
      <span className="flex-shrink-0 font-jost text-[9px] font-bold tracking-[0.2em] opacity-40 uppercase pl-8 pr-4">
        fonts
      </span>
      {/* Scrollable items only */}
      <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-8 pb-2">
        {FONTS.map((font) => (
          <button
            key={font.name}
            onClick={() => {
              trigger(15);
              onSelect(font);
            }}
            className={cn(
              "flex-shrink-0 bg-none border-none cursor-pointer text-[20px] italic text-inherit px-5 py-2 tracking-[0.01em] transition-all duration-300 relative",
              currentFont.name === font.name ? "opacity-100 scale-105" : "opacity-30 hover:opacity-75",
              font.class
            )}
            style={{ fontFamily: `var(${font.variable})` }}
          >
            {font.label}
            {currentFont.name === font.name && (
              <motion.div 
                layoutId="font-underline"
                className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-[#F5F0E8] rounded-full" 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
