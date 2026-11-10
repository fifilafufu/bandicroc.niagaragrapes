// Checked data for each grape in the app: its VIVC passport (official name, number, colour class,
// species, origin, parents) and a real Wikimedia Commons photo with author and licence.
// Built by scripts/build-varieties.mjs; see that file for how each value was found.

import data from "../../shared/varietyData.json";

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
export type VarietyInfo = { wiki: string; vivc: Vivc | null; photo: Photo | null };

const VARIETIES = data.varieties as unknown as Record<string, VarietyInfo>;
export const VARIETIES_CHECKED: string = data.checked;

export const varietyInfo = (name: string | null | undefined): VarietyInfo | null => (name ? (VARIETIES[name] ?? null) : null);
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
