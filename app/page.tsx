"use client";

import { useEditor } from "@/hooks/use-editor";
import { EditorCanvas } from "@/components/editor-canvas";
import { TopBar } from "@/components/top-bar";
import { BottomToolbar } from "@/components/bottom-toolbar";
import { ExportModal } from "@/components/export-modal";
import { DoodleDrawer } from "@/components/doodle-drawer";

export default function PoetikPage() {
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
  } = useEditor();

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-[#0D0B09]">
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
      />

      <TopBar 
        visible={uiVisible && !isDoodleDrawerOpen} 
        onClear={handleClear} 
        align={align}
        onAlignToggle={toggleAlign}
        inkMode={inkMode}
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
        uiVisible={uiVisible}
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
