// ─── Glassmorphism Theme System — BoujlilCar Rental ─────────────────────────
// 12 themes crafted for a premium car rental brand
// Categories: Luxury (executive/prestige) · Road (performance/sport) · Journey (travel/adventure)
// ─────────────────────────────────────────────────────────────────────────────

export type ThemeKey =
  // Luxury
  | "carbon"
  | "goldRush"
  | "titanium"
  | "phantom"
  // Road
  | "redline"
  | "blaze"
  | "cobalt"
  | "stealth"
  // Journey
  | "sahara"
  | "azure"
  | "arctic"
  | "horizon";

export type ThemeDef = {
  label: string;
  category: "Luxury" | "Road" | "Journey";
  /** Full-page gradient — admin panel background */
  bg: string;
  /** Public site full-page background gradient */
  siteBg: string;
  /** Sticky header / sidebar glass background (semi-transparent) */
  headerBg: string;
  /** Glass panel background — for cards, sidebar, modals */
  glass: string;
  /** Glass panel border */
  glassBorder: string;
  /** Accent — buttons, badges, active states */
  accent: string;
  accentHover: string;
  /** Text on top of accent background */
  accentText: string;
  /** Small preview gradient shown in ThemePicker */
  preview: string;
};

export const themes: Record<ThemeKey, ThemeDef> = {

  // ══════════════════════════════════════════════════════════════════════════
  // LUXURY — carbon · gold rush · titanium · phantom
  // Inspired by: carbon fiber dashboards, executive black sedans, prestige fleet
  // ══════════════════════════════════════════════════════════════════════════

  carbon: {
    label: "Carbon",
    category: "Luxury",
    bg: "linear-gradient(145deg, #060809 0%, #0f1418 35%, #1a2230 65%, #060809 100%)",
    siteBg: "linear-gradient(160deg, #162130 0%, #1e3045 30%, #243d5c 55%, #0c1620 80%, #030508 100%)",
    headerBg: "rgba(6, 8, 9, 0.62)",
    glass: "rgba(148, 163, 184, 0.08)",
    glassBorder: "rgba(148, 163, 184, 0.18)",
    accent: "#94a3b8",
    accentHover: "#cbd5e1",
    accentText: "#060809",
    preview: "linear-gradient(135deg, #060809 35%, #1a2230 65%, #94a3b8 100%)",
  },

  goldRush: {
    label: "Gold Rush",
    category: "Luxury",
    bg: "linear-gradient(145deg, #050408 0%, #0e0c1a 35%, #1a1530 65%, #050408 100%)",
    siteBg: "linear-gradient(160deg, #1a1040 0%, #251848 30%, #362260 55%, #100c2a 80%, #040208 100%)",
    headerBg: "rgba(5, 4, 8, 0.62)",
    glass: "rgba(245, 158, 11, 0.09)",
    glassBorder: "rgba(245, 158, 11, 0.22)",
    accent: "#f59e0b",
    accentHover: "#fbbf24",
    accentText: "#050408",
    preview: "linear-gradient(135deg, #050408 35%, #362260 65%, #f59e0b 100%)",
  },

  titanium: {
    label: "Titanium",
    category: "Luxury",
    bg: "linear-gradient(145deg, #080c10 0%, #121c24 35%, #1e2e3d 65%, #080c10 100%)",
    siteBg: "linear-gradient(160deg, #1c2f40 0%, #253e55 30%, #2e506a 55%, #101e2c 80%, #040810 100%)",
    headerBg: "rgba(8, 12, 16, 0.62)",
    glass: "rgba(203, 213, 225, 0.07)",
    glassBorder: "rgba(203, 213, 225, 0.16)",
    accent: "#e2e8f0",
    accentHover: "#f8fafc",
    accentText: "#080c10",
    preview: "linear-gradient(135deg, #080c10 35%, #1e2e3d 65%, #e2e8f0 100%)",
  },

  phantom: {
    label: "Phantom",
    category: "Luxury",
    bg: "linear-gradient(145deg, #04030a 0%, #09070f 35%, #130f22 65%, #04030a 100%)",
    siteBg: "linear-gradient(160deg, #130a2e 0%, #1a0f3d 30%, #251450 55%, #0c0720 80%, #020108 100%)",
    headerBg: "rgba(4, 3, 10, 0.65)",
    glass: "rgba(196, 181, 253, 0.08)",
    glassBorder: "rgba(196, 181, 253, 0.18)",
    accent: "#c4b5fd",
    accentHover: "#ddd6fe",
    accentText: "#04030a",
    preview: "linear-gradient(135deg, #04030a 35%, #251450 65%, #c4b5fd 100%)",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ROAD — redline · blaze · cobalt · stealth
  // Inspired by: racing red, burnt orange, BMW blue, stealth fighter jets
  // ══════════════════════════════════════════════════════════════════════════

  redline: {
    label: "Redline",
    category: "Road",
    bg: "linear-gradient(145deg, #0a0000 0%, #1c0404 35%, #380808 65%, #0a0000 100%)",
    siteBg: "linear-gradient(160deg, #450a0a 0%, #7f1d1d 30%, #dc2626 55%, #2d0404 80%, #060000 100%)",
    headerBg: "rgba(10, 0, 0, 0.58)",
    glass: "rgba(220, 38, 38, 0.10)",
    glassBorder: "rgba(252, 165, 165, 0.22)",
    accent: "#dc2626",
    accentHover: "#ef4444",
    accentText: "#ffffff",
    preview: "linear-gradient(135deg, #0a0000 35%, #7f1d1d 65%, #dc2626 100%)",
  },

  blaze: {
    label: "Blaze",
    category: "Road",
    bg: "linear-gradient(145deg, #0c0600 0%, #1e1000 35%, #3d2000 65%, #0c0600 100%)",
    siteBg: "linear-gradient(160deg, #431407 0%, #7c2d12 30%, #ea580c 55%, #2c1003 80%, #060300 100%)",
    headerBg: "rgba(12, 6, 0, 0.58)",
    glass: "rgba(234, 88, 12, 0.10)",
    glassBorder: "rgba(253, 186, 116, 0.22)",
    accent: "#ea580c",
    accentHover: "#f97316",
    accentText: "#ffffff",
    preview: "linear-gradient(135deg, #0c0600 35%, #7c2d12 65%, #ea580c 100%)",
  },

  cobalt: {
    label: "Cobalt",
    category: "Road",
    bg: "linear-gradient(145deg, #010510 0%, #060d22 35%, #0c1a40 65%, #010510 100%)",
    siteBg: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 30%, #2563eb 55%, #0c1a6e 80%, #010510 100%)",
    headerBg: "rgba(1, 5, 16, 0.58)",
    glass: "rgba(37, 99, 235, 0.10)",
    glassBorder: "rgba(147, 197, 253, 0.22)",
    accent: "#2563eb",
    accentHover: "#3b82f6",
    accentText: "#ffffff",
    preview: "linear-gradient(135deg, #010510 35%, #1d4ed8 65%, #2563eb 100%)",
  },

  stealth: {
    label: "Stealth",
    category: "Road",
    bg: "linear-gradient(145deg, #04080a 0%, #080f12 35%, #0f1a20 65%, #04080a 100%)",
    siteBg: "linear-gradient(160deg, #0f2830 0%, #134050 30%, #0e6c7a 55%, #061820 80%, #020608 100%)",
    headerBg: "rgba(4, 8, 10, 0.62)",
    glass: "rgba(13, 148, 136, 0.09)",
    glassBorder: "rgba(94, 234, 212, 0.20)",
    accent: "#0d9488",
    accentHover: "#14b8a6",
    accentText: "#04080a",
    preview: "linear-gradient(135deg, #04080a 35%, #0e6c7a 65%, #0d9488 100%)",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // JOURNEY — sahara · azure · arctic · horizon
  // Inspired by: Moroccan desert roads, coastal drives, mountain passes, sunset routes
  // ══════════════════════════════════════════════════════════════════════════

  sahara: {
    label: "Sahara",
    category: "Journey",
    bg: "linear-gradient(145deg, #100a02 0%, #281a06 35%, #4a2e0a 65%, #100a02 100%)",
    siteBg: "linear-gradient(160deg, #7c4508 0%, #a05c0e 30%, #c2820e 55%, #4a2804 80%, #0c0601 100%)",
    headerBg: "rgba(16, 10, 2, 0.58)",
    glass: "rgba(194, 130, 14, 0.09)",
    glassBorder: "rgba(251, 191, 36, 0.22)",
    accent: "#d97706",
    accentHover: "#f59e0b",
    accentText: "#100a02",
    preview: "linear-gradient(135deg, #100a02 35%, #a05c0e 65%, #d97706 100%)",
  },

  azure: {
    label: "Azure",
    category: "Journey",
    bg: "linear-gradient(145deg, #020c10 0%, #061820 35%, #0c2e3e 65%, #020c10 100%)",
    siteBg: "linear-gradient(160deg, #0e4d5c 0%, #0b6e80 30%, #0891b2 55%, #063848 80%, #010a0e 100%)",
    headerBg: "rgba(2, 12, 16, 0.58)",
    glass: "rgba(8, 145, 178, 0.10)",
    glassBorder: "rgba(103, 232, 249, 0.22)",
    accent: "#0891b2",
    accentHover: "#06b6d4",
    accentText: "#ffffff",
    preview: "linear-gradient(135deg, #020c10 35%, #0b6e80 65%, #0891b2 100%)",
  },

  arctic: {
    label: "Arctic",
    category: "Journey",
    bg: "linear-gradient(145deg, #040810 0%, #080f20 35%, #102040 65%, #040810 100%)",
    siteBg: "linear-gradient(160deg, #0c1a40 0%, #1240a0 30%, #1e60c8 55%, #081030 80%, #020508 100%)",
    headerBg: "rgba(4, 8, 16, 0.60)",
    glass: "rgba(125, 211, 252, 0.08)",
    glassBorder: "rgba(186, 230, 253, 0.18)",
    accent: "#7dd3fc",
    accentHover: "#bae6fd",
    accentText: "#040810",
    preview: "linear-gradient(135deg, #040810 35%, #1e60c8 65%, #7dd3fc 100%)",
  },

  horizon: {
    label: "Horizon",
    category: "Journey",
    bg: "linear-gradient(145deg, #080406 0%, #160a10 35%, #2a1220 65%, #080406 100%)",
    siteBg: "linear-gradient(160deg, #4c0d15 0%, #9a1c3c 25%, #d97706 55%, #7c1f40 78%, #100408 100%)",
    headerBg: "rgba(8, 4, 6, 0.60)",
    glass: "rgba(217, 119, 6, 0.09)",
    glassBorder: "rgba(252, 211, 77, 0.20)",
    accent: "#f59e0b",
    accentHover: "#fcd34d",
    accentText: "#080406",
    preview: "linear-gradient(135deg, #080406 30%, #9a1c3c 55%, #d97706 100%)",
  },
};

export const THEME_KEYS = Object.keys(themes) as ThemeKey[];
export const DEFAULT_THEME: ThemeKey = "carbon";
