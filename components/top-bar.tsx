"use client";

import { cn } from "@/lib/utils";
import { useWebHaptics } from "web-haptics/react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextAlignCenterIcon, TextAlignLeft01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { Logo } from "./logo";

interface TopBarProps {
  visible: boolean;
  onClear: () => void;
  align: "left" | "center";
  onAlignToggle: () => void;
  inkMode: "ink-light" | "ink-dark";
  atmosphere: "none" | "rain" | "fireplace";
  onAtmosphereToggle: () => void;
}

export function TopBar({ visible, onClear, align, onAlignToggle, inkMode, atmosphere, onAtmosphereToggle }: TopBarProps) {
  const { trigger } = useWebHaptics();
  const isDark = inkMode === "ink-light";

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 sm:px-8 pt-[max(env(safe-area-inset-top),20px)] pb-10 transition-all duration-400 ease-in-out",
        "bg-gradient-to-b from-current/[0.03] to-transparent",
        inkMode,
        !visible && "opacity-0 pointer-events-none -translate-y-2"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-6">
        <Logo onDark={isDark} className="scale-[0.75] sm:scale-100 origin-left" />
        <div className={cn("h-4 w-[1px] opacity-10 hidden sm:block", isDark ? "bg-white" : "bg-black")} />
        <button
          onClick={() => {
            trigger(20);
            onAlignToggle();
          }}
          className={cn(
            "flex items-center gap-2 shrink-0 font-jost text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2.5 px-4 sm:px-5 rounded-full backdrop-blur-xl border select-none shadow-md",
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

        {/* --- Explicit Atmosphere Pill --- */}
        <button
          onClick={() => {
            trigger(25);
            onAtmosphereToggle();
          }}
          className={cn(
            "flex items-center gap-2 shrink-0 font-jost text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all h-9 sm:h-10 px-4 rounded-full backdrop-blur-xl border select-none",
            atmosphere !== "none"
              ? (isDark ? "bg-white/[0.15] border-white/[0.25] text-white shadow-lg" : "bg-black/[0.1] border-black/[0.2] text-black shadow-sm")
              : (isDark ? "bg-white/[0.12] border-white/[0.15] text-white hover:bg-white/[0.25]" : "bg-black/[0.08] border-black/[0.15] text-black hover:bg-black/[0.15]")
          )}
        >
          {atmosphere === "none" ? (
             // Short 4-letter generic label prevents layout overflow on extremely narrow mobile devices
            <span className="mt-[1px]">Mood</span>
          ) : (
            <>
              <Image 
                src={atmosphere === "rain" ? "/icons/cloud-with-rain-3d.png" : "/icons/fire-3d.png"} 
                alt={atmosphere} 
                width={20}
                height={20}
                priority
                className="w-4 h-4 sm:w-5 sm:h-5 object-contain" 
              />
              <span className="mt-[1px] hidden sm:inline">{atmosphere === "fireplace" ? "Campfire" : atmosphere}</span>
            </>
          )}
        </button>
      </div>
      <button
        onClick={() => {
          trigger("error");
          onClear();
        }}
        className={cn(
          "flex items-center gap-2 shrink-0 font-jost text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase transition-all py-2.5 px-3 sm:px-5 rounded-full backdrop-blur-xl border select-none shadow-md",
          "bg-red-500/15 text-red-500 hover:bg-red-500/25 border-red-500/25"
        )}
      >
        <HugeiconsIcon icon={Delete02Icon} size={12} strokeWidth={2.5} />
        <span className="mt-0.5 hidden sm:inline">clear</span>
      </button>
    </div>
  );
}
