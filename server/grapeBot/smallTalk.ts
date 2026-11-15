// Small talk ("ok", "thanks", "hi", "bye"): answered at once with a fixed line, without the AI, so it
// costs no grape juice. "Yes" and "no" are left out on purpose: they often answer the bot's own question.
// Plain logic only (no imports), so scripts/test-guard.ts can run it with node.

export type SmallTalk = "hi" | "thanks" | "bye" | "ok";

// Checked in this order: "ok thanks" is thanks, "ok bye" is bye.
const WORDS: [SmallTalk, string[]][] = [
  ["thanks", ["thanks", "thank", "thx", "ty", "cheers", "dzięki", "dzieki", "dziękuję", "dziekuje", "dziękówka", "dzięks"]],
  ["bye", ["bye", "goodbye", "cya", "pa", "papa", "widzenia", "razie"]],
  ["hi", ["hi", "hello", "hey", "hiya", "yo", "cześć", "czesc", "hej", "siema", "witaj", "witam", "dzień", "dzien"]],
  ["ok", ["ok", "okay", "okey", "okej", "k", "kk", "cool", "nice", "great", "awesome", "wow", "lol", "haha", "hehe", "alright", "fine", "good", "super", "spoko", "fajnie", "fajne", "dobra", "dobrze", "aha", "jasne", "rozumiem", "got", "see"]],
];
// Words that only fill out a phrase ("thank you so much", "got it", "dzień dobry", "na razie").
const FILLER = ["it", "i", "you", "so", "much", "a", "lot", "very", "there", "grape", "bot", "do", "na", "bardzo", "wielkie", "ci", "dobry"];
const MAX_WORDS = 5;

export function smallTalk(text: string): SmallTalk | null {
  const words = text
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length || words.length > MAX_WORDS) return null;
  const kindOf = (w: string) => WORDS.find(([, list]) => list.includes(w))?.[0];
  if (!words.every((w) => kindOf(w) || FILLER.includes(w))) return null;
  return WORDS.find(([kind]) => words.some((w) => kindOf(w) === kind))?.[0] ?? null;
}
