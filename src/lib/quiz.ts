// Quiz rounds. Questions come from shared/quiz (hand-written, or built from the app's data), so the
// quiz runs fully in the app and uses none of the AI allowance.
//
// Questions you've already had in a category are skipped until you've seen them all, so rounds don't
// repeat (remembered on this device). Your chosen level's questions come first.

import { readPref, writePref } from "./prefs";
import { questionsFor } from "../../shared/quiz";
import { shuffle } from "../../shared/quiz/random";
import type { Category, Level, Question } from "../../shared/quiz/types";

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
export function newRound(cat: Category, level: Level, n = ROUND_SIZE): Question[] {
  const all = questionsFor(cat);
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
export function markSeen(cat: Category, round: Question[]) {
  const all = questionsFor(cat).length;
  let seen = new Set(readSeen(cat));
  if (seen.size >= all) seen = new Set();
  round.forEach((q) => seen.add(q.id));
  if (seen.size >= all) seen = new Set(round.map((q) => q.id));
  writePref(seenKey(cat), JSON.stringify([...seen]));
}

// Quirky but kind: what Grape Bot says about your score.
export function scoreMessage(score: number, total: number, level: Level): { emoji: string; text: string } {
  const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];
  const r = score / total;
  if (score === 0)
    return {
      emoji: "🥺",
      text: pick([
        "I don't think you've read the page… :( It's okay, the grapes still like you.",
        "Zero?! Did you answer with your eyes closed? I believe in you. Have a little read and try again 💚",
        "Hmm, not one. Even a raisin knows a bit more… but raisins have had a lot of time to think. Try again?",
      ]),
    };
  if (r < 0.375)
    return {
      emoji: "🌱",
      text: pick([
        "A tiny sprout of knowledge! Every vineyard starts with one seed. Give it another go?",
        "Not quite ripe yet. A quick look at the Grapes tab and you'll be juicier next time.",
      ]),
    };
  if (r < 0.625)
    return {
      emoji: "🍇",
      text: pick(["Halfway to grape greatness! Not bad at all.", "Solid! You know your grapes better than most people at the supermarket."]),
    };
  if (r < 1)
    return {
      emoji: "✨",
      text: pick([
        "So close! Just a grape or two away from perfect.",
        level === "pro" ? "Impressive. Dionysus is nodding slowly at you." : "Great job! You might be ready for Pro: Dionysus mode.",
      ]),
    };
  return {
    emoji: "🏆",
    text:
      level === "pro"
        ? "Perfect in Dionysus mode?! The god of wine himself raises a glass (of grape juice) to you. 🍷"
        : "Perfect! You're no newbie anymore. Try Pro: Dionysus mode next?",
  };
}
