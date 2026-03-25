"use client";

import { useEffect, useState } from "react";
import { HEADING_FONTS, BODY_FONTS, type FontDef } from "@/lib/fonts";
import { useTheme, themes } from "./ThemeContext";

interface TypoSettings {
  heading_font: string;
  body_font: string;
  heading_letter_spacing: string;
  body_letter_spacing: string;
}

const DEFAULTS: TypoSettings = {
  heading_font: "playfair",
  body_font: "dm_sans",
  heading_letter_spacing: "-0.01em",
  body_letter_spacing: "0em",
};

const LS_OPTIONS = [
  { label: "Tight",   value: "-0.04em" },
  { label: "Snug",    value: "-0.02em" },
  { label: "Default", value: "-0.01em" },
  { label: "Normal",  value: "0em" },
  { label: "Wide",    value: "0.02em" },
  { label: "Wider",   value: "0.05em" },
  { label: "Widest",  value: "0.1em" },
];

// Pre-load Google Fonts for preview
function usePreloadFonts(fonts: FontDef[]) {
  useEffect(() => {
    const loaded = new Set<string>();
    fonts.forEach((f) => {
      if (loaded.has(f.key)) return;
      loaded.add(f.key);
      const url = `https://fonts.googleapis.com/css2?family=${f.googleFamily}:wght@${f.weights}&display=swap`;
      if (!document.querySelector(`link[href="${url}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = url;
        document.head.appendChild(link);
      }
    });
  }, [fonts]);
}

export default function TypographyPanel() {
  const { theme } = useTheme();
  const ac = themes[theme].accent;
  const acT = themes[theme].accentText;

  const [settings, setSettings] = useState<TypoSettings>({ ...DEFAULTS });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  usePreloadFonts([...HEADING_FONTS, ...BODY_FONTS]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const s = data?.settings ?? {};
        setSettings({
          heading_font: s.heading_font || DEFAULTS.heading_font,
          body_font: s.body_font || DEFAULTS.body_font,
          heading_letter_spacing: s.heading_letter_spacing || DEFAULTS.heading_letter_spacing,
          body_letter_spacing: s.body_letter_spacing || DEFAULTS.body_letter_spacing,
        });
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  const activeHeading = HEADING_FONTS.find((f) => f.key === settings.heading_font) ?? HEADING_FONTS[0];
  const activeBody = BODY_FONTS.find((f) => f.key === settings.body_font) ?? BODY_FONTS[0];

  function FontDropdown({
    fonts,
    selected,
    onSelect,
    type,
  }: {
    fonts: FontDef[];
    selected: string;
    onSelect: (key: string) => void;
    type: "heading" | "body";
  }) {
    const [open, setOpen] = useState(false);
    const active = fonts.find((f) => f.key === selected) ?? fonts[0];

    return (
      <div className="relative">
        {/* Trigger */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: `1.5px solid ${open ? ac : "rgba(255,255,255,0.12)"}`,
            boxShadow: open ? `0 0 0 1px ${ac}40` : "none",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Preview in actual font */}
            <span
              className="text-white text-xl leading-none flex-shrink-0"
              style={{ fontFamily: active.cssVar, fontWeight: type === "heading" ? 700 : 400 }}
            >
              Aa
            </span>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{active.label}</div>
              <div
                className="text-sm text-white truncate"
                style={{ fontFamily: active.cssVar, fontWeight: type === "heading" ? 600 : 400 }}
              >
                {active.preview}
              </div>
            </div>
          </div>
          <span className="text-white/35 text-xs ml-3 flex-shrink-0">{open ? "▲" : "▼"}</span>
        </button>

        {/* Dropdown list */}
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div
              className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8,14,28,0.98)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                maxHeight: "380px",
                overflowY: "auto",
              }}
            >
              {(() => {
                const categories = Array.from(new Set(fonts.map((f) => f.category)));
                return categories.map((cat) => (
                  <div key={cat}>
                    {/* Category header */}
                    <div className="px-4 pt-3 pb-1.5 text-[10px] font-black uppercase tracking-[0.18em] sticky top-0"
                      style={{ background: "rgba(8,14,28,0.97)", color: "rgba(255,255,255,0.25)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      {cat}
                    </div>
                    {fonts.filter((f) => f.category === cat).map((f) => {
                      const isActive = f.key === selected;
                      return (
                        <button
                          key={f.key}
                          onClick={() => { onSelect(f.key); setOpen(false); }}
                          className="w-full flex items-center gap-4 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                        >
                          <span
                            className="text-xl leading-none w-9 flex-shrink-0 text-center"
                            style={{
                              fontFamily: f.cssVar,
                              fontWeight: type === "heading" ? 700 : 400,
                              color: isActive ? ac : "rgba(255,255,255,0.65)",
                            }}
                          >
                            Aa
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                              style={{ color: isActive ? ac : "rgba(255,255,255,0.38)" }}>
                              {f.label}
                            </div>
                            <div
                              className="text-sm truncate"
                              style={{
                                fontFamily: f.cssVar,
                                fontWeight: type === "heading" ? 600 : 400,
                                color: isActive ? "white" : "rgba(255,255,255,0.55)",
                              }}
                            >
                              {f.preview}
                            </div>
                          </div>
                          {isActive && (
                            <span className="flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black"
                              style={{ background: ac, color: acT }}>✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-white">Typography</h2>
          <p className="mt-1 text-sm text-white/55">
            Heading font, body font, and letter spacing for the public site.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all disabled:opacity-50 active:scale-95"
          style={{ background: ac, color: acT }}
        >
          {saving ? (
            <><span className="h-3.5 w-3.5 rounded-full border-2 border-current/30 border-t-current animate-spin" />Saving…</>
          ) : saved ? "✓ Saved" : "💾 Save Typography"}
        </button>
      </div>

      {/* Live preview banner */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Live Preview</div>
        <div
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: activeHeading.cssVar, letterSpacing: settings.heading_letter_spacing }}
        >
          Drive Morocco in Style
        </div>
        <div
          className="text-sm text-white/60"
          style={{ fontFamily: activeBody.cssVar, letterSpacing: settings.body_letter_spacing }}
        >
          Premium fleet, transparent pricing, and fast WhatsApp confirmation. Reserve your car in seconds.
        </div>
        <div className="mt-3 flex gap-2 text-[11px] text-white/30">
          <span>Heading: <strong className="text-white/50">{activeHeading.label}</strong></span>
          <span>·</span>
          <span>Body: <strong className="text-white/50">{activeBody.label}</strong></span>
        </div>
      </div>

      {/* Heading font */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">Aa</span>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Heading Font</h3>
            <p className="text-[11px] text-white/30">Applied to h1–h5 across the site.</p>
          </div>
        </div>
        <FontDropdown
          fonts={HEADING_FONTS}
          selected={settings.heading_font}
          onSelect={(k) => setSettings((p) => ({ ...p, heading_font: k }))}
          type="heading"
        />

        {/* Letter spacing for headings */}
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">Heading Letter Spacing</div>
          <div className="flex flex-wrap gap-2">
            {LS_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSettings((p) => ({ ...p, heading_letter_spacing: o.value }))}
                className="rounded-xl px-3.5 py-2 text-xs font-medium transition-all"
                style={{
                  background: settings.heading_letter_spacing === o.value ? `${ac}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${settings.heading_letter_spacing === o.value ? ac : "rgba(255,255,255,0.08)"}`,
                  color: settings.heading_letter_spacing === o.value ? ac : "rgba(255,255,255,0.55)",
                }}
              >
                {o.label}
                <span className="ml-1.5 text-[10px] opacity-50">{o.value}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Body font */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">ab</span>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">Body Font</h3>
            <p className="text-[11px] text-white/30">Applied to paragraphs, descriptions, and labels.</p>
          </div>
        </div>
        <FontDropdown
          fonts={BODY_FONTS}
          selected={settings.body_font}
          onSelect={(k) => setSettings((p) => ({ ...p, body_font: k }))}
          type="body"
        />

        {/* Letter spacing for body */}
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">Body Letter Spacing</div>
          <div className="flex flex-wrap gap-2">
            {LS_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setSettings((p) => ({ ...p, body_letter_spacing: o.value }))}
                className="rounded-xl px-3.5 py-2 text-xs font-medium transition-all"
                style={{
                  background: settings.body_letter_spacing === o.value ? `${ac}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${settings.body_letter_spacing === o.value ? ac : "rgba(255,255,255,0.08)"}`,
                  color: settings.body_letter_spacing === o.value ? ac : "rgba(255,255,255,0.55)",
                }}
              >
                {o.label}
                <span className="ml-1.5 text-[10px] opacity-50">{o.value}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div
        className="rounded-2xl p-4 text-xs text-white/45"
        style={{ background: themes[theme].glass, border: `1px solid ${themes[theme].glassBorder}`, backdropFilter: "blur(12px)" }}
      >
        💡 Font changes are saved to the database and apply to the public site on next page load.
        Fonts are loaded from Google Fonts — internet connection required.
      </div>
    </div>
  );
}
