"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Font, Paper, Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";
import { motion } from "motion/react";
import { getEraseAnimationPhysics } from "@/lib/erase-animations";

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
  isClearing?: boolean;
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
  isClearing,
}: EditorCanvasProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { trigger } = useWebHaptics();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [variant, setVariant] = useState<1 | 2 | 3>(1); // Random physics variant
  
  // Randomize the wipe effect every time the user hits clear!
  useEffect(() => {
    if (isClearing) {
      setVariant(Math.floor(Math.random() * 3) + 1 as 1 | 2 | 3);
    }
  }, [isClearing]);

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

  const isDark = inkMode === "ink-light";

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


      <div className={cn(
        "absolute inset-0 flex flex-col items-center justify-center px-8 pb-[90px] pt-[80px]",
        isClearing && "pointer-events-none"
      )}>
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
              <motion.span 
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 0.2, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }} // Lightning fast arrival (no artificial delay needed because 2.8s clear already passed)
                className="inline-block"
              >
                arz kiya hai...
              </motion.span>
            ) : (
              text.split('\n').map((line, i, arr) => (
                <span
                  key={i}
                  className={cn(
                    "transition-opacity duration-1000",
                    isFocused && i !== activeIndex && !isClearing ? "opacity-30" : "opacity-100"
                  )}
                >
                  {line.split(/(\s+)/).map((word, wIdx) => {
                    if (!word.trim()) return <span key={wIdx} className="whitespace-pre">{word}</span>;
                    
                    return (
                      <span key={wIdx} className="inline-block whitespace-pre">
                        {word.split('').map((char, cIdx) => {
                          const physics = getEraseAnimationPhysics(variant, i, wIdx, cIdx, isClearing || false);
                          
                          return (
                            <motion.span
                              key={cIdx}
                              className="inline-block origin-center"
                              animate={physics.animate}
                              transition={physics.transition as any}
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    );
                  })}
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
              "w-full bg-transparent resize-none outline-none overflow-hidden",
              "text-[clamp(26px,7.5vw,52px)] leading-[1.6] tracking-[0.01em] italic text-transparent caret-foreground",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
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
        <div className={cn(
          "absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none",
          isClearing ? "transition-all duration-300 scale-95 blur-[8px] opacity-0 rotate-2" : "transition-all duration-700 opacity-100 scale-100 blur-0 rotate-0"
        )}>
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
