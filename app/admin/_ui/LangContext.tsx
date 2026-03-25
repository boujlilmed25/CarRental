"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Lang = "fr" | "ar" | "en";

const T = {
  en: {
    nav: {
      dashboard: "Dashboard",
      cars: "Cars",
      bookings: "Bookings",
      analytics: "Analytics",
      content: "Content",
      themes: "Themes",
      tracking: "GPS Tracking",
      viewSite: "View Site",
      logout: "Logout",
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Overview of your rental business",
      totalCars: "Total Cars",
      activeCars: "Active Cars",
      totalBookings: "Total Bookings",
      newBookings: "New Requests",
      confirmedBookings: "Confirmed",
      doneBookings: "Completed",
      canceledBookings: "Canceled",
      recentBookings: "Recent Bookings",
      customer: "Customer",
      car: "Car",
      city: "City",
      dates: "Dates",
      status: "Status",
      noBookings: "No bookings yet.",
      quickActions: "Quick Actions",
      addCar: "Add New Car",
      viewBookings: "View Bookings",
      viewAnalytics: "Analytics",
      editContent: "Edit Content",
    },
    analytics: {
      title: "Analytics",
      subtitle: "Your rental business at a glance",
      byStatus: "Bookings by Status",
      byCity: "Bookings by City",
      byCar: "Top 5 Cars",
      byCategory: "Cars by Category",
      availability: "Fleet Availability",
      noData: "No data available",
      totalRevenue: "Est. Revenue",
      topCity: "Top City",
      topCar: "Top Car",
      active: "Active",
      hidden: "Hidden",
      total: "Total",
    },
    status: {
      new: "New",
      confirmed: "Confirmed",
      done: "Done",
      canceled: "Canceled",
    },
    common: {
      loading: "Loading…",
      noData: "No data.",
      save: "Save",
      cancel: "Cancel",
      siteOnline: "Site Online",
    },
  },

  fr: {
    nav: {
      dashboard: "Tableau de bord",
      cars: "Voitures",
      bookings: "Réservations",
      analytics: "Analytiques",
      content: "Contenu",
      themes: "Thèmes",
      tracking: "Suivi GPS",
      viewSite: "Voir le site",
      logout: "Déconnexion",
    },
    dashboard: {
      title: "Tableau de bord",
      subtitle: "Vue d'ensemble de votre activité de location",
      totalCars: "Total Voitures",
      activeCars: "Voitures Actives",
      totalBookings: "Total Réservations",
      newBookings: "Nouvelles Demandes",
      confirmedBookings: "Confirmées",
      doneBookings: "Terminées",
      canceledBookings: "Annulées",
      recentBookings: "Réservations Récentes",
      customer: "Client",
      car: "Voiture",
      city: "Ville",
      dates: "Dates",
      status: "Statut",
      noBookings: "Aucune réservation pour l'instant.",
      quickActions: "Actions Rapides",
      addCar: "Ajouter une Voiture",
      viewBookings: "Voir Réservations",
      viewAnalytics: "Analytiques",
      editContent: "Modifier le Contenu",
    },
    analytics: {
      title: "Analytiques",
      subtitle: "Votre activité de location en un coup d'œil",
      byStatus: "Réservations par Statut",
      byCity: "Réservations par Ville",
      byCar: "Top 5 Voitures",
      byCategory: "Voitures par Catégorie",
      availability: "Disponibilité du Parc",
      noData: "Aucune donnée disponible",
      totalRevenue: "Rev. Estimé",
      topCity: "Ville Principale",
      topCar: "Voiture Principale",
      active: "Active",
      hidden: "Masquée",
      total: "Total",
    },
    status: {
      new: "Nouveau",
      confirmed: "Confirmé",
      done: "Terminé",
      canceled: "Annulé",
    },
    common: {
      loading: "Chargement…",
      noData: "Aucune donnée.",
      save: "Enregistrer",
      cancel: "Annuler",
      siteOnline: "Site en ligne",
    },
  },

  ar: {
    nav: {
      dashboard: "لوحة التحكم",
      cars: "السيارات",
      bookings: "الحجوزات",
      analytics: "الإحصاءات",
      content: "المحتوى",
      themes: "المظهر",
      tracking: "تتبع GPS",
      viewSite: "عرض الموقع",
      logout: "تسجيل الخروج",
    },
    dashboard: {
      title: "لوحة التحكم",
      subtitle: "نظرة عامة على نشاط التأجير",
      totalCars: "إجمالي السيارات",
      activeCars: "السيارات النشطة",
      totalBookings: "إجمالي الحجوزات",
      newBookings: "طلبات جديدة",
      confirmedBookings: "مؤكدة",
      doneBookings: "مكتملة",
      canceledBookings: "ملغاة",
      recentBookings: "الحجوزات الأخيرة",
      customer: "العميل",
      car: "السيارة",
      city: "المدينة",
      dates: "التواريخ",
      status: "الحالة",
      noBookings: "لا توجد حجوزات بعد.",
      quickActions: "إجراءات سريعة",
      addCar: "إضافة سيارة",
      viewBookings: "عرض الحجوزات",
      viewAnalytics: "الإحصاءات",
      editContent: "تعديل المحتوى",
    },
    analytics: {
      title: "الإحصاءات",
      subtitle: "نشاط التأجير في لمحة",
      byStatus: "الحجوزات حسب الحالة",
      byCity: "الحجوزات حسب المدينة",
      byCar: "أفضل 5 سيارات",
      byCategory: "السيارات حسب الفئة",
      availability: "توفر الأسطول",
      noData: "لا توجد بيانات",
      totalRevenue: "الإيراد التقديري",
      topCity: "أهم مدينة",
      topCar: "أهم سيارة",
      active: "نشطة",
      hidden: "مخفية",
      total: "الإجمالي",
    },
    status: {
      new: "جديد",
      confirmed: "مؤكد",
      done: "مكتمل",
      canceled: "ملغى",
    },
    common: {
      loading: "جارٍ التحميل…",
      noData: "لا توجد بيانات.",
      save: "حفظ",
      cancel: "إلغاء",
      siteOnline: "الموقع متصل",
    },
  },
} as const;

export type Translations = typeof T.en;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
  isRtl: boolean;
}

const Ctx = createContext<LangCtx>({
  lang: "fr",
  setLang: () => {},
  tr: T.fr as unknown as Translations,
  isRtl: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("admin_lang") as Lang | null;
    if (stored && stored in T) setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("admin_lang", l);
  }

  return (
    <Ctx.Provider
      value={{
        lang,
        setLang,
        tr: T[lang] as unknown as Translations,
        isRtl: lang === "ar",
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
