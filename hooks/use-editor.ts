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
  const [align, setAlign] = useState<"left" | "center">("center");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [isDoodleDrawerOpen, setIsDoodleDrawerOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Dynamic assets
  const [dynamicPapers, setDynamicPapers] = useState<Paper[]>(PAPERS);
  const [dynamicDoodles, setDynamicDoodles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch("/api/assets");
        const data = await res.json();
        
        const newPapers: Paper[] = [
          PAPERS[0], // Keep basic Void
          ...data.papers.map((p: { name: string, path: string, category: string }) => ({
            id: p.name,
            path: p.path,
            type: "image" as const,
            label: p.name.split('.')[0]
          }))
        ];
        
        setDynamicPapers(newPapers);
        setDynamicDoodles(data.doodles);

        // Recover state from localStorage after fetching papers to match by ID
        const saved = localStorage.getItem("poetik-state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.paper) {
            const found = newPapers.find(p => p.id === parsed.paper.id);
            if (found) setPaper(found);
          }
        }
      } catch (e) {
        console.error("Failed to fetch assets", e);
      }
    }
    fetchAssets();
  }, []);

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
        if (parsed.tone) {
          const found = TONES.find(t => t.id === parsed.tone.id);
          if (found) setTone(found);
        }
        if (parsed.doodle) setDoodle(parsed.doodle);
        if (parsed.align) setAlign(parsed.align);
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poetik-state", JSON.stringify({ 
      text, font, paper, tone, doodle, align, bgOpacity 
    }));
  }, [text, font, paper, tone, doodle, align, bgOpacity]);

  // UI transparency logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const hideUi = () => {
      // Don't auto-hide if drawer/toolbar is open or exporting
      if (!isDoodleDrawerOpen && !isExporting && !isToolbarOpen) {
        setUiVisible(false);
      }
    };
    const resetTimer = () => {
      setUiVisible(true);
      clearTimeout(timer);
      timer = setTimeout(hideUi, 4000); // 4s instead of 3s
    };

    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    timer = setTimeout(hideUi, 4000);

    return () => {
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timer);
    };
  }, [isDoodleDrawerOpen, isExporting]);

  const handleSetFont = useCallback((f: Font) => {
    trigger("selection");
    setFont(f);
  }, [trigger]);

  const handleSetPaper = useCallback((p: Paper) => {
    trigger("medium");
    setPaper(p);
  }, [trigger]);

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
    if (confirm("Clear all text?")) {
      trigger("error");
      setText("");
    }
  }, [trigger]);

  return {
    text,
    setText,
    font,
    setFont: handleSetFont,
    paper,
    setPaper: handleSetPaper,
    tone,
    setTone: handleSetTone,
    doodle,
    setDoodle: handleSetDoodle,
    align,
    toggleAlign: handleSetAlign,
    bgOpacity,
    setBgOpacity,
    isExporting,
    setIsExporting,
    isDoodleDrawerOpen,
    setIsDoodleDrawerOpen,
    isToolbarOpen,
    setIsToolbarOpen,
    uiVisible,
    dynamicPapers,
    dynamicDoodles,
    handleClear,
  };
}
