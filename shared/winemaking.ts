// How wine is made: each step, what it does and where that comes from, plus the order of steps for
// red, white, rosé and sparkling wine. Step wording follows the OIV International Code of Oenological
// Practices where it defines the step; the rest is from the named Wikipedia articles (checked 2026-11-10).

import type { SourceId } from "./sources";

export type StepId =
  | "harvest"
  | "crush"
  | "maceration"
  | "press"
  | "ferment"
  | "mlf"
  | "age"
  | "clarify"
  | "bottle"
  | "tirage"
  | "second"
  | "lees"
  | "riddle"
  | "disgorge";

export type Step = { id: StepId; name: string; icon: string; what: string; why: string; src?: SourceId[]; wiki?: string[] };

export const STEPS: Record<StepId, Step> = {
  harvest: {
    id: "harvest",
    name: "Harvest",
    icon: "🧺",
    what: "Ripe grapes are picked, by hand or by machine.",
    why: "When to pick decides the wine: riper grapes have more sugar (more possible alcohol) and less acid.",
    wiki: ["Winemaking", "Annual growth cycle of grapevines"],
  },
  crush: {
    id: "crush",
    name: "Crushing & destemming",
    icon: "🫳",
    what: "The berries' skins are broken to free the juice (the “must”), and the stems are removed, often by a machine with paddles.",
    why: "The juice can meet the yeasts that live on the grape skins, and skin flavours can pass into it.",
    src: ["oiv-code"],
    wiki: ["Winemaking"],
  },
  maceration: {
    id: "maceration",
    name: "Maceration (skin contact)",
    icon: "🫗",
    what: "Juice and skins are left together for a while. For red wine this happens while it ferments.",
    why: "It pulls colour, tannin and flavour out of the skins. Short contact gives rosé; long contact gives red. White and rosé wines take very little tannin from the skins.",
    src: ["oiv-code"],
    wiki: ["Winemaking", "Phenolic content in wine"],
  },
  press: {
    id: "press",
    name: "Pressing",
    icon: "🗜️",
    what: "Grapes or skins are squeezed to get the liquid out.",
    why: "For white and rosé: get clear juice before fermenting. For red: separate the new wine from the skins after fermenting.",
    src: ["oiv-code"],
  },
  ferment: {
    id: "ferment",
    name: "Alcoholic fermentation",
    icon: "🫧",
    what: "Yeasts turn the grape sugars into alcohol and carbon dioxide. They can be the wild yeasts on the skins or chosen yeasts added by the winemaker.",
    why: "This makes the wine. About 16.8 g/L of sugar gives 1% alcohol; yeasts usually stop somewhere between 14 and 18%, and any sugar left makes the wine sweet.",
    src: ["oiv-code", "oiv-sugar-alcohol"],
    wiki: ["Alcohol by volume"],
  },
  mlf: {
    id: "mlf",
    name: "Malolactic fermentation",
    icon: "🧈",
    what: "Bacteria turn sharp malic acid (the taste of green apples) into softer lactic acid.",
    why: "The wine becomes less acidic and more stable. It can add a buttery note. Standard for most reds, common for some whites such as Chardonnay.",
    src: ["oiv-code", "awri-mlf-red"],
    wiki: ["Malolactic fermentation"],
  },
  age: {
    id: "age",
    name: "Ageing (often in oak)",
    icon: "🛢️",
    what: "The wine rests for a while, for example in small oak barrels.",
    why: "A little oxygen gets through the wood and softens tannins; the oak adds vanilla flavour (vanillin) and tannin of its own.",
    src: ["oiv-code"],
    wiki: ["Oak (wine)"],
  },
  clarify: {
    id: "clarify",
    name: "Clarification",
    icon: "🔍",
    what: "The wine is made clear: poured off its sediment (racking), cleared with fining agents, filtered, and often chilled so tartrate crystals drop out.",
    why: "Removes cloudiness and yeast, and makes the wine stable so it stays clear in the bottle.",
    src: ["oiv-code"],
    wiki: ["Acids in wine"],
  },
  bottle: {
    id: "bottle",
    name: "Bottling",
    icon: "🍾",
    what: "The finished, clear wine is put into bottles and closed.",
    why: "Wine keeps changing as it ages: in red wine, colour pigments and tannins join together, changing the colour and making it less astringent.",
    wiki: ["Winemaking", "Phenolic content in wine"],
  },
  tirage: {
    id: "tirage",
    name: "Tirage",
    icon: "🍬",
    what: "A still base wine is bottled with yeast and a little sugar (liqueur de tirage) and closed with a crown cap.",
    why: "This sugar will make the bubbles.",
    wiki: ["Traditional method"],
  },
  second: {
    id: "second",
    name: "Second fermentation in the bottle",
    icon: "🫧",
    what: "The yeast ferments the added sugar inside the closed bottle.",
    why: "The carbon dioxide can't escape, so it dissolves into the wine: fully sparkling wine holds about 5 to 6 atmospheres of pressure.",
    wiki: ["Traditional method", "Sparkling wine"],
  },
  lees: {
    id: "lees",
    name: "Ageing on the lees",
    icon: "⏳",
    what: "The bottles rest with the dead yeast (lees) inside.",
    why: "It adds flavour. Non-vintage Champagne must spend at least 15 months on the lees.",
    wiki: ["Traditional method"],
  },
  riddle: {
    id: "riddle",
    name: "Riddling",
    icon: "🔄",
    what: "Bottles are turned and tilted, little by little, until they stand upside down, today mostly by machine.",
    why: "The yeast sediment slides down into the neck of the bottle.",
    wiki: ["Traditional method"],
  },
  disgorge: {
    id: "disgorge",
    name: "Disgorging & dosage",
    icon: "❄️",
    what: "The neck is frozen and the plug of ice with the yeast is popped out. The bottle is topped up with wine and a little sugar (dosage), then corked.",
    why: "The wine is clear, and the dosage sets how dry or sweet it tastes, from brut nature to doux.",
    src: ["eu-2019-33"],
    wiki: ["Traditional method"],
  },
};

export type Style = { id: "red" | "white" | "rose" | "sparkling"; name: string; icon: string; blurb: string; steps: { id: StepId; sometimes?: boolean; note?: string }[] };

export const STYLES: Style[] = [
  {
    id: "red",
    name: "Red",
    icon: "🍷",
    blurb: "Dark grapes ferment together with their skins, so colour and tannin pass into the wine. Pressing comes after fermentation.",
    steps: [
      { id: "harvest" },
      { id: "crush" },
      { id: "maceration", note: "days to weeks, at the same time as fermentation" },
      { id: "ferment", note: "on the skins" },
      { id: "press", note: "after fermenting" },
      { id: "mlf", note: "standard for most reds" },
      { id: "age", sometimes: true },
      { id: "clarify" },
      { id: "bottle" },
    ],
  },
  {
    id: "white",
    name: "White",
    icon: "🥂",
    blurb: "Grapes are pressed first and only the juice ferments, so almost no colour or tannin comes from the skins.",
    steps: [
      { id: "harvest" },
      { id: "crush" },
      { id: "press", note: "before fermenting" },
      { id: "ferment", note: "juice only" },
      { id: "mlf", sometimes: true, note: "e.g. many Chardonnays" },
      { id: "age", sometimes: true },
      { id: "clarify" },
      { id: "bottle" },
    ],
  },
  {
    id: "rose",
    name: "Rosé",
    icon: "🌸",
    blurb: "Dark grapes, but the juice stays on the skins only long enough to pick up a pink colour, so it takes very little tannin.",
    steps: [
      { id: "harvest" },
      { id: "crush" },
      { id: "maceration", note: "short: just long enough to turn pink" },
      { id: "press" },
      { id: "ferment", note: "juice only" },
      { id: "clarify" },
      { id: "bottle" },
    ],
  },
  {
    id: "sparkling",
    name: "Sparkling",
    icon: "🍾",
    blurb: "Traditional method (as in Champagne): first make a still wine, then a second fermentation in the closed bottle makes the bubbles.",
    steps: [
      { id: "harvest" },
      { id: "press", note: "to make a still base wine" },
      { id: "ferment", note: "first fermentation: still base wine" },
      { id: "tirage" },
      { id: "second" },
      { id: "lees" },
      { id: "riddle" },
      { id: "disgorge" },
    ],
  },
];
