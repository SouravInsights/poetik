"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  style?: React.CSSProperties;
  className?: string;
}

export function LazyVideo({ src, style, className }: LazyVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // We track if the card is within 600px of the visible screen (horizontal padding)
  const [isNearScreen, setIsNearScreen] = useState(false);

  useEffect(() => {
    // We use InteractionObserver to heavily preserve hardware decoders.
    // Instead of auto-loading 24 videos at once, we only mount videos
    // that are immediately on-screen or just about to scroll on-screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsNearScreen(entry.isIntersecting);
        });
      },
      { 
        // 600px horizontal buffer gives the video time to load before 
        // the marquee pulls it fully into the viewport.
        rootMargin: "0px 600px 0px 600px" 
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isNearScreen && videoRef.current) {
      if (!videoRef.current.src) {
        videoRef.current.src = src;
      }
      videoRef.current.play().catch(() => {});
    } else if (!isNearScreen && videoRef.current) {
      videoRef.current.pause();
      // To strictly prevent memory leaks and completely free up the hardware
      // decoder on Safari/iOS, we remove the source entirely when out of frame.
      videoRef.current.removeAttribute("src");
      videoRef.current.load();
    }
  }, [isNearScreen, src]);

  return (
    <div ref={containerRef} style={{ ...style, position: "absolute", inset: 0 }} className={className}>
      {isNearScreen && (
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            ...style
          }}
        />
      )}
    </div>
  );
}
