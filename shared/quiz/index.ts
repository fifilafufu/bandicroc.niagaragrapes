// Every quiz question: hand-written ones plus the ones built from the app's data, in the chosen
// language. Ids, answers and sources are the same in every language, so scores and "already seen"
// lists are shared between languages.

import type { Lang } from "../i18n";
import { BANK_PL, type QuizPL } from "../i18n/pl/quizBank";
import { NUMBERS_PL } from "../i18n/pl/quizNumbers";
import { BANK } from "./bank";
import { pageQuestions } from "./fromPages";
import { varietyQuestions } from "./fromVarieties";
import { DIAGRAM_QS, NUMBER_QS } from "./numbers";
import { quizText } from "./text";
import type { Category, Question } from "./types";

const POLISH: Record<string, QuizPL> = { ...BANK_PL, ...NUMBERS_PL };

// A hand-written question in Polish: its Polish text over the English one (same options order).
function translated(q: Question, lang: Lang): Question {
  const pl = lang === "pl" ? POLISH[q.id] : undefined;
  return pl ? ({ ...q, ...pl } as Question) : q;
}

// Built fresh each time, so the wrong answers in generated questions change from round to round.
export function questionsFor(cat: Category, lang: Lang): Question[] {
  const t = quizText(lang);
  const hand = [...BANK, ...NUMBER_QS, ...DIAGRAM_QS].map((q) => translated(q, lang));
  return [...hand, ...varietyQuestions(t), ...pageQuestions(t)].filter((q) => q.cat === cat);
}
