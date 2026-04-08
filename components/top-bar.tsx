"use client";

import { cn } from "@/lib/utils";
import { Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextAlignCenterIcon, TextAlignLeft01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

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
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 pt-[max(env(safe-area-inset-top),24px)] pb-4 transition-all duration-400 ease-in-out",
        tone.ink,
        !visible && "opacity-0 pointer-events-none -translate-y-2"
      )}
    >
      <div className="flex items-center gap-7">
        <span className="font-italiana text-2xl tracking-[0.1em] opacity-80 select-none">
          poetik
        </span>
        <button
          onClick={() => {
            trigger("selection");
            onAlignToggle();
          }}
          className="flex items-center gap-2 font-jost text-[12px] font-light tracking-[0.2em] lowercase opacity-40 transition-all hover:opacity-100 py-1.5 px-3 rounded-full hover:bg-current/5"
        >
          <HugeiconsIcon 
            icon={align === "center" ? TextAlignCenterIcon : TextAlignLeft01Icon} 
            size={16} 
          />
          <span className="mt-0.5">{align === "center" ? "center" : "left"}</span>
        </button>
      </div>
      <button
        onClick={() => {
          trigger("error");
          onClear();
        }}
        className="flex items-center gap-2.5 font-jost text-[12px] font-light tracking-[0.2em] lowercase opacity-40 transition-all hover:opacity-100 py-1.5 px-3 rounded-full hover:bg-current/5"
      >
        <HugeiconsIcon icon={Delete02Icon} size={16} />
        <span className="mt-0.5">clear</span>
      </button>
    </div>
  );
}
