// Questions built from the Learn pages' data: winemaking steps, the vine's year, species, wine
// structure, EU label words and the OIV trade tables. They change when that data changes.
// The wording comes from text.ts (English) or its Polish twin; answers and sources are the same.

import { OIV_2024_MORE } from "../grapeUses";
import type { SourceId } from "../sources";
import { SPECIES } from "../species";
import { STAGES } from "../growthCycle";
import { sparklingSweetness, stillSweetness } from "../wine";
import { PARTS } from "../wineBasics";
import { STEPS, STYLES, type Step, type StepId, type Style } from "../winemaking";
import { firstSentence, sample, withWrong } from "./random";
import type { QuizText, TopId } from "./text";
import type { ChoiceQ, MatchQ, OrderQ, Question } from "./types";

const unique = <T,>(list: T[]) => [...new Set(list)];

// Red wine macerates while it ferments, so those two have no fixed order: leave maceration out.
const SAME_TIME: Partial<Record<Style["id"], StepId>> = { red: "maceration" };

function orderQs(t: QuizText): OrderQ[] {
  const styles: OrderQ[] = STYLES.map((style) => {
    const steps = style.steps.filter((s) => !s.sometimes && s.id !== SAME_TIME[style.id]).map((s) => STEPS[s.id]);
    return {
      kind: "order",
      id: `order:${style.id}`,
      cat: "winemaking",
      level: style.id === "red" || style.id === "white" ? "newbie" : "pro",
      q: t.orderStyleQ(style),
      items: steps.map((s) => t.step(s.id).name),
      why: t.styleBlurb(style.id),
      src: unique(steps.flatMap((s) => s.src ?? [])),
      wiki: style.id === "sparkling" ? ["Traditional method"] : ["Winemaking"],
    };
  });
  const year: OrderQ = {
    kind: "order",
    id: "order:year",
    cat: "biology",
    level: "newbie",
    q: t.yearQ,
    items: STAGES.map((s) => t.stage(s.id)),
    why: t.yearWhy,
    wiki: ["Annual growth cycle of grapevines"],
  };
  return [...styles, year];
}

function matchQs(t: QuizText): MatchQ[] {
  const steps: Step[] = sample(Object.values(STEPS), 4);
  const parts = sample(PARTS, 4);
  const sweetTerms = ["dry", "medium dry", "medium sweet", "sweet"];
  return [
    {
      kind: "match",
      id: "match:steps",
      cat: "winemaking",
      level: "pro",
      q: t.matchStepsQ,
      pairs: steps.map((s) => ({ term: t.step(s.id).name, meaning: firstSentence(t.step(s.id).what) })),
      why: t.matchStepsWhy,
      src: unique(steps.flatMap((s) => s.src ?? [])),
      wiki: unique(steps.flatMap((s) => s.wiki ?? [])),
    },
    {
      kind: "match",
      id: "match:parts",
      cat: "basics",
      level: "newbie",
      q: t.matchPartsQ,
      pairs: parts.map((p) => ({ term: t.part(p.id).name.replace(/\s*\(.*\)/, ""), meaning: firstSentence(t.part(p.id).what) })),
      why: t.matchPartsWhy,
      src: unique(parts.flatMap((p) => p.src ?? [])),
      wiki: unique(parts.flatMap((p) => p.wiki)),
    },
    {
      kind: "match",
      id: "match:species",
      cat: "biology",
      level: "pro",
      q: t.matchSpeciesQ,
      pairs: SPECIES.map((s) => ({ term: s.name, meaning: t.speciesNick(s.name, s.nick) })),
      why: t.matchSpeciesWhy,
      wiki: SPECIES.map((s) => s.name),
    },
    {
      kind: "match",
      id: "match:sweetness",
      cat: "basics",
      level: "pro",
      q: t.sweetQ,
      pairs: sweetTerms.map((w, i) => ({ term: capital(t.sweetWord(w)), meaning: t.sweetMeanings[i] })),
      why: t.sweetWhy,
      src: ["eu-2019-33"],
    },
  ];
}

const capital = (s: string) => s[0].toUpperCase() + s.slice(1);

// What the EU label says for a given amount of sugar left in the wine (worked out by shared/wine.ts).
function labelQs(t: QuizText): ChoiceQ[] {
  const ta = 6; // g/L total acidity, a typical value
  const still: string[] = ["dry", "medium dry", "medium sweet", "sweet"];
  const stillQs: ChoiceQ[] = [2, 30, 60].map((rs) => {
    const word = stillSweetness(rs, ta);
    return {
      kind: "choice",
      id: `label:still:${rs}`,
      cat: "basics",
      level: rs === 60 ? "newbie" : "pro",
      q: t.stillQ(rs, ta),
      options: still.map(t.sweetWord),
      answer: still.indexOf(word),
      why: t.stillWhy(rs, t.sweetWord(word)),
      src: ["eu-2019-33"],
    };
  });
  const rs = 8;
  const word = sparklingSweetness(rs, true);
  const picked = withWrong(word, ["brut nature", "extra brut", "brut", "extra dry", "dry", "sweet (doux)"]);
  const sparkling: ChoiceQ = {
    kind: "choice",
    id: "label:sparkling",
    cat: "basics",
    level: "pro",
    q: t.sparklingQ(rs),
    options: picked.options.map(t.sweetWord),
    answer: picked.answer,
    why: t.sparklingWhy(rs, t.sweetWord(word)),
    src: ["eu-2019-33"],
  };
  return [...stillQs, sparkling];
}

// "Which country … the most in 2024?" from the OIV tables; the other top countries are the wrong answers.
function topQs(t: QuizText): ChoiceQ[] {
  const M = OIV_2024_MORE;
  const src: SourceId[] = [M.source];
  const tables: { id: TopId; list: { name: string; kt?: number; mt?: number }[]; level: "newbie" | "pro" }[] = [
    { id: "export", list: M.exporters, level: "newbie" },
    { id: "import", list: M.topImporters, level: "pro" },
    { id: "table", list: M.tableProducers, level: "pro" },
    { id: "dried", list: M.driedProducers, level: "pro" },
  ];
  return tables.map((tb) => ({
    kind: "choice",
    id: `top:${tb.id}`,
    cat: "statistics",
    level: tb.level,
    q: t.topQ[tb.id],
    ...withWrong(t.country(tb.list[0].name), tb.list.slice(1, 6).map((e) => t.country(e.name))),
    why: t.topWhy(tb.list.slice(0, 3).map((e) => `${t.country(e.name)} ${t.topValue(e)}`).join(", ")),
    src,
  }));
}

export const pageQuestions = (t: QuizText): Question[] => [...orderQs(t), ...matchQs(t), ...labelQs(t), ...topQs(t)];
