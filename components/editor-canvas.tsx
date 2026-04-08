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
}

export function EditorCanvas({
  text,
  setText,
  font,
  paper,
  tone,
  doodle,
  align,
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
        "absolute inset-0 transition-all duration-500 ease-in-out grain",
        paper.type === "image" ? "bg-cover bg-center" : tone.class,
        tone.ink
      )}
      style={{
        backgroundImage: paper.type === "image" ? `url(${paper.path})` : undefined,
      }}
    >
      {/* Doodle Ornament */}
      {doodle && (
        <div 
          className={cn(
            "absolute bottom-[130px] right-[28px] w-11 h-11 opacity-25 pointer-events-none transition-opacity",
            isDark ? "invert brightness-200" : "brightness-50"
          )}
        >
          <img src={`/doodles/${doodle}`} alt="" className="w-full h-full object-contain" />
        </div>
      )}

      {/* Writing Area */}
      <div className={cn(
        "absolute inset-0 flex items-center px-10 pb-[120px] pt-[90px]",
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
            "w-full max-w-[340px] bg-transparent border-none outline-none resize-none transition-all duration-300",
            "text-[clamp(17px,4.8vw,28px)] leading-[2] tracking-[0.02em] italic",
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
