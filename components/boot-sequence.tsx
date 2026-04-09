"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";

const quotes = [
  { text: "A poem begins as a lump in the throat.", author: "Robert Frost" },
  { text: "Poetry is when an emotion has found its thought.", author: "Robert Frost" },
  { text: "The poet is a liar who always speaks the truth.", author: "Jean Cocteau" },
  { text: "Words mean more than what is set down on paper.", author: "Maya Angelou" }
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [quoteIdx, setQuoteIdx] = useState<number | null>(null);

  useEffect(() => {
    // Pick random quote on mount to avoid hydration mismatch
    setQuoteIdx(Math.floor(Math.random() * quotes.length));

    // Design Engineering: Don't trap the user. 1.8s hold is enough for an inhale.
    const timer = setTimeout(() => {
      onComplete();
    }, 1800); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (quoteIdx === null) {
      // Pure black veil while determining quote
      return <div className="fixed inset-0 z-50 bg-[#0D0B09]" />;
  }

  const quote = quotes[quoteIdx];

  return (
    // Outer container blocks clicks during boot and gracefully fades out.
    // Design Engineering: Make cinematic intros interruptible. Any tap skips to the editor.
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0D0B09] px-10"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "circOut" }}
      onPointerDown={onComplete}
    >
      {/* 
        Inner text element gracefully diffuses out. 
      */}
      <motion.div
        initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
        animate={{ opacity: 0.85, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center text-center gap-8 max-w-[600px]"
      >
        <p className="text-[#ede0c4] font-serif italic text-2xl md:text-3xl leading-[1.8] tracking-[0.03em]">
          "{quote.text}"
        </p>
        <span className="text-[#ede0c4] opacity-40 font-jost text-[10px] tracking-[0.4em] uppercase">
          {quote.author}
        </span>
      </motion.div>
    </motion.div>
  );
}
