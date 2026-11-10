// Polish wording for Make Your Wine. The simulator (shared/wineSim.ts) and its tests stay in English;
// this file only puts the same results into Polish words. Same numbers, same rules.
// Wine words follow Polish Wikipedia where checked (wino musujące, wino różowe, barrique,
// fermentacja jabłkowo-mlekowa) and the Polish EU label terms (wytrawne, półwytrawne, półsłodkie,
// słodkie; "perliste" for semi-sparkling). Colour words marked (garnet, tawny) are not checked
// and keep the English word next to them.

import { pluralForm } from "../index";
import type { SimGrape } from "../../simGrapes";
import type { Wine } from "../../wineSim";
import { AROMA_PL } from "./biology";
import { BALANCE_NOTE_PL, SWEETNESS_PL } from "./wine";

export const GROUPS_PL: Record<string, string> = {
  "European wine grapes": "Europejskie odmiany na wino",
  "American grapes": "Odmiany amerykańskie",
  "Cold-hardy crosses": "Mrozoodporne krzyżówki",
};

// Keyed by grape name, same facts as `basis` in shared/simGrapes.ts.
export const BASIS_PL: Record<string, string> = {
  Concord: "Concord osiąga około 16–17 °Brix; ciemnoniebiesko-fioletowa skórka.",
  Niagara: "Dojrzałość przyjęta za rodzicem, odmianą Concord; zielonobiała skórka.",
  Catawba: "Dojrzałość przyjęta za odmianą Concord; umiarkowana kwasowość; miedzianoczerwona skórka.",
  Delaware: "Dojrzałość przyjęta za odmianą Concord; delikatna, jasnoczerwona skórka.",
  Chardonnay: "Typowa odmiana na wino białe; neutralna, przejmuje cechy dębu i klimatu.",
  Riesling: "Odmiana na wino białe o wysokiej kwasowości (górna granica dla białych).",
  "Sauvignon Blanc": "Odmiana na wino białe, dająca rześkie wino (wyższa kwasowość).",
  Gewürztraminer: "Dużo naturalnego cukru; różowa skórka, robi się z niej wino białe.",
  "Pinot Gris": "Styl alzacki: kwasowość od niskiej do umiarkowanej, więcej alkoholu; szaroróżowa skórka, popularna do win z kontaktem ze skórkami.",
  Muscat: "Typowe wartości dla odmian na wino białe; rodzina winogron od zielonych po czarne.",
  "Thompson Seedless": "Typowe wartości dla białych; bezpestkowa, więc prawie bez tanin z pestek.",
  "Pinot Noir": "Ciemna odmiana o cienkiej skórce: mniej barwy i tanin niż w większości czerwonych.",
  "Cabernet Sauvignon": "Ciemna odmiana o grubej skórce: dużo tanin, wyraźna kwasowość.",
  Merlot: "Miękka, mięsista ciemna odmiana (niższa kwasowość).",
  Syrah: "Odmiana o ciemnej skórce; taniny od średnio wysokich do wysokich.",
  Tempranillo: "Typowe wartości dla czerwonych; ciemna odmiana.",
  Grenache: "W gorących miejscach dojrzewa późno: dużo alkoholu; miękka.",
  Solaris: "Typowe wartości dla białych; odmiana na wino białe.",
  "Seyval Blanc": "Typowe wartości dla białych; w chłodnym klimacie dojrzewa wcześnie.",
  "Vidal Blanc": "Dużo cukru w zimnym klimacie, przy kwasowości od umiarkowanej do wysokiej.",
  Regent: "Typowe wartości dla czerwonych; odmiana o ciemnej skórce.",
  Marquette: "Typowe wartości dla czerwonych; mieszaniec na wino czerwone.",
  Scuppernong: "Brak danych o winie; wartości oszacowane na podstawie innych amerykańskich odmian. Bardzo gruba skórka.",
};

const STYLE: Record<Wine["style"], string> = { white: "białe", red: "czerwone", "rosé": "różowe", orange: "pomarańczowe" };
const BUBBLES: Record<Wine["bubblesWord"], string> = { still: "", "semi-sparkling (frizzante)": "perliste (frizzante)", "sparkling (spumante)": "musujące (spumante)" };
const BODY: Record<Wine["body"], string> = { light: "lekkie", medium: "średnie", full: "pełne" };
export const bodyPl = (b: Wine["body"]) => BODY[b];
const NOTES: Record<string, string> = {
  "The yeast stopped at about 15.5% alcohol, so some sugar was left over.": "Drożdże przestały pracować przy około 15,5% alkoholu, więc część cukru została.",
  "Dark grapes pressed straight away give an almost white wine.": "Ciemne winogrona wytłoczone od razu dają prawie białe wino.",
  "Very ripe grapes: a strong, warm wine.": "Bardzo dojrzałe winogrona: mocne, rozgrzewające wino.",
  "Low acidity (high pH): the wine is less stable and won't age well.": "Niska kwasowość (wysokie pH): wino jest mniej stabilne i nie zestarzeje się dobrze.",
};
const EXTRA_AROMAS: Record<string, string> = {
  "butter (from malolactic fermentation)": "masło (z fermentacji jabłkowo-mlekowej)",
  vanilla: "wanilia",
  "toast and spice (from oak)": "tost i przyprawy (z dębu)",
  "a little vanilla (old oak)": "odrobina wanilii (stary dąb)",
  "flavour from the yeast (lees)": "smak drożdży (lees)",
};
const HUE: Record<string, string> = {
  purple: "purpurowe",
  ruby: "rubinowe",
  garnet: "granatowe (garnet)",
  tawny: "tawny",
  brick: "ceglaste",
  salmon: "łososiowe",
  "pink-orange": "różowo-pomarańczowe",
  pink: "różowe",
  "lemon-green": "cytrynowo-zielone",
  lemon: "cytrynowe",
  gold: "złote",
  amber: "bursztynowe",
  brown: "brązowe",
};
const DEPTH: Record<string, string> = { pale: "jasne", medium: "średnio intensywne", deep: "ciemne" };

export const sweetnessPl = (word: string) => SWEETNESS_PL[word] ?? word;
export const notePl = (note: string) => NOTES[note] ?? BALANCE_NOTE_PL[note] ?? note;

// "deep garnet, tawny rim" → "granatowe (garnet), ciemne; przy brzegu tawny"
export function colourPl(words: string): string {
  const [main, rim] = words.split(", ");
  const [depth, ...hue] = main.split(" ");
  const base = `${HUE[hue.join(" ")] ?? hue.join(" ")}, ${DEPTH[depth] ?? depth}`;
  const rimHue = rim?.replace(/ rim$/, "");
  return rimHue ? `${base}; przy brzegu ${HUE[rimHue] ?? rimHue}` : base;
}

// Short name shown under the glass, e.g. "czerwone, wytrawne".
export const styleNamePl = (w: Wine) => [STYLE[w.style], BUBBLES[w.bubblesWord]].filter(Boolean).join(" ") + `, ${sweetnessPl(w.sweetnessWord)}`;

// The tasting note, in the same order as describe() in shared/wineSim.ts.
export function describePl(g: SimGrape, w: Wine): string[] {
  const acid = w.ta < 5.5 ? "miękka, niska kwasowość" : w.ta < 7.5 ? "świeża kwasowość" : "rześka, wysoka kwasowość";
  const tan = w.tannin < 0.08 ? "praktycznie bez tanin" : w.tannin < 0.3 ? "lekkie taniny" : w.tannin < 0.6 ? "średnie taniny" : "zdecydowane, szorstkie taniny";
  const style = STYLE[w.style] + (w.style === "orange" ? " (białe z kontaktem ze skórkami)" : "");
  const aromas = w.aromas.map((a) => EXTRA_AROMAS[a] ?? AROMA_PL[a] ?? a);
  const first = `${style.charAt(0).toUpperCase()}${style.slice(1)} wino${BUBBLES[w.bubblesWord] ? ` ${BUBBLES[w.bubblesWord]}` : ""} z odmiany ${g.name}, ${sweetnessPl(w.sweetnessWord)}.`;
  return [
    first,
    `Kolor: ${colourPl(w.colour.words)}.`,
    aromas.length ? `Pachnie: ${aromas.join(", ")}.` : "Aromaty: nasze źródła nie podają konkretnych nut dla tej odmiany.",
    `W ustach: ${acid}, ${tan}, ${BODY[w.body]} body${w.abv > 14 ? ", rozgrzewające od alkoholu" : ""}. ${notePl(w.balance.note)}`,
  ];
}

// "6 hours", "1 day", "3 years" with Polish plural forms.
const FORMS = {
  hour: { one: "godzina", few: "godziny", many: "godzin" },
  day: { one: "dzień", few: "dni", many: "dni" },
  month: { one: "miesiąc", few: "miesiące", many: "miesięcy" },
  year: { one: "rok", few: "lata", many: "lat" },
};
export const countPl = (n: number, unit: keyof typeof FORMS) => `${n} ${FORMS[unit][pluralForm("pl", n)]}`;
export const skinLabelPl = (d: number) => (d === 0 ? "Tłoczone od razu" : d < 1 ? countPl(Math.round(d * 24), "hour") : countPl(d, "day"));
