"use client";

import { FONTS, Font } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FontPickerProps {
  currentFont: Font;
  onSelect: (font: Font) => void;
}

export function FontPicker({ currentFont, onSelect }: FontPickerProps) {
  return (
    <div className="flex gap-0 items-baseline overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-6 pb-3">
      {FONTS.map((font) => (
        <button
          key={font.name}
          onClick={() => onSelect(font)}
          className={cn(
            "flex-shrink-0 bg-none border-none cursor-pointer text-[15px] italic text-inherit px-4 pl-0 py-1 tracking-[0.01em] transition-opacity duration-200 relative",
            currentFont.name === font.name ? "opacity-95" : "opacity-30 hover:opacity-70",
            font.class
          )}
          style={{ fontFamily: `var(${font.variable})` }}
        >
          {font.label}
          {currentFont.name === font.name && (
            <div className="absolute bottom-1 left-0 w-[calc(100%-16px)] h-[0.5px] bg-accent" />
          )}
        </button>
      ))}
    </div>
  );
}
