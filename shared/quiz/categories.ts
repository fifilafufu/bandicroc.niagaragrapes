import type { Category, Level } from "./types";

export const CATEGORIES: { id: Category; emoji: string; name: string; blurb: string }[] = [
  { id: "varieties", emoji: "🍇", name: "Varieties", blurb: "Name the grape from a photo, parents, colours and where they come from." },
  { id: "biology", emoji: "🌱", name: "Biology", blurb: "Species, the parts of a berry and the vine's year." },
  { id: "statistics", emoji: "📊", name: "Statistics", blurb: "How many grapes the world grows, and what happens to them." },
  { id: "growing", emoji: "✂️", name: "Growing", blurb: "Pruning, frost, diseases and caring for a vine." },
  { id: "winemaking", emoji: "🛢️", name: "Winemaking", blurb: "Put the steps in order, from harvest to bottle." },
  { id: "basics", emoji: "🍷", name: "Wine basics", blurb: "Acidity, sugar, alcohol, tannin and what the label says." },
];

export const LEVELS: { id: Level; emoji: string; name: string; blurb: string }[] = [
  { id: "newbie", emoji: "🌱", name: "Newbie", blurb: "Easy questions first" },
  { id: "pro", emoji: "🍷", name: "Pro: Dionysus mode", blurb: "Dates, species and deep cuts" },
];
