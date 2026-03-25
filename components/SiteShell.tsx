import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { themes, ThemeKey, DEFAULT_THEME } from "@/lib/themes";
import { getLang } from "@/lib/i18n";
import { t } from "@/lib/translations";
import LangSwitcher from "./LangSwitcher";

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const [s, lang] = await Promise.all([
    getSettings([
      "site_name",
      "nav_logo",
      "nav_cta_text",
      "wa_number",
      "wa_message_nav",
      "footer_text",
      "site_theme",
      "custom_accent_color",
      "custom_accent_text",
      "custom_site_bg",
    ]),
    Promise.resolve(getLang()),
  ]);

  const waNumber = s.wa_number || "212641750719";
  const wa = (m: string) => `https://wa.me/${waNumber}?text=${encodeURIComponent(m)}`;
  const navLogo = s.nav_logo || s.site_name || "BoujlilCar";
  const navCtaText = s.nav_cta_text || t("nav_cta", lang);
  const waMessageNav = s.wa_message_nav || "Salam BoujlilCar 👋";
  const footerText = (s.footer_text || "© {year} BoujlilCar • Location voiture Maroc").replace(
    "{year}",
    String(new Date().getFullYear())
  );

  // Active theme + custom overrides
  const themeKey = (s.site_theme as ThemeKey) || DEFAULT_THEME;
  const th = themes[themeKey] ?? themes[DEFAULT_THEME];
  const accent = s.custom_accent_color || th.accent;
  const accentText = s.custom_accent_text || th.accentText;
  const siteBg = s.custom_site_bg || th.siteBg;

  // Split logo name at "Car" to color it with accent
  const logoIdx = navLogo.indexOf("Car");
  const logoBefore = logoIdx >= 0 ? navLogo.slice(0, logoIdx) : navLogo;
  const logoAfter = logoIdx >= 0 ? navLogo.slice(logoIdx + 3) : "";
  const hasCar = logoIdx >= 0;

  return (
    <div className="min-h-screen text-white" style={{ background: siteBg }}>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: th.headerBg,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${th.glassBorder}`,
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="text-sm font-bold tracking-wide">
            {hasCar ? (
              <>
                {logoBefore}
                <span style={{ color: accent }}>Car</span>
                {logoAfter}
              </>
            ) : (
              navLogo
            )}
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-2 text-xs">
            <Link
              href="/fleet"
              className="rounded-xl px-3 py-2 font-medium transition-all hover:text-white"
              style={{
                background: th.glass,
                border: `1px solid ${th.glassBorder}`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {t("nav_fleet", lang)}
            </Link>
            <Link
              href="/contact"
              className="rounded-xl px-3 py-2 font-medium transition-all hover:text-white"
              style={{
                background: th.glass,
                border: `1px solid ${th.glassBorder}`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {t("nav_contact", lang)}
            </Link>

            {/* Language switcher */}
            <LangSwitcher currentLang={lang} accentColor={accent} accentText={accentText} />

            <a
              href={wa(waMessageNav)}
              className="rounded-xl px-3 py-2 text-xs font-bold transition-all hover:brightness-110 hover:scale-105 active:scale-95"
              style={{
                background: accent,
                color: accentText,
              }}
            >
              {navCtaText}
            </a>
          </nav>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────── */}
      <main className="mx-auto max-w-6xl px-4 pb-14 pt-4">{children}</main>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer
        style={{
          background: th.glass,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: `1px solid ${th.glassBorder}`,
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-white/60">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>{footerText}</div>
            <div className="flex gap-4">
              <Link className="hover:text-white transition-colors" href="/fleet">{t("footer_fleet", lang)}</Link>
              <Link className="hover:text-white transition-colors" href="/contact">{t("footer_contact", lang)}</Link>
              <a
                className="hover:text-white transition-colors"
                href={wa(waMessageNav)}
              >
                {t("footer_whatsapp", lang)}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
