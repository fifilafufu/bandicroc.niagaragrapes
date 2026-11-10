// Small helpers for mixing up questions and answers.

export function shuffle<T>(list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const sample = <T,>(list: readonly T[], n: number): T[] => shuffle(list).slice(0, n);

// The right answer first, then up to `n` different wrong ones (the round shuffles them).
export function withWrong(right: string, pool: readonly string[], n = 3) {
  const wrong = sample([...new Set(pool)].filter((x) => x !== right), n);
  return { options: [right, ...wrong], answer: 0 };
}

// "First sentence. Second one." → "First sentence."
export const firstSentence = (text: string) => text.split(/(?<=\.)\s/)[0];
