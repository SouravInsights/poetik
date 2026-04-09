"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";

interface EditorCanvasProps {
  text: string;
  setText: (text: string) => void;
  font: Font;
  paper: Paper;
  tone: Tone;
  inkMode: "ink-light" | "ink-dark";
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
  inkMode,
  doodle,
  author,
  align,
  bgOpacity,
}: EditorCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { trigger } = useWebHaptics();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      const textBeforeCursor = text.slice(0, textareaRef.current.selectionStart || 0);
      const lineIndex = textBeforeCursor.split('\n').length - 1;
      setActiveIndex(lineIndex);
    }
  };

  const handleTextChange = (val: string) => {
    trigger(15);
    setText(val);
    setTimeout(handleSelectionChange, 0); // Sync active index after render
  };

  const isDark = inkMode === "ink-light"; // dark background = light ink

  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-700 ease-in-out grain",
        paper.type === "image" ? "bg-cover bg-center" : tone.class,
        inkMode
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

      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pb-[90px] pt-[80px]">
        <div className="relative w-full max-w-[800px]">
          {/* Ghost Div: Visually renders the poetry with Focus 'Fade' Mode */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full whitespace-pre-wrap pointer-events-none transition-all duration-300",
              "text-[clamp(26px,7.5vw,52px)] leading-[1.6] tracking-[0.01em] italic",
              align === "center" ? "text-center" : "text-left",
              font.class
            )}
            style={{ fontFamily: `var(${font.variable})` }}
          >
            {text === "" ? (
              <span className="opacity-20">arz kiya hai...</span>
            ) : (
              text.split('\n').map((line, i, arr) => (
                <span
                  key={i}
                  className={cn(
                    "transition-opacity duration-1000",
                    isFocused && i !== activeIndex ? "opacity-30" : "opacity-100"
                  )}
                >
                  {line}
                  {i !== arr.length - 1 && <br />}
                </span>
              ))
            )}
          </div>

          {/* Invisible Textarea: Handles exact cursor positioning & native typing */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onSelect={handleSelectionChange}
            onFocus={() => { setIsFocused(true); handleSelectionChange(); }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleSelectionChange}
            onClick={handleSelectionChange}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            className={cn(
              "w-full bg-transparent border-none outline-none resize-none relative z-10 transition-all duration-300",
              "text-[clamp(26px,7.5vw,52px)] leading-[1.6] tracking-[0.01em] italic",
              align === "center" ? "text-center" : "text-left",
              font.class
            )}
            style={{ 
              fontFamily: `var(${font.variable})`,
              color: 'transparent',
              caretColor: isDark ? '#f2ece0' : '#1a1714' 
            }}
            rows={1}
          />
        </div>
      </div>

      {(doodle || author) && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 pointer-events-none">
          {doodle && (
            <div className={cn(
              "w-9 h-9 opacity-40 transition-all duration-700",
              isDark ? "invert brightness-200" : "brightness-0"
            )}>
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
