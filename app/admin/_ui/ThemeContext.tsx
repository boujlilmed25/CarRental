"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { themes, ThemeKey, DEFAULT_THEME } from "@/lib/themes";

// Re-export so existing imports still work
export type { ThemeKey };
export { themes };

const ThemeContext = createContext<{
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
  saving: boolean;
}>({ theme: DEFAULT_THEME, setTheme: () => {}, saving: false });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(DEFAULT_THEME);
  const [saving, setSaving] = useState(false);

  // Load from localStorage (instant), then sync from DB
  useEffect(() => {
    const local = localStorage.getItem("site-theme") as ThemeKey | null;
    if (local && themes[local]) setThemeState(local);

    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        const dbTheme = data?.settings?.site_theme as ThemeKey | undefined;
        if (dbTheme && themes[dbTheme]) {
          setThemeState(dbTheme);
          localStorage.setItem("site-theme", dbTheme);
        }
      })
      .catch(() => {});
  }, []);

  async function setTheme(t: ThemeKey) {
    // Optimistic UI update
    setThemeState(t);
    localStorage.setItem("site-theme", t);

    // Persist to DB → public site will reflect this on next render
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_theme: t }),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, saving }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
