// Questions built from the Learn pages' data: winemaking steps, the vine's year, species, wine
// structure, EU label words and the OIV trade tables. They change when that data changes.

import { OIV_2024_MORE } from "../grapeUses";
import type { SourceId } from "../sources";
import { SPECIES } from "../species";
import { STAGES } from "../growthCycle";
import { sparklingSweetness, stillSweetness } from "../wine";
import { PARTS } from "../wineBasics";
import { STEPS, STYLES, type Step, type StepId, type Style } from "../winemaking";
import { firstSentence, sample, withWrong } from "./random";
import type { ChoiceQ, MatchQ, OrderQ, Question } from "./types";

const unique = <T,>(list: T[]) => [...new Set(list)];

// Red wine macerates while it ferments, so those two have no fixed order: leave maceration out.
const SAME_TIME: Partial<Record<Style["id"], StepId>> = { red: "maceration" };

function orderQs(): OrderQ[] {
  const styles: OrderQ[] = STYLES.map((style) => {
    const steps = style.steps.filter((s) => !s.sometimes && s.id !== SAME_TIME[style.id]).map((s) => STEPS[s.id]);
    return {
      kind: "order",
      id: `order:${style.id}`,
      cat: "winemaking",
      level: style.id === "red" || style.id === "white" ? "newbie" : "pro",
      q: `${style.icon} Put the steps for ${style.name.toLowerCase()} wine in order.`,
      items: steps.map((s) => s.name),
      why: style.blurb,
      src: unique(steps.flatMap((s) => s.src ?? [])),
      wiki: style.id === "sparkling" ? ["Traditional method"] : ["Winemaking"],
    };
  });
  const year: OrderQ = {
    kind: "order",
    id: "order:year",
    cat: "biology",
    level: "newbie",
    q: "Put the grapevine's year in order, starting in spring.",
    items: STAGES.map((s) => s.name),
    why: "Budbreak in spring, then flowering, fruit set, véraison (ripening starts), harvest, and rest through winter.",
    wiki: ["Annual growth cycle of grapevines"],
  };
  return [...styles, year];
}

function matchQs(): MatchQ[] {
  const steps: Step[] = sample(Object.values(STEPS), 4);
  const parts = sample(PARTS, 4);
  return [
    {
      kind: "match",
      id: "match:steps",
      cat: "winemaking",
      level: "pro",
      q: "Match each winemaking step to what happens.",
      pairs: steps.map((s) => ({ term: s.name, meaning: firstSentence(s.what) })),
      why: "Every step, as described on the Winemaking page.",
      src: unique(steps.flatMap((s) => s.src ?? [])),
      wiki: unique(steps.flatMap((s) => s.wiki ?? [])),
    },
    {
      kind: "match",
      id: "match:parts",
      cat: "basics",
      level: "newbie",
      q: "Match each part of a wine to what it is.",
      pairs: parts.map((p) => ({ term: p.name.replace(/\s*\(.*\)/, ""), meaning: firstSentence(p.what) })),
      why: "The parts of a wine's structure, as on the Wine basics page.",
      src: unique(parts.flatMap((p) => p.src ?? [])),
      wiki: unique(parts.flatMap((p) => p.wiki)),
    },
    {
      kind: "match",
      id: "match:species",
      cat: "biology",
      level: "pro",
      q: "Match each grapevine species to its nickname.",
      pairs: SPECIES.map((s) => ({ term: s.name, meaning: s.nick })),
      why: "The four main grapevine species, as on the Biology page.",
      wiki: SPECIES.map((s) => s.name),
    },
    {
      kind: "match",
      id: "match:sweetness",
      cat: "basics",
      level: "pro",
      q: "Match each EU label word for still wine to its sugar level.",
      pairs: [
        { term: "Dry", meaning: "Up to 4 g/L (up to 9 g/L if the wine is acidic enough)" },
        { term: "Medium dry", meaning: "Up to 12 g/L (up to 18 g/L if acidic enough)" },
        { term: "Medium sweet", meaning: "Up to 45 g/L" },
        { term: "Sweet", meaning: "45 g/L or more" },
      ],
      why: "EU Regulation 2019/33: the acid rule lets a crisp wine with a little more sugar still count as dry or medium dry.",
      src: ["eu-2019-33"],
    },
  ];
}

// What the EU label says for a given amount of sugar left in the wine (worked out by shared/wine.ts).
function labelQs(): ChoiceQ[] {
  const ta = 6; // g/L total acidity, a typical value
  const still: string[] = ["dry", "medium dry", "medium sweet", "sweet"];
  const stillQs: ChoiceQ[] = [2, 30, 60].map((rs) => {
    const word = stillSweetness(rs, ta);
    return {
      kind: "choice",
      id: `label:still:${rs}`,
      cat: "basics",
      level: rs === 60 ? "newbie" : "pro",
      q: `A still wine has ${rs} g/L of sugar left (and ${ta} g/L acidity). Which word goes on an EU label?`,
      options: still,
      answer: still.indexOf(word),
      why: `With ${rs} g/L of sugar it is "${word}". Dry is up to 4 g/L, sweet from 45 g/L.`,
      src: ["eu-2019-33"],
    };
  });
  const rs = 8;
  const word = sparklingSweetness(rs, true);
  const sparkling: ChoiceQ = {
    kind: "choice",
    id: "label:sparkling",
    cat: "basics",
    level: "pro",
    q: `A sparkling wine has ${rs} g/L of sugar. Which word goes on an EU label?`,
    ...withWrong(word, ["brut nature", "extra brut", "brut", "extra dry", "dry", "sweet (doux)"]),
    why: `${rs} g/L is "${word}" (less than 12 g/L). Confusingly, sparkling "extra dry" (12 to 17 g/L) is sweeter than brut.`,
    src: ["eu-2019-33"],
  };
  return [...stillQs, sparkling];
}

// "Which country … the most in 2024?" from the OIV tables; the other top countries are the wrong answers.
function topQs(): ChoiceQ[] {
  const M = OIV_2024_MORE;
  const src: SourceId[] = [M.source];
  const tables = [
    { id: "export", q: "exported the most fresh grapes", list: M.exporters.map((e) => ({ name: e.name, v: `${e.kt},000 t` })), level: "newbie" as const },
    { id: "import", q: "imported the most fresh grapes", list: M.topImporters.map((e) => ({ name: e.name, v: `${e.kt},000 t` })), level: "pro" as const },
    { id: "table", q: "grew the most table grapes", list: M.tableProducers.map((e) => ({ name: e.name, v: `${e.mt} Mt` })), level: "pro" as const },
    { id: "dried", q: "made the most dried grapes (raisins)", list: M.driedProducers.map((e) => ({ name: e.name, v: `${e.kt},000 t` })), level: "pro" as const },
  ];
  return tables.map((t) => ({
    kind: "choice",
    id: `top:${t.id}`,
    cat: "statistics",
    level: t.level,
    q: `Which country ${t.q} in 2024?`,
    ...withWrong(t.list[0].name, t.list.slice(1, 6).map((e) => e.name)),
    why: `Top 3 (OIV 2024): ${t.list.slice(0, 3).map((e) => `${e.name} ${e.v}`).join(", ")}.`,
    src,
  }));
}

export const pageQuestions = (): Question[] => [...orderQs(), ...matchQs(), ...labelQs(), ...topQs()];
