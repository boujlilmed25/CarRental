"use client";

import { useEffect, useState, useRef } from "react";
import { SETTING_DEFAULTS } from "@/lib/settings";
import { useTheme, themes } from "../_ui/ThemeContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Settings = Record<string, string>;
type FType = "input" | "textarea" | "cities" | "toggle" | "color" | "range" | "select" | "colorpicker" | "gradient";

interface FDef {
  key: string;
  label: string;
  type: FType;
  helper?: string;
  options?: string[];
}

interface SDef {
  id: string;
  icon: string;
  title: string;
  desc: string;
  group: string;
  fields: FDef[];
  special?: "slides" | "testimonials";
}

interface Toast { id: number; text: string; ok: boolean }

// ─── Section definitions ─────────────────────────────────────────────────────

const SECTIONS: SDef[] = [
  { id: "general", icon: "🏠", title: "General", group: "site",
    desc: "Site name, tagline, and navigation logo.",
    fields: [
      { key: "site_name", label: "Site Name", type: "input", helper: "Shown in browser tab and the header." },
      { key: "site_tagline", label: "Tagline", type: "input", helper: "Short description shown under the logo." },
      { key: "nav_logo", label: "Nav Logo Text", type: "input", helper: "Text displayed in the navbar." },
    ] },

  { id: "seo", icon: "🔍", title: "SEO", group: "site",
    desc: "Meta title and description seen by search engines.",
    fields: [
      { key: "seo_title", label: "Page Title", type: "input", helper: "Shown in Google. Keep under 60 characters." },
      { key: "seo_description", label: "Meta Description", type: "textarea", helper: "Shown under your title in Google results. Aim for 150–160 characters." },
    ] },

  { id: "navigation", icon: "🔗", title: "Navigation", group: "site",
    desc: "Top navigation bar content.",
    fields: [
      { key: "nav_cta_text", label: "WhatsApp CTA Button", type: "input", helper: "Text of the booking button in the top navbar." },
    ] },

  { id: "footer", icon: "🦶", title: "Footer", group: "site",
    desc: "Footer copyright line.",
    fields: [
      { key: "footer_text", label: "Copyright Text", type: "input", helper: "Use {year} as a placeholder for the current year." },
    ] },

  { id: "hero", icon: "🎯", title: "Hero", group: "homepage",
    desc: "Main banner text on the homepage above the booking form.",
    fields: [
      { key: "hero_title", label: "Hero Title", type: "input", helper: "Large headline shown in the hero section." },
      { key: "hero_description", label: "Hero Description", type: "textarea", helper: "Supporting text below the title." },
      { key: "hero_btn_fleet", label: '"View Fleet" Button', type: "input" },
      { key: "hero_btn_booking", label: '"Booking Form" Button', type: "input" },
    ] },

  { id: "slides", icon: "🖼️", title: "Hero Slides", group: "homepage",
    desc: "5 slides in the homepage hero carousel. Use \\n for line breaks in headlines.",
    special: "slides",
    fields: [
      { key: "slider_duration", label: "Slide Duration (ms)", type: "input", helper: "Time each slide shows before auto-advancing. Default: 5500" },
    ] },

  { id: "stats", icon: "📊", title: "Stats & Book", group: "homepage",
    desc: "Booking section label and 4 stat counters shown below the hero.",
    fields: [
      { key: "book_label", label: "Section Label", type: "input", helper: "Text shown above the booking form." },
      { key: "book_subtitle", label: "Section Subtitle", type: "input", helper: "Smaller text shown below the section label." },
      { key: "stat_1_num", label: "Stat 1 — Number", type: "input" },
      { key: "stat_1_lbl", label: "Stat 1 — Label", type: "input" },
      { key: "stat_2_num", label: "Stat 2 — Number", type: "input" },
      { key: "stat_2_lbl", label: "Stat 2 — Label", type: "input" },
      { key: "stat_3_num", label: "Stat 3 — Number", type: "input" },
      { key: "stat_3_lbl", label: "Stat 3 — Label", type: "input" },
      { key: "stat_4_num", label: "Stat 4 — Number", type: "input" },
      { key: "stat_4_lbl", label: "Stat 4 — Label", type: "input" },
      { key: "book_stats_enabled", label: "Show Stats Row", type: "toggle", helper: "Show or hide the stats row below the booking form." },
    ] },

  { id: "booking_form", icon: "📝", title: "Booking Form", group: "homepage",
    desc: "Field labels, button text and behaviour of the booking form.",
    fields: [
      { key: "book_city_label", label: "City Field Label", type: "input", helper: "Label above the city dropdown." },
      { key: "book_pickup_label", label: "Pickup Date Label", type: "input", helper: "Label above the pickup date input." },
      { key: "book_return_label", label: "Return Date Label", type: "input", helper: "Label above the return date input." },
      { key: "book_search_btn", label: "Search Button Text", type: "input", helper: "Text on the primary search / booking button." },
      { key: "book_wa_btn_tooltip", label: "WhatsApp Button Tooltip", type: "input", helper: "Tooltip shown when hovering the WhatsApp icon button." },
      { key: "book_wa_enabled", label: "Show WhatsApp Button", type: "toggle", helper: "Show or hide the WhatsApp quick-book icon next to the search button." },
      { key: "book_submit_action", label: "On Submit Action", type: "select",
        options: ["booking_page", "whatsapp"],
        helper: "booking_page → go to /booking page. whatsapp → open WhatsApp directly." },
    ] },

  { id: "featured", icon: "⭐", title: "Featured Cars", group: "homepage",
    desc: "Section heading for the featured cars grid on the homepage.",
    fields: [
      { key: "featured_eyebrow", label: "Eyebrow Label", type: "input", helper: "Small text above the section title." },
      { key: "featured_title", label: "Section Title", type: "input" },
      { key: "featured_view_all", label: '"View All" Link Text', type: "input" },
    ] },

  { id: "why", icon: "✅", title: "Why Choose Us", group: "homepage",
    desc: "The 4 feature cards shown on the homepage.",
    fields: [
      { key: "why_eyebrow", label: "Eyebrow Label", type: "input" },
      { key: "why_title", label: "Section Title", type: "input" },
      { key: "why_1_title", label: "Card 1 — Title", type: "input" },
      { key: "why_1_desc", label: "Card 1 — Description", type: "textarea" },
      { key: "why_2_title", label: "Card 2 — Title", type: "input" },
      { key: "why_2_desc", label: "Card 2 — Description", type: "textarea" },
      { key: "why_3_title", label: "Card 3 — Title", type: "input" },
      { key: "why_3_desc", label: "Card 3 — Description", type: "textarea" },
      { key: "why_4_title", label: "Card 4 — Title", type: "input" },
      { key: "why_4_desc", label: "Card 4 — Description", type: "textarea" },
    ] },

  { id: "how", icon: "🔢", title: "How It Works", group: "homepage",
    desc: "The 3-step process section on the homepage.",
    fields: [
      { key: "how_eyebrow", label: "Eyebrow Label", type: "input" },
      { key: "how_title", label: "Section Title", type: "input" },
      { key: "how_1_title", label: "Step 1 — Title", type: "input" },
      { key: "how_1_desc", label: "Step 1 — Description", type: "textarea" },
      { key: "how_2_title", label: "Step 2 — Title", type: "input" },
      { key: "how_2_desc", label: "Step 2 — Description", type: "textarea" },
      { key: "how_3_title", label: "Step 3 — Title", type: "input" },
      { key: "how_3_desc", label: "Step 3 — Description", type: "textarea" },
    ] },

  { id: "cities_section", icon: "🗺️", title: "Cities Section", group: "coverage",
    desc: "Heading for the cities coverage section on the homepage.",
    fields: [
      { key: "cities_eyebrow", label: "Eyebrow Label", type: "input" },
      { key: "cities_title", label: "Section Title", type: "input" },
    ] },

  { id: "cities", icon: "📍", title: "Cities List", group: "coverage",
    desc: "Cities available for booking. Appear in the booking form and homepage.",
    fields: [
      { key: "cities", label: "Available Cities", type: "cities", helper: "One city per line. These populate the booking dropdown and the homepage cities grid." },
    ] },

  { id: "testimonials", icon: "💬", title: "Testimonials", group: "reviews",
    desc: "The 3 customer reviews shown on the homepage.",
    special: "testimonials",
    fields: [
      { key: "testimonials_eyebrow", label: "Eyebrow Label", type: "input" },
      { key: "testimonials_title", label: "Section Title", type: "input" },
    ] },

  { id: "cta", icon: "🚀", title: "CTA Banner", group: "marketing",
    desc: "The bottom call-to-action banner on the homepage.",
    fields: [
      { key: "cta_eyebrow", label: "Eyebrow Label", type: "input" },
      { key: "cta_title", label: "Banner Title", type: "input" },
      { key: "cta_desc", label: "Banner Description", type: "textarea" },
      { key: "cta_wa_btn", label: "WhatsApp Button Text", type: "input" },
      { key: "cta_wa_message", label: "WhatsApp Pre-filled Message", type: "textarea", helper: "This message is pre-filled when users click the WhatsApp CTA button." },
      { key: "cta_fleet_btn", label: "Fleet Button Text", type: "input" },
    ] },

  { id: "whatsapp", icon: "📱", title: "WhatsApp & Contact", group: "marketing",
    desc: "Phone numbers and WhatsApp message templates.",
    fields: [
      { key: "wa_number", label: "WhatsApp Number", type: "input", helper: "Country code included, no + or spaces. Example: 212641750719" },
      { key: "contact_phone", label: "Contact Phone", type: "input", helper: "Used for the tel: link. Example: 0641750719" },
      { key: "contact_phone_display", label: "Phone Display Text", type: "input" },
      { key: "wa_message_nav", label: "Navbar WA Message", type: "textarea", helper: "Pre-filled when clicking the navbar WhatsApp button." },
      { key: "wa_message_book", label: "Booking WA Message", type: "textarea", helper: "Pre-filled on car and rent pages." },
      { key: "wa_message_floating", label: "Floating Button Message", type: "textarea", helper: "Pre-filled for the floating WhatsApp button." },
    ] },

  { id: "fleet", icon: "🚗", title: "Fleet Page", group: "pages",
    desc: "Text on the fleet listing page.",
    fields: [
      { key: "fleet_title", label: "Page Title", type: "input" },
      { key: "fleet_subtitle", label: "Page Subtitle", type: "input" },
    ] },

  { id: "contact", icon: "📞", title: "Contact Page", group: "pages",
    desc: "Text on the contact page.",
    fields: [
      { key: "contact_title", label: "Page Title", type: "input" },
      { key: "contact_subtitle", label: "Page Subtitle", type: "input" },
      { key: "contact_wa_btn", label: '"WhatsApp us" Button', type: "input" },
      { key: "contact_call_btn", label: '"Call" Button', type: "input" },
    ] },

  { id: "car_detail", icon: "🔍", title: "Car Detail", group: "pages",
    desc: "Text blocks on individual car listing pages.",
    fields: [
      { key: "car_detail_delivery_title", label: "Delivery Section Title", type: "input" },
      { key: "car_detail_delivery_text", label: "Delivery Section Text", type: "textarea" },
      { key: "car_detail_tip", label: "Booking Tip Text", type: "input" },
    ] },

  // ── Section Styles ──────────────────────────────────────────────────────────
  { id: "style_book", icon: "🎨", title: "Form Section Style", group: "styles",
    desc: "Visual styling of the Reserve Your Car section and its fields.",
    fields: [
      { key: "section_book_bg",          label: "Section Background",      type: "gradient", helper: "Gradient or color of the outer booking section." },
      { key: "section_book_border",      label: "Section Border Color",     type: "colorpicker", helper: "Border color of the section." },
      { key: "section_book_form_bg",     label: "Form Container Background",type: "colorpicker", helper: "Background of the inner form wrapper." },
      { key: "section_book_form_border", label: "Form Container Border",    type: "colorpicker", helper: "Border color of the inner form wrapper." },
      { key: "section_book_field_bg",    label: "Input Field Background",   type: "colorpicker", helper: "Background of each input/select field." },
      { key: "section_book_field_border",label: "Input Field Border",       type: "colorpicker", helper: "Border color of each input/select field." },
    ] },

  { id: "style_cards", icon: "🃏", title: "Cards Style", group: "styles",
    desc: "Background and border of featured car cards and review cards.",
    fields: [
      { key: "section_car_card_bg",      label: "Car Card Background",      type: "colorpicker" },
      { key: "section_car_card_border",  label: "Car Card Border",          type: "colorpicker" },
      { key: "section_why_card_bg",      label: "Why-Us Card Background",   type: "colorpicker" },
      { key: "section_why_card_border",  label: "Why-Us Card Border",       type: "colorpicker" },
      { key: "section_review_card_bg",   label: "Review Card Background",   type: "colorpicker" },
      { key: "section_review_card_border",label:"Review Card Border",       type: "colorpicker" },
    ] },

  { id: "style_steps", icon: "🔢", title: "How-It-Works Style", group: "styles",
    desc: "Styling of the numbered step circles in the How It Works section.",
    fields: [
      { key: "section_how_step_bg",     label: "Step Circle Background", type: "gradient", helper: "Gradient for the step number circles." },
      { key: "section_how_step_border", label: "Step Circle Border",     type: "colorpicker" },
    ] },

  { id: "style_cta", icon: "🚀", title: "CTA Banner Style", group: "styles",
    desc: "Background and border of the bottom call-to-action banner.",
    fields: [
      { key: "section_cta_bg",     label: "CTA Background",  type: "gradient", helper: "Gradient for the CTA banner." },
      { key: "section_cta_border", label: "CTA Border Color",type: "colorpicker" },
    ] },
];

const GROUPS = [
  { id: "site",      label: "Site",      icon: "🌐" },
  { id: "homepage",  label: "Homepage",  icon: "🏠" },
  { id: "styles",    label: "Styles",    icon: "🎨" },
  { id: "coverage",  label: "Coverage",  icon: "📍" },
  { id: "reviews",   label: "Reviews",   icon: "💬" },
  { id: "marketing", label: "Marketing", icon: "📣" },
  { id: "pages",     label: "Pages",     icon: "📄" },
];

const SLIDE_SUBKEYS = ["image","badge","headline","subline","cta_lbl","cta_href","cta2_lbl","cta2_href","enabled","opacity","theme","shadow"];
const REVIEW_SUBKEYS = ["name","city","text"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function citiesToLines(v: string): string {
  try { const a = JSON.parse(v); if (Array.isArray(a)) return a.join("\n"); } catch {/* */}
  return v;
}

// ─── ContentEditor ────────────────────────────────────────────────────────────

export default function ContentEditor() {
  const { theme } = useTheme();
  const ac = themes[theme].accent;
  const acT = themes[theme].accentText;

  const [settings, setSettings] = useState<Settings>({ ...SETTING_DEFAULTS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((j) => { if (j.settings) setSettings((p) => ({ ...p, ...j.settings })); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function addToast(text: string, ok: boolean) {
    const id = Date.now();
    setToasts((p) => [...p, { id, text, ok }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }

  function getValue(key: string): string {
    if (key === "cities") { try { const a = JSON.parse(settings[key] ?? "[]"); if (Array.isArray(a)) return a.join("\n"); } catch {/**/} }
    return settings[key] ?? "";
  }

  function setValue(key: string, value: string) { setSettings((p) => ({ ...p, [key]: value })); }

  const activeSection = SECTIONS.find((s) => s.id === activeTab) ?? SECTIONS[0];

  function getAllKeys(): string[] {
    const keys = activeSection.fields.map((f) => f.key);
    if (activeSection.special === "slides")
      for (let i = 1; i <= 5; i++) SLIDE_SUBKEYS.forEach((k) => keys.push(`slide_${i}_${k}`));
    if (activeSection.special === "testimonials")
      for (let i = 1; i <= 3; i++) REVIEW_SUBKEYS.forEach((k) => keys.push(`review_${i}_${k}`));
    return keys;
  }

  async function save() {
    setSaving(activeSection.id);
    const keys = getAllKeys();
    const patch: Settings = {};
    keys.forEach((k) => (patch[k] = settings[k] ?? ""));
    if (patch.cities !== undefined) {
      try { JSON.parse(patch.cities); } catch {
        patch.cities = JSON.stringify(patch.cities.split("\n").map((l) => l.trim()).filter(Boolean));
      }
    }
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    const j = await res.json().catch(() => ({}));
    setSaving(null);
    res.ok ? addToast("Changes saved successfully!", true) : addToast(j?.error || "Save failed", false);
  }

  function resetSection() {
    const keys = getAllKeys();
    const upd: Settings = {};
    keys.forEach((k) => { if (SETTING_DEFAULTS[k] !== undefined) upd[k] = SETTING_DEFAULTS[k]; });
    setSettings((p) => ({ ...p, ...upd }));
  }

  function swapSlides(a: number, b: number) {
    setSettings((prev) => {
      const next = { ...prev };
      SLIDE_SUBKEYS.forEach((k) => {
        const va = next[`slide_${a}_${k}`] ?? "";
        const vb = next[`slide_${b}_${k}`] ?? "";
        next[`slide_${a}_${k}`] = vb;
        next[`slide_${b}_${k}`] = va;
      });
      return next;
    });
  }

  function getDirtyCount(s: SDef): number {
    return s.fields.filter((f) => {
      const cur = getValue(f.key);
      const def = f.key === "cities" ? citiesToLines(SETTING_DEFAULTS[f.key] ?? "") : (SETTING_DEFAULTS[f.key] ?? "");
      return cur !== def;
    }).length;
  }

  const glassCard: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px" };

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 lg:-mx-8 -my-6" style={{ minHeight: "calc(100vh - 65px)" }}>

      {/* ── Left Sidebar ─────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-56 xl:w-60 flex-shrink-0 flex-col overflow-y-auto border-r border-white/8 sticky"
        style={{ background: "rgba(5,10,22,0.97)", height: "calc(100vh - 65px)", top: "65px" }}
      >
        <div className="px-3 py-5">
          <div className="text-[9px] text-white/20 uppercase tracking-[0.2em] mb-4 px-2">Content Sections</div>
          {GROUPS.map((g) => {
            const groupSections = SECTIONS.filter((s) => s.group === g.id);
            return (
              <div key={g.id} className="mb-4">
                <div className="flex items-center gap-1.5 text-[9px] text-white/22 uppercase tracking-wider mb-1 px-2">
                  <span>{g.icon}</span><span>{g.label}</span>
                </div>
                {groupSections.map((s) => {
                  const dirty = getDirtyCount(s);
                  const active = activeTab === s.id;
                  return (
                    <button key={s.id} onClick={() => setActiveTab(s.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all mb-0.5"
                      style={{ background: active ? `${ac}18` : "transparent", color: active ? ac : "rgba(255,255,255,0.45)" }}>
                      <span className="text-sm leading-none flex-shrink-0">{s.icon}</span>
                      <span className="flex-1 text-[12px] font-medium truncate">{s.title}</span>
                      {dirty > 0 && !active && (
                        <span className="flex-shrink-0 h-4 w-4 rounded-full text-[9px] font-black flex items-center justify-center" style={{ background: "#D97706", color: "#000" }}>{dirty}</span>
                      )}
                      {active && <span className="flex-shrink-0 h-1.5 w-1.5 rounded-full" style={{ background: ac }} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* Sticky action bar */}
        <div className="flex-shrink-0 sticky top-0 z-20 flex items-center gap-2.5 px-5 py-3 border-b border-white/8"
          style={{ background: "rgba(5,10,22,0.96)", backdropFilter: "blur(20px)" }}>
          {/* Mobile select */}
          <select className="lg:hidden flex-1 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none"
            value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.icon} {s.title}</option>)}
          </select>

          {/* Breadcrumb — desktop */}
          <div className="hidden lg:flex items-center gap-2 text-sm min-w-0">
            <span className="text-white/25 text-xs">{GROUPS.find((g) => g.id === activeSection.group)?.label}</span>
            <span className="text-white/15">/</span>
            <span className="font-semibold text-white truncate">{activeSection.icon} {activeSection.title}</span>
          </div>

          <div className="flex-1" />

          <a href="/" target="_blank" rel="noopener"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/4 px-3.5 py-2 text-xs text-white/50 hover:text-white hover:bg-white/8 transition-all">
            🌐 Preview
          </a>

          <button onClick={resetSection}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/4 px-3.5 py-2 text-xs text-white/50 hover:text-white hover:bg-white/8 transition-all">
            ↺ Reset
          </button>

          <button disabled={saving === activeSection.id || loading} onClick={save}
            className="flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-bold transition-all disabled:opacity-50 active:scale-95"
            style={{ background: ac, color: acT }}>
            {saving === activeSection.id
              ? <><span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />Saving…</>
              : <>💾 Save Changes</>}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-5 lg:px-8 py-7">

            {/* Section header card */}
            <div className="flex items-start gap-4 mb-7 p-5 rounded-2xl" style={glassCard}>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl flex-shrink-0"
                style={{ background: `${ac}18` }}>
                {activeSection.icon}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{activeSection.title}</h2>
                <p className="text-xs text-white/45 mt-0.5 leading-relaxed">{activeSection.desc}</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-16 justify-center text-sm text-white/30">
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white/50 animate-spin" />
                Loading settings…
              </div>
            ) : (
              <>
                {/* Regular fields */}
                {activeSection.fields.length > 0 && (
                  <div className="space-y-3 mb-3">
                    {activeSection.fields.map((f) => (
                      <FieldRow key={f.key} field={f} value={getValue(f.key)} onChange={(v) => setValue(f.key, v)}
                        defaultValue={f.key === "cities" ? citiesToLines(SETTING_DEFAULTS[f.key] ?? "") : (SETTING_DEFAULTS[f.key] ?? "")}
                        accent={ac} />
                    ))}
                  </div>
                )}

                {/* Special: Slide cards */}
                {activeSection.special === "slides" && (
                  <SlideCards getValue={getValue} setValue={setValue} accent={ac} onSwap={swapSlides} />
                )}

                {/* Special: Review cards */}
                {activeSection.special === "testimonials" && (
                  <ReviewCards getValue={getValue} setValue={setValue} accent={ac} />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Toast stack ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl pointer-events-auto"
            style={{ background: t.ok ? "rgba(16,185,129,0.92)" : "rgba(239,68,68,0.92)", backdropFilter: "blur(12px)", color: "white", animation: "slideUp 0.25s ease" }}>
            <span className="text-base">{t.ok ? "✓" : "✕"}</span>{t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SlideCards ───────────────────────────────────────────────────────────────

function SlideCards({
  getValue, setValue, accent, onSwap,
}: {
  getValue: (k: string) => string;
  setValue: (k: string, v: string) => void;
  accent: string;
  onSwap: (a: number, b: number) => void;
}) {
  const [open, setOpen] = useState<number | null>(1);

  const SHADOW_OPTIONS = ["none", "light", "medium", "heavy"];

  return (
    <div className="space-y-2.5">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[10px] text-white/28 uppercase tracking-widest">5 Slide Cards</div>
        <div className="text-[10px] text-white/22">↑↓ drag to reorder</div>
      </div>

      {[1,2,3,4,5].map((n) => {
        const enabled = getValue(`slide_${n}_enabled`) !== "false";
        const headline = (getValue(`slide_${n}_headline`) || `Slide ${n}`).replace("\\n", " — ");
        const imgSrc = getValue(`slide_${n}_image`);
        const shadow = getValue(`slide_${n}_shadow`) || "medium";
        const isOpen = open === n;

        return (
          <div key={n} className="rounded-2xl overflow-hidden transition-all"
            style={{ border: `1px solid ${isOpen ? `${accent}45` : "rgba(255,255,255,0.08)"}`, background: isOpen ? `${accent}07` : "rgba(255,255,255,0.025)" }}>

            {/* ── Card header ─────────────────────────────── */}
            <div className="flex items-center gap-2.5 px-3.5 py-3">

              {/* Slide number badge */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black flex-shrink-0 cursor-pointer"
                style={{ background: enabled ? `${accent}22` : "rgba(255,255,255,0.05)", color: enabled ? accent : "rgba(255,255,255,0.25)" }}
                onClick={() => setOpen(isOpen ? null : n)}>
                {n}
              </div>

              {/* Thumbnail preview */}
              {imgSrc ? (
                <div className="h-9 w-14 rounded-lg overflow-hidden border border-white/12 flex-shrink-0 bg-white/5 cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : n)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imgSrc} alt="" className="h-full w-full object-cover"
                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }} />
                </div>
              ) : (
                <div className="h-9 w-14 rounded-lg border border-dashed border-white/12 flex-shrink-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : n)}>
                  <span className="text-[10px] text-white/20">no img</span>
                </div>
              )}

              {/* Title + badge */}
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setOpen(isOpen ? null : n)}>
                <div className="text-sm font-semibold text-white truncate leading-tight">{headline}</div>
                <div className="text-[11px] text-white/32 truncate mt-0.5">{getValue(`slide_${n}_badge`) || "—"}</div>
              </div>

              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => { if (n > 1) onSwap(n - 1, n); }}
                  disabled={n === 1}
                  title="Move up"
                  className="flex h-4 w-5 items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/10 disabled:opacity-0 disabled:cursor-default transition-all text-[10px] leading-none"
                >▲</button>
                <button
                  onClick={() => { if (n < 5) onSwap(n, n + 1); }}
                  disabled={n === 5}
                  title="Move down"
                  className="flex h-4 w-5 items-center justify-center rounded text-white/25 hover:text-white hover:bg-white/10 disabled:opacity-0 disabled:cursor-default transition-all text-[10px] leading-none"
                >▼</button>
              </div>

              {/* Enable toggle */}
              <button
                onClick={() => setValue(`slide_${n}_enabled`, enabled ? "false" : "true")}
                title={enabled ? "Click to hide slide" : "Click to show slide"}
                className="flex-shrink-0 relative h-5 w-9 rounded-full transition-colors"
                style={{ background: enabled ? accent : "rgba(255,255,255,0.12)" }}>
                <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform"
                  style={{ transform: enabled ? "translateX(16px)" : "none" }} />
              </button>

              {/* Expand chevron */}
              <svg className="w-4 h-4 text-white/28 flex-shrink-0 transition-transform cursor-pointer"
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                onClick={() => setOpen(isOpen ? null : n)}>
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* ── Card body ───────────────────────────────── */}
            {isOpen && (
              <div className="px-4 pb-5 pt-3 border-t border-white/6 space-y-3">

                {/* Image upload row */}
                <div>
                  <label className="text-[12px] font-semibold text-white/70 block mb-2">Background Image</label>
                  <ImageUploader
                    value={imgSrc}
                    onChange={(v) => setValue(`slide_${n}_image`, v)}
                    accent={accent}
                  />
                </div>

                {/* Text fields */}
                {[
                  { key: `slide_${n}_badge`, label: "Badge Text", type: "input" as const, helper: "Small label shown above the headline." },
                  { key: `slide_${n}_headline`, label: "Headline", type: "input" as const, helper: "Use \\n to add a line break in the headline." },
                  { key: `slide_${n}_subline`, label: "Subline", type: "textarea" as const },
                ].map((f) => (
                  <FieldRow key={f.key} field={f} value={getValue(f.key)} onChange={(v) => setValue(f.key, v)}
                    defaultValue={SETTING_DEFAULTS[f.key] ?? ""} accent={accent} compact />
                ))}

                {/* CTA buttons row */}
                <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.065)" }}>
                  <div className="text-[11px] text-white/38 uppercase tracking-wider mb-2.5">CTA Buttons</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { key: `slide_${n}_cta_lbl`, label: "Primary Label" },
                      { key: `slide_${n}_cta_href`, label: "Primary Link" },
                      { key: `slide_${n}_cta2_lbl`, label: "Secondary Label" },
                      { key: `slide_${n}_cta2_href`, label: "Secondary Link" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="text-[11px] text-white/38 block mb-1">{f.label}</label>
                        <input type="text" value={getValue(f.key)} onChange={(e) => setValue(f.key, e.target.value)}
                          placeholder={SETTING_DEFAULTS[f.key] ?? ""}
                          className="w-full rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                          style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)" }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual controls */}
                <div className="rounded-xl p-3.5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.065)" }}>
                  <div className="text-[11px] text-white/38 uppercase tracking-wider mb-3">Visual Controls</div>
                  <div className="grid grid-cols-3 gap-3">

                    {/* Opacity slider */}
                    <div>
                      <label className="text-[11px] text-white/40 block mb-2">Overlay Opacity</label>
                      <div className="flex flex-col gap-1.5">
                        <input type="range" min="0" max="100"
                          value={getValue(`slide_${n}_opacity`) || "85"}
                          onChange={(e) => setValue(`slide_${n}_opacity`, e.target.value)}
                          className="w-full h-1.5 rounded-full cursor-pointer" style={{ accentColor: accent }} />
                        <div className="flex justify-between text-[10px] text-white/30">
                          <span>0%</span>
                          <span className="font-mono font-bold" style={{ color: accent }}>{getValue(`slide_${n}_opacity`) || "85"}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>

                    {/* Accent color */}
                    <div>
                      <label className="text-[11px] text-white/40 block mb-2">Accent Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color"
                          value={getValue(`slide_${n}_theme`) || "#F59E0B"}
                          onChange={(e) => setValue(`slide_${n}_theme`, e.target.value)}
                          className="h-8 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0.5 flex-shrink-0" />
                        <input type="text"
                          value={getValue(`slide_${n}_theme`) || "#F59E0B"}
                          onChange={(e) => setValue(`slide_${n}_theme`, e.target.value)}
                          className="flex-1 rounded-lg px-2 py-1.5 text-xs font-mono text-white focus:outline-none w-0"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
                      </div>
                    </div>

                    {/* Shadow intensity */}
                    <div>
                      <label className="text-[11px] text-white/40 block mb-2">Text Shadow</label>
                      <div className="flex flex-col gap-1">
                        {SHADOW_OPTIONS.map((opt) => (
                          <button key={opt}
                            onClick={() => setValue(`slide_${n}_shadow`, opt)}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs transition-all text-left capitalize"
                            style={{
                              background: shadow === opt ? `${accent}20` : "transparent",
                              color: shadow === opt ? accent : "rgba(255,255,255,0.38)",
                              border: `1px solid ${shadow === opt ? `${accent}35` : "transparent"}`,
                            }}>
                            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                              style={{ background: shadow === opt ? accent : "rgba(255,255,255,0.2)" }} />
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ReviewCards ─────────────────────────────────────────────────────────────

function ReviewCards({ getValue, setValue, accent }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void; accent: string }) {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="space-y-2.5">
      <div className="text-[10px] text-white/28 uppercase tracking-widest mb-3">3 Customer Reviews</div>
      {[1,2,3].map((n) => {
        const name = getValue(`review_${n}_name`) || `Review ${n}`;
        const city = getValue(`review_${n}_city`);
        const isOpen = open === n;
        return (
          <div key={n} className="rounded-2xl overflow-hidden transition-all"
            style={{ border: `1px solid ${isOpen ? `${accent}45` : "rgba(255,255,255,0.08)"}`, background: isOpen ? `${accent}06` : "rgba(255,255,255,0.025)" }}>
            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none" onClick={() => setOpen(isOpen ? null : n)}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black flex-shrink-0"
                style={{ background: `${accent}20`, color: accent }}>{n}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{name}</div>
                {city && <div className="text-[11px] text-white/32">📍 {city}</div>}
              </div>
              <span className="text-amber-400 text-xs flex-shrink-0">★★★★★</span>
              <svg className="w-4 h-4 text-white/28 flex-shrink-0 transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {isOpen && (
              <div className="px-4 pb-4 pt-3 border-t border-white/6 space-y-2.5">
                {[
                  { key: `review_${n}_name`, label: "Name", type: "input" as const },
                  { key: `review_${n}_city`, label: "City", type: "input" as const },
                  { key: `review_${n}_text`, label: "Review Text", type: "textarea" as const },
                ].map((f) => (
                  <FieldRow key={f.key} field={f} value={getValue(f.key)} onChange={(v) => setValue(f.key, v)}
                    defaultValue={SETTING_DEFAULTS[f.key] ?? ""} accent={accent} compact />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ImageUploader ────────────────────────────────────────────────────────────

function ImageUploader({
  value,
  onChange,
  accent,
}: {
  value: string;
  onChange: (url: string) => void;
  accent: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) { setUploadErr("Only image files are allowed."); return; }
    if (file.size > 8 * 1024 * 1024) { setUploadErr("File too large — max 8 MB."); return; }
    setUploading(true);
    setUploadErr(null);
    const form = new FormData();
    form.append("file", file);
    form.append("folder", "slides");
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const j = await res.json().catch(() => ({}));
    setUploading(false);
    if (res.ok && j.url) { onChange(j.url); }
    else { setUploadErr(j?.error || "Upload failed — try again."); }
  }

  return (
    <div className="space-y-2">
      {/* Drop zone / preview */}
      <div
        className="relative rounded-xl overflow-hidden transition-all cursor-pointer"
        style={{
          border: `2px dashed ${dragOver ? accent : "rgba(255,255,255,0.12)"}`,
          background: dragOver ? `${accent}10` : "rgba(255,255,255,0.03)",
          minHeight: "80px",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
      >
        {value ? (
          /* Image preview */
          <div className="flex gap-3 items-center p-3">
            <div className="h-14 w-24 rounded-lg overflow-hidden border border-white/12 flex-shrink-0 bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Slide preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-white/60 truncate">{value}</div>
              <div className="text-[11px] text-white/30 mt-1">Click or drop a new image to replace</div>
            </div>
            {uploading && (
              <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-5 gap-2">
            {uploading ? (
              <>
                <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white/70 animate-spin" />
                <div className="text-xs text-white/40">Uploading…</div>
              </>
            ) : (
              <>
                <div className="text-2xl">📤</div>
                <div className="text-xs text-white/45 text-center leading-relaxed">
                  Click to upload or drag & drop<br />
                  <span className="text-white/25">JPG, PNG, WEBP — max 8 MB</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual path input + upload button row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/slides/slide-1.jpg"
          className="flex-1 rounded-lg px-2.5 py-2 text-xs font-mono text-white focus:outline-none"
          style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.09)" }}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
          style={{ background: accent, color: "white" }}
        >
          {uploading ? (
            <><span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />Uploading…</>
          ) : (
            <>📤 Upload Image</>
          )}
        </button>
      </div>

      {uploadErr && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <span>⚠️</span>{uploadErr}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
      />
    </div>
  );
}

// ─── ColorPicker ─────────────────────────────────────────────────────────────

function ColorPicker({ value, onChange, accent }: { value: string; onChange: (v: string) => void; accent: string }) {
  // Try to extract a hex or rgb from rgba/rgb value for the color input
  function toHex(v: string): string {
    const hex = v.match(/#([0-9a-fA-F]{3,8})/);
    if (hex) return hex[0];
    return "#ffffff";
  }

  return (
    <div className="flex items-center gap-2.5 flex-wrap">
      {/* Native color wheel */}
      <div className="relative flex-shrink-0">
        <input
          type="color"
          value={toHex(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 rounded-xl cursor-pointer border-0 p-0.5"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          title="Pick a color"
        />
      </div>

      {/* Opacity presets */}
      <div className="flex gap-1.5 flex-wrap">
        {[100, 80, 50, 20, 10, 5].map((op) => {
          const hex = toHex(value);
          const r = parseInt(hex.slice(1, 3), 16) || 255;
          const g = parseInt(hex.slice(3, 5), 16) || 255;
          const b = parseInt(hex.slice(5, 7), 16) || 255;
          const rgba = `rgba(${r},${g},${b},${op / 100})`;
          return (
            <button
              key={op}
              title={`${op}% opacity`}
              onClick={() => onChange(rgba)}
              className="h-7 w-7 rounded-lg border border-white/15 text-[10px] font-bold text-white/60 hover:text-white transition-colors"
              style={{ background: rgba }}
            >
              {op}
            </button>
          );
        })}
      </div>

      {/* Raw CSS value input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="rgba(255,255,255,0.08)"
        className="flex-1 min-w-[180px] rounded-xl px-3 py-2 text-xs font-mono outline-none"
        style={{ background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.095)", color: "white" }}
      />

      {/* Live preview swatch */}
      <div
        className="h-8 w-8 rounded-xl border border-white/15 flex-shrink-0"
        style={{ background: value }}
        title="Preview"
      />
    </div>
  );
}

// ─── GradientPicker ───────────────────────────────────────────────────────────

const GRADIENT_PRESETS = [
  { label: "Navy Deep",    value: "linear-gradient(140deg, #0a1628 0%, #0d2248 45%, #091525 100%)" },
  { label: "Midnight",     value: "linear-gradient(135deg, #0d2040 0%, #162a50 50%, #0a1628 100%)" },
  { label: "Dark Slate",   value: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" },
  { label: "Deep Navy",    value: "linear-gradient(145deg, #060809 0%, #0f1418 35%, #1a2230 65%, #060809 100%)" },
  { label: "Gold Rush",    value: "linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(245,158,11,0.05) 100%)" },
  { label: "Soft Glass",   value: "rgba(255,255,255,0.05)" },
  { label: "Dark Glass",   value: "rgba(255,255,255,0.03)" },
  { label: "Cobalt",       value: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 50%, #0c1a6e 100%)" },
  { label: "Crimson",      value: "linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #2d0404 100%)" },
  { label: "Sahara",       value: "linear-gradient(160deg, #7c4508 0%, #a05c0e 50%, #4a2804 100%)" },
  { label: "Azure",        value: "linear-gradient(160deg, #0e4d5c 0%, #0b6e80 50%, #063848 100%)" },
  { label: "Horizon",      value: "linear-gradient(160deg, #4c0d15 0%, #9a1c3c 50%, #7c1f40 100%)" },
];

function GradientPicker({ value, onChange, accent }: { value: string; onChange: (v: string) => void; accent: string }) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="space-y-3">
      {/* Live preview */}
      <div
        className="h-12 w-full rounded-xl border border-white/15"
        style={{ background: value }}
        title="Current gradient preview"
      />

      {/* Preset swatches */}
      <div className="grid grid-cols-4 gap-2">
        {GRADIENT_PRESETS.map((p) => {
          const isActive = value === p.value;
          return (
            <button
              key={p.label}
              onClick={() => onChange(p.value)}
              title={p.label}
              className="group relative rounded-xl overflow-hidden transition-all hover:scale-105"
              style={{
                height: "52px",
                background: p.value,
                border: `2px solid ${isActive ? accent : "rgba(255,255,255,0.12)"}`,
                boxShadow: isActive ? `0 0 0 1px ${accent}80` : "none",
              }}
            >
              <div className="absolute inset-0 flex items-end p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)" }}>
                <span className="text-[9px] font-bold text-white leading-tight">{p.label}</span>
              </div>
              {isActive && (
                <div className="absolute top-1 right-1 h-4 w-4 rounded-full flex items-center justify-center"
                  style={{ background: accent }}>
                  <span className="text-[9px] font-black" style={{ color: "black" }}>✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Raw CSS toggle */}
      <button
        onClick={() => setShowRaw((p) => !p)}
        className="text-[11px] text-white/35 hover:text-white/60 transition-colors flex items-center gap-1"
      >
        <span>{showRaw ? "▲" : "▼"}</span> {showRaw ? "Hide" : "Edit"} raw CSS
      </button>

      {showRaw && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          placeholder="linear-gradient(135deg, #0a1628 0%, #0d2248 100%)"
          className="w-full rounded-xl px-3 py-2.5 text-xs font-mono outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.055)", border: `1px solid rgba(255,255,255,0.095)`, color: "white" }}
        />
      )}
    </div>
  );
}

// ─── FieldRow ─────────────────────────────────────────────────────────────────

function FieldRow({ field, value, onChange, defaultValue, accent, compact = false }:
  { field: FDef; value: string; onChange: (v: string) => void; defaultValue: string; accent: string; compact?: boolean }) {

  const isDirty = value !== defaultValue;

  const base: React.CSSProperties = {
    background: "rgba(255,255,255,0.055)",
    border: `1px solid rgba(255,255,255,0.095)`,
    color: "white",
    borderRadius: "10px",
    padding: compact ? "7px 11px" : "9px 12px",
    fontSize: "13px",
    width: "100%",
    outline: "none",
    resize: "vertical" as const,
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = `${accent}55`;
    e.target.style.boxShadow = `0 0 0 3px ${accent}12`;
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = isDirty ? `${accent}30` : "rgba(255,255,255,0.095)";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="rounded-xl p-3.5 transition-all"
      style={{ background: isDirty ? `${accent}07` : "rgba(255,255,255,0.02)", border: `1px solid ${isDirty ? `${accent}28` : "rgba(255,255,255,0.065)"}` }}>

      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-[12px] font-semibold text-white/72">{field.label}</label>
            {isDirty && (
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ background: `${accent}22`, color: accent }}>edited</span>
            )}
          </div>
          {field.helper && !compact && (
            <p className="text-[11px] text-white/32 mt-0.5 leading-tight">{field.helper}</p>
          )}
        </div>
        {isDirty && (
          <button onClick={() => onChange(defaultValue)} className="flex-shrink-0 text-[11px] text-white/28 hover:text-white/60 transition-colors whitespace-nowrap">
            ↺ reset
          </button>
        )}
      </div>

      {field.type === "toggle" ? (
        <div className="flex items-center gap-3">
          <button onClick={() => onChange(value === "true" ? "false" : "true")}
            className="relative h-6 w-10 rounded-full transition-colors flex-shrink-0"
            style={{ background: value === "true" ? accent : "rgba(255,255,255,0.12)" }}>
            <span className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
              style={{ transform: value === "true" ? "translateX(16px)" : "none" }} />
          </button>
          <span className="text-xs text-white/45">{value === "true" ? "Enabled" : "Disabled"}</span>
        </div>
      ) : field.type === "colorpicker" ? (
        <ColorPicker value={value} onChange={onChange} accent={accent} />
      ) : field.type === "gradient" ? (
        <GradientPicker value={value} onChange={onChange} accent={accent} />
      ) : field.type === "textarea" || field.type === "cities" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)}
          rows={field.type === "cities" ? 7 : compact ? 2 : 3}
          style={base} onFocus={onFocus} onBlur={onBlur}
          placeholder={field.type === "cities" ? "Casablanca\nMarrakech\nRabat…" : defaultValue} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          style={base} onFocus={onFocus} onBlur={onBlur} placeholder={defaultValue} />
      )}

      {!compact && (
        <div className="mt-1.5 text-[10px] text-white/18">key: {field.key}</div>
      )}
    </div>
  );
}
