"use client";

import { useState, useEffect, useCallback } from "react";
import { FONTS, PAPERS, TONES, DEFAULT_PAPER, Font, Paper, Tone } from "@/lib/constants";
import { useWebHaptics } from "web-haptics/react";

export function useEditor() {
  const { trigger } = useWebHaptics();
  const [text, setText] = useState("");
  const [font, setFont] = useState<Font>(FONTS[0]);
  // Fresh sessions start on the default cinematic video (dark → light ink).
  // Saved sessions overwrite these in the localStorage restore effect below.
  const [paper, setPaper] = useState<Paper>(DEFAULT_PAPER);
  const [tone, setTone] = useState<Tone>(TONES[0]);
  const [inkMode, setInkMode] = useState<"ink-light" | "ink-dark">("ink-light");
  const [doodle, setDoodle] = useState<string | null>(null);
  const [author, setAuthor] = useState<string>("");
  const [align, setAlign] = useState<"left" | "center">("center");
  const [bgOpacity, setBgOpacity] = useState(1);
  const [atmosphere, setAtmosphere] = useState<"none" | "rain" | "fireplace">("none");
  const [isExporting, setIsExporting] = useState(false);
  const [isDoodleDrawerOpen, setIsDoodleDrawerOpen] = useState(false);
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  const [dynamicPapers, setDynamicPapers] = useState<Paper[]>(PAPERS);
  const [dynamicDoodles, setDynamicDoodles] = useState<string[]>([]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch("/api/assets");
        const data = await res.json();
        
        const videoPapers: Paper[] = (data.videos || []).map((v: any) => ({
          id: v.name,
          path: v.path,
          poster: v.poster,
          type: "video" as const,
          label: `Video ${v.name.split('.')[0]}`,
          theme: "dark" // Default to dark theme for videos for better contrast with light ink
        }));

        const newPapers: Paper[] = [
          PAPERS[0],
          ...data.papers.map((p: any) => ({
            id: p.name,
            path: p.path,
            type: "image" as const,
            label: p.name.split('.')[0],
            theme: (p.path.includes('modern') && ['11'].includes(p.name.split('.')[0])) ? 'dark' : 'light'
          })),
          ...videoPapers
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
        // Restore full paper object (may be a dynamic image paper)
        if (parsed.paper) setPaper(parsed.paper);
        if (parsed.inkMode) setInkMode(parsed.inkMode);
        if (parsed.doodle) setDoodle(parsed.doodle);
        if (parsed.author) setAuthor(parsed.author);
        if (parsed.align) setAlign(parsed.align);
        if (parsed.bgOpacity !== undefined) setBgOpacity(parsed.bgOpacity);
        if (parsed.atmosphere) setAtmosphere(parsed.atmosphere);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("poetik-state", JSON.stringify({
      text, font, paper, tone, inkMode, doodle, author, align, bgOpacity, atmosphere
    }));
  }, [text, font, paper, tone, inkMode, doodle, author, align, bgOpacity, atmosphere]);

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
    if (!text && !doodle) return;
    
    // Intense, erratic haptic sequence mimicking physical paper crumpling
    trigger([30, 40, 20, 50, 40, 60, 30, 80]); 
    setIsClearing(true);
    
    setTimeout(() => {
      setText("");
      setDoodle(null);
      setIsClearing(false);
    }, 2800); // Extended fully to 2.8 seconds to allow hyper-slow luxurious animations
  }, [trigger, text, doodle]);

  const handleSetAtmosphere = useCallback((mode: "none" | "rain" | "fireplace") => {
    trigger([20, 40]);
    setAtmosphere(mode);
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
    isClearing,
    atmosphere, setAtmosphere: handleSetAtmosphere,
  };
}
