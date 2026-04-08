"use client";

import { cn } from "@/lib/utils";

interface TopBarProps {
  visible: boolean;
  onClear: () => void;
  align: "left" | "center";
  onAlignToggle: () => void;
}

export function TopBar({ visible, onClear, align, onAlignToggle }: TopBarProps) {
  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),16px)] pb-2 transition-opacity duration-400 ease-in-out",
        !visible && "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center gap-4">
        <span className="font-italiana text-xl tracking-wider opacity-45 select-none text-inherit">
          poetik
        </span>
        <button
          onClick={onAlignToggle}
          className="font-jost text-[11px] font-light tracking-[0.12em] lowercase opacity-40 transition-opacity hover:opacity-75 text-inherit"
        >
          {align === "center" ? "align: center" : "align: left"}
        </button>
      </div>
      <button
        onClick={onClear}
        className="font-jost text-[11px] font-light tracking-[0.12em] lowercase opacity-40 transition-opacity hover:opacity-75 text-inherit"
      >
        clear
      </button>
    </div>
  );
}
