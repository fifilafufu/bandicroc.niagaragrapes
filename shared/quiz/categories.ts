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
  { id: "pro", emoji: "🍷", name: "Pro: Dionysus mode", blurb: "Dates, species and deep cuts" },
];
