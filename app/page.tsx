"use client";

import { useState } from "react";
import { preload } from "react-dom";
import { useEditor } from "@/hooks/use-editor";
import { DEFAULT_PAPER } from "@/lib/constants";
import { EditorCanvas } from "@/components/editor-canvas";
import { TopBar } from "@/components/top-bar";
import { BottomToolbar } from "@/components/bottom-toolbar";
import { ExportModal } from "@/components/export-modal";
import { DoodleDrawer } from "@/components/doodle-drawer";
import { BootSequence } from "@/components/boot-sequence";
import { AnimatePresence } from "motion/react";

// Start fetching the default cinematic assets the exact millisecond React
// begins evaluating — mirroring the landing hero. The poster is tiny so we
// preload it always; the video only for fresh sessions (returning users get
// their saved background back, so warming 14.mp4 would be wasted bytes).
if (DEFAULT_PAPER.poster) preload(DEFAULT_PAPER.poster, { as: "image" });
const hasSavedState = typeof window !== "undefined" && !!localStorage.getItem("poetik-state");
if (!hasSavedState && DEFAULT_PAPER.path) preload(DEFAULT_PAPER.path, { as: "video" });

export default function PoetikPage() {
  const [isBooting, setIsBooting] = useState(true);
  const {
    text, setText,
    font, setFont,
    paper, setPaper,
    tone, setTone,
    inkMode, setInkMode,
    doodle, setDoodle,
    author, setAuthor,
    align, toggleAlign,
    bgOpacity, setBgOpacity,
    isExporting, setIsExporting,
    isDoodleDrawerOpen, setIsDoodleDrawerOpen,
    isToolbarOpen, setIsToolbarOpen,
    uiVisible, dynamicPapers, dynamicDoodles,
    handleClear,
    isClearing,
    atmosphere, setAtmosphere, // NEW: Subliminal Audio-Video state
    onCanvasFocusChange,
  } = useEditor();

  // Chrome dissolves while writing (the hook drives uiVisible), but must
  // always stay put while a drawer is open, during boot, and mid clear-wipe.
  const chromeVisible = (uiVisible || isToolbarOpen || isDoodleDrawerOpen) && !isBooting && !isClearing;

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#0D0B09]">
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      <EditorCanvas
        text={text}
        setText={setText}
        font={font}
        paper={paper}
        tone={tone}
        inkMode={inkMode}
        doodle={doodle}
        author={author}
        align={align}
        bgOpacity={bgOpacity}
        atmosphere={atmosphere} // Pass to canvas to orchestrate audio and lighting
        isClearing={isClearing}
        onFocusChange={onCanvasFocusChange}
      />

      <TopBar 
        visible={chromeVisible && !isDoodleDrawerOpen} 
        onClear={handleClear} 
        align={align}
        onAlignToggle={toggleAlign}
        inkMode={inkMode}
        atmosphere={atmosphere}
        onAtmosphereToggle={() => {
          if (atmosphere === "none") setAtmosphere("rain");
          else if (atmosphere === "rain") setAtmosphere("fireplace");
          else setAtmosphere("none");
        }}
      />

      <BottomToolbar
        isOpen={isToolbarOpen}
        onOpenToggle={setIsToolbarOpen}
        currentFont={font}
        currentTone={tone}
        currentPaper={paper}
        inkMode={inkMode}
        dynamicPapers={dynamicPapers}
        author={author}
        onAuthorChange={setAuthor}
        onFontSelect={setFont}
        onToneSelect={setTone}
        onPaperSelect={setPaper}
        onInkModeChange={setInkMode}
        onExport={() => setIsExporting(true)}
        onDoodleToggle={() => setIsDoodleDrawerOpen(true)}
        uiVisible={chromeVisible}
      />

      <DoodleDrawer
        isOpen={isDoodleDrawerOpen}
        onClose={() => setIsDoodleDrawerOpen(false)}
        currentDoodle={doodle}
        onSelect={setDoodle}
        inkMode={inkMode}
        dynamicDoodles={dynamicDoodles}
      />

      <ExportModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        text={text}
        font={font}
        paper={paper}
        tone={tone}
        inkMode={inkMode}
        doodle={doodle}
        author={author}
        align={align}
        bgOpacity={bgOpacity}
      />
    </main>
  );
}
