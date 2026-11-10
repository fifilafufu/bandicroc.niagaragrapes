// Quiz rounds. Questions come from shared/quiz (hand-written, or built from the app's data), so the
// quiz runs fully in the app and uses none of the AI allowance.
//
// Questions you've already had in a category are skipped until you've seen them all, so rounds don't
// repeat (remembered on this device). Your chosen level's questions come first.

import { readPref, writePref } from "./prefs";
import { questionsFor } from "../../shared/quiz";
import { shuffle } from "../../shared/quiz/random";
import type { Category, Level, Question } from "../../shared/quiz/types";
import type { Lang } from "../../shared/i18n";

export const ROUND_SIZE = 8;
const SAME_KIND_PER_ROUND = 2; // at most 2 photo questions, 2 VIVC colour questions, … per round

const seenKey = (cat: Category) => `quiz-seen-${cat}`;
function readSeen(cat: Category): string[] {
  try {
    const v = JSON.parse(readPref(seenKey(cat)) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const LEVEL_KEY = "quiz-level";
export const savedLevel = (): Level => (readPref(LEVEL_KEY) === "pro" ? "pro" : "newbie");
export const saveLevel = (level: Level) => writePref(LEVEL_KEY, level);

// Generated questions share an id prefix ("photo:Niagara", "photo:Merlot"); hand-written ones don't.
const groupOf = (q: Question) => (q.id.includes(":") ? q.id.split(":")[0] : q.id);

// Take up to n questions, keeping each kind of generated question to a couple per round.
function takeMixed(list: Question[], n: number, already: Question[] = []): Question[] {
  const out = [...already];
  const count = new Map<string, number>();
  out.forEach((q) => count.set(groupOf(q), (count.get(groupOf(q)) ?? 0) + 1));
  for (const q of list) {
    if (out.length >= n) break;
    const g = groupOf(q);
    if ((count.get(g) ?? 0) >= SAME_KIND_PER_ROUND) continue;
    count.set(g, (count.get(g) ?? 0) + 1);
    out.push(q);
  }
  return out;
}

// A fresh round: unseen questions of your level first, then unseen ones of the other level, then
// (once the category runs out) ones you've seen. Answer options are shuffled too.
export function newRound(cat: Category, level: Level, lang: Lang, n = ROUND_SIZE): Question[] {
  const all = questionsFor(cat, lang);
  const seen = new Set(readSeen(cat));
  const fresh = shuffle(all.filter((q) => !seen.has(q.id)));
  const order = [...fresh.filter((q) => q.level === level), ...fresh.filter((q) => q.level !== level), ...shuffle(all.filter((q) => seen.has(q.id)))];
  let picked = takeMixed(order, n);
  if (picked.length < n) picked = picked.concat(order.filter((q) => !picked.includes(q)).slice(0, n - picked.length));
  return picked.map(shuffleOptions);
}

function shuffleOptions(q: Question): Question {
  if (q.kind !== "choice") return q;
  const order = shuffle(q.options.map((_, i) => i));
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
}

// Call once a round is on screen. When the whole category has been seen, the cycle starts again.
// Question ids are the same in every language, so the count is too.
export function markSeen(cat: Category, round: Question[]) {
  const all = questionsFor(cat, "en").length;
  let seen = new Set(readSeen(cat));
  if (seen.size >= all) seen = new Set();
  round.forEach((q) => seen.add(q.id));
  if (seen.size >= all) seen = new Set(round.map((q) => q.id));
  writePref(seenKey(cat), JSON.stringify([...seen]));
}
