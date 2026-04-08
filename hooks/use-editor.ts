"use client";

import { useState, useEffect, useCallback } from "react";
import { FONTS, PAPERS, TONES, Font, Paper, Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";

export function useEditor() {
  const { trigger } = useWebHaptics();
  const [text, setText] = useState("");
  const [font, setFont] = useState<Font>(FONTS[0]);
  const [paper, setPaper] = useState<Paper>(PAPERS[0]);
  const [tone, setTone] = useState<Tone>(TONES[0]);
  const [doodle, setDoodle] = useState<string | null>(null);
  const [author, setAuthor] = useState<string>("");
  const [align, setAlign] = useState<"left" | "center">("center");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isDoodleDrawerOpen, setIsDoodleDrawerOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  const [dynamicPapers, setDynamicPapers] = useState<Paper[]>(PAPERS);
  const [dynamicDoodles, setDynamicDoodles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch("/api/assets");
        const data = await res.json();
        const newPapers: Paper[] = [
          PAPERS[0],
          ...data.papers.map((p: any) => ({
            id: p.name,
            path: p.path,
            type: "image" as const,
            label: p.name.split('.')[0],
            theme: (p.path.includes('modern') && ['11'].includes(p.name.split('.')[0])) ? 'dark' : 'light'
          }))
        ];
        setDynamicPapers(newPapers);
        setDynamicDoodles(data.doodles);
      } catch (e) {
        console.error("Failed to fetch assets", e);
      }
    }
    fetchAssets();
  }, []);

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
        if (parsed.tone) {
          const found = TONES.find(t => t.id === parsed.tone.id);
          if (found) setTone(found);
        }
        if (parsed.doodle) setDoodle(parsed.doodle);
        if (parsed.author) setAuthor(parsed.author);
        if (parsed.align) setAlign(parsed.align);
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poetik-state", JSON.stringify({ 
      text, font, paper, tone, doodle, author, align, bgOpacity 
    }));
  }, [text, font, paper, tone, doodle, author, align, bgOpacity]);

  const handleSetFont = useCallback((f: Font) => {
    trigger("selection");
    setFont(f);
  }, [trigger]);

  const handleSetPaper = useCallback((p: Paper) => {
    trigger("medium");
    setPaper(p);
    if (p.theme === "light" && tone.ink === "ink-light") {
      setTone(TONES.find(t => t.id === "paper") || TONES[4]);
    } else if (p.theme === "dark" && tone.ink === "ink-dark") {
      setTone(TONES.find(t => t.id === "void") || TONES[0]);
    }
  }, [trigger, tone]);

  const handleSetTone = useCallback((t: Tone) => {
    trigger("medium");
    setTone(t);
  }, [trigger]);

  const handleSetDoodle = useCallback((d: string | null) => {
    trigger("light");
    setDoodle(d);
  }, [trigger]);

  const handleSetAlign = useCallback(() => {
    trigger("selection");
    setAlign(a => a === "center" ? "left" : "center");
  }, [trigger]);

  const handleClear = useCallback(() => {
    trigger("error");
    setText("");
    setDoodle(null);
  }, [trigger]);

  return {
    text, setText,
    font, setFont: handleSetFont,
    paper, setPaper: handleSetPaper,
    tone, setTone: handleSetTone,
    doodle, setDoodle: handleSetDoodle,
    author, setAuthor,
    align, toggleAlign: handleSetAlign,
    bgOpacity, setBgOpacity,
    isExporting, setIsExporting,
    isDoodleDrawerOpen, setIsDoodleDrawerOpen,
    isToolbarOpen, setIsToolbarOpen,
    uiVisible, dynamicPapers, dynamicDoodles,
    handleClear,
  };
}
