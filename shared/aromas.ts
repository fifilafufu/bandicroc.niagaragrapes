// Aromas and flavours named in each grape's checked facts (shared/grapes.ts, from its Wikipedia
// article). Only words those facts actually use are listed; grapes whose facts name no aroma are left out.
// For wine grapes these describe the wine; for table grapes, the fresh fruit.

export type AromaFamily = { family: string; icon: string; aromas: string[] };

export const AROMA_FAMILIES: AromaFamily[] = [
  { family: "Red fruit", icon: "🍓", aromas: ["cherry", "raspberry", "strawberry"] },
  { family: "Black fruit", icon: "🫐", aromas: ["blackcurrant", "blackberry", "black cherry"] },
  { family: "Orchard & citrus", icon: "🍏", aromas: ["apple", "pear", "citrus", "peach"] },
  { family: "Tropical", icon: "🥭", aromas: ["tropical fruit", "lychee"] },
  { family: "Flowers", icon: "🌸", aromas: ["floral"] },
  { family: "Green & herbal", icon: "🌿", aromas: ["grass", "green pepper", "mint"] },
  { family: "Spice", icon: "🌶️", aromas: ["black pepper", "white pepper", "licorice"] },
  { family: "Other", icon: "✨", aromas: ["musky (foxy)", "butter (from oak)", "leather", "cotton candy"] },
];

export const GRAPE_AROMAS: Record<string, string[]> = {
  Niagara: ["musky (foxy)"],
  Concord: ["musky (foxy)"],
  Catawba: ["musky (foxy)"],
  Delaware: ["musky (foxy)"],
  "Cotton Candy": ["cotton candy"],
  Muscat: ["floral"],
  Chardonnay: ["apple", "pear", "citrus", "tropical fruit", "butter (from oak)"],
  Riesling: ["floral", "apple", "citrus", "peach"],
  "Pinot Noir": ["cherry", "raspberry", "strawberry"],
  "Cabernet Sauvignon": ["blackcurrant", "green pepper", "black cherry"],
  Gewürztraminer: ["lychee"],
  "Sauvignon Blanc": ["grass", "tropical fruit"],
  Syrah: ["blackberry", "mint", "black pepper", "licorice", "leather"],
  Grenache: ["raspberry", "strawberry", "white pepper"],
};

export const grapesWithAroma = (aroma: string) => Object.keys(GRAPE_AROMAS).filter((g) => GRAPE_AROMAS[g].includes(aroma));
