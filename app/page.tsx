import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import WhatsAppFloating from "@/components/WhatsAppFloating";
import HeroForm from "@/components/HeroForm";
import HeroSlider, { type SlideData } from "@/components/HeroSlider";
import { getSettings } from "@/lib/settings";
import { themes, ThemeKey, DEFAULT_THEME } from "@/lib/themes";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

// ── Section label ────────────────────────────────────────────────────────────
function SectionEyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
      {children}
    </div>
  );
}

export default async function Home() {
  const [s, topCars] = await Promise.all([
    getSettings([
      "site_theme",
      "custom_accent_color",
      "custom_accent_text",
      "custom_site_bg",
      "cities",
      "wa_number",
      // Slider global
      "slider_duration",
      // Hero slides
      "slide_1_image", "slide_1_badge", "slide_1_headline", "slide_1_subline",
      "slide_1_cta_lbl", "slide_1_cta_href", "slide_1_cta2_lbl", "slide_1_cta2_href",
      "slide_1_opacity", "slide_1_shadow", "slide_1_theme", "slide_1_enabled",
      "slide_2_image", "slide_2_badge", "slide_2_headline", "slide_2_subline",
      "slide_2_cta_lbl", "slide_2_cta_href", "slide_2_cta2_lbl", "slide_2_cta2_href",
      "slide_2_opacity", "slide_2_shadow", "slide_2_theme", "slide_2_enabled",
      "slide_3_image", "slide_3_badge", "slide_3_headline", "slide_3_subline",
      "slide_3_cta_lbl", "slide_3_cta_href", "slide_3_cta2_lbl", "slide_3_cta2_href",
      "slide_3_opacity", "slide_3_shadow", "slide_3_theme", "slide_3_enabled",
      "slide_4_image", "slide_4_badge", "slide_4_headline", "slide_4_subline",
      "slide_4_cta_lbl", "slide_4_cta_href", "slide_4_cta2_lbl", "slide_4_cta2_href",
      "slide_4_opacity", "slide_4_shadow", "slide_4_theme", "slide_4_enabled",
      "slide_5_image", "slide_5_badge", "slide_5_headline", "slide_5_subline",
      "slide_5_cta_lbl", "slide_5_cta_href", "slide_5_cta2_lbl", "slide_5_cta2_href",
      "slide_5_opacity", "slide_5_shadow", "slide_5_theme", "slide_5_enabled",
      // Book section
      "book_label",
      "book_subtitle",
      // Booking form
      "book_city_label", "book_pickup_label", "book_return_label",
      "book_search_btn", "book_wa_btn_tooltip",
      "book_wa_enabled", "book_stats_enabled", "book_submit_action",
      "stat_1_num", "stat_1_lbl",
      "stat_2_num", "stat_2_lbl",
      "stat_3_num", "stat_3_lbl",
      "stat_4_num", "stat_4_lbl",
      // Featured cars
      "featured_eyebrow", "featured_title", "featured_view_all",
      // Why Choose Us
      "why_eyebrow", "why_title",
      "why_1_title", "why_1_desc",
      "why_2_title", "why_2_desc",
      "why_3_title", "why_3_desc",
      "why_4_title", "why_4_desc",
      // How It Works
      "how_eyebrow", "how_title",
      "how_1_title", "how_1_desc",
      "how_2_title", "how_2_desc",
      "how_3_title", "how_3_desc",
      // Cities section
      "cities_eyebrow", "cities_title",
      // Testimonials
      "testimonials_eyebrow", "testimonials_title",
      "review_1_name", "review_1_city", "review_1_text",
      "review_2_name", "review_2_city", "review_2_text",
      "review_3_name", "review_3_city", "review_3_text",
      // CTA Banner
      "cta_eyebrow", "cta_title", "cta_desc",
      "cta_wa_btn", "cta_wa_message", "cta_fleet_btn",
      // Section styles
      "section_book_bg", "section_book_border",
      "section_book_form_bg", "section_book_form_border",
      "section_book_field_bg", "section_book_field_border",
      "section_why_card_bg", "section_why_card_border",
      "section_how_step_bg", "section_how_step_border",
      "section_car_card_bg", "section_car_card_border",
      "section_cta_bg", "section_cta_border",
      "section_review_card_bg", "section_review_card_border",
    ]),
    prisma.car.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 6,
    }),
  ]);

  const themeKey = (s.site_theme as ThemeKey) || DEFAULT_THEME;
  const t = themes[themeKey] ?? themes[DEFAULT_THEME];
  const GOLD = s.custom_accent_color || t.accent;
  const GOLD_TEXT = s.custom_accent_text || t.accentText;

  const waNumber = s.wa_number || "212641750719";

  let cities: string[] = [
    "Casablanca", "Marrakech", "Rabat", "Tangier",
    "Agadir", "Fes", "Oujda", "Tetouan",
  ];
  try {
    const parsed = JSON.parse(s.cities);
    if (Array.isArray(parsed) && parsed.length > 0) cities = parsed;
  } catch { /* use defaults */ }

  const wa = (m: string) =>
    `https://wa.me/${waNumber}?text=${encodeURIComponent(m)}`;

  const stats = [
    { n: s.stat_1_num, l: s.stat_1_lbl },
    { n: s.stat_2_num, l: s.stat_2_lbl },
    { n: s.stat_3_num, l: s.stat_3_lbl },
    { n: s.stat_4_num, l: s.stat_4_lbl },
  ];

  const whyCards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: s.why_1_title,
      desc: s.why_1_desc,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: s.why_2_title,
      desc: s.why_2_desc,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: s.why_3_title,
      desc: s.why_3_desc,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: s.why_4_title,
      desc: s.why_4_desc,
    },
  ];

  const howSteps = [
    { step: "01", title: s.how_1_title, desc: s.how_1_desc },
    { step: "02", title: s.how_2_title, desc: s.how_2_desc },
    { step: "03", title: s.how_3_title, desc: s.how_3_desc },
  ];

  const reviews = [
    { name: s.review_1_name, city: s.review_1_city, text: s.review_1_text },
    { name: s.review_2_name, city: s.review_2_city, text: s.review_2_text },
    { name: s.review_3_name, city: s.review_3_city, text: s.review_3_text },
  ];

  const sliderDuration = parseInt(s.slider_duration ?? "5500", 10) || 5500;

  const slides: SlideData[] = [1, 2, 3, 4, 5]
    .filter((n) => s[`slide_${n}_enabled`] !== "false")
    .map((n) => ({
      id: n,
      image: s[`slide_${n}_image`],
      badge: s[`slide_${n}_badge`] || undefined,
      headline: s[`slide_${n}_headline`],
      subline: s[`slide_${n}_subline`],
      cta: { label: s[`slide_${n}_cta_lbl`], href: s[`slide_${n}_cta_href`], primary: true },
      ctaSecondary: s[`slide_${n}_cta2_lbl`]
        ? { label: s[`slide_${n}_cta2_lbl`], href: s[`slide_${n}_cta2_href`] }
        : undefined,
      overlayOpacity: parseInt(s[`slide_${n}_opacity`] ?? "85", 10),
      shadow: (s[`slide_${n}_shadow`] ?? "medium") as SlideData["shadow"],
      theme: s[`slide_${n}_theme`] || "#F59E0B",
    }));

  return (
    <SiteShell>
      <WhatsAppFloating />

      {/* ══════════════════════════════════════════════════════════════
          HERO SLIDER
      ══════════════════════════════════════════════════════════════ */}
      <HeroSlider slides={slides} duration={sliderDuration} />

      {/* ── Booking form + stats below the slider ────────────────── */}
      <section
        id="book"
        className="relative mt-4 overflow-hidden rounded-3xl"
        style={{
          background: s.section_book_bg,
          border: `1px solid ${s.section_book_border}`,
        }}
      >
        <div className="relative px-6 py-10 sm:px-10 lg:px-14">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest" style={{ color: GOLD }}>
            {s.book_label}
          </p>
          {s.book_subtitle && (
            <p className="mb-4 text-xs text-white/40">{s.book_subtitle}</p>
          )}
          <HeroForm
            cities={cities}
            waNumber={waNumber}
            cityLabel={s.book_city_label}
            pickupLabel={s.book_pickup_label}
            returnLabel={s.book_return_label}
            searchBtnText={s.book_search_btn}
            waBtnTooltip={s.book_wa_btn_tooltip}
            waEnabled={s.book_wa_enabled !== "false"}
            submitAction={s.book_submit_action === "whatsapp" ? "whatsapp" : "booking_page"}
            accentColor={GOLD}
            accentText={GOLD_TEXT}
            formBg={s.section_book_form_bg}
            formBorder={s.section_book_form_border}
            fieldBg={s.section_book_field_bg}
            fieldBorder={s.section_book_field_border}
          />

          {/* Stats row */}
          {s.book_stats_enabled !== "false" && (
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/5 pt-8">
              {stats.map(({ n, l }) => (
                <div key={l}>
                  <div className="text-xl font-black" style={{ color: GOLD }}>
                    {n}
                  </div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-white/40">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURED CARS
      ══════════════════════════════════════════════════════════════ */}
      {topCars.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <SectionEyebrow color={GOLD}>{s.featured_eyebrow}</SectionEyebrow>
              <h2
                className="mt-1 text-2xl font-bold sm:text-3xl"
                style={serif}
              >
                {s.featured_title}
              </h2>
            </div>
            <Link
              href="/fleet"
              className="hidden text-xs font-semibold transition-colors hover:text-white sm:block"
              style={{ color: GOLD }}
            >
              {s.featured_view_all}
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topCars.map((car) => (
              <Link
                key={car.id}
                href={`/car/${car.slug}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: s.section_car_card_bg,
                  border: `1px solid ${s.section_car_card_border}`,
                }}
              >
                {/* Gold glow border on hover */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(245,158,11,0.45)" }}
                />

                {/* Image */}
                <div className="relative h-44 overflow-hidden bg-white/5">
                  {car.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={car.imageUrl}
                      alt={car.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        viewBox="0 0 220 80"
                        className="w-40 opacity-15"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M200,50 C200,56 195,60 188,60 L32,60 C25,60 20,56 20,50 L20,44 L8,40 L8,35 L14,33 L18,20 C20,13 27,8 34,8 L186,8 C193,8 200,13 202,20 L206,33 L212,35 L212,40 L200,44 Z" />
                        <circle cx="60" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
                        <circle cx="160" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    {car.featured && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide"
                        style={{ background: GOLD, color: GOLD_TEXT }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-3 right-3">
                    <div
                      className="rounded-xl px-2.5 py-1 text-sm font-black"
                      style={{ background: "rgba(10,22,40,0.85)", color: GOLD }}
                    >
                      MAD {car.pricePerDay}
                      <span className="text-[10px] font-normal text-white/50">/day</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{car.name}</h3>
                      <div className="mt-0.5 text-xs text-white/40">
                        {car.category} · {car.city}
                      </div>
                    </div>
                  </div>

                  {/* Specs */}
                  <div className="mt-3 flex gap-3 text-xs text-white/40">
                    <span>👥 {car.seats} seats</span>
                    <span>⚙️ {car.transmission}</span>
                    <span>⛽ {car.fuel}</span>
                  </div>

                  {/* CTA */}
                  <div
                    className="mt-4 rounded-xl py-2.5 text-center text-sm font-bold transition-all duration-200 group-hover:brightness-110"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      color: GOLD,
                    }}
                  >
                    Book Now →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 rounded-xl border px-5 py-2.5 text-sm font-semibold"
              style={{ borderColor: "rgba(245,158,11,0.3)", color: GOLD }}
            >
              {s.featured_view_all}
            </Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-8 text-center">
          <SectionEyebrow color={GOLD}>{s.why_eyebrow}</SectionEyebrow>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl" style={serif}>
            {s.why_title}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyCards.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-2xl border p-5 transition-all duration-300 hover:border-amber-400/25 hover:-translate-y-0.5"
              style={{
                background: s.section_why_card_bg,
                borderColor: s.section_why_card_border,
              }}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(245,158,11,0.12)",
                  color: GOLD,
                }}
              >
                {icon}
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-white/45">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-10 text-center">
          <SectionEyebrow color={GOLD}>{s.how_eyebrow}</SectionEyebrow>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl" style={serif}>
            {s.how_title}
          </h2>
        </div>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connector line */}
          <div
            className="absolute left-8 right-8 top-8 hidden h-px sm:block"
            style={{
              background:
                "linear-gradient(90deg, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0.1) 100%)",
            }}
          />

          {howSteps.map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col items-start gap-4">
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-black"
                style={{
                  background: s.section_how_step_bg,
                  border: `1px solid ${s.section_how_step_border}`,
                  color: GOLD,
                }}
              >
                {step}
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-white/45">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CITIES
      ══════════════════════════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <SectionEyebrow color={GOLD}>{s.cities_eyebrow}</SectionEyebrow>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl" style={serif}>
              {s.cities_title}
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c) => (
            <Link
              key={c}
              href={`/rent/${encodeURIComponent(c.toLowerCase())}`}
              className="group rounded-2xl border p-4 transition-all duration-200 hover:border-amber-400/35 hover:bg-amber-400/5"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="font-semibold transition-colors group-hover:text-amber-400">
                {c}
              </div>
              <div className="mt-1 text-xs text-white/40">
                See deals &amp; availability →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════ */}
      <section className="mt-20">
        <div className="mb-8 text-center">
          <SectionEyebrow color={GOLD}>{s.testimonials_eyebrow}</SectionEyebrow>
          <h2 className="mt-1 text-2xl font-bold sm:text-3xl" style={serif}>
            {s.testimonials_title}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {reviews.map(({ name, city, text }) => (
            <div
              key={name}
              className="flex flex-col justify-between rounded-2xl border p-5"
              style={{
                background: s.section_review_card_bg,
                borderColor: s.section_review_card_border,
              }}
            >
              {/* Stars */}
              <div className="mb-3 flex gap-0.5 text-sm" style={{ color: GOLD }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>

              <p className="flex-1 text-sm italic leading-relaxed text-white/60">
                &ldquo;{text}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: "rgba(245,158,11,0.15)", color: GOLD }}
                >
                  {name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{name}</div>
                  <div className="text-xs text-white/35">{city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative mt-20 overflow-hidden rounded-3xl p-8 text-center sm:p-14"
        style={{
          background: s.section_cta_bg,
          border: `1px solid ${s.section_cta_border}`,
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative">
          <SectionEyebrow color={GOLD}>{s.cta_eyebrow}</SectionEyebrow>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl" style={serif}>
            {s.cta_title}
          </h2>
          <p className="mt-2 text-sm text-white/50">
            {s.cta_desc}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={wa(s.cta_wa_message)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-black transition-all hover:brightness-110 hover:scale-105 active:scale-95"
              style={{ background: GOLD, color: GOLD_TEXT }}
            >
              {s.cta_wa_btn}
            </a>
            <Link
              href="/fleet"
              className="inline-flex items-center gap-1.5 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-white/5"
              style={{
                borderColor: "rgba(245,158,11,0.3)",
                color: GOLD,
              }}
            >
              {s.cta_fleet_btn}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
