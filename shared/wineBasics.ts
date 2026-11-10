// The parts of a wine's structure: what each one is, where it comes from, what it changes, and the
// numbers to know. From the named Wikipedia articles, the OIV and the EU label rules (checked 2026-11-10).

import type { SourceId } from "./sources";

export type PartId = "acidity" | "sugar" | "alcohol" | "tannin" | "body" | "balance";

export type Part = {
  id: PartId;
  name: string;
  icon: string;
  what: string;
  from: string;
  changes: string;
  numbers: string;
  src?: SourceId[];
  wiki: string[];
};

export const PARTS: Part[] = [
  {
    id: "acidity",
    name: "Acidity",
    icon: "🍋",
    what: "The fresh, tart, mouth-watering side of a wine. Three main acids come from the grape: tartaric, malic and citric.",
    from: "The grape. Acids fall as grapes ripen, so grapes picked earlier give crisper wine. Malolactic fermentation turns sharp malic acid into softer lactic acid.",
    changes: "Freshness. Tartaric acid keeps the wine chemically stable and helps its colour, and acids help protect wine from bacteria. Acidity is judged by how well it balances sweetness and bitter parts such as tannin.",
    numbers: "Most wines have a pH between 2.9 and 3.9. The lower the pH, the more acidic. Total acidity is measured as grams per litre of tartaric acid.",
    wiki: ["Acids in wine", "Malolactic fermentation"],
  },
  {
    id: "sugar",
    name: "Sugar (sweetness)",
    icon: "🍯",
    what: "Grape sugar (glucose and fructose) that the yeast did not turn into alcohol: the “residual sugar”.",
    from: "The grape. It stays in the wine when fermentation stops early, by the winemaker's choice or because there was more sugar than the yeast could use.",
    changes: "Sweetness, and a fuller feel. Acidity balances it; without enough acid a sweet wine tastes cloying.",
    numbers: "EU labels: dry up to 4 g/L (or up to 9 g/L if the acidity is at most 2 g/L lower than the sugar), then medium dry, medium sweet, and sweet from 45 g/L.",
    src: ["eu-2019-33"],
    wiki: ["Sweetness of wine"],
  },
  {
    id: "alcohol",
    name: "Alcohol",
    icon: "🔥",
    what: "Ethanol, made by yeast from grape sugar during fermentation.",
    from: "Sugar only: riper grapes mean more possible alcohol. About 16.8 g/L of sugar makes 1% alcohol. Yeasts usually stop between 14 and 18%.",
    changes: "Body and warmth: a lot of alcohol makes a wine feel full and heavy; too much tastes hot and “alcoholic”.",
    numbers: "Sugar (g/L) × 0.05943 = alcohol (% vol). So 200 g/L of sugar, fully fermented, makes about 11.9%.",
    src: ["oiv-sugar-alcohol"],
    wiki: ["Alcohol by volume", "Wine tasting descriptors"],
  },
  {
    id: "tannin",
    name: "Tannin",
    icon: "🍵",
    what: "Phenolic compounds that make your mouth feel dry and grippy (astringent), like strong tea.",
    from: "Grape skins, seeds and stems, pulled out during skin contact (maceration), plus the oak of barrels. That's why red wines have tannin and white and rosé wines have very little.",
    changes: "Structure and grip. As a red wine ages, its colour pigments join with tannins: the colour changes and the wine feels less astringent.",
    numbers: "No skin contact and no oak means almost no tannin.",
    wiki: ["Phenolic content in wine", "Oak (wine)"],
  },
  {
    id: "body",
    name: "Body",
    icon: "🏋️",
    what: "How heavy and full the wine feels in your mouth: light, medium or full.",
    from: "Mostly alcohol, together with how the wine feels in the mouth.",
    changes: "How rich the wine feels. A “fat” wine is full-bodied and almost thick; a “heavy” one has too much alcohol and body.",
    numbers: "More alcohol usually means more body.",
    wiki: ["Wine tasting descriptors"],
  },
  {
    id: "balance",
    name: "Balance",
    icon: "⚖️",
    what: "When acid, tannin, sweetness and alcohol fit together and no single one sticks out.",
    from: "The grape and every choice the winemaker makes.",
    changes: "The softness of sugar and alcohol has to match the firmness of acidity and tannin. The lower the acidity, the more tannin a wine can carry.",
    numbers: "Try it below: move the sliders and watch the scale.",
    src: ["vt-balance"],
    wiki: ["Wine tasting descriptors"],
  },
];
