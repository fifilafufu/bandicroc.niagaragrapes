// The shapes of quiz questions. Every question names where its answer comes from: data sources
// (ids in shared/sources.ts) and/or Wikipedia article titles.

import type { SourceId } from "../sources";

export type Category = "varieties" | "biology" | "statistics" | "growing" | "winemaking" | "basics";
export type Level = "newbie" | "pro";

type Base = {
  id: string; // stable, so a question you've had can be skipped next time
  cat: Category;
  level: Level;
  q: string;
  why: string;
  src?: SourceId[];
  wiki?: string[];
};

// Pick one answer. `photo` names a grape whose real Commons photo is shown with the question.
export type ChoiceQ = Base & { kind: "choice"; options: string[]; answer: number; photo?: string };
// Tap the items in the right order. `items` is the correct order.
export type OrderQ = Base & { kind: "order"; items: string[] };
// Tap the meaning of each word in turn.
export type MatchQ = Base & { kind: "match"; pairs: { term: string; meaning: string }[] };
// Guess a number on a slider; within `tolerance` of the answer counts as right.
export type NumberQ = Base & { kind: "number"; answer: number; min: number; max: number; step: number; unit: string; tolerance: number };
// Tap the right part of a diagram drawn in code.
export type BerryPart = "stem" | "skin" | "flesh" | "seeds";
export type DiagramQ = Base & { kind: "diagram"; diagram: "berry"; answer: BerryPart };

export type Question = ChoiceQ | OrderQ | MatchQ | NumberQ | DiagramQ;
