export interface Font {
  name: string;
  variable: string;
  class: string;
  label: string;
}

export interface Paper {
  id: string;
  path?: string;
  color?: string;
  type: "color" | "image" | "video";
  label: string;
  theme?: "light" | "dark";
  /** Pre-generated thumbnail for video papers (served as a plain image). */
  poster?: string;
}

export interface Tone {
  id: string;
  class: string;
  ink: "ink-light" | "ink-dark";
  label: string;
}

export const FONTS: Font[] = [
  {
    name: "Cormorant Garamond",
    variable: "--font-cormorant",
    class: "font-cormorant",
    label: "Cormorant",
  },
  {
    name: "IM Fell English",
    variable: "--font-fell",
    class: "font-fell",
    label: "Fell",
  },
  {
    name: "Playfair Display",
    variable: "--font-playfair",
    class: "font-playfair",
    label: "Playfair",
  },
  {
    name: "Lora",
    variable: "--font-lora",
    class: "font-lora",
    label: "Lora",
  },
];

const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_URL ?? "";

// Default background for a fresh session: the cinematic video, poster-bridged
// so there's no black flash while it buffers. Matches the landing hero's video.
export const DEFAULT_PAPER: Paper = {
  id: "14.mp4",
  path: `${R2_BASE_URL}/bg-videos/14.mp4`,
  poster: `${R2_BASE_URL}/bg-videos/14-poster.webp`,
  type: "video",
  label: "Video 14",
  theme: "dark",
};

export const PAPERS: Paper[] = [
  { id: "void", color: "#0D0B09", type: "color", label: "Void", theme: "dark" },
  { id: "paper-1", path: "/papers/paper-1.jpg", type: "image", label: "Paper 1", theme: "light" },
  { id: "paper-2", path: "/papers/paper-2.jpg", type: "image", label: "Paper 2", theme: "light" },
  { id: "paper-3", path: "/papers/paper-3.jpg", type: "image", label: "Paper 3", theme: "light" },
  { id: "paper-4", path: "/papers/paper-4.jpg", type: "image", label: "Paper 4", theme: "light" },
  { id: "paper-5", path: "/papers/paper-5.jpg", type: "image", label: "Paper 5", theme: "light" },
  { id: "paper-6", path: "/papers/paper-6.jpg", type: "image", label: "Paper 6", theme: "light" },
  { id: "paper-7", path: "/papers/paper-7.jpg", type: "image", label: "Paper 7", theme: "light" },
  { id: "paper-8", path: "/papers/paper-8.jpg", type: "image", label: "Paper 8", theme: "light" },
  { id: "paper-9", path: "/papers/paper-9.jpg", type: "image", label: "Paper 9", theme: "light" },
  { id: "paper-10", path: "/papers/paper-10.jpg", type: "image", label: "Paper 10", theme: "light" },
  { id: "paper-11", path: "/papers/paper-11.jpg", type: "image", label: "Paper 11", theme: "light" },
  { id: "paper-12", path: "/papers/paper-12.jpg", type: "image", label: "Paper 12", theme: "light" },
];

export const TONES: Tone[] = [
  { id: "void", class: "bg-[#0e0c0a]", ink: "ink-light", label: "Void" },
  { id: "night", class: "bg-gradient-to-br from-[#0f0d14] via-[#1a1626] to-[#0d0b12]", ink: "ink-light", label: "Night" },
  { id: "dusk", class: "bg-gradient-to-br from-[#150d05] via-[#2a1508] to-[#120b04]", ink: "ink-light", label: "Dusk" },
  { id: "slate", class: "bg-gradient-to-br from-[#0e1219] via-[#182030] to-[#0b0f18]", ink: "ink-light", label: "Slate" },
  { id: "paper", class: "bg-[#f0e8d8]", ink: "ink-dark", label: "Paper" },
  { id: "cream", class: "bg-[#ede0c4]", ink: "ink-dark", label: "Cream" },
  { id: "linen", class: "bg-[#d8ccb4]", ink: "ink-dark", label: "Linen" },
];

export const DOODLES: string[] = [
  "bird-1.svg", "bird-5.svg", "bird-13.svg",
  "botanical-1.svg", "botanical-20.svg", "botanical-27.svg",
  "feather-1.svg", "feather-6.svg",
  "fire-2.svg", "fire-9.svg",
  "flowers-1.svg", "flowers-10.svg", "flowers-32.svg",
  "moon-1.svg", "moon-3.svg", "moon-6.svg",
  "sun-6.svg", "sun-12.svg",
];


