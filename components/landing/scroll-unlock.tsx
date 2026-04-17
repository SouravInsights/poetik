"use client";

import { useEffect } from "react";

/**
 * Removes the editor's body:fixed lock so the landing page can scroll.
 * The root globals.css sets body { position: fixed; overflow: hidden; }
 * for the writing editor. This component restores scroll for the landing page.
 */
export function ScrollUnlock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "auto";
    body.style.position = "relative";
    body.style.overflow = "auto";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.position = prevBodyPosition;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return null;
}
