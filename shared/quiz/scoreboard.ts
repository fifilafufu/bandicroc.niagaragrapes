// Over-the-top lines for the Quizzes scoreboard. Jokes only, no facts, so no sources needed.

// One line per best score in a category (index = score out of 8).
export const BEST_LINES: string[] = [
  "Zero?! The grapes forgive you. Mostly.",
  "One grape of pure genius!",
  "Sprouting! Barely, but sprouting!",
  "Officially smarter than a raisin",
  "Half a bunch of brilliance!",
  "The grapes are whispering your name",
  "Vineyard gossip says you're GOOD",
  "One grape from glory! SO CLOSE!",
  "PERFECT! Bow before the grape lord 👑",
];

export const NOT_PLAYED_LINE = "Untasted. The grapes are waiting…";

// Headline for all categories together, by share of the best possible total.
const HEADLINES: { min: number; text: string }[] = [
  { min: 1, text: "A PERFECT SCOREBOARD?! Dionysus wants your autograph 👑🍷" },
  { min: 0.75, text: "Certified grape whisperer! Sommeliers tremble at your name 🍷" },
  { min: 0.5, text: "You're a newbie no more! The vines bow as you walk past 🍇" },
  { min: 0.25, text: "Getting juicy! The vineyard is starting to talk about you 👀" },
  { min: 0, text: "A tiny sprout with BIG dreams! Every legend starts somewhere 🌱" },
];

export const EMPTY_HEADLINE = "Your scoreboard is emptier than a vineyard in January. Pick a quiz below!";

export function bestLine(score: number, total: number): string {
  return BEST_LINES[Math.round((score / total) * (BEST_LINES.length - 1))];
}

export function scoreboardHeadline(sum: number, max: number, played: number): string {
  if (!played) return EMPTY_HEADLINE;
  const r = sum / max;
  return HEADLINES.find((h) => r >= h.min)!.text;
}
