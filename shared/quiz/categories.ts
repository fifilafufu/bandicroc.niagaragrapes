import type { Lang } from "../i18n";
import { CATEGORY_NAMES_PL, LEVELS_PL } from "../i18n/pl/quizBoard";
import type { Category, Level } from "./types";

export const CATEGORIES: { id: Category; emoji: string; name: string }[] = [
  { id: "varieties", emoji: "🍇", name: "Varieties" },
  { id: "biology", emoji: "🌱", name: "Biology" },
  { id: "statistics", emoji: "📊", name: "Statistics" },
  { id: "growing", emoji: "✂️", name: "Growing" },
  { id: "winemaking", emoji: "🛢️", name: "Winemaking" },
  { id: "basics", emoji: "🍷", name: "Wine basics" },
];

export const LEVELS: { id: Level; emoji: string; name: string; blurb: string }[] = [
  { id: "newbie", emoji: "🌱", name: "Newbie", blurb: "Easy questions first" },
  { id: "pro", emoji: "🍷", name: "Dionysus mode", blurb: "Dates, species and deep cuts" },
];

export const categoryName = (id: Category, lang: Lang) => (lang === "pl" ? CATEGORY_NAMES_PL[id] : CATEGORIES.find((c) => c.id === id)!.name);

export function levelText(id: Level, lang: Lang): { name: string; blurb: string } {
  return lang === "pl" ? LEVELS_PL[id] : LEVELS.find((l) => l.id === id)!;
}
