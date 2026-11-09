// Grape quiz: every answer comes from the checked facts in shared/grapes.ts (taken from Wikipedia).
// Runs fully in the app, so it uses none of the AI allowance.

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index into options
  why: string;
  wiki: string;
};

export const QUIZ: QuizQuestion[] = [
  { q: "Where do grapes originally come from?", options: ["South America", "The Middle East / Western Asia", "Australia", "Northern Europe"], answer: 1, why: "People began growing grapes in the Middle East about 6,000–8,000 years ago.", wiki: "Grape" },
  { q: "Roughly how long have people been growing grapes?", options: ["About 500 years", "About 2,000 years", "About 8,000 years", "About 50,000 years"], answer: 2, why: "Grape growing began approximately 8,000 years ago.", wiki: "Grape" },
  { q: "Botanically, a grape is a…", options: ["Berry", "Nut", "Vegetable", "Seed"], answer: 0, why: "A grape is botanically a berry, growing on woody vines of the genus Vitis.", wiki: "Grape" },
  { q: "Which country grew the most grapes in 2023?", options: ["France", "USA", "China", "Spain"], answer: 2, why: "China grew 19% of the world's 72.5 million tonnes, ahead of Italy and France.", wiki: "Grape" },
  { q: "What happens to most of the world's grapes?", options: ["Eaten fresh", "Made into wine", "Dried into raisins", "Made into juice"], answer: 1, why: "About 71% become wine, 27% are eaten fresh and 2% are dried.", wiki: "Grape" },
  { q: "\"White\" grapes are actually…", options: ["White", "Green", "Yellow", "Grey"], answer: 1, why: "They're green: purple grapes with two pigment genes switched off.", wiki: "Grape" },
  { q: "Can dogs safely eat grapes or raisins?", options: ["Yes, they're healthy", "Only seedless ones", "No, they can cause kidney failure", "Only raisins"], answer: 2, why: "Grapes and raisins are toxic to dogs. A dog that eats them should see a vet.", wiki: "Grape toxicity in dogs" },
  { q: "In Spain, people eat 12 grapes on New Year's Eve to…", options: ["Count down the hours", "Bring luck for each coming month", "Celebrate the harvest", "Honour 12 saints"], answer: 1, why: "One grape per bell strike at midnight, each one for luck in a coming month.", wiki: "Twelve Grapes" },
  { q: "Dionysus (the Roman Bacchus) was the Greek god of…", options: ["The sea", "War", "Wine-making and festivity", "The sun"], answer: 2, why: "Dionysus was the god of wine-making, fruit, fertility and festivity.", wiki: "Dionysus" },
  { q: "Where is the oldest known winery (about 4100 BCE)?", options: ["Italy", "Armenia", "Egypt", "France"], answer: 1, why: "The Areni-1 winery in Armenia is the oldest known.", wiki: "History of wine" },
  { q: "What do ripe Niagara grapes taste like?", options: ["Sour", "Bitter", "Sweet and musky (\"foxy\")", "Salty"], answer: 2, why: "Ripe Niagara grapes are sweet with a musky \"foxy\" flavour. Only unripe ones taste tart.", wiki: "Niagara (grape)" },
  { q: "Niagara grapes were first bred in 1868 by crossing Concord with…", options: ["Cassady", "Riesling", "Muscat", "Delaware"], answer: 0, why: "Niagara is a cross of Concord and Cassady, bred in Niagara County, New York.", wiki: "Niagara (grape)" },
  { q: "Which grape is the classic taste of grape jelly and juice?", options: ["Chardonnay", "Concord", "Riesling", "Red Globe"], answer: 1, why: "Concord's sweet, musky flavour is the classic grape juice and jelly taste.", wiki: "Concord grape" },
  { q: "Thompson Seedless is also known as…", options: ["Sultana", "Muscat", "Merlot", "Catawba"], answer: 0, why: "Thompson Seedless is the Sultana grape, the main grape for raisins.", wiki: "Sultana (grape)" },
  { q: "Cabernet Sauvignon makes what kind of wine?", options: ["Light sweet white", "Full-bodied red", "Sparkling rosé", "Dessert white"], answer: 1, why: "It's a thick-skinned black grape making full-bodied red wine with high tannins.", wiki: "Cabernet Sauvignon" },
  { q: "Raw grapes are mostly…", options: ["Sugar", "Water", "Fibre", "Protein"], answer: 1, why: "Raw grapes are 81% water and 18% carbohydrates.", wiki: "Grape" },
];

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// A fresh round of `n` random questions, with the answer options in a random order too.
export function newRound(n = 8): QuizQuestion[] {
  return shuffle(QUIZ)
    .slice(0, n)
    .map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
    });
}
