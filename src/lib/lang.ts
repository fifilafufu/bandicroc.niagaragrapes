import { useCallback, useSyncExternalStore } from "react";
import { translate, type Lang, type TextKey } from "../../shared/i18n";
import { readPref, writePref } from "./prefs";

// The chosen language, kept on this device. First visit: Polish if the phone or browser is set to
// Polish, otherwise English. Every screen reads it with useLang(), so a switch redraws them all.

const KEY = "lang";

function startLang(): Lang {
  const saved = readPref(KEY);
  if (saved === "en" || saved === "pl") return saved;
  const wanted = navigator.languages?.length ? navigator.languages : [navigator.language];
  return wanted.some((l) => l?.toLowerCase().startsWith("pl")) ? "pl" : "en";
}

let current: Lang = startLang();
const listeners = new Set<() => void>();
document.documentElement.lang = current;

export function setLang(lang: Lang) {
  current = lang;
  writePref(KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useLang() {
  const lang = useSyncExternalStore(subscribe, () => current);
  const t = useCallback((key: TextKey, vars?: Record<string, string | number>) => translate(lang, key, vars), [lang]);
  return { lang, t, setLang };
}
