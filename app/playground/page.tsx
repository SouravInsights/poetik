"use client";

import { useState } from "react";
import { LandingNav } from "@/components/landing/landing-nav";
import { ScrollUnlock } from "@/components/landing/scroll-unlock";
import { Loader2, Sparkles, Image as ImageIcon, Send, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const MOOD_SEEDS = [
  "ethereal", "liquid", "grainy", "sharp", "soft", "geometric", "organic", "noir", "brutalist", "dreamy", "austere"
];

const PRESET_PROMPTS = [
  {
    id: "system-1",
    label: "Full Brand System",
    category: "Identity",
    prompt: "A comprehensive modern brand identity kit for 'Poetik'. Includes a minimalist abstract mark (geometric dot and line motif), sophisticated typography layout using Italiana, and a vibrant sunset-inspired color palette. Desktop web app interface mockups.",
    aspect_ratio: "1:1"
  },
  {
    id: "abstract-1",
    label: "Minimalist Logo",
    category: "Logo",
    prompt: "A modern, minimalist logo mark for Poetik. An abstract geometric representation using a single dot and fluid lines. High-end black ink on grainy cream paper (#F0E8D8). Pure minimalism, professional brand identity.",
    aspect_ratio: "1:1"
  },
  {
    id: "editorial-1",
    label: "Landing Page Concept",
    category: "Landing",
    prompt: "A high-end editorial landing page for the Poetik DESKTOP WEB APP. Massive Italiana typography, hero section with cinematic blurred video background, and a 'Begin writing' CTA. Sections include 'The Void' and 'Cinematic Export'. No mobile app elements.",
    aspect_ratio: "3:2"
  },
  {
    id: "mobile-1",
    label: "Mobile Web View",
    category: "Digital",
    prompt: "A premium mobile web interface for Poetik. Clean, minimal writing canvas with glassmorphic toolbars. Italian and Cormorant typography. Soft sunset glow from the top corner. High-end UX design.",
    aspect_ratio: "2:3"
  },
];

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (customPrompt?: string, forcedRatio?: string) => {
    const basePrompt = customPrompt || prompt;
    if (!basePrompt) return;

    // Inject a random mood seed to ensure non-static results for presets
    const randomMood = MOOD_SEEDS[Math.floor(Math.random() * MOOD_SEEDS.length)];
    const finalPrompt = customPrompt ? `${basePrompt} (Mood: ${randomMood})` : basePrompt;
    const finalRatio = forcedRatio || aspectRatio;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: finalPrompt,
          aspect_ratio: finalRatio
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Replicate returns an array or a string depending on the model
        const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
        setResult(imageUrl);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `poetik-brand-${Date.now()}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0B09] text-[#F5F0E8] selection:bg-[#F5F0E8] selection:text-[#0D0B09]">
      <ScrollUnlock />
      <LandingNav />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <header className="mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-italiana text-5xl md:text-7xl uppercase tracking-wider mb-4">
              Brand <span className="italic font-cormorant normal-case tracking-normal">Atelier</span>
            </h1>
            <p className="font-cormorant text-xl md:text-2xl text-[#F5F0E8]/60 italic max-w-2xl">
              Exploring the visual soul of Poetik through GPT Image 2.
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-4">
              <h2 className="font-jost text-xs uppercase tracking-[0.3em] text-[#F5F0E8]/40 font-semibold">Presets</h2>
              <div className="grid grid-cols-1 gap-3">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setPrompt(preset.prompt);
                      setAspectRatio(preset.aspect_ratio);
                      handleGenerate(preset.prompt, preset.aspect_ratio);
                    }}
                    disabled={isGenerating}
                    className="group flex flex-col items-start p-4 bg-[#1A1816] border border-[#F5F0E8]/5 hover:border-[#F5F0E8]/20 transition-all text-left rounded-sm"
                  >
                    <div className="w-full flex justify-between items-start mb-1">
                      <span className="font-jost text-[10px] uppercase tracking-widest text-[#F5F0E8]/40">{preset.category}</span>
                      <span className="font-jost text-[9px] px-1.5 py-0.5 border border-[#F5F0E8]/10 rounded text-[#F5F0E8]/30 group-hover:border-[#F5F0E8]/30 transition-colors uppercase">{preset.aspect_ratio}</span>
                    </div>
                    <span className="font-cormorant text-lg group-hover:text-white transition-colors">{preset.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-jost text-xs uppercase tracking-[0.3em] text-[#F5F0E8]/40 font-semibold">Aspect Ratio</h2>
              <div className="flex gap-2">
                {["1:1", "3:2", "2:3"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "flex-1 py-2 font-jost text-[10px] uppercase tracking-widest border transition-all rounded-sm",
                      aspectRatio === ratio 
                        ? "bg-[#F5F0E8] text-[#0D0B09] border-[#F5F0E8]" 
                        : "bg-transparent text-[#F5F0E8]/40 border-[#F5F0E8]/10 hover:border-[#F5F0E8]/30"
                    )}
                  >
                    {ratio === "1:1" ? "Square" : ratio === "3:2" ? "Desktop" : "Mobile"}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="font-jost text-xs uppercase tracking-[0.3em] text-[#F5F0E8]/40 font-semibold">Custom Prompt</h2>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the aesthetic..."
                  className="w-full h-40 bg-[#1A1816] border border-[#F5F0E8]/5 focus:border-[#F5F0E8]/20 rounded-sm p-4 font-cormorant text-lg resize-none outline-none transition-all placeholder:text-[#F5F0E8]/20"
                />
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !prompt}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-2 bg-[#F5F0E8] text-[#0D0B09] font-jost text-xs uppercase tracking-widest font-bold rounded-full hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                >
                  {isGenerating ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {isGenerating ? "Envisioning..." : "Generate"}
                </button>
              </div>
            </section>

            {error && (
              <div className="p-4 bg-red-950/20 border border-red-900/50 text-red-400 font-cormorant italic rounded-sm">
                {error}
              </div>
            )}
          </div>

          {/* Result */}
          <div className="lg:col-span-7">
            <div 
              className={cn(
                "w-full bg-[#1A1816] border border-[#F5F0E8]/5 rounded-sm overflow-hidden relative flex items-center justify-center group shadow-2xl transition-all duration-500",
                aspectRatio === "1:1" ? "aspect-square" : aspectRatio === "3:2" ? "aspect-[3/2]" : "aspect-[2/3]"
              )}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <Loader2 className="w-12 h-12 text-[#F5F0E8]/20 animate-spin" />
                      <div className="absolute inset-0 blur-xl bg-[#F5F0E8]/10 animate-pulse" />
                    </div>
                    <p className="font-cormorant italic text-[#F5F0E8]/40 animate-pulse">Rendering high-end visuals...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full relative"
                  >
                    <img 
                      src={result} 
                      alt="Generated brand identity" 
                      className="w-full h-full object-contain bg-black/40"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                    
                    <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={downloadImage}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E8] text-[#0D0B09] font-jost text-[10px] uppercase tracking-widest font-bold rounded-full hover:bg-white transition-all shadow-xl"
                      >
                        <Sparkles className="w-3 h-3" />
                        Download
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className="p-3 bg-[#F5F0E8] text-[#0D0B09] rounded-full hover:bg-white transition-all shadow-xl"
                        title="Copy image URL"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" /> }
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-[#F5F0E8]/10"
                  >
                    <ImageIcon className="w-20 h-20 stroke-[0.5px]" />
                    <p className="font-cormorant italic text-lg tracking-wide">The canvas is waiting.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <p className="mt-4 font-jost text-[10px] uppercase tracking-[0.2em] text-[#F5F0E8]/20 text-center">
              Powered by openai/gpt-image-2 · Handcrafted for Poetik
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        
        :root {
          --font-italiana: 'Italiana', serif;
          --font-cormorant: 'Cormorant Garamond', serif;
          --font-jost: 'Jost', sans-serif;
        }

        .font-italiana { font-family: var(--font-italiana); }
        .font-cormorant { font-family: var(--font-cormorant); }
        .font-jost { font-family: var(--font-jost); }
      `}</style>
    </main>
  );
}
