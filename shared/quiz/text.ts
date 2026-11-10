// The English wording of the questions built from the app's data (fromVarieties.ts, fromPages.ts),
// plus the data names they use. shared/i18n/pl/quizText.ts has the same shape in Polish, so the
// builders make the same questions, with the same answers and sources, in either language.

import { CLASSES } from "../colourClasses";
import { DISEASE_NAMES, type DiseaseKey } from "../diseases";
import { STAGES } from "../growthCycle";
import { niceCase } from "../varieties";
import { PARTS, type PartId } from "../wineBasics";
import { STEPS, STYLES, type StepId, type Style } from "../winemaking";
import type { Lang } from "../i18n";
import { QUIZ_TEXT_PL } from "../i18n/pl/quizText";

export type TopId = "export" | "import" | "table" | "dried";
type Ranked = { name: string; kt?: number; mt?: number };

export type QuizText = {
  // data names
  step: (id: StepId) => { name: string; what: string };
  styleBlurb: (id: Style["id"]) => string;
  stage: (id: string) => string;
  part: (id: PartId) => { name: string; what: string };
  speciesNick: (name: string, nick: string) => string;
  sweetWord: (en: string) => string;
  classMeaning: (cls: string) => string;
  origin: (vivc: string) => string;
  country: (name: string) => string;
  // varieties and growing
  photoQ: string;
  photoWhy: (name: string, cls?: { cls: string; meaning: string }) => string;
  colourQ: (name: string) => string;
  colourWhy: (name: string, cls: string) => string;
  originQ: (name: string) => string;
  originWhy: (name: string, origin: string) => string;
  parentsQ: (name: string) => string;
  parentsWhy: (name: string, parents: string) => string;
  budQ: string;
  budWhy: (name: string, wrong: string[], frostRisk?: string) => string;
  ripeQ: string;
  ripeWhy: (name: string, wrong: string[]) => string;
  pruneQ: (name: string) => string;
  pruneOptions: [string, string];
  pruneWhy: (name: string, type: "spur" | "cane", text: string) => string;
  resistQ: (disease: DiseaseKey) => string;
  resistWhy: (scores: string) => string;
  // Learn pages
  orderStyleQ: (style: Style) => string;
  yearQ: string;
  yearWhy: string;
  matchStepsQ: string;
  matchStepsWhy: string;
  matchPartsQ: string;
  matchPartsWhy: string;
  matchSpeciesQ: string;
  matchSpeciesWhy: string;
  sweetQ: string;
  sweetMeanings: [string, string, string, string];
  sweetWhy: string;
  stillQ: (rs: number, ta: number) => string;
  stillWhy: (rs: number, word: string) => string;
  sparklingQ: (rs: number) => string;
  sparklingWhy: (rs: number, word: string) => string;
  topQ: Record<TopId, string>;
  topValue: (e: Ranked) => string;
  topWhy: (top3: string) => string;
};

const CLASS_OF = (cls: string) => CLASSES.find((c) => c.cls === cls)!;

export const QUIZ_TEXT_EN: QuizText = {
  step: (id) => STEPS[id],
  styleBlurb: (id) => STYLES.find((s) => s.id === id)!.blurb,
  stage: (id) => STAGES.find((s) => s.id === id)!.name,
  part: (id) => PARTS.find((p) => p.id === id)!,
  speciesNick: (_name, nick) => nick,
  sweetWord: (en) => en,
  classMeaning: (cls) => CLASS_OF(cls).meaning,
  origin: niceCase,
  country: (name) => name,

  photoQ: "Which grape is in this photo?",
  photoWhy: (name, cls) => `This is ${name}${cls ? `, a ${cls.meaning} grape (VIVC colour class "${cls.cls}")` : ""}.`,
  colourQ: (name) => `Which skin colour class does VIVC give ${name}?`,
  colourWhy: (name, cls) => `${name} is "${cls}", meaning ${CLASS_OF(cls).meaning}: ${CLASS_OF(cls).note}.`,
  originQ: (name) => `Where does ${name} come from, according to VIVC?`,
  originWhy: (name, origin) => `VIVC gives ${name}'s country of origin as ${origin}.`,
  parentsQ: (name) => `Who are ${name}'s parents?`,
  parentsWhy: (name, parents) => `VIVC lists ${name}'s parents as ${parents}.`,
  budQ: "Which of these grapes buds early, so a spring frost can hit its young shoots?",
  budWhy: (name, wrong, frostRisk) => `${name} buds early; ${wrong.join(", ")} bud late. ${frostRisk ?? ""}`.trim(),
  ripeQ: "Which of these grapes ripens early?",
  ripeWhy: (name, wrong) => `${name} ripens early; ${wrong.join(", ")} ripen late.`,
  pruneQ: (name) => `Which pruning suits ${name}?`,
  pruneOptions: ["Spur (short) pruning", "Cane (long) pruning"],
  pruneWhy: (_name, _type, text) => text,
  resistQ: (d) => `Which of these grapes resists ${DISEASE_NAMES[d].toLowerCase()} best?`,
  resistWhy: (scores) => `VIVC scores (1 = very susceptible, 9 = very resistant): ${scores}.`,

  orderStyleQ: (style) => `${style.icon} Put the steps for ${style.name.toLowerCase()} wine in order.`,
  yearQ: "Put the grapevine's year in order, starting in spring.",
  yearWhy: "Budbreak in spring, then flowering, fruit set, véraison (ripening starts), harvest, and rest through winter.",
  matchStepsQ: "Match each winemaking step to what happens.",
  matchStepsWhy: "Every step, as described on the Winemaking page.",
  matchPartsQ: "Match each part of a wine to what it is.",
  matchPartsWhy: "The parts of a wine's structure, as on the Wine basics page.",
  matchSpeciesQ: "Match each grapevine species to its nickname.",
  matchSpeciesWhy: "The four main grapevine species, as on the Biology page.",
  sweetQ: "Match each EU label word for still wine to its sugar level.",
  sweetMeanings: ["Up to 4 g/L (up to 9 g/L if the wine is acidic enough)", "Up to 12 g/L (up to 18 g/L if acidic enough)", "Up to 45 g/L", "45 g/L or more"],
  sweetWhy: "EU Regulation 2019/33: the acid rule lets a crisp wine with a little more sugar still count as dry or medium dry.",
  stillQ: (rs, ta) => `A still wine has ${rs} g/L of sugar left (and ${ta} g/L acidity). Which word goes on an EU label?`,
  stillWhy: (rs, word) => `With ${rs} g/L of sugar it is "${word}". Dry is up to 4 g/L, sweet from 45 g/L.`,
  sparklingQ: (rs) => `A sparkling wine has ${rs} g/L of sugar. Which word goes on an EU label?`,
  sparklingWhy: (rs, word) => `${rs} g/L is "${word}" (less than 12 g/L). Confusingly, sparkling "extra dry" (12 to 17 g/L) is sweeter than brut.`,
  topQ: {
    export: "Which country exported the most fresh grapes in 2024?",
    import: "Which country imported the most fresh grapes in 2024?",
    table: "Which country grew the most table grapes in 2024?",
    dried: "Which country made the most dried grapes (raisins) in 2024?",
  },
  topValue: (e) => (e.mt !== undefined ? `${e.mt} Mt` : `${e.kt},000 t`),
  topWhy: (top3) => `Top 3 (OIV 2024): ${top3}.`,
};

export const quizText = (lang: Lang): QuizText => (lang === "pl" ? QUIZ_TEXT_PL : QUIZ_TEXT_EN);
