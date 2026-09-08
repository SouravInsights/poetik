/**
 * lib/video-exporter.ts
 *
 * THE CINEMATIC VIDEO EXPORT ENGINE
 * ==================================
 *
 * WHAT THIS FILE DOES IN PLAIN ENGLISH:
 * When a user taps "Export 10s Video", we need to record a real video file
 * (MP4 or WebM) that looks exactly like what they see in the editor.
 * That means: the moving video background playing behind their poem text.
 *
 * WHY THIS IS HARD:
 * Browsers can't simply "record" a section of the screen. They need
 * an explicit drawing surface — a <canvas> element. So we have to
 * manually draw every single frame ourselves, one at a time.
 *
 * THE ARCHITECTURE (2-layer compositor):
 * Instead of trying to replicate the CSS layout on a canvas (which would
 * break all your custom fonts and letter-spacing), we use a smarter approach:
 *
 *   LAYER 1 — Raw Video Pixels:
 *     We draw the background video frame directly onto a canvas.
 *     ctx.drawImage(video) copies raw pixels at source quality — no re-encoding.
 *     This is exactly like screenshotting a video frame. Crisp, lossless.
 *
 *   LAYER 2 — HTML-Rendered Text Overlay:
 *     We DO NOT draw text on canvas manually (that breaks fonts).
 *     Instead, we let the browser render the poem text in an actual
 *     HTML <div> (with the real Tailwind classes and web fonts you designed),
 *     then use html-to-image to capture it as a transparent PNG, ONCE.
 *     We then stamp that pre-captured PNG over every single video frame.
 *     This means the typography always matches because it WAS rendered by
 *     the browser's own CSS engine.
 *
 * THE OUTPUT:
 *   - We use the browser's native MediaRecorder API to record what gets
 *     drawn on the canvas into a video file.
 *   - We target 24fps (like a cinema, not jarring 30fps).
 *   - We encode at 16 Mbps — that's about the same quality as a YouTube 1080p upload.
 *   - On Chrome/Edge: outputs MP4 (widely supported, Instagram-ready).
 *   - On Firefox/Safari: outputs WebM (also fine, but might need conversion for some apps).
 *
 * INFRASTRUCTURE COST:
 *   - 100% client-side. Zero server costs. Zero cloud. The user's phone/laptop
 *     GPU does all the work. A 10-second export takes ~10 real seconds because
 *     we record in real-time at 24fps. A 30-second export takes ~30 seconds.
 */

import { toPng } from "html-to-image";

export interface VideoExportOptions {
  videoSrc: string;       // R2 URL of the background video (…/bg-videos/1.mp4)
  overlayEl: HTMLElement; // The hidden HTML element containing the styled poem text/doodle/author
  durationSecs: number;   // How long the output video should be (5–30 seconds, user-controlled)
  onProgress?: (pct: number) => void; // Called every frame so the UI can show a progress bar
}

const WIDTH = 1080;   // Portrait 9:16 — perfect for Instagram Reels, TikTok, Stories
const HEIGHT = 1920;
const FPS = 24;       // 24fps = cinematic. 30fps is TV. 24fps feels more "film".

/**
 * loadVideo()
 *
 * Creates a hidden <video> element in memory (not visible on screen),
 * loads the video file into it, and waits until the browser has downloaded
 * enough of the file to start playing.
 *
 * We need the video to be fully ready before we start recording,
 * otherwise the first frames would be blank or black.
 */
function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    // crossOrigin="anonymous" is required now that videos are served from the
    // cross-origin Cloudflare R2 CDN. Without it, ctx.drawImage(video) taints
    // the canvas and the MediaRecorder export produces a blank output.
    // R2 must also respond with Access-Control-Allow-Origin: * (or the app origin)
    // for this to work — configure CORS on the R2 bucket if you haven't already.
    video.crossOrigin = "anonymous";
    video.src = src;
    video.muted = true;      // Must be muted or browsers block autoplay
    video.playsInline = true;
    video.loop = true;       // Loop so it never ends mid-export
    video.oncanplaythrough = () => resolve(video);
    video.onerror = reject;
    video.load();
  });
}

/**
 * exportPoetryVideo()
 *
 * The main function. Call this to kick off a full video recording.
 *
 * STEP-BY-STEP FLOW:
 *
 * 1. Capture the text overlay as a transparent PNG using html-to-image.
 *    This happens ONCE upfront, not every frame. It reads the actual
 *    computed CSS of the overlay div — fonts, colors, positioning, everything.
 *
 * 2. Convert that PNG into an ImageBitmap. An ImageBitmap lives on the
 *    GPU (not in CPU memory), so drawing it 24 times per second is nearly free.
 *
 * 3. Load and play the background video in memory.
 *
 * 4. Create a <canvas> at 1080x1920. This is our "digital film reel".
 *    Nothing on this canvas is ever shown to the user — it's purely
 *    a staging area for the recording pipeline.
 *
 * 5. canvas.captureStream(24) turns the canvas into a live video stream.
 *    Think of it like a webcam, but pointed at our canvas instead of a camera.
 *
 * 6. MediaRecorder wraps that stream and compresses it into a video file format.
 *    Every few milliseconds it emits a "chunk" of encoded video data.
 *    We collect all these chunks.
 *
 * 7. A setInterval fires 24 times per second. Each tick:
 *    - Draws the current video frame onto the canvas (Layer 1)
 *    - Draws the pre-captured text overlay on top (Layer 2)
 *    - Counts how many frames we've drawn so far
 *
 * 8. When frameCount reaches our target (durationSecs × 24 frames/sec),
 *    we stop the interval and tell MediaRecorder to finalize.
 *
 * 9. MediaRecorder fires onstop, we collect all the chunks into a single
 *    Blob (binary large object — just a file in memory), and return it.
 *    The calling code then converts this Blob to a download link.
 */
export async function exportPoetryVideo(
  opts: VideoExportOptions
): Promise<Blob> {
  // Step 1: Snapshot the poem text overlay as a transparent PNG.
  // html-to-image renders the div using the browser's own renderer — so
  // all your Tailwind classes, Google Fonts, opacity, letter-spacing
  // are all preserved perfectly in the PNG output.
  const overlayDataUrl = await toPng(opts.overlayEl, {
    cacheBust: true,
    width: WIDTH,
    height: HEIGHT,
    pixelRatio: 1, // 1:1 pixel density — no Retina scaling, we want exact 1080x1920
    style: {
      background: "transparent", // Force transparent background so only text shows
    },
  });

  // Step 2: Convert the PNG data URL → Blob → ImageBitmap (GPU-resident image).
  // ImageBitmap is faster than a regular Image() because it's pre-decoded
  // and stored in GPU memory, making drawImage() calls nearly instant.
  const overlayBlob = await fetch(overlayDataUrl).then(r => r.blob());
  const overlayBitmap = await createImageBitmap(overlayBlob);

  // Step 3: Load the background video and start playing it.
  const video = await loadVideo(opts.videoSrc);
  await video.play();

  // Step 4: Create the off-screen compositor canvas.
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d", {
    alpha: false,              // No transparency needed — video fills every pixel
    willReadFrequently: false, // We only write pixels, never read them back (keeps GPU path active)
  })!;

  const totalFrames = opts.durationSecs * FPS;
  let frameCount = 0;

  // Step 5: Pick the best available video codec for this browser.
  // - MP4/AVC1 (H.264): Best compatibility. Works on Instagram, iMessage, everywhere.
  //   Available on Chrome, Edge, and most Chromium browsers.
  // - WebM/VP9: Google's open codec. Works great but not natively on Apple Mail/iMessage.
  //   Available on Firefox and older Chrome.
  // - WebM (baseline): Fallback for when nothing else is available.
  const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
    ? "video/mp4;codecs=avc1"
    : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  // Step 6: Wire up the recording pipeline.
  // captureStream(FPS) creates a live "video feed" from the canvas at our target framerate.
  const stream = canvas.captureStream(FPS);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 16_000_000, // 16 Mbps = very high quality.
                                    // For reference: Instagram Stories encode at ~3 Mbps.
                                    // YouTube 1080p is ~8 Mbps. We over-encode so the
                                    // user can re-share without generational quality loss.
  });

  // Collect every compressed video chunk as MediaRecorder emits them
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      // Recording is done. Clean up resources.
      video.pause();
      overlayBitmap.close(); // Free GPU memory — important on mobile!
      // Merge all the chunks into a single video file Blob.
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = reject;
    recorder.start();

    // Step 7: The compositing loop — fires 24 times per second.
    const interval = setInterval(() => {
      // LAYER 1: Draw the video frame with object-fit: cover behavior.
      // The naive ctx.drawImage(video, 0, 0, WIDTH, HEIGHT) would STRETCH the
      // video to fill the canvas regardless of its original shape — exactly what
      // causes the squeeze. If the source video is 16:9 landscape and the canvas
      // is 9:16 portrait, a naive draw squashes it horizontally.
      //
      // Instead, we replicate how CSS object-fit: cover works:
      //   1. Scale the video UP uniformly until it is large enough to COVER
      //      the full canvas in both dimensions (like zooming in on a photo to fill a frame)
      //   2. Center-crop — trim the sides/top/bottom that spill outside the canvas
      //
      // This means we only draw a SUBSET of the source video (sx, sy, sWidth, sHeight)
      // and that subset fills the full destination canvas (0, 0, WIDTH, HEIGHT).
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      const scale = Math.max(WIDTH / vw, HEIGHT / vh); // scale factor so video covers canvas
      const drawW = vw * scale;
      const drawH = vh * scale;
      const offsetX = (WIDTH - drawW) / 2;   // negative offset centers the wider dimension
      const offsetY = (HEIGHT - drawH) / 2;
      ctx.drawImage(video, offsetX, offsetY, drawW, drawH);

      // LAYER 2: Stamp the pre-captured text PNG on top, at full canvas size.
      // Since the overlay is transparent everywhere except the text/doodle/author,
      // this blends cleanly over the video background.
      ctx.drawImage(overlayBitmap, 0, 0, WIDTH, HEIGHT);

      frameCount++;
      opts.onProgress?.(Math.round((frameCount / totalFrames) * 100));

      if (frameCount >= totalFrames) {
        clearInterval(interval);
        recorder.stop(); // Tells MediaRecorder to finalize and fire onstop
      }
    }, 1000 / FPS); // 1000ms / 24 = ~41.6ms per frame
  });
}
