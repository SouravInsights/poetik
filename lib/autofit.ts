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
const LEADING_CANDIDATES = [1.6, 1.5, 1.42];

/** How much bigger a tighter leading must make the font before we accept it. */
const LEADING_GAIN_THRESHOLD = 4;

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
}

export interface FitResult {
  /** Chosen integer font size in CSS px. */
  size: number;
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
function maxFittingSize(
  input: FitInput,
  lineHeight: number
): number {
  const { text, width, height, fontFamily, letterSpacing, maxSize, minSize } =
    input;

  // If even the floor overflows, return the floor (we refuse to go smaller —
  // unreadable poetry is worse than a poem that needs a taller canvas).
  if (
    measureHeight(text, width, fontFamily, minSize, lineHeight, letterSpacing) >
    height
  ) {
    return minSize;
  }
  if (
    measureHeight(text, width, fontFamily, maxSize, lineHeight, letterSpacing) <=
    height
  ) {
    return maxSize;
  }

  let lo = minSize;
  let hi = maxSize;
  let best = minSize;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (
      measureHeight(text, width, fontFamily, mid, lineHeight, letterSpacing) <=
      height
    ) {
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
 * Cheap for short text: the first candidate returns the ceiling immediately.
 */
export function fitText(input: FitInput): FitResult {
  const { text, width, height, maxSize } = input;

  // Nothing to fit yet — keep the design's full dramatic size.
  if (!text || width <= 0 || height <= 0) {
    return { size: maxSize, lineHeight: LEADING_CANDIDATES[0], height: 0 };
  }

  let chosen: FitResult = {
    size: input.minSize,
    lineHeight: LEADING_CANDIDATES[0],
    height: 0,
  };
  let initialized = false;

  for (const lineHeight of LEADING_CANDIDATES) {
    const size = maxFittingSize(input, lineHeight);
    // Accept the first (loosest) result always; after that, a tighter leading
    // must buy a real size win to be worth the lost breathing room.
    if (!initialized || size > chosen.size + LEADING_GAIN_THRESHOLD) {
      chosen = { size, lineHeight, height: 0 };
      initialized = true;
    }
    // Once we can render at the ceiling, no tighter leading can improve it.
    if (size >= maxSize) break;
  }

  chosen.height = measureHeight(
    text,
    width,
    input.fontFamily,
    chosen.size,
    chosen.lineHeight,
    input.letterSpacing
  );

  return chosen;
}
