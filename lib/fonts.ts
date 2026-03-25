// ─── Luxury & Display Font Catalog ───────────────────────────────────────────

export interface FontDef {
  key: string;
  label: string;
  category: "Classic Serif" | "Bold Display" | "Elegant Sans" | "Body";
  googleFamily: string;
  weights: string;
  cssVar: string;
  preview: string;
}

export const HEADING_FONTS: FontDef[] = [

  // ── Classic Serif ──────────────────────────────────────────────────────────
  {
    key: "playfair",
    label: "Playfair Display",
    category: "Classic Serif",
    googleFamily: "Playfair+Display",
    weights: "400;500;700;800",
    cssVar: "'Playfair Display', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "cormorant",
    label: "Cormorant Garamond",
    category: "Classic Serif",
    googleFamily: "Cormorant+Garamond",
    weights: "400;600;700",
    cssVar: "'Cormorant Garamond', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "cinzel",
    label: "Cinzel",
    category: "Classic Serif",
    googleFamily: "Cinzel",
    weights: "400;500;600;700",
    cssVar: "'Cinzel', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "bodoni",
    label: "Bodoni Moda",
    category: "Classic Serif",
    googleFamily: "Bodoni+Moda",
    weights: "400;600;700;800",
    cssVar: "'Bodoni Moda', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "dm_serif",
    label: "DM Serif Display",
    category: "Classic Serif",
    googleFamily: "DM+Serif+Display",
    weights: "400",
    cssVar: "'DM Serif Display', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "fraunces",
    label: "Fraunces",
    category: "Classic Serif",
    googleFamily: "Fraunces",
    weights: "400;600;700;900",
    cssVar: "'Fraunces', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "lora",
    label: "Lora",
    category: "Classic Serif",
    googleFamily: "Lora",
    weights: "400;500;600;700",
    cssVar: "'Lora', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "eb_garamond",
    label: "EB Garamond",
    category: "Classic Serif",
    googleFamily: "EB+Garamond",
    weights: "400;500;600;700;800",
    cssVar: "'EB Garamond', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "spectral",
    label: "Spectral",
    category: "Classic Serif",
    googleFamily: "Spectral",
    weights: "400;500;600;700;800",
    cssVar: "'Spectral', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "libre_baskerville",
    label: "Libre Baskerville",
    category: "Classic Serif",
    googleFamily: "Libre+Baskerville",
    weights: "400;700",
    cssVar: "'Libre Baskerville', Georgia, serif",
    preview: "Drive Morocco in Style",
  },

  // ── Bold Display ───────────────────────────────────────────────────────────
  {
    key: "bebas",
    label: "Bebas Neue",
    category: "Bold Display",
    googleFamily: "Bebas+Neue",
    weights: "400",
    cssVar: "'Bebas Neue', Impact, sans-serif",
    preview: "DRIVE MOROCCO IN STYLE",
  },
  {
    key: "oswald",
    label: "Oswald",
    category: "Bold Display",
    googleFamily: "Oswald",
    weights: "300;400;500;600;700",
    cssVar: "'Oswald', Impact, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "abril",
    label: "Abril Fatface",
    category: "Bold Display",
    googleFamily: "Abril+Fatface",
    weights: "400",
    cssVar: "'Abril Fatface', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "big_shoulders",
    label: "Big Shoulders Display",
    category: "Bold Display",
    googleFamily: "Big+Shoulders+Display",
    weights: "400;600;700;800;900",
    cssVar: "'Big Shoulders Display', Impact, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "fjalla",
    label: "Fjalla One",
    category: "Bold Display",
    googleFamily: "Fjalla+One",
    weights: "400",
    cssVar: "'Fjalla One', Impact, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "yeseva",
    label: "Yeseva One",
    category: "Bold Display",
    googleFamily: "Yeseva+One",
    weights: "400",
    cssVar: "'Yeseva One', Georgia, serif",
    preview: "Drive Morocco in Style",
  },

  // ── Elegant Sans ───────────────────────────────────────────────────────────
  {
    key: "italiana",
    label: "Italiana",
    category: "Elegant Sans",
    googleFamily: "Italiana",
    weights: "400",
    cssVar: "'Italiana', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "poiret",
    label: "Poiret One",
    category: "Elegant Sans",
    googleFamily: "Poiret+One",
    weights: "400",
    cssVar: "'Poiret One', system-ui, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "josefin",
    label: "Josefin Sans",
    category: "Elegant Sans",
    googleFamily: "Josefin+Sans",
    weights: "300;400;600;700",
    cssVar: "'Josefin Sans', system-ui, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "philosopher",
    label: "Philosopher",
    category: "Elegant Sans",
    googleFamily: "Philosopher",
    weights: "400;700",
    cssVar: "'Philosopher', Georgia, serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "tenor",
    label: "Tenor Sans",
    category: "Elegant Sans",
    googleFamily: "Tenor+Sans",
    weights: "400",
    cssVar: "'Tenor Sans', system-ui, sans-serif",
    preview: "Drive Morocco in Style",
  },
  {
    key: "righteous",
    label: "Righteous",
    category: "Elegant Sans",
    googleFamily: "Righteous",
    weights: "400",
    cssVar: "'Righteous', system-ui, sans-serif",
    preview: "Drive Morocco in Style",
  },
];

export const BODY_FONTS: FontDef[] = [
  {
    key: "dm_sans",
    label: "DM Sans",
    category: "Body",
    googleFamily: "DM+Sans",
    weights: "300;400;500;600",
    cssVar: "'DM Sans', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "raleway",
    label: "Raleway",
    category: "Body",
    googleFamily: "Raleway",
    weights: "300;400;500;600",
    cssVar: "'Raleway', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "montserrat",
    label: "Montserrat",
    category: "Body",
    googleFamily: "Montserrat",
    weights: "300;400;500;600",
    cssVar: "'Montserrat', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "jost",
    label: "Jost",
    category: "Body",
    googleFamily: "Jost",
    weights: "300;400;500;600",
    cssVar: "'Jost', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "poppins",
    label: "Poppins",
    category: "Body",
    googleFamily: "Poppins",
    weights: "300;400;500;600",
    cssVar: "'Poppins', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "inter",
    label: "Inter",
    category: "Body",
    googleFamily: "Inter",
    weights: "300;400;500;600",
    cssVar: "'Inter', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "nunito",
    label: "Nunito",
    category: "Body",
    googleFamily: "Nunito",
    weights: "300;400;500;600",
    cssVar: "'Nunito', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
  {
    key: "outfit",
    label: "Outfit",
    category: "Body",
    googleFamily: "Outfit",
    weights: "300;400;500;600",
    cssVar: "'Outfit', system-ui, sans-serif",
    preview: "Premium fleet. Transparent pricing. Fast confirmation.",
  },
];

export const ALL_FONTS = [...HEADING_FONTS, ...BODY_FONTS];

export function getFontDef(key: string): FontDef | undefined {
  return ALL_FONTS.find((f) => f.key === key);
}

export function buildGoogleFontsUrl(headingKey: string, bodyKey: string): string {
  const hf = getFontDef(headingKey);
  const bf = getFontDef(bodyKey);
  const parts: string[] = [];
  if (hf) parts.push(`family=${hf.googleFamily}:wght@${hf.weights}`);
  if (bf && bf.key !== hf?.key) parts.push(`family=${bf.googleFamily}:wght@${bf.weights}`);
  if (parts.length === 0) return "";
  return `https://fonts.googleapis.com/css2?${parts.join("&")}&display=swap`;
}

export const DEFAULT_HEADING_FONT = "playfair";
export const DEFAULT_BODY_FONT = "dm_sans";
