// Over-the-top lines for the Quizzes scoreboard and Grape Bot's verdict after a round.
// Jokes only, no facts, so no sources needed. The Polish lines are in shared/i18n/pl/quizBoard.ts.

import type { Lang } from "../i18n";
import { BOARD_PL } from "../i18n/pl/quizBoard";
import type { Level } from "./types";

export type BoardText = {
  best: string[]; // one line per best score in a category (index = score out of 8)
  notPlayed: string;
  headlines: { min: number; text: string }[]; // all categories together, by share of the best possible total
  empty: string;
  verdict: { zero: string[]; low: string[]; half: string[]; close: string[]; closePro: string; closeNewbie: string; perfectPro: string; perfectNewbie: string };
};

const BOARD_EN: BoardText = {
  best: [
    "Zero?! The grapes forgive you. Mostly.",
    "One grape of pure genius!",
    "Sprouting! Barely, but sprouting!",
    "Officially smarter than a raisin",
    "Half a bunch of brilliance!",
    "The grapes are whispering your name",
    "Vineyard gossip says you're GOOD",
    "One grape from glory! SO CLOSE!",
    "PERFECT! Bow before the grape lord 👑",
  ],
  notPlayed: "Untasted. The grapes are waiting…",
  headlines: [
    { min: 1, text: "A PERFECT SCOREBOARD?! Dionysus wants your autograph 👑🍷" },
    { min: 0.75, text: "Certified grape whisperer! Sommeliers tremble at your name 🍷" },
    { min: 0.5, text: "You're a newbie no more! The vines bow as you walk past 🍇" },
    { min: 0.25, text: "Getting juicy! The vineyard is starting to talk about you 👀" },
    { min: 0, text: "A tiny sprout with BIG dreams! Every legend starts somewhere 🌱" },
  ],
  empty: "Your scoreboard is emptier than a vineyard in January. Pick a quiz below!",
  verdict: {
    zero: [
      "I don't think you've read the page… :( It's okay, the grapes still like you.",
      "Zero?! Did you answer with your eyes closed? I believe in you. Have a little read and try again 💚",
      "Hmm, not one. Even a raisin knows a bit more… but raisins have had a lot of time to think. Try again?",
    ],
    low: [
      "A tiny sprout of knowledge! Every vineyard starts with one seed. Give it another go?",
      "Not quite ripe yet. A quick look at the Grapes tab and you'll be juicier next time.",
    ],
    half: ["Halfway to grape greatness! Not bad at all.", "Solid! You know your grapes better than most people at the supermarket."],
    close: ["So close! Just a grape or two away from perfect."],
    closePro: "Impressive. Dionysus is nodding slowly at you.",
    closeNewbie: "Great job! You might be ready for Dionysus mode.",
    perfectPro: "Perfect in Dionysus mode?! The god of wine himself raises a glass (of grape juice) to you. 🍷",
    perfectNewbie: "Perfect! You're no newbie anymore. Try Dionysus mode next?",
  },
};

const board = (lang: Lang) => (lang === "pl" ? BOARD_PL : BOARD_EN);

export const notPlayedLine = (lang: Lang) => board(lang).notPlayed;

export function bestLine(score: number, total: number, lang: Lang): string {
  const lines = board(lang).best;
  return lines[Math.round((score / total) * (lines.length - 1))];
}

export function scoreboardHeadline(sum: number, max: number, played: number, lang: Lang): string {
  const b = board(lang);
  if (!played) return b.empty;
  return b.headlines.find((h) => sum / max >= h.min)!.text;
}

// Quirky but kind: what Grape Bot says about your score.
export function scoreMessage(score: number, total: number, level: Level, lang: Lang): { emoji: string; text: string } {
  const v = board(lang).verdict;
  const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)];
  const r = score / total;
  if (score === 0) return { emoji: "🥺", text: pick(v.zero) };
  if (r < 0.375) return { emoji: "🌱", text: pick(v.low) };
  if (r < 0.625) return { emoji: "🍇", text: pick(v.half) };
  if (r < 1) return { emoji: "✨", text: pick([...v.close, level === "pro" ? v.closePro : v.closeNewbie]) };
  return { emoji: "🏆", text: level === "pro" ? v.perfectPro : v.perfectNewbie };
}
