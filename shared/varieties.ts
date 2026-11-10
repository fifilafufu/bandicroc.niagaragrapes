// Checked data for each grape in the app: its VIVC passport (official name, number, colour class,
// species, origin, parents), VIVC disease-resistance scores and a real Wikimedia Commons photo with
// author and licence. Built by scripts/build-varieties.mjs; see that file for how each value was found.
// Used by the app, the quizzes and Grape Bot.

import data from "./varietyData.json";
import type { DiseaseKey } from "./diseases";

export type Photo = {
  file: string;
  thumb: string;
  page: string; // the photo's Commons page (full credit and licence)
  author: string;
  licence: string;
  licenceUrl: string | null;
};
export type Vivc = {
  id: number;
  primeName: string;
  colour: "blanc" | "rose" | "gris" | "rouge" | "noir" | null;
  species: string | null;
  origin: string | null;
  pedigree: string | null;
  url: string;
};
// VIVC disease-resistance scores, OIV 1 to 9 scale (1 = very susceptible, 9 = very resistant):
// the median of all studies VIVC lists, and how many studies there were.
export type Resistance = Partial<Record<DiseaseKey, { score: number; studies: number }>>;
export type VarietyInfo = { wiki: string; vivc: Vivc | null; photo: Photo | null; resistance?: Resistance | null };

const BY_NAME = data.varieties as unknown as Record<string, VarietyInfo>;
export const VARIETIES: [string, VarietyInfo][] = Object.entries(BY_NAME);
export const VARIETIES_CHECKED: string = data.checked;

export const varietyInfo = (name: string | null | undefined): VarietyInfo | null => (name ? (BY_NAME[name] ?? null) : null);
export const photoOf = (name: string | null | undefined) => varietyInfo(name)?.photo ?? null;

// VIVC's colour classes in plain English.
export const COLOUR_CLASS: Record<string, { label: string; meaning: string; dot: string }> = {
  blanc: { label: "Blanc", meaning: "white (green to yellow)", dot: "#b9cf5a" },
  rose: { label: "Rose", meaning: "pink", dot: "#e79bb0" },
  gris: { label: "Gris", meaning: "grey-pink", dot: "#a58a8f" },
  rouge: { label: "Rouge", meaning: "red", dot: "#b0243c" },
  noir: { label: "Noir", meaning: "black (blue-black)", dot: "#2b2140" },
};

// "VITIS VINIFERA LINNÉ SUBSP. SATIVA (DE CANDOLLE) HEGI" → "Vitis vinifera" and similar.
export function speciesLabel(species: string | null): string | null {
  if (!species) return null;
  const s = species.toUpperCase();
  if (s.startsWith("VITIS VINIFERA")) return "Vitis vinifera";
  if (s.includes("INTERSPECIFIC")) return "Hybrid (crossed species)";
  if (s.includes("ROTUNDIFOLIA")) return "Muscadinia rotundifolia (muscadine)";
  if (s.includes("LABRUSCA")) return "Vitis labrusca";
  return species.charAt(0) + species.slice(1).toLowerCase();
}

// VIVC writes names in capitals: "UNITED STATES OF AMERICA" → "United States of America".
const SMALL = new Set(["of", "de", "des", "du", "la", "le", "x"]);
export function niceCase(s: string): string {
  return s
    .replace(/\s+LINNE\b/g, "")
    .toLowerCase()
    .split(" ")
    .map((w, i) => (i > 0 && SMALL.has(w) ? w : w.replace(/\p{L}/u, (c) => c.toUpperCase())))
    .join(" ")
    .replace(/ x /g, " × ")
    .replace(/Vitis (\p{L}+)/gu, (_, sp: string) => `Vitis ${sp.toLowerCase()}`);
}
