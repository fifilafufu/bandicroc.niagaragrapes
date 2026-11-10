// Make Your Wine: turns the winemaker's choices into a wine. Built on shared/wine.ts (OIV sugar to
// alcohol, EU label words, balance) and the formulas approved in the plan (PLAN.md, Part 6).
// It's a teaching model: the directions are real, the exact numbers are simplified.
// Tested by scripts/test-wine.ts. Bump MODEL_VERSION whenever a formula changes, so saved wines
// can say which version made them.

import { abvFromSugar, balance, ferment, sparklingSweetness, stillSweetness } from "./wine.ts";
import { GRAPE_AROMAS } from "./aromas.ts";
import type { SimGrape } from "./simGrapes.ts";
import { clamp, lchToHex } from "./wineColour.ts";

export const MODEL_VERSION = 1;

// ---------- inputs ----------

export const SKIN_STEPS = [0, 0.25, 0.5, 1, 2, 4, 7, 14, 21, 30]; // days of skin contact
export const skinLabel = (d: number) => (d === 0 ? "Pressed straight away" : d < 1 ? `${Math.round(d * 24)} hours` : `${d} ${d === 1 ? "day" : "days"}`);

export type Inputs = {
  brix: number; // ripeness at harvest
  skinDays: number;
  fermentPct: number; // 0 to 100: share of the sugar the yeast eats
  mlf: 0 | 0.5 | 1;
  oak: "none" | "old" | "new";
  oakMonths: number;
  bottleYears: number;
  bubbles: "still" | "semi" | "sparkling";
  leesMonths: number; // sparkling only
  dosage: number; // g/L sugar added after disgorging, sparkling only
};

export const defaultInputs = (g: SimGrape): Inputs => ({
  brix: g.brix,
  skinDays: g.colour >= 0.4 ? 7 : 0,
  fermentPct: 100,
  mlf: g.colour >= 0.4 ? 1 : 0,
  oak: "none",
  oakMonths: 12,
  bottleYears: 1,
  bubbles: "still",
  leesMonths: 15,
  dosage: 8,
});

// ---------- sugar from ripeness (OIV Resolution OENO 466-2012 table: °Brix → g/L) ----------

const BRIX_TABLE: [number, number][] = [
  [10, 82.2], [11, 92.8], [12, 103.5], [13, 114.3], [14, 125.2], [15, 136.1], [16, 147.1], [17, 158.2], [18, 169.4], [19, 180.6],
  [20, 191.9], [21, 203.3], [22, 214.7], [23, 226.2], [24, 237.8], [25, 249.5], [26, 261.2], [27, 273.0], [28, 284.9], [29, 296.9], [30, 308.9],
];
export function brixToSugar(brix: number) {
  const b = Math.max(10, Math.min(30, brix));
  const i = Math.min(BRIX_TABLE.length - 2, Math.floor(b - 10));
  const [b0, s0] = BRIX_TABLE[i];
  const [, s1] = BRIX_TABLE[i + 1];
  return s0 + (s1 - s0) * (b - b0);
}

// ---------- the simulation ----------

export type Wine = {
  style: "white" | "orange" | "rosé" | "red";
  sweetnessWord: string;
  bubblesWord: "still" | "semi-sparkling (frizzante)" | "sparkling (spumante)";
  sugarAtHarvest: number;
  potentialAbv: number;
  abv: number;
  residualSugar: number;
  ta: number;
  ph: number;
  tannin: number; // 0 to 1, as tasted
  pressureBar: number;
  body: "light" | "medium" | "full";
  balance: ReturnType<typeof balance>;
  colour: { core: string; rim: string; rimWidth: number; words: string };
  aromas: string[];
  notes: string[];
  modelVersion: number;
};

export function makeWine(g: SimGrape, inp: Inputs): Wine {
  const notes: string[] = [];
  const ripeSugar = brixToSugar(g.brix);
  const sugar = brixToSugar(inp.brix);
  const r = ripeSugar / sugar; // < 1 when riper than usual

  // Acidity falls and pH rises as grapes ripen (approved plan formulas).
  const ta0 = g.ta * r ** 1.2;
  const malic = Math.min(ta0 * 0.4 * r ** 1.5, ta0 * 0.8);
  let ph = g.ph + 0.5 * Math.log(sugar / ripeSugar);

  // Fermentation: alcohol only from sugar the yeast ate.
  const f = ferment(sugar, inp.fermentPct / 100);
  let abv = f.abv;
  let rs = f.residualSugar;
  if (f.stoppedByYeast) notes.push("The yeast stopped at about 15.5% alcohol, so some sugar was left over.");

  // Malolactic fermentation: malic → lactic acid.
  const ta = ta0 - 0.56 * malic * inp.mlf;
  ph += 0.15 * inp.mlf;

  // Skin contact: colour comes out fast, tannin slower (seed tannin slowest).
  const t = inp.skinDays;
  const anth = t === 0 ? g.colour * 0.03 : g.colour * (1 - Math.exp(-t / 2));
  let tannin = t === 0 ? 0 : g.skinTannin * (1 - Math.exp(-t / 4)) * 0.6 + g.seedTannin * (1 - Math.exp(-t / 10)) * 0.4;

  // Oak adds tannin and vanilla; a little air through the wood ages the wine faster.
  const oakYears = inp.oak === "none" ? 0 : inp.oakMonths / 12;
  if (inp.oak === "new") tannin += 0.02 * inp.oakMonths;
  if (inp.oak === "old") tannin += 0.004 * inp.oakMonths;
  tannin = clamp(tannin);

  // Bubbles: second fermentation in a closed bottle (Wikipedia "Traditional method": 18 g/L of sugar → 6 bar).
  let pressure = 0;
  const lees = inp.bubbles === "sparkling" ? inp.leesMonths / 12 : 0;
  if (inp.bubbles === "semi") {
    pressure = 2; // 6 g/L of sugar
    abv += abvFromSugar(6);
  } else if (inp.bubbles === "sparkling") {
    pressure = 6; // 18 g/L of sugar
    abv += abvFromSugar(18);
    rs += inp.dosage;
  }

  const age = inp.bottleYears + 1.3 * oakYears + lees;
  const tasted = tannin * Math.exp(-age / 12);

  // Style from grape colour and skin contact.
  const dark = g.colour >= 0.4;
  let style: Wine["style"];
  if (dark) style = t > 2 ? "red" : t > 0 ? "rosé" : "white";
  else if (g.colour > 0 && t >= 0.5 && t <= 2) style = "rosé";
  else style = t >= 1 ? "orange" : "white";
  if (dark && t === 0) notes.push("Dark grapes pressed straight away give an almost white wine.");

  // Sweetness word (EU 2019/33): still and semi-sparkling use Part B, sparkling uses Part A.
  const sweetnessWord = inp.bubbles === "sparkling" ? sparklingSweetness(rs, inp.dosage > 0) : stillSweetness(rs, ta);
  const bubblesWord = inp.bubbles === "still" ? "still" : inp.bubbles === "semi" ? "semi-sparkling (frizzante)" : "sparkling (spumante)";

  // Body and balance.
  const bodyIndex = 0.45 * clamp((abv - 8) / 7) + 0.25 * clamp(rs / 120) + 0.3 * tasted;
  const body = bodyIndex < 0.35 ? "light" : bodyIndex < 0.6 ? "medium" : "full";
  const bal = balance({ acidity: clamp((ta - 4) / 8), tannin: tasted, sweetness: clamp(rs / 60), alcohol: clamp((abv - 9) / 8) });
  if (abv > 14.5) notes.push("Very ripe grapes: a strong, warm wine.");
  if (ph > 3.8) notes.push("Low acidity (high pH): the wine is less stable and won't age well.");

  // ---------- colour ----------
  let core: string, rim: string, rimWidth: number, words: string;
  if (style === "red") {
    const I = anth;
    const L = clamp(58 - 44 * I + 0.5 * age, 16, 66);
    const C = 15 + 35 * I * (1 - 0.3 * (1 - Math.exp(-age / 10)));
    const h = 345 + 70 * (1 - Math.exp(-age / 8)) - 15 * (ph - 3.5);
    const hRim = h + 5 + 0.5 * age;
    core = lchToHex(L, C, h);
    rim = lchToHex(Math.min(L + 18 + age, 80), C * 0.85, hRim);
    rimWidth = Math.min(0.04 + 0.012 * age, 0.25);
    const hueWord = (x: number) => (x < 358 ? "purple" : x < 375 ? "ruby" : x < 397 ? "garnet" : x < 410 ? "tawny" : "brick");
    const depth = L < 30 ? "deep" : L < 45 ? "medium" : "pale";
    words = `${depth} ${hueWord(h)}${hueWord(hRim) !== hueWord(h) ? `, ${hueWord(hRim)} rim` : ""}`;
  } else if (style === "rosé") {
    const k = clamp(anth / 0.5);
    const h = 45 - 40 * k + 3 * age;
    const L = 88 - 35 * k;
    const C = 20 + 30 * k;
    core = lchToHex(L, C, h);
    rim = lchToHex(Math.min(L + 6, 95), C * 0.8, h + 4);
    rimWidth = 0.06;
    words = `${k < 0.35 ? "pale" : k < 0.7 ? "medium" : "deep"} ${h > 32 ? "salmon" : h > 18 ? "pink-orange" : "pink"}`;
  } else {
    const skinPhenolics = style === "orange" ? 1 - Math.exp(-t / 5) : 0;
    const W = 0.15 * age + (inp.oak === "new" ? 0.4 : inp.oak === "old" ? 0.2 : 0) * oakYears + 0.25 * Math.max(0, 1 / r - 1) + 1.2 * skinPhenolics + 0.5 * anth;
    const fW = 1 - Math.exp(-W);
    const h = 105 - 45 * fW;
    const L = 95 - 25 * fW;
    const C = 15 + 45 * fW;
    core = lchToHex(L, C, h);
    rim = lchToHex(Math.min(L + 3, 98), C * 0.6, h + 3);
    rimWidth = 0.08;
    const hueWord = h > 98 ? "lemon-green" : h > 88 ? "lemon" : h > 72 ? "gold" : h > 62 ? "amber" : "brown";
    words = `${fW < 0.3 ? "pale" : fW < 0.7 ? "medium" : "deep"} ${hueWord}`;
  }

  // ---------- aromas ----------
  // A grape's oak-related aromas (e.g. Chardonnay's butter) only show when the wine saw oak.
  const aromas = (GRAPE_AROMAS[g.name] ?? []).filter((x) => inp.oak !== "none" || !x.includes("oak"));
  if (inp.mlf > 0) aromas.push("butter (from malolactic fermentation)");
  if (inp.oak === "new") aromas.push("vanilla", "toast and spice (from oak)");
  if (inp.oak === "old") aromas.push("a little vanilla (old oak)");
  if (inp.bubbles === "sparkling" && inp.leesMonths >= 12) aromas.push("flavour from the yeast (lees)");

  return {
    style,
    sweetnessWord,
    bubblesWord,
    sugarAtHarvest: sugar,
    potentialAbv: abvFromSugar(sugar),
    abv,
    residualSugar: rs,
    ta,
    ph,
    tannin: tasted,
    pressureBar: pressure,
    body,
    balance: bal,
    colour: { core, rim, rimWidth, words },
    aromas,
    notes,
    modelVersion: MODEL_VERSION,
  };
}

// Plain-language tasting note.
export function describe(g: SimGrape, w: Wine): string[] {
  const acid = w.ta < 5.5 ? "soft, low acidity" : w.ta < 7.5 ? "fresh acidity" : "crisp, high acidity";
  const tan = w.tannin < 0.08 ? "no real tannin" : w.tannin < 0.3 ? "light tannin" : w.tannin < 0.6 ? "medium tannin" : "firm, grippy tannin";
  const style = w.style === "orange" ? "orange (skin-contact white)" : w.style;
  return [
    `A ${w.bubblesWord === "still" ? "" : w.bubblesWord + " "}${style} wine from ${g.name}, ${w.sweetnessWord}.`,
    `Colour: ${w.colour.words}.`,
    w.aromas.length ? `Smells of: ${w.aromas.join(", ")}.` : "Aromas: no specific notes in our sources for this grape.",
    `In the mouth: ${acid}, ${tan}, ${w.body} body${w.abv > 14 ? ", warm from the alcohol" : ""}. ${w.balance.note}`,
  ];
}
