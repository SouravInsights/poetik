"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";

interface EditorCanvasProps {
  text: string;
  setText: (text: string) => void;
  font: Font;
  paper: Paper;
  tone: Tone;
  doodle: string | null;
  align: "left" | "center";
  bgOpacity: number;
}

export function EditorCanvas({
  text,
  setText,
  font,
  paper,
  tone,
  doodle,
  align,
  bgOpacity,
}: EditorCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const isDark = tone.ink === "ink-light";

  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-700 ease-in-out grain",
        paper.type === "image" ? "bg-cover bg-center" : tone.class,
        tone.ink
      )}
      style={{
        backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
        opacity: bgOpacity,
      }}
    >
      {/* Background Overlay for UI contrast (only when paper is selected) */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          paper.type === "image" ? "opacity-20" : "opacity-0",
          isDark ? "bg-black" : "bg-white"
        )} 
      />

      {/* Doodle Ornament (Signature Position) */}
      {doodle && (
        <div 
          className={cn(
            "absolute bottom-32 right-10 w-16 h-16 opacity-10 pointer-events-none transition-all duration-1000",
            isDark ? "invert brightness-200" : "brightness-50"
          )}
        >
          <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Writing Area */}
      <div className={cn(
        "absolute inset-0 flex items-center px-10 pb-[150px] pt-[100px]",
        align === "center" ? "justify-center" : "justify-start"
      )}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="kuch likho..."
          className={cn(
            "w-full bg-transparent border-none outline-none resize-none transition-all duration-300",
            "text-[clamp(26px,7.5vw,52px)] leading-[1.6] tracking-[0.01em] italic",
            "placeholder:opacity-20 placeholder:text-current",
            align === "center" ? "text-center" : "text-left",
            font.class
          )}
          style={{ fontFamily: `var(${font.variable})` }}
          rows={1}
        />
      </div>
    </div>
  );
}
