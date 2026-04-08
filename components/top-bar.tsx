"use client";

import { cn } from "@/lib/utils";
import { Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextAlignCenterIcon, TextAlignLeft01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Logo } from "./logo";

interface TopBarProps {
  visible: boolean;
  onClear: () => void;
  align: "left" | "center";
  onAlignToggle: () => void;
  tone: Tone;
}

export function TopBar({ visible, onClear, align, onAlignToggle, tone }: TopBarProps) {
  const { trigger } = useWebHaptics();
  const isDark = tone.ink === "ink-light";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-8 pt-[max(env(safe-area-inset-top),20px)] pb-10 transition-all duration-400 ease-in-out",
        "bg-gradient-to-b from-current/[0.03] to-transparent",
        tone.ink,
        !visible && "opacity-0 pointer-events-none -translate-y-2"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-6">
        <Logo onDark={isDark} className="scale-[0.75] sm:scale-100 origin-left" />
        <div className={cn("h-4 w-[1px] opacity-10 hidden sm:block", isDark ? "bg-white" : "bg-black")} />
        <button
          onClick={() => {
            trigger("selection");
            onAlignToggle();
          }}
          className={cn(
            "flex items-center gap-2 font-jost text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2 px-3 sm:px-5 rounded-full backdrop-blur-xl border select-none shadow-md",
            isDark 
              ? "bg-white/[0.12] border-white/[0.15] text-white hover:bg-white/[0.25]" 
              : "bg-black/[0.08] border-black/[0.15] text-black hover:bg-black/[0.15]"
          )}
        >
          <HugeiconsIcon 
            icon={align === "center" ? TextAlignCenterIcon : TextAlignLeft01Icon} 
            size={12} 
            strokeWidth={2.5}
          />
          <span className="mt-0.5 hidden sm:inline">{align}</span>
        </button>
      </div>
      <button
        onClick={() => {
          trigger("error");
          onClear();
        }}
        className={cn(
          "flex items-center gap-2 font-jost text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2 px-3 sm:px-5 rounded-full backdrop-blur-xl border select-none shadow-md",
          "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/25"
        )}
      >
        <HugeiconsIcon icon={Delete02Icon} size={12} strokeWidth={2.5} />
        <span className="mt-0.5 hidden sm:inline">clear</span>
      </button>
    </div>
  );
}
