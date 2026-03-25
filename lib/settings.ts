import { prisma } from "./prisma";

export const SETTING_DEFAULTS: Record<string, string> = {
  // ── Theme ──────────────────────────────────────────────────────────────────
  site_theme: "carbon",

  // ── General ────────────────────────────────────────────────────────────────
  site_name: "BoujlilCar",
  site_tagline: "Car rental across Morocco",

  // ── SEO ────────────────────────────────────────────────────────────────────
  seo_title: "BoujlilCar • Car Rental Morocco",
  seo_description: "Premium car rental across Morocco — WhatsApp-first booking.",

  // ── Homepage hero ──────────────────────────────────────────────────────────
  hero_title: "BoujlilCar — Car rental across Morocco",
  hero_description:
    "Premium fleet, transparent pricing, and fast confirmation on WhatsApp. Salam 👋 khalli lina message and we'll confirm in minutes.",
  hero_btn_fleet: "View Fleet",
  hero_btn_booking: "Booking Form",

  // ── Book section (stats row) ───────────────────────────────────────────────
  book_label: "Reserve Your Car",
  book_subtitle: "Reserve your car in seconds",

  // ── Booking form field labels ─────────────────────────────────────────────
  book_city_label: "City",
  book_pickup_label: "Pickup Date",
  book_return_label: "Return Date",
  book_search_btn: "Search",
  book_wa_btn_tooltip: "Book via WhatsApp",

  // ── Booking form behavior ─────────────────────────────────────────────────
  book_wa_enabled: "true",
  book_stats_enabled: "true",
  book_submit_action: "booking_page",

  stat_1_num: "500+",
  stat_1_lbl: "Cars Available",
  stat_2_num: "8",
  stat_2_lbl: "Cities",
  stat_3_num: "4.9 ★",
  stat_3_lbl: "Avg Rating",
  stat_4_num: "24/7",
  stat_4_lbl: "Support",

  // ── Featured cars section ─────────────────────────────────────────────────
  featured_eyebrow: "Our Fleet",
  featured_title: "Popular Vehicles",
  featured_view_all: "View All →",

  // ── Why Choose Us section ─────────────────────────────────────────────────
  why_eyebrow: "Why BoujlilCar",
  why_title: "The BoujlilCar Difference",
  why_1_title: "Free Cancellation",
  why_1_desc: "Change your plans freely. No fees, no stress.",
  why_2_title: "24/7 Support",
  why_2_desc: "Always available on WhatsApp, day or night.",
  why_3_title: "Wide Selection",
  why_3_desc: "Economy to luxury — find your perfect vehicle.",
  why_4_title: "Best Prices",
  why_4_desc: "Transparent pricing, zero hidden fees — ever.",

  // ── How It Works section ──────────────────────────────────────────────────
  how_eyebrow: "Simple Process",
  how_title: "Renting Is Easy",
  how_1_title: "Choose Your Car",
  how_1_desc: "Browse our fleet and select the vehicle that fits your trip and budget.",
  how_2_title: "Confirm on WhatsApp",
  how_2_desc: "Send your details on WhatsApp and get instant booking confirmation.",
  how_3_title: "Drive Away",
  how_3_desc: "Pick up your car and enjoy the open roads of Morocco.",

  // ── Cities section ────────────────────────────────────────────────────────
  cities_eyebrow: "Coverage",
  cities_title: "Available Across Morocco",
  // Cities list (JSON array)
  cities: JSON.stringify([
    "Casablanca",
    "Marrakech",
    "Rabat",
    "Tangier",
    "Agadir",
    "Fes",
    "Oujda",
    "Tetouan",
  ]),

  // ── Testimonials section ──────────────────────────────────────────────────
  testimonials_eyebrow: "Testimonials",
  testimonials_title: "What Our Clients Say",
  review_1_name: "Youssef B.",
  review_1_city: "Casablanca",
  review_1_text:
    "Excellent service! The car was pristine and the WhatsApp confirmation was instant. Highly recommend BoujlilCar.",
  review_2_name: "Fatima K.",
  review_2_city: "Marrakech",
  review_2_text:
    "Best rental experience in Morocco. Great prices, beautiful cars, and they were available 24/7 for any questions.",
  review_3_name: "Omar A.",
  review_3_city: "Tangier",
  review_3_text:
    "Used BoujlilCar for a road trip from Tangier to Agadir. Smooth process, zero hidden fees. Will use again!",

  // ── CTA Banner section ────────────────────────────────────────────────────
  cta_eyebrow: "Ready?",
  cta_title: "Ready to Hit the Road?",
  cta_desc: "Book your car in under 2 minutes via WhatsApp.",
  cta_wa_btn: "🟢 Book on WhatsApp",
  cta_wa_message:
    "Salam BoujlilCar 👋\n\nBghit n7jez. City: ... Dates: ...\n\nShukran!",
  cta_fleet_btn: "Browse Fleet",

  // ── WhatsApp & contact ────────────────────────────────────────────────────
  wa_number: "212641750719",
  wa_message_book:
    "🌟 *BoujlilCar — طلب حجز*\n\nالسلام عليكم 👋\n\nبغيت نحجز سيارة:\n\n📍 *المدينة :*  ...\n📅 *الاستلام :*  ...\n🏁 *الإرجاع  :*  ...\n👤 *الاسم    :*  ...\n📞 *الهاتف   :*  ...\n\nشكراً بزاف 🙏",
  wa_message_nav:
    "🌟 *BoujlilCar — استفسار*\n\nالسلام عليكم 👋\n\nبغيت نحجز سيارة:\n\n📍 *المدينة :*  ...\n📅 *التواريخ :*  ...\n\nشكراً — كنتسنى ردكم 🙏",
  wa_message_floating:
    "السلام عليكم 👋 — *BoujlilCar*\n\nبغيت نعرف عن السيارات ديالكم.\n\n📍 المدينة: ...\n📅 التواريخ: ...\n\nشكراً بزاف 🙏",
  contact_phone: "0641750719",
  contact_phone_display: "0641750719",

  // ── Navigation ────────────────────────────────────────────────────────────
  nav_logo: "BoujlilCar",
  nav_cta_text: "Book on WhatsApp",

  // ── Footer ────────────────────────────────────────────────────────────────
  footer_text: "© {year} BoujlilCar • Location voiture Maroc",

  // ── Fleet page ────────────────────────────────────────────────────────────
  fleet_title: "Fleet",
  fleet_subtitle: "Browse our cars available across Morocco.",

  // ── Contact page ──────────────────────────────────────────────────────────
  contact_title: "Contact",
  contact_subtitle: "Fastest way: WhatsApp.",
  contact_wa_btn: "WhatsApp us",
  contact_call_btn: "Call",

  // ── Slider global controls ────────────────────────────────────────────────
  slider_duration: "5500",

  // ── Per-slide visual controls (opacity 0-100, shadow, theme color, enabled) ─
  slide_1_opacity: "85",
  slide_1_shadow: "medium",
  slide_1_theme: "#F59E0B",
  slide_1_enabled: "true",

  slide_2_opacity: "85",
  slide_2_shadow: "medium",
  slide_2_theme: "#F59E0B",
  slide_2_enabled: "true",

  slide_3_opacity: "85",
  slide_3_shadow: "medium",
  slide_3_theme: "#F59E0B",
  slide_3_enabled: "true",

  slide_4_opacity: "85",
  slide_4_shadow: "medium",
  slide_4_theme: "#F59E0B",
  slide_4_enabled: "true",

  slide_5_opacity: "85",
  slide_5_shadow: "medium",
  slide_5_theme: "#F59E0B",
  slide_5_enabled: "true",

  // ── Hero Slides ───────────────────────────────────────────────────────────
  slide_1_image: "/slides/slide-1-mountain-road.jpg",
  slide_1_badge: "Morocco's Premium Car Rental",
  slide_1_headline: "Drive Morocco\nin Style",
  slide_1_subline: "Premium fleet, transparent pricing, and instant WhatsApp confirmation across Morocco.",
  slide_1_cta_lbl: "Browse Fleet →",
  slide_1_cta_href: "/fleet",
  slide_1_cta2_lbl: "Book on WhatsApp",
  slide_1_cta2_href: "#book",

  slide_2_image: "/slides/slide-2-marrakech-suv.jpg",
  slide_2_badge: "Wide Selection",
  slide_2_headline: "500+ Cars.\n8 Cities.",
  slide_2_subline: "From economy to luxury — find the perfect vehicle for every trip across Morocco.",
  slide_2_cta_lbl: "View All Cars →",
  slide_2_cta_href: "/fleet",
  slide_2_cta2_lbl: "Find by City",
  slide_2_cta2_href: "/rent",

  slide_3_image: "/slides/slide-3-customer-trust.jpg",
  slide_3_badge: "Trusted by Thousands",
  slide_3_headline: "Rated 4.9★\nby Our Clients",
  slide_3_subline: "Thousands of happy travelers trusted BoujlilCar for their Moroccan adventures.",
  slide_3_cta_lbl: "See Our Fleet →",
  slide_3_cta_href: "/fleet",
  slide_3_cta2_lbl: "Contact Us",
  slide_3_cta2_href: "/contact",

  slide_4_image: "/slides/slide-4-whatsapp-booking.jpg",
  slide_4_badge: "Instant Confirmation",
  slide_4_headline: "Book in 2 Minutes\nvia WhatsApp",
  slide_4_subline: "No forms, no waiting. Send a message and get instant confirmation 24/7.",
  slide_4_cta_lbl: "Book Now →",
  slide_4_cta_href: "#book",
  slide_4_cta2_lbl: "How It Works",
  slide_4_cta2_href: "/#how",

  slide_5_image: "/slides/slide-5-coastal-road.jpg",
  slide_5_badge: "The Open Road Awaits",
  slide_5_headline: "Your Morocco\nAdventure Starts Here",
  slide_5_subline: "Coastal drives, mountain passes, imperial cities — we've got the perfect car for every journey.",
  slide_5_cta_lbl: "Start Your Journey →",
  slide_5_cta_href: "/fleet",
  slide_5_cta2_lbl: "Explore Cities",
  slide_5_cta2_href: "/rent",

  // ── Typography ────────────────────────────────────────────────────────────
  heading_font: "playfair",
  body_font: "dm_sans",
  heading_letter_spacing: "-0.01em",
  body_letter_spacing: "0em",

  // ── Language ──────────────────────────────────────────────────────────────
  default_language: "en",

  // ── Custom color overrides ────────────────────────────────────────────────
  custom_accent_color: "",   // hex — overrides the selected theme's accent (e.g. #F59E0B)
  custom_accent_text: "",    // hex — text color on accent background (e.g. #0A1628)
  custom_site_bg: "",        // CSS gradient — overrides the full-page background

  // ── Section styles ────────────────────────────────────────────────────────
  // Book / reservation form section
  section_book_bg: "linear-gradient(140deg, #0a1628 0%, #0d2248 45%, #091525 100%)",
  section_book_border: "rgba(245,158,11,0.12)",
  section_book_form_bg: "rgba(255,255,255,0.05)",
  section_book_form_border: "rgba(255,255,255,0.1)",
  section_book_field_bg: "rgba(255,255,255,0.08)",
  section_book_field_border: "rgba(255,255,255,0.12)",

  // Why Choose Us cards
  section_why_card_bg: "rgba(255,255,255,0.03)",
  section_why_card_border: "rgba(255,255,255,0.07)",

  // How It Works steps
  section_how_step_bg: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))",
  section_how_step_border: "rgba(245,158,11,0.35)",

  // Featured cars cards
  section_car_card_bg: "rgba(255,255,255,0.04)",
  section_car_card_border: "rgba(255,255,255,0.08)",

  // CTA banner
  section_cta_bg: "linear-gradient(135deg, #0d2040 0%, #162a50 50%, #0a1628 100%)",
  section_cta_border: "rgba(245,158,11,0.2)",

  // Testimonials cards
  section_review_card_bg: "rgba(255,255,255,0.03)",
  section_review_card_border: "rgba(255,255,255,0.07)",

  // ── Car detail page ───────────────────────────────────────────────────────
  car_detail_delivery_title: "Delivery",
  car_detail_delivery_text:
    "Airport pickup + delivery anywhere in Morocco. Fast confirmation on WhatsApp.",
  car_detail_tip: "Tip: Khalli lina message and we'll confirm quickly.",
};

export async function getSetting(key: string): Promise<string> {
  try {
    const s = await prisma.siteSetting.findUnique({ where: { key } });
    return s?.value ?? SETTING_DEFAULTS[key] ?? "";
  } catch {
    return SETTING_DEFAULTS[key] ?? "";
  }
}

export async function getSettings(
  keys: string[]
): Promise<Record<string, string>> {
  try {
    const records = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });
    const map: Record<string, string> = {};
    keys.forEach((k) => (map[k] = SETTING_DEFAULTS[k] ?? ""));
    records.forEach((r) => (map[r.key] = r.value));
    return map;
  } catch {
    const map: Record<string, string> = {};
    keys.forEach((k) => (map[k] = SETTING_DEFAULTS[k] ?? ""));
    return map;
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  return getSettings(Object.keys(SETTING_DEFAULTS));
}
