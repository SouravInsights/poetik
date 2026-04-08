"use client";

import { useEditor } from "@/hooks/use-editor";
import { EditorCanvas } from "@/components/editor-canvas";
import { TopBar } from "@/components/top-bar";
import { BottomToolbar } from "@/components/bottom-toolbar";
import { ExportModal } from "@/components/export-modal";
import { DoodleDrawer } from "@/components/doodle-drawer";

export default function PoetikPage() {
  const {
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
  } = useEditor();

  const handleClear = () => {
    if (confirm("Clear all text?")) {
      setText("");
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0D0B09]">
      <EditorCanvas
        text={text}
        setText={setText}
        font={font}
        paper={paper}
        tone={tone}
        doodle={doodle}
        align={align}
      />

      <TopBar 
        visible={uiVisible && !isDoodleDrawerOpen} 
        onClear={handleClear} 
        align={align}
        onAlignToggle={() => setAlign((a: "left" | "center") => a === "center" ? "left" : "center")}
      />

      <BottomToolbar
        visible={uiVisible && !isDoodleDrawerOpen}
        currentFont={font}
        currentTone={tone}
        currentPaper={paper}
        onFontSelect={setFont}
        onToneSelect={setTone}
        onPaperSelect={setPaper}
        onExport={() => setIsExporting(true)}
        onDoodleToggle={() => setIsDoodleDrawerOpen(true)}
      />

      <DoodleDrawer
        isOpen={isDoodleDrawerOpen}
        onClose={() => setIsDoodleDrawerOpen(false)}
        currentDoodle={doodle}
        onSelect={setDoodle}
        tone={tone}
      />

      <ExportModal
        isOpen={isExporting}
        onClose={() => setIsExporting(false)}
        text={text}
        font={font}
        paper={paper}
        tone={tone}
        doodle={doodle}
        align={align}
      />
    </main>
  );
}
