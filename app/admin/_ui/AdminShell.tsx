"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeProvider, useTheme, themes } from "./ThemeContext";
import { LangProvider, useLang, type Lang } from "./LangContext";

const NAV_ITEMS = [
  { key: "dashboard" as const, href: "/admin/dashboard", icon: "📊" },
  { key: "cars" as const, href: "/admin/cars", icon: "🚗" },
  { key: "bookings" as const, href: "/admin/bookings", icon: "📋" },
  { key: "analytics" as const, href: "/admin/analytics", icon: "📈" },
  { key: "content" as const, href: "/admin/content", icon: "✏️" },
  { key: "tracking" as const, href: "/admin/tracking", icon: "📍" },
  { key: "themes" as const, href: "/admin/settings", icon: "🎨" },
];

const LANG_FLAGS: Record<Lang, string> = { fr: "🇫🇷", en: "🇬🇧", ar: "🇲🇦" };

function Shell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const t = themes[theme];
  const { lang, setLang, tr, isRtl } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebarBase =
    "fixed inset-y-0 z-50 w-60 flex flex-col border-white/10 transition-transform duration-300 ease-in-out lg:translate-x-0";
  const sidebarPos = isRtl
    ? `right-0 border-l ${open ? "translate-x-0" : "translate-x-full"}`
    : `left-0 border-r ${open ? "translate-x-0" : "-translate-x-full"}`;

  return (
    <div
      className="min-h-screen flex text-white"
      style={{ background: t.bg }}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`${sidebarBase} ${sidebarPos}`}
        style={{
          background: t.glass,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderColor: t.glassBorder,
        }}
      >
        {/* Brand */}
        <div className="flex-shrink-0 px-5 py-5 border-b border-white/10">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-base flex-shrink-0"
              style={{ background: `${t.accent}25` }}
            >
              🚘
            </div>
            <div>
              <div className="font-bold text-sm leading-none text-white">
                BoujlilCar
              </div>
              <div className="text-[10px] text-white/30 mt-0.5 uppercase tracking-[0.15em]">
                Admin
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ key, href, icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? "text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
                style={
                  active
                    ? {
                        background: `${t.accent}20`,
                        color: t.accent,
                      }
                    : {}
                }
              >
                <span className="text-base leading-none flex-shrink-0">
                  {icon}
                </span>
                <span className="flex-1">{tr.nav[key]}</span>
                {active && (
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ background: t.accent }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex-shrink-0 px-3 py-4 border-t border-white/10 space-y-0.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="text-base flex-shrink-0">🌐</span>
            <span className="flex-1">{tr.nav.viewSite}</span>
            <span className="text-[10px] text-white/25">↗</span>
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <span className="text-base flex-shrink-0">🚪</span>
              <span>{tr.nav.logout}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Main content area ───────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-w-0 ${
          isRtl ? "lg:mr-60" : "lg:ml-60"
        }`}
      >
        {/* Top header bar */}
        <header
          className="flex-shrink-0 sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-white/10"
          style={{
            background: t.headerBg,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottomColor: t.glassBorder,
          }}
        >
          {/* Hamburger — mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6h16M4 12h16M4 18h16"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Status badge — desktop */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-white/40">
            <span
              className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ animation: "pulse-gold 2s infinite" }}
            />
            {tr.common.siteOnline}
          </div>

          <div className="flex-1" />

          {/* Language switcher */}
          <div className="flex items-center gap-0.5 rounded-xl border border-white/15 bg-white/5 p-1">
            {(["fr", "en", "ar"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                title={
                  l === "fr" ? "Français" : l === "en" ? "English" : "العربية"
                }
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                  lang === l
                    ? "text-white"
                    : "text-white/30 hover:text-white/70"
                }`}
                style={
                  lang === l
                    ? { background: t.accent, color: t.accentText }
                    : {}
                }
              >
                <span className="text-sm leading-none">{LANG_FLAGS[l]}</span>
                <span className="hidden sm:inline">{l.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <LangProvider>
        <Shell>{children}</Shell>
      </LangProvider>
    </ThemeProvider>
  );
}

export { useTheme, themes };
