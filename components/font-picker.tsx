"use client";

import { FONTS, Font } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface FontPickerProps {
  currentFont: Font;
  onSelect: (font: Font) => void;
}

import { useWebHaptics } from "web-haptics/react";

export function FontPicker({ currentFont, onSelect }: FontPickerProps) {
  const { trigger } = useWebHaptics();

  return (
    <div className="flex gap-4 items-center overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-8 pb-2">
      <span className="font-jost text-[9px] font-medium tracking-[0.3em] opacity-40 flex-shrink-0 uppercase pr-2">
        fonts
      </span>
      {FONTS.map((font) => (
        <button
          key={font.name}
          onClick={() => {
            trigger("selection");
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
  );
}
