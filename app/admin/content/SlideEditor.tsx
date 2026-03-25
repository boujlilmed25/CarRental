'use client'

import { useEffect, useRef, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ShadowPreset = 'none' | 'light' | 'medium' | 'heavy'

interface SlideState {
  enabled: boolean
  image: string
  badge: string
  headline: string
  subline: string
  ctaLbl: string
  ctaHref: string
  cta2Lbl: string
  cta2Href: string
  opacity: number
  shadow: ShadowPreset
  theme: string
}

const EMPTY_SLIDE: SlideState = {
  enabled: true,
  image: '',
  badge: '',
  headline: '',
  subline: '',
  ctaLbl: '',
  ctaHref: '',
  cta2Lbl: '',
  cta2Href: '',
  opacity: 85,
  shadow: 'medium',
  theme: '#F59E0B',
}

// ── Theme presets ─────────────────────────────────────────────────────────────
const THEME_PRESETS = [
  { label: 'Gold',   color: '#F59E0B' },
  { label: 'Blue',   color: '#3B82F6' },
  { label: 'Green',  color: '#10B981' },
  { label: 'Red',    color: '#EF4444' },
  { label: 'Purple', color: '#8B5CF6' },
  { label: 'White',  color: '#FFFFFF' },
]

// ── Shadow labels ─────────────────────────────────────────────────────────────
const SHADOW_OPTIONS: { value: ShadowPreset; label: string; icon: string }[] = [
  { value: 'none',   label: 'Aucun',  icon: '○' },
  { value: 'light',  label: 'Léger',  icon: '◔' },
  { value: 'medium', label: 'Moyen',  icon: '◑' },
  { value: 'heavy',  label: 'Intense',icon: '●' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function settingsToSlide(s: Record<string, string>, n: number): SlideState {
  return {
    enabled:  s[`slide_${n}_enabled`] !== 'false',
    image:    s[`slide_${n}_image`]     ?? '',
    badge:    s[`slide_${n}_badge`]     ?? '',
    headline: s[`slide_${n}_headline`]  ?? '',
    subline:  s[`slide_${n}_subline`]   ?? '',
    ctaLbl:   s[`slide_${n}_cta_lbl`]  ?? '',
    ctaHref:  s[`slide_${n}_cta_href`] ?? '',
    cta2Lbl:  s[`slide_${n}_cta2_lbl`] ?? '',
    cta2Href: s[`slide_${n}_cta2_href`] ?? '',
    opacity:  parseInt(s[`slide_${n}_opacity`] ?? '85', 10),
    shadow:   (s[`slide_${n}_shadow`]   ?? 'medium') as ShadowPreset,
    theme:    s[`slide_${n}_theme`]     ?? '#F59E0B',
  }
}

function slideToPatch(slide: SlideState, n: number): Record<string, string> {
  return {
    [`slide_${n}_enabled`]:   slide.enabled ? 'true' : 'false',
    [`slide_${n}_image`]:     slide.image,
    [`slide_${n}_badge`]:     slide.badge,
    [`slide_${n}_headline`]:  slide.headline,
    [`slide_${n}_subline`]:   slide.subline,
    [`slide_${n}_cta_lbl`]:  slide.ctaLbl,
    [`slide_${n}_cta_href`]: slide.ctaHref,
    [`slide_${n}_cta2_lbl`]: slide.cta2Lbl,
    [`slide_${n}_cta2_href`]:slide.cta2Href,
    [`slide_${n}_opacity`]:   String(slide.opacity),
    [`slide_${n}_shadow`]:    slide.shadow,
    [`slide_${n}_theme`]:     slide.theme,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export default function SlideEditor() {
  const [loading, setLoading]     = useState(true)
  const [slides, setSlides]       = useState<SlideState[]>(Array(5).fill(null).map(() => ({ ...EMPTY_SLIDE })))
  const [duration, setDuration]   = useState(5500)
  const [activeSlide, setActive]  = useState(0)
  const [saving, setSaving]       = useState(false)
  const [saveMsg, setSaveMsg]     = useState<'ok' | 'err' | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Load settings ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/admin/settings', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        const s: Record<string, string> = j.settings ?? {}
        setSlides([1, 2, 3, 4, 5].map((n) => settingsToSlide(s, n)))
        setDuration(parseInt(s.slider_duration ?? '5500', 10) || 5500)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Update a single slide field ────────────────────────────────────────────────
  function updateSlide<K extends keyof SlideState>(idx: number, key: K, val: SlideState[K]) {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: val } : s)))
  }

  // Upload image ───────────────────────────────────────────────────────────────
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'slides')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await res.json()
      if (data.url) updateSlide(activeSlide, 'image', data.url)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // Save ───────────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true)
    setSaveMsg(null)
    const patch: Record<string, string> = { slider_duration: String(duration) }
    slides.forEach((sl, i) => Object.assign(patch, slideToPatch(sl, i + 1)))
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    setSaving(false)
    setSaveMsg(res.ok ? 'ok' : 'err')
    setTimeout(() => setSaveMsg(null), 3000)
  }

  const slide = slides[activeSlide]

  return (
    <div className="space-y-5">
      {/* Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">🖼️ Hero Slides</h2>
          <p className="mt-0.5 text-xs text-white/50">
            Gérer les 5 slides du carousel — images, texte, couleurs, ombres.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10 transition-all">
            Prévisualiser ↗
          </a>
          <button
            onClick={save}
            disabled={saving || loading}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: saveMsg === 'ok' ? '#22c55e' : saveMsg === 'err' ? '#ef4444' : '#3b82f6' }}
          >
            {saving ? 'Enregistrement…' : saveMsg === 'ok' ? '✓ Enregistré !' : saveMsg === 'err' ? '✕ Erreur' : 'Enregistrer tout'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-white/40 py-10 text-center">Chargement…</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-5">

          {/* ── Left panel: global + slide list ──────────────────────────── */}
          <div className="space-y-4">
            {/* Global duration */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">⚙️ Global</p>
              <label className="block text-xs text-white/50 mb-1">
                Durée par slide — <span className="text-white font-medium">{(duration / 1000).toFixed(1)}s</span>
              </label>
              <input
                type="range" min={2000} max={12000} step={500}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-white/30 mt-1">
                <span>2s</span><span>12s</span>
              </div>
            </div>

            {/* Slide tabs */}
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <p className="px-4 pt-3 pb-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
                Slides
              </p>
              {slides.map((sl, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-t border-white/5 ${
                    activeSlide === i ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-10 w-14 rounded-lg flex-shrink-0 bg-white/10 bg-center bg-cover border border-white/10"
                    style={sl.image ? { backgroundImage: `url(${sl.image})` } : {}}
                  >
                    {!sl.image && (
                      <div className="h-full w-full flex items-center justify-center text-white/20 text-xs">📷</div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-white">Slide {i + 1}</span>
                      {!sl.enabled && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400">OFF</span>
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 truncate mt-0.5">
                      {sl.headline || 'Sans titre…'}
                    </p>
                  </div>
                  {/* Accent dot */}
                  <span
                    className="h-3 w-3 rounded-full flex-shrink-0 border border-white/20"
                    style={{ background: sl.theme }}
                  />
                  {activeSlide === i && (
                    <svg className="h-3 w-3 text-white/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right panel: editor ──────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Slide header */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-semibold text-white">Slide {activeSlide + 1}</h3>
                {/* Enable toggle */}
                <button
                  onClick={() => updateSlide(activeSlide, 'enabled', !slide.enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    slide.enabled ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      slide.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-white/40">{slide.enabled ? 'Activé' : 'Désactivé'}</span>
              </div>
            </div>

            {/* ── Section 1: Image ───────────────────────────────────────── */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3">📸 Image</p>

              {/* Preview */}
              <div
                className="relative h-40 w-full rounded-xl bg-white/5 border border-white/10 overflow-hidden bg-center bg-cover mb-3"
                style={slide.image ? { backgroundImage: `url(${slide.image})` } : {}}
              >
                {!slide.image && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20">
                    <span className="text-3xl">🖼️</span>
                    <span className="text-xs">Aucune image</span>
                  </div>
                )}
                {/* Upload button overlay */}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white text-xs font-medium transition-all backdrop-blur-sm"
                >
                  {uploading ? (
                    <>
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Upload…
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Uploader depuis PC
                    </>
                  )}
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />

              {/* Manual path input */}
              <div>
                <label className="block text-xs text-white/50 mb-1">
                  Chemin de l&apos;image <span className="text-white/25">(ou uploader ci-dessus)</span>
                </label>
                <input
                  type="text"
                  value={slide.image}
                  onChange={(e) => updateSlide(activeSlide, 'image', e.target.value)}
                  placeholder="/slides/mon-image.jpg"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none"
                />
              </div>
            </div>

            {/* ── Section 2: Visual Controls ─────────────────────────────── */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">🎨 Effets visuels</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* Opacity */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">
                    Opacité overlay —
                    <span className="text-white font-medium ml-1">{slide.opacity}%</span>
                  </label>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={slide.opacity}
                    onChange={(e) => updateSlide(activeSlide, 'opacity', Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                  <div className="flex justify-between text-[10px] text-white/30 mt-1">
                    <span>Transparent</span><span>Sombre</span>
                  </div>
                  {/* Visual preview strip */}
                  <div
                    className="mt-2 h-4 w-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, rgba(10,22,40,0) 0%, rgba(10,22,40,${slide.opacity / 100}) 100%)`,
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>

                {/* Shadow */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Ombre / Vignette</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {SHADOW_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateSlide(activeSlide, 'shadow', opt.value)}
                        className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs transition-all border ${
                          slide.shadow === opt.value
                            ? 'bg-white/15 border-white/40 text-white font-medium'
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-sm leading-none">{opt.icon}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme color */}
                <div>
                  <label className="block text-xs text-white/50 mb-1.5">Couleur accent</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {THEME_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        onClick={() => updateSlide(activeSlide, 'theme', p.color)}
                        title={p.label}
                        className="h-7 w-7 rounded-full border-2 transition-all hover:scale-110"
                        style={{
                          background: p.color,
                          borderColor: slide.theme === p.color ? 'white' : 'transparent',
                          boxShadow: slide.theme === p.color ? `0 0 0 1px rgba(255,255,255,0.3)` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  {/* Custom color picker */}
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={slide.theme}
                      onChange={(e) => updateSlide(activeSlide, 'theme', e.target.value)}
                      className="h-8 w-8 rounded-lg cursor-pointer border border-white/10 bg-transparent"
                    />
                    <input
                      type="text"
                      value={slide.theme}
                      onChange={(e) => updateSlide(activeSlide, 'theme', e.target.value)}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-white/25"
                      placeholder="#F59E0B"
                    />
                  </div>
                </div>
              </div>

              {/* Live preview bar */}
              <div
                className="mt-4 h-8 w-full rounded-xl overflow-hidden relative"
                style={{ background: `url(${slide.image || ''}) center/cover, #1a1a2e` }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(90deg, rgba(10,22,40,${(slide.opacity / 100) * 0.9}) 0%, transparent 60%)`,
                  }}
                />
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold"
                  style={{ color: slide.theme }}
                >
                  ● Aperçu couleur
                </div>
              </div>
            </div>

            {/* ── Section 3: Texte ───────────────────────────────────────── */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">✏️ Texte</p>

              <div className="space-y-3">
                <Field
                  label="Badge"
                  placeholder="ex: Morocco's Premium Car Rental"
                  value={slide.badge}
                  onChange={(v) => updateSlide(activeSlide, 'badge', v)}
                />
                <Field
                  label="Titre (\\n pour retour ligne)"
                  placeholder="ex: Drive Morocco\nen Style"
                  value={slide.headline}
                  onChange={(v) => updateSlide(activeSlide, 'headline', v)}
                />
                <Field
                  label="Sous-titre"
                  placeholder="Description courte…"
                  value={slide.subline}
                  onChange={(v) => updateSlide(activeSlide, 'subline', v)}
                  multiline
                />
              </div>
            </div>

            {/* ── Section 4: Boutons CTA ─────────────────────────────────── */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4">🔗 Boutons</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <p className="text-xs text-white/50 font-medium">Bouton principal</p>
                  <Field
                    label="Texte"
                    placeholder="Browse Fleet →"
                    value={slide.ctaLbl}
                    onChange={(v) => updateSlide(activeSlide, 'ctaLbl', v)}
                  />
                  <Field
                    label="Lien"
                    placeholder="/fleet"
                    value={slide.ctaHref}
                    onChange={(v) => updateSlide(activeSlide, 'ctaHref', v)}
                  />
                  {/* Preview button */}
                  {slide.ctaLbl && (
                    <div
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold"
                      style={{ background: slide.theme, color: '#0A1628' }}
                    >
                      {slide.ctaLbl}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-white/50 font-medium">Bouton secondaire <span className="text-white/25">(optionnel)</span></p>
                  <Field
                    label="Texte"
                    placeholder="Book on WhatsApp"
                    value={slide.cta2Lbl}
                    onChange={(v) => updateSlide(activeSlide, 'cta2Lbl', v)}
                  />
                  <Field
                    label="Lien"
                    placeholder="#book"
                    value={slide.cta2Href}
                    onChange={(v) => updateSlide(activeSlide, 'cta2Href', v)}
                  />
                  {/* Preview button */}
                  {slide.cta2Lbl && (
                    <div
                      className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: `${slide.theme}4D`, color: slide.theme }}
                    >
                      {slide.cta2Lbl}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

// ── Reusable field ────────────────────────────────────────────────────────────
function Field({
  label,
  placeholder,
  value,
  onChange,
  multiline = false,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  const base =
    'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-white/25 focus:outline-none transition-colors'

  return (
    <div>
      <label className="block text-xs text-white/50 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${base} resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={base}
        />
      )}
    </div>
  )
}
