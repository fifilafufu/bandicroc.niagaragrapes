// Gallery content: taste and main uses per grape, summarised from each grape's checked facts (shared/grapes.ts).

export type Use = "eat" | "wine" | "juice" | "raisin";

export const USE_ICON: Record<Use, string> = { eat: "🍽️", wine: "🍷", juice: "🧃", raisin: "☀️" };

export const USE_LABEL: Record<Use, string> = { eat: "eating", wine: "wine", juice: "juice & jelly", raisin: "raisins" };

// Taste and main uses, summarised from each grape's checked facts (shared/grapes.ts).
// hybrid: set by hand only where Wikipedia states hybrid ancestry that VIVC files under Vitis vinifera;
// every other hybrid comes from VIVC ("interspecific crossing").
export const INFO: Record<string, { taste: string; uses: Use[]; hybrid?: boolean }> = {
  Niagara: { taste: "Sweet, musky “foxy”", uses: ["eat", "juice", "wine"] },
  Concord: { taste: "Sweet, musky; tart skin", uses: ["juice", "eat", "wine"] },
  Catawba: { taste: "Musky, grapey, tangy", uses: ["wine", "juice"] },
  Delaware: { taste: "Juicy, sweet, mild", uses: ["eat", "wine"] },
  "Cotton Candy": { taste: "Very sweet, like cotton candy", uses: ["eat"] },
  "Thompson Seedless": { taste: "Mild, sweet", uses: ["raisin", "eat", "wine"] },
  "Red Globe": { taste: "Crunchy, gently sweet", uses: ["eat"] },
  Muscat: { taste: "Sweet, very floral", uses: ["eat", "raisin", "wine"] },
  Chardonnay: { taste: "Neutral; wine takes on oak & climate", uses: ["wine"] },
  Riesling: { taste: "Flowery, high acidity", uses: ["wine"] },
  "Pinot Noir": { taste: "Wine: cherry & raspberry", uses: ["wine"] },
  "Cabernet Sauvignon": { taste: "Wine: blackcurrant, tannic", uses: ["wine"] },
  "Shine Muscat": { taste: "Sweet, muscat aroma; edible skin", uses: ["eat"] },
  Scuppernong: { taste: "Big berry, thick tough skin", uses: ["eat"] },
  Gewürztraminer: { taste: "Wine smells of lychee", uses: ["wine"] },
  Kyoho: { taste: "Very sweet, juicy; peel it", uses: ["eat", "juice"] },
  "Pinot Gris": { taste: "Wine: rich & oily, or light & crisp", uses: ["wine"] },
  Merlot: { taste: "Wine: soft, fleshy red", uses: ["wine"] },
  "Sauvignon Blanc": { taste: "Wine: crisp, grassy to tropical", uses: ["wine"] },
  Syrah: { taste: "Wine: blackberry, black pepper", uses: ["wine"] },
  Tempranillo: { taste: "Wine: fairly neutral, often blended", uses: ["wine"] },
  Grenache: { taste: "Wine: raspberry, white pepper", uses: ["wine"] },
  Solaris: { taste: "White wine; resists fungal disease", uses: ["wine"], hybrid: true },
  Regent: { taste: "Red wine; resists fungal disease", uses: ["wine"], hybrid: true },
  Marquette: { taste: "Red wine; survives about −37 °C", uses: ["wine"] },
  "Seyval Blanc": { taste: "White wine; ripens early", uses: ["wine"] },
  "Vidal Blanc": { taste: "White wine and ice wine", uses: ["wine"] },
};
