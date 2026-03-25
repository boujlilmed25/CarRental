// ─── Static UI Translations — En / Fr / Ar ───────────────────────────────────

export type Lang = "en" | "fr" | "ar";
export const SUPPORTED_LANGS: Lang[] = ["en", "fr", "ar"];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN",
  fr: "FR",
  ar: "عر",
};

export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const RTL_LANGS: Lang[] = ["ar"];

type Translations = {
  // Navbar
  nav_fleet: string;
  nav_contact: string;
  nav_cta: string;

  // Language switcher
  lang_label: string;

  // Search form
  form_city: string;
  form_pickup: string;
  form_return: string;
  form_search: string;
  form_wa_tooltip: string;

  // Car cards
  car_book_now: string;
  car_featured: string;
  car_seats: string;
  car_per_day: string;
  car_view_all: string;

  // Cities
  city_see_deals: string;

  // Reviews
  review_stars: string;

  // Footer
  footer_fleet: string;
  footer_contact: string;
  footer_whatsapp: string;

  // Error / misc
  loading: string;
};

export const translations: Record<Lang, Translations> = {
  en: {
    nav_fleet: "Fleet",
    nav_contact: "Contact",
    nav_cta: "Book on WhatsApp",
    lang_label: "Language",

    form_city: "City",
    form_pickup: "Pickup Date",
    form_return: "Return Date",
    form_search: "Search",
    form_wa_tooltip: "Book via WhatsApp",

    car_book_now: "Book Now →",
    car_featured: "Featured",
    car_seats: "seats",
    car_per_day: "/day",
    car_view_all: "View All →",

    city_see_deals: "See deals & availability →",

    review_stars: "★★★★★",

    footer_fleet: "Fleet",
    footer_contact: "Contact",
    footer_whatsapp: "WhatsApp",

    loading: "Loading…",
  },

  fr: {
    nav_fleet: "Flotte",
    nav_contact: "Contact",
    nav_cta: "Réserver sur WhatsApp",
    lang_label: "Langue",

    form_city: "Ville",
    form_pickup: "Date de départ",
    form_return: "Date de retour",
    form_search: "Rechercher",
    form_wa_tooltip: "Réserver via WhatsApp",

    car_book_now: "Réserver →",
    car_featured: "En vedette",
    car_seats: "places",
    car_per_day: "/jour",
    car_view_all: "Voir tout →",

    city_see_deals: "Voir les offres & disponibilités →",

    review_stars: "★★★★★",

    footer_fleet: "Flotte",
    footer_contact: "Contact",
    footer_whatsapp: "WhatsApp",

    loading: "Chargement…",
  },

  ar: {
    nav_fleet: "الأسطول",
    nav_contact: "اتصل بنا",
    nav_cta: "احجز عبر واتساب",
    lang_label: "اللغة",

    form_city: "المدينة",
    form_pickup: "تاريخ الاستلام",
    form_return: "تاريخ الإرجاع",
    form_search: "بحث",
    form_wa_tooltip: "احجز عبر واتساب",

    car_book_now: "← احجز الآن",
    car_featured: "مميز",
    car_seats: "مقاعد",
    car_per_day: "/يوم",
    car_view_all: "← عرض الكل",

    city_see_deals: "← عروض وتوافر",

    review_stars: "★★★★★",

    footer_fleet: "الأسطول",
    footer_contact: "اتصل بنا",
    footer_whatsapp: "واتساب",

    loading: "جار التحميل…",
  },
};

export function t(key: keyof Translations, lang: Lang): string {
  return translations[lang]?.[key] ?? translations["en"][key] ?? key;
}
