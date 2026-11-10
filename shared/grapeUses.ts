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
