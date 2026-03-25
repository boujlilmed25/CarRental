"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SUPPORTED_LANGS, LANG_LABELS, LANG_NAMES, type Lang } from "@/lib/translations";

interface Props {
  currentLang: Lang;
  accentColor?: string;
  accentText?: string;
}

export default function LangSwitcher({ currentLang, accentColor = "#F59E0B", accentText = "#0A1628" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  async function switchLang(lang: Lang) {
    if (lang === currentLang) { setOpen(false); return; }
    await fetch("/api/lang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
    setOpen(false);
    startTransition(() => router.refresh());
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={pending}
        className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all hover:brightness-110 disabled:opacity-50"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
      >
        {pending ? (
          <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white/80 animate-spin" />
        ) : (
          <span className="text-base leading-none">🌐</span>
        )}
        <span>{LANG_LABELS[currentLang]}</span>
        <span className="text-white/40 text-[10px]">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute right-0 top-full mt-1.5 z-50 min-w-[130px] rounded-2xl overflow-hidden py-1"
            style={{
              background: "rgba(10,22,40,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            {SUPPORTED_LANGS.map((lang) => {
              const isActive = lang === currentLang;
              return (
                <button
                  key={lang}
                  onClick={() => switchLang(lang)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors hover:bg-white/5"
                  style={{ color: isActive ? accentColor : "rgba(255,255,255,0.7)" }}
                >
                  <span className="text-base leading-none">
                    {lang === "en" ? "🇬🇧" : lang === "fr" ? "🇫🇷" : "🇲🇦"}
                  </span>
                  <span className="font-medium">{LANG_NAMES[lang]}</span>
                  {isActive && (
                    <span className="ml-auto text-[10px] font-black" style={{ color: accentColor }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
