import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

export function useParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Extremely smooth, heavy physics so it feels like liquid glass moving
  const springConfig = { damping: 40, stiffness: 100, mass: 0.8 }; 
  const bgX = useSpring(mouseX, springConfig);
  const bgY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate offset from center of screen (-1 to 1)
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2;
      // Negative multipliers push the background strictly away from movement 
      mouseX.set(xPct * -15);
      mouseY.set(yPct * -15);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const xPct = (touch.clientX / window.innerWidth - 0.5) * 2;
        const yPct = (touch.clientY / window.innerHeight - 0.5) * 2;
        mouseX.set(xPct * -15);
        mouseY.set(yPct * -15);
      }
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma is left/right (-90 to 90). Clamp tilt to normal usage.
        const xPct = Math.max(-1, Math.min(1, e.gamma / 30));
        // beta is front/back (0 is flat face up, 90 is vertically upright).
        const yPct = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
        
        // Push slightly harder on mobile gyroscope to make the effect apparent
        mouseX.set(xPct * -18);
        mouseY.set(yPct * -18);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, [mouseX, mouseY]);

  return { bgX, bgY };
}
