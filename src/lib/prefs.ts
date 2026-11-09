import { useEffect, useState } from "react";

// Small per-device preferences. Storage can be blocked (private mode, strict settings),
// so every read and write is guarded and the app works the same without it.

export function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
export function writePref(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage blocked: the setting lasts until the page closes */
  }
}

// ---------- theme ----------

export type Theme = "system" | "light" | "dark";
const THEME_KEY = "theme";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (readPref(THEME_KEY) as Theme | null) ?? "system");
  useEffect(() => {
    applyTheme(theme);
    writePref(THEME_KEY, theme === "system" ? null : theme);
  }, [theme]);
  return [theme, setTheme] as const;
}

// Apply the saved theme before React renders, so there's no flash of the wrong colours.
applyTheme((readPref(THEME_KEY) as Theme | null) ?? "system");

// ---------- online / offline ----------

export function useOnline() {
  const [online, setOnline] = useState(() => navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => {
      window.removeEventListener("online", up);
      window.removeEventListener("offline", down);
    };
  }, []);
  return online;
}
