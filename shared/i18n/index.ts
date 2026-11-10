// The app's languages and a tiny text helper (no library, no paid service).
// English is complete; Polish fills in what has been translated and checked. A missing Polish
// string falls back to English, so the app never shows a key.

import { EN, type TextKey } from "./en";
import { PL } from "./pl";

export type Lang = "en" | "pl";
export const LANGS: Lang[] = ["en", "pl"];
export type { TextKey };

const LISTS: Record<Lang, Partial<Record<TextKey, string>>> = { en: EN, pl: PL };

// translate("pl", "quiz.score", { n: 5 }) → the Polish text with {n} filled in.
export function translate(lang: Lang, key: TextKey, vars?: Record<string, string | number>): string {
  const text = LISTS[lang][key] ?? EN[key];
  return vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text;
}

// Picks the Polish version of a piece of content when there is one, else the English one.
export const pick = <T>(lang: Lang, en: T, pl: T | undefined): T => (lang === "pl" && pl !== undefined ? pl : en);
