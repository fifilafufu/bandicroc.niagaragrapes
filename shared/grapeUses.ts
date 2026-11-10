// What the world's grapes are used for, as published by the OIV (International Organisation of
// Vine and Wine). Shares are of the grapes available after harvest losses, exactly as OIV states
// them. Only years OIV has published are listed: nothing is filled in between.
//
// "pressed" = wine plus musts and juices; "table" = eaten fresh; "dried" = fresh grapes dried
// into raisins, sultanas and currants (about 4 kg of fresh grapes make 1 kg of dried grapes).

import type { SourceId } from "./sources";

export type UsesYear = {
  year: number;
  pressed?: number; // % of available grapes
  table?: number;
  dried?: number;
  provisional?: boolean;
  source: SourceId;
};

export const USES_SERIES: UsesYear[] = [
  { year: 2000, table: 26, source: "oiv-2025-provisional" },
  { year: 2018, pressed: 57, table: 36, dried: 7, source: "oiv-2018" },
  { year: 2021, pressed: 52, table: 41, dried: 7, source: "oiv-2021" },
  { year: 2022, pressed: 50, table: 42, dried: 8, source: "oiv-2022" },
  { year: 2024, pressed: 47, table: 46, dried: 7, source: "oiv-2024" },
  { year: 2025, table: 48, provisional: true, source: "oiv-2025-provisional" },
];

// The full OIV grape balance sheet for 2024 (million tonnes, except where noted).
export const BALANCE_2024 = {
  year: 2024,
  produced: 77.7,
  lost: 5.9,
  available: 71.8,
  pressed: 33.3,
  wine: 30.5,
  wineHl: 225.6, // million hectolitres of wine
  mustsJuices: 2.8,
  table: 33.3,
  driedFresh: 5.2, // fresh grapes sent to drying
  driedProduct: 1.3, // dried grapes that came out
  shares: { pressed: 47, table: 46, dried: 7 },
  china: 17.0,
  italy: 7.3,
  usa: 6.4,
  topTenShare: 70,
  source: "oiv-2024" as SourceId,
};

// More OIV 2024 figures (Statistical Brief 2024: text and Tables 3 and 7 to 9).
export const OIV_2024_MORE = {
  vineyardMha: 7.1, // million hectares under vines, all uses
  tradeMt: 5.0, // fresh grapes exported worldwide
  tradeBnEur: 9.9,
  // Fresh grape exporters by volume, thousand tonnes (Table 3)
  exporters: [
    { name: "China", kt: 594 },
    { name: "Peru", kt: 554 },
    { name: "Chile", kt: 523 },
    { name: "South Africa", kt: 416 },
    { name: "Netherlands", kt: 409 },
    { name: "Italy", kt: 389 },
    { name: "India", kt: 310 },
    { name: "USA", kt: 263 },
    { name: "Uzbekistan", kt: 219 },
    { name: "Mexico", kt: 204 },
  ],
  topImporters: [
    { name: "USA", kt: 777 },
    { name: "Netherlands", kt: 500 },
    { name: "Germany", kt: 354 },
  ],
  // Table grapes, million tonnes; these five grow 67% of the world's 33.3 Mt
  tableProducers: [
    { name: "China", mt: 14.2 },
    { name: "India", mt: 3.2 },
    { name: "Egypt", mt: 1.8 },
    { name: "Türkiye", mt: 1.8 },
    { name: "Uzbekistan", mt: 1.4 },
  ],
  tableTop5Share: 67,
  // Dried grapes (raisins), thousand tonnes; these five make 75% of the world's 1.3 Mt
  driedProducers: [
    { name: "Türkiye", kt: 315 },
    { name: "USA", kt: 228 },
    { name: "China", kt: 170 },
    { name: "Iran", kt: 164 },
    { name: "South Africa", kt: 94 },
  ],
  driedTop5Share: 75,
  source: "oiv-2024" as SourceId,
};
