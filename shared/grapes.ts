// One list used by both the app (favourite picker, Wikipedia cards) and Grape Bot (which articles to read).

export type Grape = {
  name: string; // shown in the app and saved as the favourite
  wiki: string; // English Wikipedia article title (all checked to exist)
  keywords: string[]; // lowercase words that mean a question is about this grape
};

export const GRAPES: Grape[] = [
  { name: "Niagara", wiki: "Niagara (grape)", keywords: ["niagara"] },
  { name: "Concord", wiki: "Concord grape", keywords: ["concord"] },
  { name: "Catawba", wiki: "Catawba (grape)", keywords: ["catawba"] },
  { name: "Delaware", wiki: "Delaware (grape)", keywords: ["delaware"] },
  { name: "Cotton Candy", wiki: "Cotton Candy grapes", keywords: ["cotton candy"] },
  { name: "Thompson Seedless", wiki: "Sultana (grape)", keywords: ["thompson", "sultana"] },
  { name: "Red Globe", wiki: "Red Globe", keywords: ["red globe"] },
  { name: "Muscat", wiki: "Muscat (grape)", keywords: ["muscat", "moscato"] },
  { name: "Chardonnay", wiki: "Chardonnay", keywords: ["chardonnay"] },
  { name: "Riesling", wiki: "Riesling", keywords: ["riesling"] },
  { name: "Pinot Noir", wiki: "Pinot noir", keywords: ["pinot"] },
  { name: "Cabernet Sauvignon", wiki: "Cabernet Sauvignon", keywords: ["cabernet"] },
];

export const GENERAL_GRAPE_ARTICLE = "Grape";

export const wikiUrl = (title: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

export const findGrape = (name: string | null | undefined) =>
  GRAPES.find((g) => g.name.toLowerCase() === (name ?? "").toLowerCase()) ?? null;
