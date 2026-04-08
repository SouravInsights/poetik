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

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 pt-[max(env(safe-area-inset-top),20px)] pb-4 transition-all duration-400 ease-in-out",
        tone.ink,
        !visible && "opacity-0 pointer-events-none -translate-y-2"
      )}
    >
      <div className="flex items-center gap-8">
        <Logo onDark={tone.ink === "ink-light"} />
        <div className="h-4 w-[1px] bg-current opacity-10" />
        <button
          onClick={() => {
            trigger("selection");
            onAlignToggle();
          }}
          className="flex items-center gap-2 font-jost text-[10px] font-medium tracking-[0.2em] uppercase opacity-40 transition-all hover:opacity-100"
        >
          <HugeiconsIcon 
            icon={align === "center" ? TextAlignCenterIcon : TextAlignLeft01Icon} 
            size={14} 
          />
          <span>{align}</span>
        </button>
      </div>
      <button
        onClick={() => {
          trigger("error");
          onClear();
        }}
        className="flex items-center gap-2 font-jost text-[10px] font-medium tracking-[0.2em] uppercase opacity-40 transition-all hover:opacity-100"
      >
        <HugeiconsIcon icon={Delete02Icon} size={14} />
        <span>clear</span>
      </button>
    </div>
  );
}
