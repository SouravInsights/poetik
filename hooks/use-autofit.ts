"use client";

/**
 * hooks/use-autofit.ts
 *
 * React binding for the auto-fit engine in lib/autofit.ts.
 *
 * It re-runs the fit whenever the text, font, or available box changes, and
 * once more after web fonts finish loading (the first measurement can land
 * before the real typeface is ready, which would size against a fallback
 * font). Layout effects are used so a pasted poem never flashes at the old
 * size for a frame.
 */

import { useEffect, useLayoutEffect, useState } from "react";
import { Font } from "@/lib/constants";
import { fitText, FitResult } from "@/lib/autofit";

// useLayoutEffect warns during SSR; fall back to useEffect on the server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface UseAutoFitOptions {
  text: string;
  font: Font;
  width: number;
  height: number;
  maxSize: number;
  minSize: number;
  letterSpacing: string;
}

export function useAutoFit({
  text,
  font,
  width,
  height,
  maxSize,
  minSize,
  letterSpacing,
}: UseAutoFitOptions): FitResult {
  const [result, setResult] = useState<FitResult>({
    size: maxSize,
    lineHeight: 1.6,
    height: 0,
  });

  useIsoLayoutEffect(() => {
    let cancelled = false;

    const run = () => {
      const next = fitText({
        text,
        width,
        height,
        fontFamily: `var(${font.variable})`,
        letterSpacing,
        maxSize,
        minSize,
      });
      if (cancelled) return;
      setResult((prev) =>
        prev.size === next.size &&
        prev.lineHeight === next.lineHeight &&
        prev.height === next.height
          ? prev
          : next
      );
    };

    run();

    // The first measurement can land before the real typeface is ready and
    // fit against a fallback font — re-fit once web fonts settle.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        if (!cancelled) run();
      });
    }

    return () => {
      cancelled = true;
    };
  }, [text, font.variable, width, height, maxSize, minSize, letterSpacing]);

  return result;
}
