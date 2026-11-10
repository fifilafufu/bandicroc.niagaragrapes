// Polish wording of the questions built from the app's data: the same shape as QUIZ_TEXT_EN in
// shared/quiz/text.ts, with the same facts, numbers and sources. Data names come from the Polish
// files already checked for the pages (wine.ts, biology.ts, varieties.ts).
// Checked terms (Polish Wikipedia): mączniak rzekomy (Downy mildew), mączniak prawdziwy (Powdery
// mildew → Mączniakowce). No Polish article, kept in English: black rot, spur and cane (pruning).

import type { DiseaseKey } from "../../diseases";
import type { QuizText } from "../../quiz/text";
import { niceCase } from "../../varieties";
import { countryName, num } from "../countries";
import { SPECIES_TEXT_PL, STAGES_PL } from "./biology";
import { CLASSES_PL } from "./varieties";
import { PARTS_PL, STEPS_PL, STYLES_PL, SWEETNESS_PL } from "./wine";

// Disease names in the accusative ("odporna na …").
const DISEASE_ACC: Partial<Record<DiseaseKey, string>> = {
  downy: "mączniaka rzekomego",
  powdery: "mączniaka prawdziwego",
  blackRot: "black rot",
};

// VIVC countries of origin, keyed by VIVC's own spelling.
const ORIGIN_PL: Record<string, string> = {
  "UNITED STATES OF AMERICA": "Stany Zjednoczone",
  "CENTRAL ASIA": "Azja Środkowa",
  FRANCE: "Francja",
  GERMANY: "Niemcy",
  JAPAN: "Japonia",
  SPAIN: "Hiszpania",
};

// "wino czerwone" → "wina czerwonego"
const STYLE_GEN: Record<string, string> = { red: "czerwonego", white: "białego", rose: "różowego", sparkling: "musującego" };
const PRUNE = { spur: "cięcie krótkie (spur)", cane: "cięcie długie (cane)" };

export const QUIZ_TEXT_PL: QuizText = {
  step: (id) => STEPS_PL[id],
  styleBlurb: (id) => STYLES_PL[id].blurb,
  stage: (id) => STAGES_PL[id].name,
  part: (id) => PARTS_PL[id],
  speciesNick: (name, nick) => SPECIES_TEXT_PL[name]?.nick ?? nick,
  sweetWord: (en) => SWEETNESS_PL[en] ?? en,
  classMeaning: (cls) => CLASSES_PL[cls].meaning,
  origin: (vivc) => ORIGIN_PL[vivc] ?? niceCase(vivc),
  country: (name) => countryName(name, "pl"),

  photoQ: "Jaka odmiana jest na tym zdjęciu?",
  photoWhy: (name, cls) => `To ${name}${cls ? `, odmiana ${CLASSES_PL[cls.cls].meaning} (klasa barwy VIVC „${cls.cls}”)` : ""}.`,
  colourQ: (name) => `Jaką klasę barwy skórki VIVC przypisuje odmianie ${name}?`,
  colourWhy: (name, cls) => `${name} ma klasę „${cls}”, czyli skórka ${CLASSES_PL[cls].meaning}: ${CLASSES_PL[cls].note}.`,
  originQ: (name) => `Skąd pochodzi ${name} według VIVC?`,
  originWhy: (name, origin) => `VIVC podaje jako kraj pochodzenia odmiany ${name}: ${origin}.`,
  parentsQ: (name) => `Kto jest rodzicami odmiany ${name}?`,
  parentsWhy: (name, parents) => `Według VIVC rodzice odmiany ${name} to ${parents}.`,
  budQ: "Która z tych odmian wcześnie wypuszcza pąki, więc wiosenny przymrozek może uszkodzić jej młode pędy?",
  budWhy: (name, wrong) => `${name} wypuszcza pąki wcześnie, a ${wrong.join(", ")} późno.`,
  ripeQ: "Która z tych odmian dojrzewa wcześnie?",
  ripeWhy: (name, wrong) => `${name} dojrzewa wcześnie, a ${wrong.join(", ")} późno.`,
  pruneQ: (name) => `Jakie cięcie pasuje do odmiany ${name}?`,
  pruneOptions: ["Cięcie krótkie (spur)", "Cięcie długie (cane)"],
  pruneWhy: (name, type) => `Według źródła do odmiany ${name} pasuje ${PRUNE[type]}.`,
  resistQ: (d) => `Która z tych odmian jest najbardziej odporna na ${DISEASE_ACC[d] ?? d}?`,
  resistWhy: (scores) => `Oceny VIVC (1 = bardzo podatna, 9 = bardzo odporna): ${scores}.`,

  orderStyleQ: (style) => `${style.icon} Ułóż etapy produkcji wina ${STYLE_GEN[style.id]} we właściwej kolejności.`,
  yearQ: "Ułóż rok winorośli we właściwej kolejności, zaczynając od wiosny.",
  yearWhy: "Wiosną pękanie pąków, potem kwitnienie, zawiązywanie owoców, véraison (początek dojrzewania), zbiór i spoczynek przez zimę.",
  matchStepsQ: "Dopasuj każdy etap produkcji wina do tego, co się w nim dzieje.",
  matchStepsWhy: "Każdy etap tak, jak opisuje go strona Winiarstwo.",
  matchPartsQ: "Dopasuj każdy składnik wina do jego opisu.",
  matchPartsWhy: "Składniki struktury wina, jak na stronie Podstawy wina.",
  matchSpeciesQ: "Dopasuj każdy gatunek winorośli do jego polskiej nazwy.",
  matchSpeciesWhy: "Cztery główne gatunki winorośli, jak na stronie Biologia.",
  sweetQ: "Dopasuj każde określenie z etykiety UE dla wina niemusującego do zawartości cukru.",
  sweetMeanings: ["Do 4 g/L (do 9 g/L, jeśli wino jest dość kwasowe)", "Do 12 g/L (do 18 g/L, jeśli jest dość kwasowe)", "Do 45 g/L", "45 g/L lub więcej"],
  sweetWhy: "Rozporządzenie UE 2019/33: dzięki regule kwasowości rześkie wino z odrobiną więcej cukru nadal może być wytrawne lub półwytrawne.",
  stillQ: (rs, ta) => `Wino niemusujące ma ${rs} g/L pozostałego cukru (i ${ta} g/L kwasowości). Które słowo trafi na etykietę w UE?`,
  stillWhy: (rs, word) => `Przy ${rs} g/L cukru to „${word}”. Wytrawne do 4 g/L, słodkie od 45 g/L.`,
  sparklingQ: (rs) => `Wino musujące ma ${rs} g/L cukru. Które słowo trafi na etykietę w UE?`,
  sparklingWhy: (rs, word) => `${rs} g/L to „${word}” (mniej niż 12 g/L). Uwaga, myląca rzecz: musujące „extra dry” (12–17 g/L) jest słodsze niż brut.`,
  topQ: {
    export: "Który kraj wyeksportował najwięcej świeżych winogron w 2024 r.?",
    import: "Który kraj zaimportował najwięcej świeżych winogron w 2024 r.?",
    table: "Który kraj wyprodukował najwięcej winogron deserowych w 2024 r.?",
    dried: "Który kraj wyprodukował najwięcej suszonych winogron (rodzynek) w 2024 r.?",
  },
  topValue: (e) => (e.mt !== undefined ? `${num(e.mt, "pl")} mln t` : `${num(e.kt!, "pl")} tys. t`),
  topWhy: (top3) => `Pierwsza trójka (OIV 2024): ${top3}.`,
};
