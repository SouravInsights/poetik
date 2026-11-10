/**
 * lib/autofit.ts
 *
 * CONTENT-AWARE POEM TYPOGRAPHY ("auto-fit")
 * ==========================================
 *
 * The problem this solves:
 * Poetik used to render every poem at a single fixed size — clamp(26px…52px)
 * on the canvas, a hard 80px in the 1080×1920 export. That is perfect for a
 * two-line shayari and catastrophic for a five-sher ghazal: the block grows
 * taller than the canvas and gets silently clipped by `overflow: hidden`.
 *
 * The fix is invisible. We measure the *actual* rendered text — with the
 * real font, width, letter-spacing and wrapping — and pick the largest font
 * size at which the whole composition still fits the box. Short quotes keep
 * the big, dramatic type they always had; long poems gracefully step down.
 * The user does nothing.
 *
 * HOW MEASUREMENT WORKS:
 * Text wrapping is a browser layout decision, not something we can compute
 * accurately from character counts (kerning, italic overhang, font metrics).
 * So we render the text into a single hidden probe <div> pinned off-screen
 * with `position: fixed` (out of flow, so it never affects the page), set it
 * to the exact width and font, and read its height. We reuse one probe for
 * every measurement to avoid DOM churn.
 *
 * FINDING THE SIZE:
 * Height grows monotonically with font size (bigger glyphs → same or more
 * wrapped lines), so we binary-search the integer size between a floor and a
 * ceiling in ~6 measurements instead of scanning all 30+ sizes.
 *
 * LEADING (line-height):
 * Poetry needs air, but a 20-line poem can trade a little air for a much
 * larger, more legible font. We test a few leadings from loose to tight and
 * only accept a tighter one if it buys a *meaningful* size increase, so short
 * poems keep the generous 1.6 they were designed with.
 */

/** Line-height candidates, loosest first. 1.6 is the design's canonical value. */
/**
 * Optical leading.
 *
 * Type needs less air as it grows: a 16px line wants ~1.6, while a 52px
 * display line starts to look unmoored at the same ratio. A single fixed
 * line-height (the old 1.6 everywhere) is why long line breaks felt so vast.
 * We scale leading down from 1.6 at text size 18 to 1.32 at 90, which is
 * roughly how a careful print typesetter sets display poetry.
 */
const MAX_LEADING = 1.6;
const MIN_LEADING = 1.32;
const LEADING_REF_SIZE = 18; // at or below this, full air
const LEADING_SLOPE = 0.0039; // leading lost per px of type growth

function opticalLeading(size: number): number {
  return Math.min(
    MAX_LEADING,
    Math.max(MIN_LEADING, MAX_LEADING - (size - LEADING_REF_SIZE) * LEADING_SLOPE)
  );
}

/** Absolute bounds so no combination of scale + base can produce absurd type. */
const ABSOLUTE_MIN_SIZE = 12;
const ABSOLUTE_MAX_SIZE = 120;

/** User spacing multipliers may lean the optical leading tighter or looser. */
const ABSOLUTE_MIN_LEADING = 1.15;
const ABSOLUTE_MAX_LEADING = 2.1;

function applyLineScale(lineHeight: number, lineScale: number): number {
  return Math.min(
    ABSOLUTE_MAX_LEADING,
    Math.max(ABSOLUTE_MIN_LEADING, lineHeight * lineScale)
  );
}

function clampSize(size: number): number {
  return Math.round(Math.min(ABSOLUTE_MAX_SIZE, Math.max(ABSOLUTE_MIN_SIZE, size)));
}

export interface FitInput {
  text: string;
  /** Content-box width available to the text, in CSS px. */
  width: number;
  /** Content-box height available to the text, in CSS px. */
  height: number;
  /** CSS font-family value, e.g. `var(--font-lora)`. */
  fontFamily: string;
  /** CSS letter-spacing value. Must match the rendered element. */
  letterSpacing: string;
  maxSize: number;
  minSize: number;
  /**
   * User's size preference, multiplying the auto-fitted size. 1 = pure auto.
   * Applied AFTER fitting, so the user's choice is honoured exactly; if that
   * makes the block taller than `height`, callers decide what to do (the
   * editor scrolls, the export clamps back to baseSize so it never clips).
   */
  scale?: number;
  /**
   * User spacing preference, multiplying the optical leading. 1 = auto.
   * Fed into the fit so tighter spacing genuinely buys a larger font rather
   * than merely shrinking the block.
   */
  lineScale?: number;
}

export interface FitResult {
  /** Chosen integer font size in CSS px (auto size × scale). */
  size: number;
  /** The auto-fitted size before the user's scale was applied. */
  baseSize: number;
  /** Chosen line-height ratio. */
  lineHeight: number;
  /**
   * Measured height (px) of the text block at the chosen size/leading. Used
   * to size the input layer, which keeps it pixel-locked to the visual layer
   * without relying on `scrollHeight` (which never shrinks once grown).
   */
  height: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// The hidden measurement probe (module-level singleton, reused forever)
// ─────────────────────────────────────────────────────────────────────────────

let probe: HTMLDivElement | null = null;

function ensureProbe(): HTMLDivElement | null {
  if (typeof document === "undefined") return null;
  if (probe && probe.isConnected) return probe;

  probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = [
    "position:fixed",
    "top:0",
    "left:-99999px",
    "width:0",
    "height:auto",
    "visibility:hidden",
    "pointer-events:none",
    "white-space:pre-wrap",
    "overflow-wrap:break-word",
    "word-break:break-word",
    "box-sizing:border-box",
    "margin:0",
    "padding:0",
    "border:0",
    "font-style:italic",
    "font-weight:400",
  ].join(";");
  document.body.appendChild(probe);
  return probe;
}

function measureHeight(
  text: string,
  width: number,
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  letterSpacing: string
): number {
  const el = ensureProbe();
  if (!el) return 0;

  el.textContent = text;
  el.style.width = `${width}px`;
  el.style.fontFamily = fontFamily;
  el.style.fontSize = `${fontSize}px`;
  el.style.lineHeight = String(lineHeight);
  el.style.letterSpacing = letterSpacing;

  // Force a synchronous layout read on the isolated fixed probe.
  return el.getBoundingClientRect().height;
}

/** Largest integer size in [minSize, maxSize] whose measured height ≤ height. */
function maxFittingSize(input: FitInput): number {
  const {
    text,
    width,
    height,
    fontFamily,
    letterSpacing,
    maxSize,
    minSize,
    lineScale = 1,
  } = input;

  // Height at a candidate size, using that size's own optical leading.
  const heightAt = (size: number) =>
    measureHeight(
      text,
      width,
      fontFamily,
      size,
      applyLineScale(opticalLeading(size), lineScale),
      letterSpacing
    );

  // If even the floor overflows, return the floor (we refuse to go smaller —
  // unreadable poetry is worse than a poem that needs a taller canvas).
  if (heightAt(minSize) > height) return minSize;
  if (heightAt(maxSize) <= height) return maxSize;

  let lo = minSize;
  let hi = maxSize;
  let best = minSize;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (heightAt(mid) <= height) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

/**
 * Compute the best (size, lineHeight) pair for a block of text.
 *
 * Leading is optical (a function of the final size), and the search evaluates
 * each candidate size at its own leading, so we never fit against one leading
 * and then render at another.
 */
export function fitText(input: FitInput): FitResult {
  const { text, width, height, maxSize, scale = 1, lineScale = 1 } = input;

  // Nothing to fit yet — keep the design's full dramatic size.
  if (!text || width <= 0 || height <= 0) {
    const size = clampSize(maxSize * scale);
    return {
      size,
      baseSize: maxSize,
      lineHeight: applyLineScale(opticalLeading(size), lineScale),
      height: 0,
    };
  }

  const baseSize = maxFittingSize(input);
  const size = clampSize(baseSize * scale);
  const lineHeight = applyLineScale(opticalLeading(size), lineScale);
  const measured = measureHeight(
    text,
    width,
    input.fontFamily,
    size,
    lineHeight,
    input.letterSpacing
  );

  return { size, baseSize, lineHeight, height: measured };
}
