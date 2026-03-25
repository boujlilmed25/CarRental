"use client";

import { useEffect, useState } from "react";
import { useTheme, themes, ThemeKey } from "./ThemeContext";

const CATEGORIES: Array<{ key: string; label: string; emoji: string; desc: string }> = [
  { key: "Luxury",  label: "Luxury",  emoji: "💎", desc: "Carbon fiber, gold & executive black" },
  { key: "Road",    label: "Road",    emoji: "🏎️", desc: "Racing red, blaze orange & cobalt speed" },
  { key: "Journey", label: "Journey", emoji: "🌍", desc: "Desert roads, coastal drives & open horizons" },
];

interface CustomColors {
  custom_accent_color: string;
  custom_accent_text: string;
  custom_site_bg: string;
}

export default function ThemePicker() {
  const { theme, setTheme, saving } = useTheme();

  const [custom, setCustom] = useState<CustomColors>({
    custom_accent_color: "",
    custom_accent_text: "",
    custom_site_bg: "",
  });
  const [customSaving, setCustomSaving] = useState(false);
  const [customSaved, setCustomSaved] = useState(false);

  // Load custom colors from DB on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const s = data?.settings ?? {};
        setCustom({
          custom_accent_color: s.custom_accent_color ?? "",
          custom_accent_text: s.custom_accent_text ?? "",
          custom_site_bg: s.custom_site_bg ?? "",
        });
      })
      .catch(() => {});
  }, []);

  async function saveCustomColors() {
    setCustomSaving(true);
    setCustomSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(custom),
      });
      setCustomSaved(true);
      setTimeout(() => setCustomSaved(false), 2500);
    } finally {
      setCustomSaving(false);
    }
  }

  async function resetCustomColors() {
    const cleared = { custom_accent_color: "", custom_accent_text: "", custom_site_bg: "" };
    setCustom(cleared);
    setCustomSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleared),
      });
    } finally {
      setCustomSaving(false);
    }
  }

  const activeTheme = themes[theme];
  const previewAccent = custom.custom_accent_color || activeTheme.accent;
  const previewAccentText = custom.custom_accent_text || activeTheme.accentText;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Themes & Colors</h1>
          <p className="mt-1 text-sm text-white/60">
            Choose a preset theme, then optionally override individual colors.
          </p>
        </div>
        {saving && (
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
            Saving…
          </div>
        )}
      </div>

      {/* ── Preset Themes ─────────────────────────────────────────────── */}
      {CATEGORIES.map(({ key, label, emoji, desc }) => {
        const categoryThemes = (
          Object.entries(themes) as [ThemeKey, (typeof themes)[ThemeKey]][]
        ).filter(([, t]) => t.category === key);

        return (
          <section key={key} className="mt-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg leading-none">{emoji}</span>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
                  {label}
                </h2>
                <p className="text-[11px] text-white/35">{desc}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryThemes.map(([themeKey, t]) => {
                const isActive = theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => setTheme(themeKey)}
                    className="group relative overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
                    style={{
                      background: t.bg,
                      borderColor: isActive ? t.accent : t.glassBorder,
                      boxShadow: isActive
                        ? `0 0 0 1.5px ${t.accent}80, 0 8px 32px ${t.accent}30`
                        : `0 2px 16px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <div className="h-16 w-full overflow-hidden" style={{ background: t.siteBg }} />
                    <div
                      className="absolute top-2 left-2 right-2 h-8 rounded-lg"
                      style={{
                        background: t.glass,
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        border: `1px solid ${t.glassBorder}`,
                      }}
                    />
                    <div
                      className="px-3 py-3"
                      style={{
                        background: t.glass,
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        borderTop: `1px solid ${t.glassBorder}`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="h-7 w-7 flex-shrink-0 rounded-full border border-white/20 shadow"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, ${t.accentHover}, ${t.accent})`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-white">{t.label}</div>
                          {isActive ? (
                            <span
                              className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold"
                              style={{ background: t.accent, color: t.accentText }}
                            >
                              ✓ Active
                            </span>
                          ) : (
                            <div className="text-[10px] text-white/35 group-hover:text-white/60 transition-colors">
                              Click to apply
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* ── Custom Color Overrides ─────────────────────────────────────── */}
      <section className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-lg leading-none">🎨</span>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
              Custom Color Overrides
            </h2>
            <p className="text-[11px] text-white/35">
              Override specific colors on top of the selected theme. Leave blank to use theme defaults.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            background: activeTheme.glass,
            border: `1px solid ${activeTheme.glassBorder}`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {/* Accent Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">
                Accent Color
              </label>
              <p className="mb-3 text-[11px] text-white/35">
                Buttons, badges, highlighted text. Theme default: <span style={{ color: activeTheme.accent }}>{activeTheme.accent}</span>
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={custom.custom_accent_color || activeTheme.accent}
                  onChange={(e) => setCustom((p) => ({ ...p, custom_accent_color: e.target.value }))}
                  className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent p-0.5"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={custom.custom_accent_color}
                    onChange={(e) => setCustom((p) => ({ ...p, custom_accent_color: e.target.value }))}
                    placeholder={activeTheme.accent}
                    className="w-full rounded-xl px-3 py-2 text-sm font-mono outline-none"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  />
                </div>
                {custom.custom_accent_color && (
                  <button
                    onClick={() => setCustom((p) => ({ ...p, custom_accent_color: "" }))}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    title="Clear override"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Accent Text Color */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">
                Accent Text Color
              </label>
              <p className="mb-3 text-[11px] text-white/35">
                Text inside accent-colored buttons. Theme default: <span className="font-mono">{activeTheme.accentText}</span>
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={custom.custom_accent_text || activeTheme.accentText}
                  onChange={(e) => setCustom((p) => ({ ...p, custom_accent_text: e.target.value }))}
                  className="h-10 w-14 cursor-pointer rounded-lg border-0 bg-transparent p-0.5"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={custom.custom_accent_text}
                    onChange={(e) => setCustom((p) => ({ ...p, custom_accent_text: e.target.value }))}
                    placeholder={activeTheme.accentText}
                    className="w-full rounded-xl px-3 py-2 text-sm font-mono outline-none"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "white",
                    }}
                  />
                </div>
                {custom.custom_accent_text && (
                  <button
                    onClick={() => setCustom((p) => ({ ...p, custom_accent_text: "" }))}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    title="Clear override"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Site Background */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-white/60">
                Site Background
              </label>
              <p className="mb-3 text-[11px] text-white/35">
                Full CSS gradient for the public site background. Leave blank to use theme default.
              </p>
              <textarea
                value={custom.custom_site_bg}
                onChange={(e) => setCustom((p) => ({ ...p, custom_site_bg: e.target.value }))}
                placeholder={`e.g. linear-gradient(160deg, #0a1628 0%, #0d2248 50%, #091525 100%)`}
                rows={3}
                className="w-full rounded-xl px-3 py-2 text-xs font-mono outline-none resize-none"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                }}
              />
              {custom.custom_site_bg && (
                <button
                  onClick={() => setCustom((p) => ({ ...p, custom_site_bg: "" }))}
                  className="mt-1 text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  ✕ Clear
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 rounded-xl overflow-hidden border border-white/10">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 bg-white/5">
              Preview
            </div>
            <div className="flex items-center gap-3 p-4" style={{ background: custom.custom_site_bg || activeTheme.siteBg }}>
              <button
                className="rounded-xl px-5 py-2.5 text-sm font-black"
                style={{ background: previewAccent, color: previewAccentText }}
              >
                Book Now
              </button>
              <span className="text-sm font-semibold" style={{ color: previewAccent }}>
                500+ Cars Available
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                style={{ background: previewAccent, color: previewAccentText }}
              >
                Featured
              </span>
            </div>
          </div>

          {/* Save / Reset buttons */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={saveCustomColors}
              disabled={customSaving}
              className="rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:brightness-110 disabled:opacity-50"
              style={{ background: previewAccent, color: previewAccentText }}
            >
              {customSaving ? "Saving…" : customSaved ? "✓ Saved" : "Save Custom Colors"}
            </button>
            <button
              onClick={resetCustomColors}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium text-white/60 hover:text-white transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.12)" }}
            >
              Reset to Theme Defaults
            </button>
          </div>
        </div>
      </section>

      {/* Info note */}
      <div
        className="mt-8 rounded-2xl p-4 text-xs text-white/50"
        style={{
          background: activeTheme.glass,
          border: `1px solid ${activeTheme.glassBorder}`,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        💡 Theme and color changes are saved to the database and apply to the public site on next page load.
        Custom color overrides take priority over the selected theme.
      </div>
    </div>
  );
}
