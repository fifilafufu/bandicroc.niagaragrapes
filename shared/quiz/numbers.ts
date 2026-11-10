// "Guess the number" and "tap the diagram" questions. Numbers are read from the app's own data
// files where they exist, so the quiz always agrees with the pages.

import { BALANCE_2024, OIV_2024_MORE, USES_SERIES } from "../grapeUses";
import { SUGAR_PER_ABV, YEAST_LIMIT_ABV, abvFromSugar } from "../wine";
import type { DiagramQ, NumberQ } from "./types";

const B = BALANCE_2024;
const fresh2000 = USES_SERIES.find((y) => y.year === 2000)!;
const round1 = (n: number) => Math.round(n * 10) / 10;

export const NUMBER_QS: NumberQ[] = [
  // statistics
  { kind: "number", id: "n-world", cat: "statistics", level: "newbie", q: `How many million tonnes of grapes did the world grow in ${B.year}?`, answer: B.produced, min: 0, max: 200, step: 1, unit: "million tonnes", tolerance: 8, why: `${B.produced} million tonnes (OIV). ${B.lost} were lost after harvest, leaving ${B.available}.`, src: [B.source] },
  { kind: "number", id: "n-pressed", cat: "statistics", level: "newbie", q: `What share of the world's grapes was pressed (mostly for wine) in ${B.year}?`, answer: B.shares.pressed, min: 0, max: 100, step: 1, unit: "%", tolerance: 5, why: `${B.shares.pressed}% pressed, ${B.shares.table}% eaten fresh, ${B.shares.dried}% dried (OIV).`, src: [B.source] },
  { kind: "number", id: "n-raisin-kg", cat: "statistics", level: "newbie", q: "How many kg of fresh grapes does it take to make 1 kg of raisins?", answer: round1(B.driedFresh / B.driedProduct), min: 1, max: 10, step: 0.5, unit: "kg", tolerance: 0.5, why: `About 4 kg: in ${B.year}, ${B.driedFresh} million tonnes of fresh grapes gave ${B.driedProduct} million tonnes of dried grapes (OIV).`, src: [B.source] },
  { kind: "number", id: "n-china", cat: "statistics", level: "pro", q: `How many million tonnes of grapes did China grow in ${B.year}?`, answer: B.china, min: 0, max: 40, step: 0.5, unit: "million tonnes", tolerance: 2, why: `${B.china} million tonnes, the most of any country, ahead of Italy (${B.italy}) and the USA (${B.usa}) (OIV).`, src: [B.source] },
  { kind: "number", id: "n-vineyard", cat: "statistics", level: "pro", q: `How many million hectares of vineyards did the world have in ${B.year}?`, answer: OIV_2024_MORE.vineyardMha, min: 0, max: 20, step: 0.1, unit: "million ha", tolerance: 1, why: `${OIV_2024_MORE.vineyardMha} million hectares, for all uses (OIV).`, src: [B.source] },
  { kind: "number", id: "n-wine-hl", cat: "statistics", level: "pro", q: `How many million hectolitres of wine did the world make in ${B.year}?`, answer: B.wineHl, min: 0, max: 600, step: 5, unit: "million hl", tolerance: 25, why: `${B.wineHl} million hectolitres, from ${B.wine} million tonnes of grapes (OIV).`, src: [B.source] },
  { kind: "number", id: "n-table-2000", cat: "statistics", level: "pro", q: "What share of the world's grapes was eaten fresh in 2000?", answer: fresh2000.table!, min: 0, max: 100, step: 1, unit: "%", tolerance: 5, why: `About ${fresh2000.table}%, against ${B.shares.table}% in ${B.year}: table grapes keep growing (OIV).`, src: [fresh2000.source, B.source] },

  // biology
  { kind: "number", id: "n-water", cat: "biology", level: "newbie", q: "What percentage of a raw grape is water?", answer: 81, min: 0, max: 100, step: 1, unit: "%", tolerance: 5, why: "Raw grapes are 81% water and 18% carbohydrates.", wiki: ["Grape"] },
  { kind: "number", id: "n-fruitset", cat: "biology", level: "pro", q: "On average, what share of a vine's flowers become berries?", answer: 30, min: 0, max: 100, step: 5, unit: "%", tolerance: 10, why: "On average about 30% of flowers become berries; the rest fall off. This sets how big the harvest can be.", wiki: ["Annual growth cycle of grapevines"] },

  // growing
  { kind: "number", id: "n-prune", cat: "growing", level: "pro", q: "How much of last year's growth is cut off at winter pruning?", answer: 85, min: 0, max: 100, step: 5, unit: "%", tolerance: 5, why: "80 to 90%, because fruit grows on new shoots from last year's wood.", src: ["umn-home-grapes"] },
  { kind: "number", id: "n-marquette", cat: "growing", level: "pro", q: "Marquette was bred in Minnesota for cold winters. Down to what temperature does it survive when fully dormant?", answer: -37, min: -50, max: 0, step: 1, unit: "°C", tolerance: 4, why: "About −37 °C. It grows very well in USDA zone 4 and does well in zone 3.", src: ["umn-home-grapes"], wiki: ["Marquette (grape)"] },

  // winemaking
  { kind: "number", id: "n-lees", cat: "winemaking", level: "pro", q: "Non-vintage Champagne must age on its lees (dead yeast) for at least how many months?", answer: 15, min: 0, max: 60, step: 1, unit: "months", tolerance: 2, why: "At least 15 months on the lees, which adds flavour.", wiki: ["Traditional method"] },
  { kind: "number", id: "n-pressure", cat: "winemaking", level: "pro", q: "Fully sparkling wine holds about how many atmospheres of pressure?", answer: 5.5, min: 0, max: 15, step: 0.5, unit: "atm", tolerance: 1, why: "About 5 to 6 atmospheres: the carbon dioxide from the second fermentation can't escape the closed bottle.", wiki: ["Traditional method", "Sparkling wine"] },

  // wine basics
  { kind: "number", id: "n-abv-200", cat: "basics", level: "newbie", q: "A must has 200 g/L of sugar. Fully fermented, how much alcohol does it make?", answer: round1(abvFromSugar(200)), min: 0, max: 25, step: 0.5, unit: "% vol", tolerance: 1, why: `200 × 0.05943 = ${round1(abvFromSugar(200))}% vol (OIV rule).`, src: ["oiv-sugar-alcohol"] },
  { kind: "number", id: "n-sugar-per-abv", cat: "basics", level: "pro", q: "How many grams of sugar per litre make 1% alcohol?", answer: round1(SUGAR_PER_ABV), min: 0, max: 50, step: 0.5, unit: "g/L", tolerance: 1.5, why: `About ${round1(SUGAR_PER_ABV)} g/L (1 ÷ 0.05943, OIV).`, src: ["oiv-sugar-alcohol"] },
  { kind: "number", id: "n-yeast", cat: "basics", level: "pro", q: "Wine yeasts usually stop working at about what alcohol level?", answer: (YEAST_LIMIT_ABV.low + YEAST_LIMIT_ABV.high) / 2, min: 0, max: 30, step: 0.5, unit: "% vol", tolerance: 2, why: `Usually between ${YEAST_LIMIT_ABV.low} and ${YEAST_LIMIT_ABV.high}%. Any sugar left makes the wine sweet.`, wiki: ["Alcohol by volume"] },
  { kind: "number", id: "n-sweet", cat: "basics", level: "pro", q: "From how many g/L of sugar may a still wine be labelled \"sweet\" in the EU?", answer: 45, min: 0, max: 100, step: 1, unit: "g/L", tolerance: 5, why: "Sweet from 45 g/L. Below that: medium sweet, medium dry or dry.", src: ["eu-2019-33"] },
];

// Tap the right part of the grape berry (diagram drawn in code).
export const DIAGRAM_QS: DiagramQ[] = [
  { kind: "diagram", diagram: "berry", id: "d-yeast", cat: "biology", level: "newbie", q: "Tap the part of the grape where wild yeast lives.", answer: "skin", why: "Wild yeasts live on the skin. Crushing lets them meet the juice and start fermenting.", wiki: ["Grape", "Winemaking"] },
  { kind: "diagram", diagram: "berry", id: "d-water", cat: "biology", level: "newbie", q: "Tap the part that is 75 to 85% water.", answer: "flesh", why: "The flesh (pulp) is 75 to 85% water.", wiki: ["Grape"] },
  { kind: "diagram", diagram: "berry", id: "d-oil", cat: "biology", level: "newbie", q: "Tap the part that grape seed oil is pressed from.", answer: "seeds", why: "Grape seed oil comes from the seeds (pips), often a by-product of winemaking.", wiki: ["Grape seed oil"] },
  { kind: "diagram", diagram: "berry", id: "d-stem", cat: "biology", level: "newbie", q: "Tap the part that holds the berry to the bunch.", answer: "stem", why: "The stem holds each berry to the bunch. Winemakers usually remove stems at crushing.", wiki: ["Grape"], src: ["oiv-code"] },
  { kind: "diagram", diagram: "berry", id: "d-colour", cat: "winemaking", level: "newbie", q: "Red wine gets its colour from one part of the grape. Tap it.", answer: "skin", why: "The colour is in the skin: maceration (skin contact) pulls colour and tannin into the wine.", src: ["oiv-code"], wiki: ["Winemaking"] },
];
