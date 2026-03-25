// ─── Design Token System — BoujlilCar Theme Studio ───────────────────────────
// Token keys are stored in SiteSetting with "tk_" prefix.
// These layer on top of the selected base ThemeKey preset.
// CSS variables are served at /api/theme-css for progressive adoption.
// ─────────────────────────────────────────────────────────────────────────────

import type { ThemeDef } from "./themes";

export type TokenType = "color" | "range" | "select" | "input" | "toggle";

export interface TokenDef {
  key: string;
  cssVar: string;
  label: string;
  group: string;
  subgroup: string;
  type: TokenType;
  default: string;
  // range
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  // select
  options?: { value: string; label: string }[];
  // ThemeDef field this overrides (if any)
  themeKey?: keyof ThemeDef;
  helper?: string;
}

export interface TokenGroup {
  id: string;
  icon: string;
  label: string;
  desc: string;
  subgroups: string[];
}

export const TOKEN_GROUPS: TokenGroup[] = [
  { id: "colors",     icon: "🎨", label: "Colors",     desc: "Brand palette, text and state colors",    subgroups: ["Brand", "Text", "States"] },
  { id: "typography", icon: "✍️", label: "Typography", desc: "Fonts, sizes, weights and spacing",       subgroups: ["Fonts", "Sizes", "Weights"] },
  { id: "layout",     icon: "📐", label: "Layout",     desc: "Container, sections and grid spacing",    subgroups: ["Container", "Sections", "Grid"] },
  { id: "radius",     icon: "⬛", label: "Radius",     desc: "Border radius scale for all elements",    subgroups: ["Scale", "Components"] },
  { id: "shadows",    icon: "💫", label: "Shadows",    desc: "Elevation and depth across components",   subgroups: ["Scale"] },
  { id: "navbar",     icon: "🔗", label: "Navbar",     desc: "Navigation height, blur and style",       subgroups: ["Structure", "Style"] },
  { id: "cards",      icon: "🃏", label: "Cards",      desc: "Car cards, feature cards, all card types",subgroups: ["Structure", "Hover"] },
  { id: "buttons",    icon: "🔘", label: "Buttons",    desc: "Primary, secondary and icon buttons",     subgroups: ["Size", "Style"] },
  { id: "forms",      icon: "📝", label: "Forms",      desc: "Inputs, selects and date pickers",        subgroups: ["Structure", "States"] },
  { id: "presets",    icon: "🌟", label: "Presets",    desc: "Quick token presets for fast switching",  subgroups: ["Saved"] },
];

// ─── Option lists ─────────────────────────────────────────────────────────────

const FONT_OPTS = [
  { value: "Inter, system-ui, sans-serif",             label: "Inter — Modern" },
  { value: "'Cormorant Garamond', Georgia, serif",     label: "Cormorant — Luxury" },
  { value: "'Playfair Display', Georgia, serif",       label: "Playfair — Elegant" },
  { value: "'DM Sans', system-ui, sans-serif",         label: "DM Sans — Clean" },
  { value: "'Montserrat', system-ui, sans-serif",      label: "Montserrat — Bold" },
  { value: "'Raleway', system-ui, sans-serif",         label: "Raleway — Stylish" },
  { value: "Georgia, serif",                           label: "Georgia — Classic" },
];

const WEIGHT_OPTS = [
  { value: "400", label: "400 — Regular" },
  { value: "500", label: "500 — Medium" },
  { value: "600", label: "600 — SemiBold" },
  { value: "700", label: "700 — Bold" },
  { value: "800", label: "800 — ExtraBold" },
  { value: "900", label: "900 — Black" },
];

const SHADOW_OPTS = [
  { value: "none",                                      label: "None" },
  { value: "0 1px 4px rgba(0,0,0,0.3)",                label: "Subtle" },
  { value: "0 4px 16px rgba(0,0,0,0.4)",               label: "Medium" },
  { value: "0 12px 40px rgba(0,0,0,0.5)",              label: "Strong" },
  { value: "0 20px 60px rgba(0,0,0,0.7)",              label: "Dramatic" },
];

const SPACING_OPTS = [
  { value: "0em",    label: "0 — None" },
  { value: "0.05em", label: "0.05em — Tight" },
  { value: "0.1em",  label: "0.1em — Normal" },
  { value: "0.15em", label: "0.15em — Wide" },
  { value: "0.2em",  label: "0.2em — Widest" },
];

// ─── Token definitions ────────────────────────────────────────────────────────

export const TOKENS: TokenDef[] = [
  // COLORS › Brand
  { key: "tk_color_accent",       cssVar: "--color-accent",       label: "Primary / Accent",     group: "colors", subgroup: "Brand",  type: "color",  default: "#F59E0B", themeKey: "accent",      helper: "Main brand color — buttons, badges, active states." },
  { key: "tk_color_accent_hover", cssVar: "--color-accent-hover", label: "Accent Hover",         group: "colors", subgroup: "Brand",  type: "color",  default: "#FBBF24", themeKey: "accentHover", helper: "Slightly lighter accent used on hover." },
  { key: "tk_color_accent_text",  cssVar: "--color-accent-text",  label: "Accent Text",          group: "colors", subgroup: "Brand",  type: "color",  default: "#050408", themeKey: "accentText",  helper: "Text on accent backgrounds. Dark for light accents." },
  { key: "tk_color_glass",        cssVar: "--color-glass",        label: "Glass Panel BG",       group: "colors", subgroup: "Brand",  type: "input",  default: "rgba(245,158,11,0.09)", themeKey: "glass",   helper: "e.g. rgba(245,158,11,0.09)" },
  { key: "tk_color_glass_border", cssVar: "--color-glass-border", label: "Glass Border",         group: "colors", subgroup: "Brand",  type: "input",  default: "rgba(245,158,11,0.22)", themeKey: "glassBorder", helper: "e.g. rgba(245,158,11,0.22)" },
  { key: "tk_color_header_bg",    cssVar: "--color-header-bg",    label: "Header Background",    group: "colors", subgroup: "Brand",  type: "input",  default: "rgba(5,4,8,0.62)",     themeKey: "headerBg",    helper: "e.g. rgba(5,4,8,0.62)" },

  // COLORS › Text
  { key: "tk_color_text_primary",   cssVar: "--color-text-primary",   label: "Text Primary",   group: "colors", subgroup: "Text", type: "color", default: "#FFFFFF" },
  { key: "tk_color_text_secondary", cssVar: "--color-text-secondary", label: "Text Secondary", group: "colors", subgroup: "Text", type: "color", default: "#9BA3AF" },
  { key: "tk_color_text_muted",     cssVar: "--color-text-muted",     label: "Text Muted",     group: "colors", subgroup: "Text", type: "color", default: "#6B7280" },

  // COLORS › States
  { key: "tk_color_success", cssVar: "--color-success", label: "Success", group: "colors", subgroup: "States", type: "color", default: "#10B981" },
  { key: "tk_color_warning", cssVar: "--color-warning", label: "Warning", group: "colors", subgroup: "States", type: "color", default: "#F59E0B" },
  { key: "tk_color_error",   cssVar: "--color-error",   label: "Error",   group: "colors", subgroup: "States", type: "color", default: "#EF4444" },

  // TYPOGRAPHY › Fonts
  { key: "tk_font_body",    cssVar: "--font-body",    label: "Body Font",    group: "typography", subgroup: "Fonts", type: "select", default: "Inter, system-ui, sans-serif",          options: FONT_OPTS },
  { key: "tk_font_heading", cssVar: "--font-heading", label: "Heading Font", group: "typography", subgroup: "Fonts", type: "select", default: "'Cormorant Garamond', Georgia, serif",  options: FONT_OPTS },

  // TYPOGRAPHY › Sizes
  { key: "tk_size_base", cssVar: "--size-base", label: "Base Font (px)",  group: "typography", subgroup: "Sizes", type: "range", default: "16", min: 13, max: 20, step: 1, unit: "px" },
  { key: "tk_size_h1",   cssVar: "--size-h1",   label: "H1 Size (px)",    group: "typography", subgroup: "Sizes", type: "range", default: "48", min: 28, max: 80, step: 2, unit: "px" },
  { key: "tk_size_h2",   cssVar: "--size-h2",   label: "H2 Size (px)",    group: "typography", subgroup: "Sizes", type: "range", default: "36", min: 22, max: 60, step: 2, unit: "px" },
  { key: "tk_size_h3",   cssVar: "--size-h3",   label: "H3 Size (px)",    group: "typography", subgroup: "Sizes", type: "range", default: "24", min: 16, max: 40, step: 1, unit: "px" },
  { key: "tk_size_sm",   cssVar: "--size-sm",   label: "Small Text (px)", group: "typography", subgroup: "Sizes", type: "range", default: "13", min: 10, max: 16, step: 1, unit: "px" },

  // TYPOGRAPHY › Weights
  { key: "tk_weight_heading",  cssVar: "--weight-heading",  label: "Heading Weight",        group: "typography", subgroup: "Weights", type: "select", default: "700",    options: WEIGHT_OPTS },
  { key: "tk_weight_body",     cssVar: "--weight-body",     label: "Body Weight",           group: "typography", subgroup: "Weights", type: "select", default: "400",    options: WEIGHT_OPTS },
  { key: "tk_weight_btn",      cssVar: "--weight-btn",      label: "Button Weight",         group: "typography", subgroup: "Weights", type: "select", default: "700",    options: WEIGHT_OPTS },
  { key: "tk_letter_label",    cssVar: "--letter-label",    label: "Label Letter Spacing",  group: "typography", subgroup: "Weights", type: "select", default: "0.1em",  options: SPACING_OPTS },

  // LAYOUT › Container
  { key: "tk_container_max", cssVar: "--container-max", label: "Max Width (px)",       group: "layout", subgroup: "Container", type: "range", default: "1152", min: 960,  max: 1600, step: 32, unit: "px" },
  { key: "tk_content_px",    cssVar: "--content-px",    label: "Side Padding (px)",    group: "layout", subgroup: "Container", type: "range", default: "16",   min: 8,    max: 48,   step: 4,  unit: "px" },

  // LAYOUT › Sections
  { key: "tk_section_pt",  cssVar: "--section-pt",  label: "Section Pad Top (px)",    group: "layout", subgroup: "Sections", type: "range", default: "80", min: 24, max: 160, step: 8, unit: "px" },
  { key: "tk_section_pb",  cssVar: "--section-pb",  label: "Section Pad Bottom (px)", group: "layout", subgroup: "Sections", type: "range", default: "80", min: 24, max: 160, step: 8, unit: "px" },
  { key: "tk_section_gap", cssVar: "--section-gap", label: "Between Sections (px)",   group: "layout", subgroup: "Sections", type: "range", default: "80", min: 24, max: 160, step: 8, unit: "px" },

  // LAYOUT › Grid
  { key: "tk_grid_gap", cssVar: "--grid-gap", label: "Grid / Card Gap (px)", group: "layout", subgroup: "Grid", type: "range", default: "20", min: 8, max: 48, step: 4, unit: "px" },

  // RADIUS › Scale
  { key: "tk_radius_sm", cssVar: "--radius-sm", label: "Radius Small (px)",  group: "radius", subgroup: "Scale", type: "range", default: "8",  min: 0, max: 16, step: 2, unit: "px" },
  { key: "tk_radius_md", cssVar: "--radius-md", label: "Radius Medium (px)", group: "radius", subgroup: "Scale", type: "range", default: "12", min: 0, max: 24, step: 2, unit: "px" },
  { key: "tk_radius_lg", cssVar: "--radius-lg", label: "Radius Large (px)",  group: "radius", subgroup: "Scale", type: "range", default: "16", min: 0, max: 32, step: 2, unit: "px" },
  { key: "tk_radius_xl", cssVar: "--radius-xl", label: "Radius XL (px)",     group: "radius", subgroup: "Scale", type: "range", default: "24", min: 0, max: 48, step: 4, unit: "px" },

  // RADIUS › Components
  { key: "tk_radius_btn",   cssVar: "--radius-btn",   label: "Button Radius (px)", group: "radius", subgroup: "Components", type: "range", default: "12", min: 0, max: 32, step: 2, unit: "px" },
  { key: "tk_radius_card",  cssVar: "--radius-card",  label: "Card Radius (px)",   group: "radius", subgroup: "Components", type: "range", default: "16", min: 0, max: 40, step: 2, unit: "px" },
  { key: "tk_radius_input", cssVar: "--radius-input", label: "Input Radius (px)",  group: "radius", subgroup: "Components", type: "range", default: "12", min: 0, max: 24, step: 2, unit: "px" },
  { key: "tk_radius_badge", cssVar: "--radius-badge", label: "Badge Radius (px)",  group: "radius", subgroup: "Components", type: "range", default: "9999", min: 0, max: 9999, step: 1, unit: "px" },

  // SHADOWS
  { key: "tk_shadow_card",   cssVar: "--shadow-card",   label: "Card Shadow",   group: "shadows", subgroup: "Scale", type: "select", default: "none",                         options: SHADOW_OPTS },
  { key: "tk_shadow_btn",    cssVar: "--shadow-btn",    label: "Button Shadow", group: "shadows", subgroup: "Scale", type: "select", default: "none",                         options: SHADOW_OPTS },
  { key: "tk_shadow_modal",  cssVar: "--shadow-modal",  label: "Modal Shadow",  group: "shadows", subgroup: "Scale", type: "select", default: "0 20px 60px rgba(0,0,0,0.7)", options: SHADOW_OPTS },
  { key: "tk_shadow_navbar", cssVar: "--shadow-navbar", label: "Navbar Shadow", group: "shadows", subgroup: "Scale", type: "select", default: "none",                         options: SHADOW_OPTS },

  // NAVBAR
  { key: "tk_nav_height",      cssVar: "--nav-height",      label: "Height (px)",         group: "navbar", subgroup: "Structure", type: "range",  default: "52",  min: 40, max: 96, step: 4, unit: "px" },
  { key: "tk_nav_blur",        cssVar: "--nav-blur",        label: "Backdrop Blur (px)",  group: "navbar", subgroup: "Structure", type: "range",  default: "20",  min: 0,  max: 40, step: 2, unit: "px" },
  { key: "tk_nav_sticky",      cssVar: "--nav-sticky",      label: "Sticky Header",       group: "navbar", subgroup: "Structure", type: "toggle", default: "true" },
  { key: "tk_nav_border_show", cssVar: "--nav-border-show", label: "Show Bottom Border",  group: "navbar", subgroup: "Style",     type: "toggle", default: "true" },
  { key: "tk_nav_link_radius", cssVar: "--nav-link-radius", label: "Link Radius (px)",    group: "navbar", subgroup: "Style",     type: "range",  default: "12",  min: 0,  max: 24, step: 2, unit: "px" },

  // CARDS
  { key: "tk_card_bg_opacity",     cssVar: "--card-bg-opacity",     label: "BG Opacity (%)",    group: "cards", subgroup: "Structure", type: "range",  default: "4",  min: 0, max: 20, step: 1, unit: "%" },
  { key: "tk_card_border_opacity", cssVar: "--card-border-opacity", label: "Border Opacity (%)",group: "cards", subgroup: "Structure", type: "range",  default: "8",  min: 0, max: 30, step: 1, unit: "%" },
  { key: "tk_card_padding",        cssVar: "--card-padding",        label: "Padding (px)",      group: "cards", subgroup: "Structure", type: "range",  default: "20", min: 8, max: 40, step: 4, unit: "px" },
  { key: "tk_card_hover_lift",     cssVar: "--card-hover-lift",     label: "Hover Lift (px)",   group: "cards", subgroup: "Hover",     type: "range",  default: "4",  min: 0, max: 12, step: 1, unit: "px" },
  { key: "tk_card_hover_glow",     cssVar: "--card-hover-glow",     label: "Hover Glow Border", group: "cards", subgroup: "Hover",     type: "toggle", default: "true" },
  { key: "tk_card_hover_scale",    cssVar: "--card-hover-scale",    label: "Hover Scale",       group: "cards", subgroup: "Hover",     type: "toggle", default: "false" },

  // BUTTONS
  { key: "tk_btn_px",          cssVar: "--btn-px",          label: "Padding X (px)",    group: "buttons", subgroup: "Size",  type: "range",  default: "24",  min: 8,  max: 56, step: 4, unit: "px" },
  { key: "tk_btn_py",          cssVar: "--btn-py",          label: "Padding Y (px)",    group: "buttons", subgroup: "Size",  type: "range",  default: "10",  min: 4,  max: 24, step: 2, unit: "px" },
  { key: "tk_btn_font_size",   cssVar: "--btn-font-size",   label: "Font Size (px)",    group: "buttons", subgroup: "Size",  type: "range",  default: "14",  min: 11, max: 20, step: 1, unit: "px" },
  { key: "tk_btn_hover_scale", cssVar: "--btn-hover-scale", label: "Scale on Hover",    group: "buttons", subgroup: "Style", type: "toggle", default: "true" },
  { key: "tk_btn_hover_lift",  cssVar: "--btn-hover-lift",  label: "Lift on Hover",     group: "buttons", subgroup: "Style", type: "toggle", default: "false" },
  { key: "tk_btn_transition",  cssVar: "--btn-transition",  label: "Transition (ms)",   group: "buttons", subgroup: "Style", type: "range",  default: "200", min: 50, max: 600, step: 50, unit: "ms" },

  // FORMS
  { key: "tk_input_bg_opacity",     cssVar: "--input-bg-opacity",     label: "Input BG Opacity (%)",   group: "forms", subgroup: "Structure", type: "range",  default: "8",  min: 0, max: 30, step: 1, unit: "%" },
  { key: "tk_input_border_opacity", cssVar: "--input-border-opacity", label: "Border Opacity (%)",     group: "forms", subgroup: "Structure", type: "range",  default: "12", min: 0, max: 40, step: 1, unit: "%" },
  { key: "tk_input_px",             cssVar: "--input-px",             label: "Padding X (px)",         group: "forms", subgroup: "Structure", type: "range",  default: "12", min: 6, max: 32, step: 2, unit: "px" },
  { key: "tk_input_py",             cssVar: "--input-py",             label: "Padding Y (px)",         group: "forms", subgroup: "Structure", type: "range",  default: "10", min: 4, max: 20, step: 2, unit: "px" },
  { key: "tk_input_focus_ring",     cssVar: "--input-focus-ring",     label: "Focus Ring Color",       group: "forms", subgroup: "States",    type: "color",  default: "#F59E0B" },
  { key: "tk_label_letter_spacing", cssVar: "--label-letter-spacing", label: "Label Letter Spacing",   group: "forms", subgroup: "States",    type: "select", default: "0.1em", options: SPACING_OPTS },
];

// ─── Token preset bundles ─────────────────────────────────────────────────────

export interface PresetBundle {
  label: string;
  desc: string;
  icon: string;
  tokens: Partial<Record<string, string>>;
}

export const PRESET_BUNDLES: Record<string, PresetBundle> = {
  luxury_dark: {
    label: "Luxury Dark",   desc: "Premium gold on deep black",    icon: "🏆",
    tokens: { tk_color_accent: "#F59E0B", tk_color_accent_hover: "#FBBF24", tk_color_accent_text: "#050408", tk_font_heading: "'Cormorant Garamond', Georgia, serif", tk_weight_heading: "700", tk_radius_btn: "12", tk_radius_card: "16" },
  },
  bronze_premium: {
    label: "Bronze Premium", desc: "Warm bronze, Moroccan flair",   icon: "🔶",
    tokens: { tk_color_accent: "#D97706", tk_color_accent_hover: "#B45309", tk_color_accent_text: "#FFFBEB", tk_font_heading: "'Playfair Display', Georgia, serif", tk_weight_heading: "700", tk_radius_btn: "16", tk_radius_card: "20" },
  },
  midnight_blue: {
    label: "Midnight Blue",  desc: "Deep cobalt, sharp contrasts",  icon: "🌙",
    tokens: { tk_color_accent: "#3B82F6", tk_color_accent_hover: "#60A5FA", tk_color_accent_text: "#FFFFFF", tk_font_heading: "Inter, system-ui, sans-serif", tk_weight_heading: "800", tk_radius_btn: "8", tk_radius_card: "12" },
  },
  moroccan_warm: {
    label: "Moroccan Warm",  desc: "Sahara amber meets Atlas slate", icon: "🌅",
    tokens: { tk_color_accent: "#C2820E", tk_color_accent_hover: "#F59E0B", tk_color_accent_text: "#0C0601", tk_font_heading: "'Cormorant Garamond', Georgia, serif", tk_weight_heading: "700", tk_radius_btn: "20", tk_radius_card: "24" },
  },
  minimal_glass: {
    label: "Minimal Glass",  desc: "Clean lines, pure glassmorphism", icon: "🪟",
    tokens: { tk_color_accent: "#E2E8F0", tk_color_accent_hover: "#F8FAFC", tk_color_accent_text: "#080C10", tk_font_heading: "'DM Sans', system-ui, sans-serif", tk_weight_heading: "600", tk_radius_btn: "8", tk_radius_card: "8" },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const TOKEN_KEYS = TOKENS.map((t) => t.key);

export function getTokenDefaults(): Record<string, string> {
  const map: Record<string, string> = {};
  TOKENS.forEach((t) => { map[t.key] = t.default; });
  return map;
}

export function mergeTokensIntoTheme(
  base: import("./themes").ThemeDef,
  overrides: Record<string, string>
): import("./themes").ThemeDef {
  const out = { ...base };
  TOKENS.forEach(({ key, themeKey }) => {
    if (themeKey && overrides[key]) {
      (out as Record<string, string>)[themeKey] = overrides[key];
    }
  });
  return out;
}
