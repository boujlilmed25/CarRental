"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

const NAVY = "#0A1628";

// ── Shadow presets ─────────────────────────────────────────────────────────
const SHADOW_PRESETS = {
  none:   { top: 0,    bottom: 0    },
  light:  { top: 0.25, bottom: 0.35 },
  medium: { top: 0.50, bottom: 0.70 },
  heavy:  { top: 0.75, bottom: 0.92 },
} as const;

export type ShadowPreset = keyof typeof SHADOW_PRESETS;

export interface SlideData {
  id: number;
  image: string;
  badge?: string;
  headline: string;
  subline: string;
  cta: { label: string; href: string; primary?: boolean };
  ctaSecondary?: { label: string; href: string };
  // Visual controls
  overlayOpacity?: number;   // 0-100, controls dark overlay intensity
  shadow?: ShadowPreset;     // vignette intensity
  theme?: string;            // accent color hex, e.g. "#F59E0B"
}

type Props = {
  slides: SlideData[];
  duration?: number; // ms per slide, default 5500
};

export default function HeroSlider({ slides, duration = 5500 }: Props) {
  const activeSlides = slides.filter((s) => s.image); // skip empty
  const count = activeSlides.length;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating, current]
  );

  const next = useCallback(() => goTo((current + 1) % count), [current, goTo, count]);
  const prev = useCallback(() => goTo((current - 1 + count) % count), [current, goTo, count]);

  // Autoplay
  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(next, duration);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, next, duration, count]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (count === 0) return null;

  const slide = activeSlides[current];

  // Per-slide computed values
  const opacity   = Math.max(0, Math.min(100, slide.overlayOpacity ?? 85)) / 100;
  const shadow    = SHADOW_PRESETS[slide.shadow ?? "medium"];
  const accentHex = slide.theme ?? "#F59E0B";

  // Left gradient opacity scales with the opacity setting
  const g = (base: number) => Math.round(base * opacity * 100) / 100;

  return (
    <section
      className="relative mt-6 overflow-hidden rounded-3xl"
      style={{ minHeight: "520px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="BoujlilCar hero slider"
    >
      {/* ── Slide backgrounds ────────────────────────────────────────── */}
      {activeSlides.map((s, i) => {
        const sOpacity = Math.max(0, Math.min(100, s.overlayOpacity ?? 85)) / 100;
        const sG       = (base: number) => Math.round(base * sOpacity * 100) / 100;
        const sShadow  = SHADOW_PRESETS[s.shadow ?? "medium"];

        return (
          <div
            key={s.id}
            aria-hidden={i !== current}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${s.image})` }}
            />
            {/* Left text-safe gradient — scales with opacity */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg,
                  rgba(10,22,40,${sG(0.92)}) 0%,
                  rgba(10,22,40,${sG(0.75)}) 45%,
                  rgba(10,22,40,${sG(0.25)}) 70%,
                  rgba(10,22,40,${sG(0.05)}) 100%)`,
              }}
            />
            {/* Top vignette */}
            {sShadow.top > 0 && (
              <div
                className="absolute inset-x-0 top-0 h-32"
                style={{
                  background: `linear-gradient(180deg, rgba(10,22,40,${sShadow.top}) 0%, transparent 100%)`,
                }}
              />
            )}
            {/* Bottom vignette */}
            {sShadow.bottom > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 h-40"
                style={{
                  background: `linear-gradient(0deg, rgba(10,22,40,${sShadow.bottom}) 0%, transparent 100%)`,
                }}
              />
            )}
          </div>
        );
      })}

      {/* ── Gold dot-grid texture ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentHex}12 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Accent top border ──────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentHex}99, transparent)`,
        }}
      />

      {/* ── Slide content ─────────────────────────────────────────────── */}
      <div className="relative flex min-h-[520px] max-w-[52%] flex-col justify-center px-6 py-14 sm:px-10 lg:px-14">
        {/* Badge */}
        {slide.badge && (
          <div
            key={`badge-${current}`}
            className="animate-slide-in mb-5 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{
              borderColor: `${accentHex}59`,
              background: `${accentHex}14`,
              color: accentHex,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accentHex, animation: "pulse-gold 2s infinite" }}
            />
            {slide.badge}
          </div>
        )}

        {/* Headline */}
        <h1
          key={`headline-${current}`}
          className="animate-slide-in-up max-w-xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", whiteSpace: "pre-line" }}
        >
          {slide.headline}
        </h1>

        {/* Subline */}
        <p
          key={`sub-${current}`}
          className="animate-slide-in-up-delay mt-4 max-w-sm text-sm leading-relaxed text-white/60 sm:text-base"
        >
          {slide.subline}
        </p>

        {/* CTAs */}
        <div
          key={`cta-${current}`}
          className="animate-slide-in-up-delay2 mt-8 flex flex-wrap items-center gap-3"
        >
          <Link
            href={slide.cta.href}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition-all hover:brightness-110 hover:scale-105 active:scale-95"
            style={{ background: accentHex, color: NAVY }}
          >
            {slide.cta.label}
          </Link>
          {slide.ctaSecondary && (
            <Link
              href={slide.ctaSecondary.href}
              className="inline-flex items-center gap-1.5 rounded-xl border px-5 py-3 text-sm font-semibold transition-all hover:bg-white/5"
              style={{ borderColor: `${accentHex}4D`, color: accentHex }}
            >
              {slide.ctaSecondary.label}
            </Link>
          )}
        </div>
      </div>

      {/* ── Navigation arrows ──────────────────────────────────────────── */}
      {count > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:bg-white/10 active:scale-95"
            style={{ borderColor: `${accentHex}40`, color: "rgba(255,255,255,0.6)" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:bg-white/10 active:scale-95"
            style={{ borderColor: `${accentHex}40`, color: "rgba(255,255,255,0.6)" }}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* ── Progress dots ───────────────────────────────────────────────── */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
          {activeSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                height: "4px",
                width: i === current ? "28px" : "8px",
                borderRadius: "2px",
                background: i === current ? accentHex : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      )}

      {/* ── Progress bar ───────────────────────────────────────────────── */}
      {!paused && count > 1 && (
        <div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-[2px] animate-progress"
          style={{ background: accentHex }}
        />
      )}
    </section>
  );
}
