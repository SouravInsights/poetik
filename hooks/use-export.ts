/**
 * hooks/use-export.ts
 *
 * THE EXPORT BRAIN
 * ================
 * This hook owns everything that happens when a user taps "Export".
 * It tracks the current state of the export process, runs the actual
 * export logic, and exposes clean values and handlers to the UI.
 *
 * We separated this from the modal component so that ExportModal stays
 * purely visual — it just renders buttons and listens for what this hook says.
 * None of the "how does export work?" logic lives in the UI layer.
 *
 * STATE MACHINE:
 * ==============
 * The export process moves through these states in order:
 *
 *   "idle"     → User has not started anything. Show the export button.
 *   "saving"   → JPEG export is in progress (usually < 2 seconds).
 *   "encoding" → Video export is recording frames (takes 5–30 seconds).
 *   "done"     → Export finished and file downloaded. Show success state for 3 seconds.
 *   "error"    → Something went wrong. Show error state for 3 seconds, then reset.
 *
 * TWO EXPORT PATHS:
 * =================
 * This hook handles two completely different types of exports
 * depending on what background the user has selected:
 *
 *   1. JPEG export (for static image or solid color backgrounds)
 *      → Uses html-to-image to photograph the hidden JpegExportBuffer div
 *      → Fast, simple, one function call, done in ~1 second
 *
 *   2. Video export (for video backgrounds)
 *      → Uses the 2-layer compositor in lib/video-exporter.ts
 *      → Captures the VideoOverlayBuffer div as a transparent PNG
 *      → Then records a canvas compositing video frames + text overlay at 24fps
 *      → Takes as long as the chosen duration (10s export = 10s recording time)
 *      → Outputs MP4 (Chrome) or WebM (Firefox)
 *
 * THE REFS:
 * =========
 * exportRef and overlayRef are React refs — they're just pointers to
 * actual DOM elements. Instead of searching the DOM by ID or class,
 * refs give us a direct, reliable handle to specific elements.
 *
 * exportRef  → points to the JpegExportBuffer div
 * overlayRef → points to the VideoOverlayBuffer div
 *
 * Both of these refs are passed DOWN to ExportBuffers as props,
 * and passed to the export functions when the user taps the button.
 */

"use client";

import { useRef, useState, useEffect } from "react";
import { toJpeg } from "html-to-image";
import { useWebHaptics } from "web-haptics/react";
import { exportPoetryVideo } from "@/lib/video-exporter";
import { Paper } from "@/lib/constants";

export type ExportState = "idle" | "saving" | "encoding" | "done" | "error";

interface UseExportOptions {
  isOpen: boolean;
  paper: Paper;
}

export function useExport({ isOpen, paper }: UseExportOptions) {
  // DOM refs — point directly to the hidden buffer elements in ExportBuffers
  const exportRef = useRef<HTMLDivElement>(null);   // For JPEG export
  const overlayRef = useRef<HTMLDivElement>(null);  // For video text overlay capture

  const { trigger } = useWebHaptics();
  const [exportState, setExportState] = useState<ExportState>("idle");
  const [durationSecs, setDurationSecs] = useState(10); // Default: 10 seconds
  const [progress, setProgress] = useState(0);          // 0–100, used during video encoding

  // Quick computed values the UI needs
  const isVideoBackground = paper.type === "video";
  const isBusy = exportState === "saving" || exportState === "encoding";

  // Every time the modal opens fresh, reset back to idle
  useEffect(() => {
    if (isOpen) {
      setExportState("idle");
      setProgress(0);
    }
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────────────────────
  // JPEG IMAGE EXPORT
  // Used for: static image backgrounds (paper textures, modern photos)
  //           and solid color tones (Void, Night, Cream, etc.)
  //
  // HOW IT WORKS:
  // 1. Waits 600ms — gives the UI a moment to settle before capture,
  //    avoiding any animation mid-frame artifacts.
  // 2. toJpeg() from html-to-image traverses the JpegExportBuffer div,
  //    renders all its CSS into a canvas, and returns a JPEG data URL.
  //    A data URL is a base64-encoded image — like a very long text string
  //    that encodes the raw image bytes.
  // 3. We create a fake <a> link pointing to that data URL, click it
  //    programmatically, and the browser downloads the file.
  // ─────────────────────────────────────────────────────────────────────────
  const handleImageExport = async () => {
    if (!exportRef.current || exportState === "saving") return;
    setExportState("saving");
    trigger("medium");
    try {
      await new Promise(r => setTimeout(r, 600));
      const dataUrl = await toJpeg(exportRef.current, {
        cacheBust: true,      // Adds a random query param so cached images don't interfere
        width: 1080,
        height: 1920,
        quality: 0.98,        // 98% JPEG quality — near-lossless, keeps file size reasonable
        style: { transform: "scale(1)", transformOrigin: "top left" },
      });
      const link = document.createElement("a");
      link.download = `poetik-${Date.now()}.jpg`; // Unique filename using current timestamp
      link.href = dataUrl;
      link.click();
      trigger("success");
      setExportState("done");
      setTimeout(() => setExportState("idle"), 3000);
    } catch (err) {
      console.error("Image export failed", err);
      setExportState("error");
      setTimeout(() => setExportState("idle"), 3000);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CINEMATIC VIDEO EXPORT
  // Used for: video backgrounds from the Cinematic tab
  //
  // HOW IT WORKS:
  // 1. Passes the overlayRef DOM element to exportPoetryVideo() in video-exporter.ts
  // 2. That function: captures the text overlay as PNG, plays the video,
  //    records every frame on a canvas, and returns the final Blob.
  // 3. A Blob is basically a file in memory — like a File object but without a name.
  //    We create a temporary URL for it (URL.createObjectURL), trigger a download,
  //    then immediately revoke the URL to free memory.
  //
  // TIMING:
  // This takes exactly as long as the chosen duration.
  // A 10-second video takes ~10 seconds to encode.
  // A 30-second video takes ~30 seconds.
  // The progress bar updates live as frames are recorded.
  // ─────────────────────────────────────────────────────────────────────────
  const handleVideoExport = async () => {
    if (!paper.path || !overlayRef.current || exportState !== "idle") return;
    setExportState("encoding");
    setProgress(0);
    trigger("medium");
    try {
      const blob = await exportPoetryVideo({
        videoSrc: paper.path,
        overlayEl: overlayRef.current,
        durationSecs,
        onProgress: setProgress, // Called every frame with a 0–100 value
      });

      // Determine file extension from the codec that was selected
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";

      // createObjectURL creates a temporary browser-only URL for the blob.
      // It doesn't upload anywhere — it just creates a local reference like:
      // "blob:http://localhost:3000/some-random-guid"
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `poetik-${Date.now()}.${ext}`;
      link.href = url;
      link.click();

      // Do NOT revoke synchronously: iOS Safari resolves the blob URL
      // asynchronously when the download begins, so an instant revoke kills
      // the download before it starts (silent failure on the primary
      // platform). A short grace window keeps it alive, then frees memory.
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      trigger("success");
      setExportState("done");
      setTimeout(() => setExportState("idle"), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isCors = msg.includes("tainted") || msg.includes("insecure") || msg.includes("cross-origin") || msg.includes("CORS");
      if (isCors) {
        console.error(
          "Video export failed — CORS error.\n" +
          "The video is served from a cross-origin URL (R2 CDN) but the bucket is missing CORS headers.\n" +
          "Fix: Go to Cloudflare R2 → ambient-assets → Settings → CORS Policy and add:\n" +
          JSON.stringify([{ AllowedOrigins: ["*"], AllowedMethods: ["GET", "HEAD"], AllowedHeaders: ["*"], MaxAgeSeconds: 3600 }], null, 2),
          err
        );
      } else {
        console.error("Video export failed:", msg, err);
      }
      setExportState("error");
      setTimeout(() => setExportState("idle"), 3000);
    }
  };

  // The modal calls this single handler — it routes to the correct
  // export function based on whether the background is a video or not
  const handleExport = isVideoBackground ? handleVideoExport : handleImageExport;

  // Human-readable label shown above the export button in the UI
  const statusLabel = (() => {
    // progress is 0 during overlay-capture + video-load (can be a second or
    // two on mobile) — say so, or the phase reads as frozen
    if (exportState === "encoding") return progress === 0 ? "preparing…" : `exporting... ${progress}%`;
    if (exportState === "saving") return "saving...";
    if (exportState === "done") return "saved to your device ✦";
    if (exportState === "error") return "something went wrong — try again";
    return isVideoBackground ? "ready to export" : "ready to share";
  })();

  return {
    exportRef,       // Pass to JpegExportBuffer
    overlayRef,      // Pass to VideoOverlayBuffer
    exportState,
    progress,
    durationSecs,
    setDurationSecs,
    isVideoBackground,
    isBusy,
    statusLabel,
    handleExport,
  };
}
