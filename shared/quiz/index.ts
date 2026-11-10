// Every quiz question: hand-written ones plus the ones built from the app's data.

import { BANK } from "./bank";
import { pageQuestions } from "./fromPages";
import { varietyQuestions } from "./fromVarieties";
import { DIAGRAM_QS, NUMBER_QS } from "./numbers";
import type { Category, Question } from "./types";

// Built fresh each time, so the wrong answers in generated questions change from round to round.
export const questionsFor = (cat: Category): Question[] =>
  [...BANK, ...NUMBER_QS, ...DIAGRAM_QS, ...varietyQuestions(), ...pageQuestions()].filter((q) => q.cat === cat);
