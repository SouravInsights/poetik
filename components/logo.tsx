"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  onDark?: boolean;
}

export function Logo({ 
  className, 
  onDark = true
}: LogoProps) {
  return (
    <div className={cn("flex flex-col items-start select-none group", className)}>
      <div className="flex items-baseline gap-0.5">
        <span className={cn(
          "font-italiana text-2xl uppercase tracking-[0.3em] transition-all duration-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]",
          onDark ? "text-white" : "text-black"
        )}>
          poetik
        </span>
        <div className={cn(
          "w-1.5 h-1.5 rounded-full mb-1 shadow-sm",
          onDark ? "bg-white" : "bg-black"
        )} />
      </div>
    </div>
  );
}
