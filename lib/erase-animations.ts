export interface ErasePhysics {
  animate: {
    opacity: number;
    filter: string;
    y: number;
    x: number;
    scale?: number;
    scaleY?: number;
    scaleX?: number;
    rotate: number;
  };
  transition: {
    duration?: number;
    ease?: string | [number, number, number, number];
    delay?: number;
    default?: { 
      duration: number; 
      ease: string | [number, number, number, number]; 
      delay: number 
    };
    opacity?: { 
      duration: number; 
      ease: string | [number, number, number, number]; 
      delay: number 
    };
  };
}

/**
 * Calculates the exact cinematic physics trajectory for a single character 
 * during the Poetik "Erase/Clear" wipe effect.
 * 
 * We use an index-based (deterministic) pseudo-randomization approach so that
 * the stagger and motion look 100% natural without causing hydration jumps or 
 * requiring heavy Javascript math.random() calls during rapid typing.
 * 
 * @param variant - Which of the 3 wipe variations to use
 * @param lineIndex - The vertical line number of the character
 * @param wordIndex - The word number within that line
 * @param charIndex - The exact character position within the word
 * @param isClearing - Boolean trigger if the wipe is currently active
 */
export function getEraseAnimationPhysics(
  variant: 1 | 2 | 3,
  lineIndex: number,
  wordIndex: number,
  charIndex: number,
  isClearing: boolean
): ErasePhysics {
  // A completely unique ID for heavily randomized scattering
  const uniqueEntropyId = lineIndex * 1000 + wordIndex * 100 + charIndex;
  
  // A perfectly linear index across the page for sweeping left-to-right effects
  const linearSweepStagger = (lineIndex * 0.08) + (wordIndex * 0.03) + (charIndex * 0.015);

  if (variant === 1) {
    // ==========================================
    // V1: EXPANSIVE GHOST (Cinematic Diffusion)
    // ==========================================
    // Letters scale up massively, blur heavily, and drift away before 
    // their opacity decays. Beautiful, slow, and dramatic.
    // ==========================================
    const scatterDistanceY = -40 - (uniqueEntropyId % 4) * 10;
    const scatterDistanceX = ((uniqueEntropyId % 7) - 3) * 15;
    const expansionScale = 1.6 + (uniqueEntropyId % 4) * 0.2;
    const atmosphericSpin = ((uniqueEntropyId % 5) - 2) * 10;
    const randomStaggerDelay = (uniqueEntropyId % 10) * 0.03;

    return {
      animate: isClearing ? {
        opacity: 0, 
        filter: "blur(8px)", 
        y: scatterDistanceY, 
        x: scatterDistanceX, 
        scale: expansionScale, 
        rotate: atmosphericSpin
      } : { opacity: 1, filter: "blur(0px)", y: 0, x: 0, scale: 1, rotate: 0 },
      transition: {
        default: { duration: 2.5 + (uniqueEntropyId % 3) * 0.4, ease: "easeOut", delay: randomStaggerDelay },
        opacity: { duration: 1.2, ease: "easeIn", delay: randomStaggerDelay } // Opacity dies faster to prevent dark smudges
      }
    };
  } else if (variant === 2) {
    // ==========================================
    // V2: WEEPING MELT (Gravity/Rain Drag)
    // ==========================================
    // Letters lock their X-axis and drop strictly downwards while vertically 
    // stretching, mimicking heavy wet ink running down a page in the rain.
    // ==========================================
    const verticalDrop = 60 + (uniqueEntropyId % 5) * 40;
    const verticalStretch = 3; // 3x height
    const horizontalSqueeze = 0.5; // halves horizontally
    const meltStaggerDelay = (uniqueEntropyId % 8) * 0.04;

    return {
      animate: isClearing ? {
        opacity: 0, 
        filter: "blur(6px)", 
        y: verticalDrop, 
        x: 0, 
        scaleY: verticalStretch, 
        scaleX: horizontalSqueeze, 
        rotate: 0
      } : { opacity: 1, filter: "blur(0px)", y: 0, x: 0, scaleY: 1, scaleX: 1, rotate: 0 },
      transition: {
        duration: 1.5 + (uniqueEntropyId % 6) * 0.2, 
        ease: "easeIn", 
        delay: meltStaggerDelay
      }
    };
  } else {
    // ==========================================
    // V3: AUTUMN GUST (Aerodynamic Sweep)
    // ==========================================
    // A highly directional wind blast that rips over the poem strictly from 
    // left-to-right. Letters undergo aerodynamic tumbling & vertical flutter.
    // ==========================================
    const chaoticFlutterY = -40 + (uniqueEntropyId % 5) * 20; 
    const blowDistanceX = 180 + (uniqueEntropyId % 4) * 50; 
    const aerodynamicShrink = 0.6 + (uniqueEntropyId % 3) * 0.2; 
    const isSpinningBackwards = uniqueEntropyId % 2 === 0 ? 1 : -1;
    const violentTumbleSpin = isSpinningBackwards * (180 + (uniqueEntropyId % 5) * 60);

    return {
      animate: isClearing ? {
        opacity: 0, 
        filter: "blur(5px)", 
        y: chaoticFlutterY, 
        x: blowDistanceX, 
        scale: aerodynamicShrink, 
        rotate: violentTumbleSpin
      } : { opacity: 1, filter: "blur(0px)", y: 0, x: 0, scale: 1, rotate: 0 },
      transition: {
        duration: 1.2 + (uniqueEntropyId % 3) * 0.2, // Snappy fast blast
        ease: "easeIn", // Accelerates deeper into the wind
        delay: linearSweepStagger * 0.6 // Rip through the lines ~40% faster
      }
    };
  }
}
