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
    // Sharp 15ms pulse for writing. 
    // This is a direct Vibration API call through web-haptics for maximum intensity.
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

      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center px-8 pb-[90px] pt-[80px]"
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
            "text-[clamp(26px,7.5vw,52px)] leading-[1.6] tracking-[0.01em] italic",
            "placeholder:opacity-20 placeholder:text-current",
            align === "center" ? "text-center" : "text-left",
            font.class
          )}
          style={{ fontFamily: `var(${font.variable})` }}
          rows={1}
        />
      </div>

      {(doodle || author) && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 pointer-events-none">
          {doodle && (
            <div 
              className={cn(
                "w-9 h-9 opacity-40 transition-all duration-700",
                isDark ? "invert brightness-200" : "brightness-0"
              )}
            >
              <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
            </div>
          )}
          {author && (
            <span className={cn(
              "font-jost text-[8px] tracking-[0.3em] uppercase opacity-30",
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
