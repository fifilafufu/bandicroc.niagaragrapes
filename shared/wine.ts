// The wine model: the rules Wine basics, Winemaking and (later) Make Your Wine all share, so their
// numbers always agree. Every rule names its source. Tested by scripts/test-wine.ts.

// ---------- sugar and alcohol ----------

// OIV Resolution OENO 466-2012: sugar (g/L) × 0.05943 = potential alcohol (% vol).
// So about 16.83 g/L of sugar makes 1% alcohol.
export const ABV_PER_GRAM = 0.05943;
export const SUGAR_PER_ABV = 1 / ABV_PER_GRAM; // 16.83 g/L

export const abvFromSugar = (sugarGL: number) => sugarGL * ABV_PER_GRAM;
export const sugarForAbv = (abv: number) => abv * SUGAR_PER_ABV;

// Wikipedia "Alcohol by volume": wine yeasts typically stop between 14 and 18% alcohol.
export const YEAST_LIMIT_ABV = { low: 14, high: 18, typical: 15.5 };

// Ferment `fraction` (0 to 1) of the grape sugar. Yeast stops at `yeastLimit`, so whatever sugar is
// left stays in the wine as residual sugar. Alcohol can only come from sugar that was fermented.
export function ferment(sugarGL: number, fraction: number, yeastLimit = YEAST_LIMIT_ABV.typical) {
  const wanted = Math.max(0, Math.min(1, fraction)) * sugarGL;
  const fermented = Math.min(wanted, sugarForAbv(yeastLimit));
  return {
    abv: abvFromSugar(fermented),
    residualSugar: sugarGL - fermented,
    stoppedByYeast: wanted > fermented,
  };
}

// ---------- sweetness words on the label (EU Regulation 2019/33, Annex III) ----------

export type StillSweetness = "dry" | "medium dry" | "medium sweet" | "sweet";

// Still wine (Part B). ta = total acidity as g/L tartaric acid. The acid rule lets a crisp wine
// with a little more sugar still count as dry: acidity may be at most 2 g/L below the sugar.
export function stillSweetness(residualSugar: number, ta: number): StillSweetness {
  const rs = residualSugar;
  if (rs <= 4 || (rs <= 9 && ta >= rs - 2)) return "dry";
  if (rs <= 12 || (rs <= 18 && ta >= rs - 10)) return "medium dry";
  if (rs < 45) return "medium sweet";
  return "sweet";
}

export type SparklingSweetness = "brut nature" | "extra brut" | "brut" | "extra dry" | "dry" | "medium dry (demi-sec)" | "sweet (doux)";

// Sparkling wine (Part A). "Brut nature" also needs no sugar added after the second fermentation.
export function sparklingSweetness(residualSugar: number, sugarAddedAfter: boolean): SparklingSweetness {
  const rs = residualSugar;
  if (rs < 3 && !sugarAddedAfter) return "brut nature";
  if (rs <= 6) return "extra brut";
  if (rs < 12) return "brut";
  if (rs <= 17) return "extra dry";
  if (rs <= 32) return "dry";
  if (rs <= 50) return "medium dry (demi-sec)";
  return "sweet (doux)";
}

// ---------- balance ----------

// Virginia Tech Enology: the sweetness that comes from sugar and alcohol must balance the sum of
// acidity, astringency (tannin) and bitterness. Wikipedia "Wine tasting descriptors": a balanced wine
// has no single component standing out; "cloying" is sweetness not balanced by acidity.
// Inputs are 0 (none) to 1 (very high). This is a teaching model, not a lab measurement.
export type BalanceInput = { acidity: number; tannin: number; sweetness: number; alcohol: number };

export function balance({ acidity, tannin, sweetness, alcohol }: BalanceInput) {
  const soft = sweetness + alcohol;
  const firm = acidity + tannin;
  const tilt = soft - firm; // > 0 leans soft, < 0 leans firm
  let verdict: "balanced" | "too soft" | "too firm";
  if (Math.abs(tilt) <= 0.35) verdict = "balanced";
  else verdict = tilt > 0 ? "too soft" : "too firm";
  let note: string;
  if (verdict === "balanced") note = "Nothing sticks out: a balanced wine.";
  else if (verdict === "too soft")
    note = sweetness >= alcohol ? "Too sweet for its acidity: it tastes cloying." : "Alcohol and softness win: it tastes heavy and hot.";
  else note = tannin >= acidity ? "Tannin wins: it feels harsh and drying." : "Acid wins: it tastes sharp and sour.";
  return { soft, firm, tilt, verdict, note };
}
