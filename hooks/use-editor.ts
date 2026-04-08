"use client";

import { useState, useEffect } from "react";
import { FONTS, PAPERS, TONES, Font, Paper, Tone } from "@/lib/constants";

export function useEditor() {
  const [text, setText] = useState("");
  const [font, setFont] = useState<Font>(FONTS[0]);
  const [paper, setPaper] = useState<Paper>(PAPERS[0]);
  const [tone, setTone] = useState<Tone>(TONES[0]);
  const [doodle, setDoodle] = useState<string | null>(null);
  const [align, setAlign] = useState<"left" | "center">("left");
  const [isExporting, setIsExporting] = useState(false);
  const [isDoodleDrawerOpen, setIsDoodleDrawerOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Auto-save to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("poetik-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.text) setText(parsed.text);
        if (parsed.font) {
          const found = FONTS.find(f => f.name === parsed.font.name);
          if (found) setFont(found);
        }
        if (parsed.paper) {
          const found = PAPERS.find(p => p.id === parsed.paper.id);
          if (found) setPaper(found);
        }
        if (parsed.tone) {
          const found = TONES.find(t => t.id === parsed.tone.id);
          if (found) setTone(found);
        }
        if (parsed.doodle) setDoodle(parsed.doodle);
        if (parsed.align) setAlign(parsed.align);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poetik-state", JSON.stringify({ text, font, paper, tone, doodle, align }));
  }, [text, font, paper, tone, doodle, align]);

  // UI transparency logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const hideUi = () => setUiVisible(false);
    const resetTimer = () => {
      setUiVisible(true);
      clearTimeout(timer);
      timer = setTimeout(hideUi, 3000);
    };

    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    timer = setTimeout(hideUi, 3000);

    return () => {
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timer);
    };
  }, []);

  return {
    text,
    setText,
    font,
    setFont,
    paper,
    setPaper,
    tone,
    setTone,
    doodle,
    setDoodle,
    align,
    setAlign,
    isExporting,
    setIsExporting,
    isDoodleDrawerOpen,
    setIsDoodleDrawerOpen,
    uiVisible,
  };
}
