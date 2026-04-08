"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";

interface EditorCanvasProps {
  text: string;
  setText: (text: string) => void;
  font: Font;
  paper: Paper;
  tone: Tone;
  doodle: string | null;
  author: string;
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
  author,
  align,
  bgOpacity,
}: EditorCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { trigger } = useWebHaptics();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleTextChange = (val: string) => {
    trigger(15);
    setText(val);
  };

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
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          paper.type === "image" ? "opacity-20" : "opacity-0",
          isDark ? "bg-black" : "bg-white"
        )} 
      />

      {/* Writing Area */}
      <div className={cn(
        "absolute inset-0 flex flex-col items-center px-6 sm:px-12",
        "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        "pb-[220px] pt-[max(env(safe-area-inset-top),100px)]"
      )}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          placeholder="kuch likho..."
          className={cn(
            "w-full bg-transparent border-none outline-none resize-none transition-all duration-300",
            "text-[clamp(28px,8vw,56px)] leading-[1.5] tracking-[0.01em] italic",
            "placeholder:opacity-20 placeholder:text-current",
            align === "center" ? "text-center" : "text-left",
            font.class
          )}
          style={{ 
            fontFamily: `var(${font.variable})`,
            minHeight: "100px" 
          }}
          rows={1}
        />
      </div>

      {/* Signature & Author Block */}
      {(doodle || author) && (
        <div className="fixed bottom-28 sm:bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 pointer-events-none z-20">
          {doodle && (
            <div 
              className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 opacity-40 transition-all duration-700",
                isDark ? "invert brightness-200" : "brightness-0"
              )}
            >
              <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          {author && (
            <span className={cn(
              "font-jost text-[9px] sm:text-[10px] tracking-[0.3em] uppercase opacity-30 mt-1",
              isDark ? "text-white" : "text-black"
            )}>
              {author.startsWith('@') ? author : `@${author}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
