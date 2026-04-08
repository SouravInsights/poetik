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
  const [inkMode, setInkMode] = useState<"ink-light" | "ink-dark">("ink-light");
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
        if (parsed.inkMode) setInkMode(parsed.inkMode);
        if (parsed.doodle) setDoodle(parsed.doodle);
        if (parsed.author) setAuthor(parsed.author);
        if (parsed.align) setAlign(parsed.align);
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poetik-state", JSON.stringify({
      text, font, paper, tone, inkMode, doodle, author, align, bgOpacity
    }));
  }, [text, font, paper, tone, inkMode, doodle, author, align, bgOpacity]);

  const handleSetFont = useCallback((f: Font) => {
    trigger(15);
    setFont(f);
  }, [trigger]);

  // Selecting a solid tone → clear canvas, apply tone bg, sync inkMode
  const handleSetTone = useCallback((t: Tone) => {
    trigger(35);
    setTone(t);
    setPaper(PAPERS[0]); // clear any canvas texture
    setInkMode(t.ink);   // sync ink to the tone's natural direction
  }, [trigger]);

  // Selecting a canvas texture → set paper, auto-set inkMode from theme
  const handleSetPaper = useCallback((p: Paper) => {
    trigger(35);
    setPaper(p);
    if (p.theme === "dark") {
      setInkMode("ink-light");
    } else {
      setInkMode("ink-dark");
    }
  }, [trigger]);

  // Independent ink toggle — does NOT change background
  const handleSetInkMode = useCallback((mode: "ink-light" | "ink-dark") => {
    trigger(20);
    setInkMode(mode);
  }, [trigger]);

  const handleSetDoodle = useCallback((d: string | null) => {
    trigger(20);
    setDoodle(d);
  }, [trigger]);

  const handleSetAlign = useCallback(() => {
    trigger([20, 30, 20]);
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
    inkMode, setInkMode: handleSetInkMode,
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
