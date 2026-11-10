// Grape quiz: every answer comes from the checked facts in shared/grapes.ts, the home page and the
// world map data (all from Wikipedia / FAO). Runs fully in the app, so it uses none of the AI allowance.
//
// Three levels. Questions you've already had are skipped until you've seen the whole level,
// so rounds don't repeat (remembered on this device).

import { readPref, writePref } from "./prefs";
import type { SourceId } from "../../shared/sources";

export type Level = "newbie" | "intermediate" | "pro";

export type QuizQuestion = {
  q: string;
  options: string[];
  answer: number; // index into options
  why: string;
  wiki: string;
  src?: SourceId; // a data source, shown next to the Wikipedia link
};

export const LEVELS: { id: Level; emoji: string; name: string; blurb: string }[] = [
  { id: "newbie", emoji: "🌱", name: "Newbie", blurb: "Just started? Easy questions from the home page." },
  { id: "intermediate", emoji: "🍇", name: "Intermediate", blurb: "Grape varieties, history and where they grow." },
  { id: "pro", emoji: "🍷", name: "Pro: Dionysus mode", blurb: "For a true god of grapes. Dates, species and deep cuts." },
];

const BANK: Record<Level, QuizQuestion[]> = {
  newbie: [
    { q: "Botanically, a grape is a…", options: ["Berry", "Nut", "Vegetable", "Seed"], answer: 0, why: "A grape is botanically a berry, growing on woody vines of the genus Vitis.", wiki: "Grape" },
    { q: "Can dogs safely eat grapes or raisins?", options: ["Yes, they're healthy", "Only seedless ones", "No, they can cause kidney failure", "Only raisins"], answer: 2, why: "Grapes and raisins are toxic to dogs. A dog that eats them should see a vet.", wiki: "Grape toxicity in dogs" },
    { q: "\"White\" grapes are actually…", options: ["White", "Green", "Yellow", "Grey"], answer: 1, why: "They're green: purple grapes with two pigment genes switched off.", wiki: "Grape" },
    { q: "Raw grapes are mostly…", options: ["Sugar", "Water", "Fibre", "Protein"], answer: 1, why: "Raw grapes are 81% water and 18% carbohydrates.", wiki: "Grape" },
    { q: "Which grape is famous for tasting like a fairground sweet?", options: ["Cabernet Sauvignon", "Cotton Candy", "Riesling", "Concord"], answer: 1, why: "Cotton Candy grapes taste like cotton candy, with no flavouring added.", wiki: "Cotton Candy grapes" },
    { q: "A raisin is…", options: ["A dried grape", "A baby grape", "A grape seed", "A type of plum"], answer: 0, why: "Raisins are dried grapes. About 2% of the world's grapes are dried.", wiki: "Raisin" },
    { q: "Grapes grow on…", options: ["Tall palm trees", "Woody vines", "Underground roots", "Water lilies"], answer: 1, why: "Grapes grow in bunches on woody vines of the genus Vitis.", wiki: "Grape" },
    { q: "How many grapes can one bunch hold?", options: ["Exactly 12", "2 to 5", "15 to 300", "Over 5,000"], answer: 2, why: "A bunch can hold anywhere from 15 to 300 grapes.", wiki: "Grape" },
    { q: "What is Grape Bot's favourite grape?", options: ["Merlot", "Niagara", "Red Globe", "Kyoho"], answer: 1, why: "Niagara, of course! Sweet, green-gold and musky. 💚", wiki: "Niagara (grape)" },
    { q: "Ripe grapes come in many colours. Which one is NOT a grape colour?", options: ["Pink", "Yellow", "Orange", "Silver"], answer: 3, why: "Ripe grapes can be crimson, black, dark blue, yellow, green, orange or pink, but not silver.", wiki: "Grape" },
    { q: "Which TWO uses take almost all of the world's grapes?",options: ["Wine and eating fresh", "Raisins and jam", "Juice and vinegar", "Oil and cosmetics"], answer: 0, why: "In 2024, 47% were pressed (mostly for wine) and 46% were eaten fresh. Only 7% were dried (OIV).", wiki: "Grape", src: "oiv-2024" },
    { q: "Which country grows the most grapes?", options: ["France", "USA", "China", "Spain"], answer: 2, why: "China grows the most by far: 17.0 of 77.7 million tonnes in 2024, more than a fifth (OIV).", wiki: "Grape", src: "oiv-2024" },
    { q: "In Spain, people eat 12 grapes on New Year's Eve to…", options: ["Count down the hours", "Bring luck for each coming month", "Celebrate the harvest", "Honour 12 saints"], answer: 1, why: "One grape per bell strike at midnight, each one for luck in a coming month.", wiki: "Twelve Grapes" },
    { q: "Table grapes (the ones we eat) are usually…", options: ["Tiny and sour", "Large, seedless and thin-skinned", "Hard and dry", "Always purple"], answer: 1, why: "Table grapes are bred for eating: usually large, seedless and thin-skinned.", wiki: "Grape" },
    { q: "Which of these is NOT made from grapes?", options: ["Raisins", "Grape-seed oil", "Vinegar", "Maple syrup"], answer: 3, why: "Grapes give us raisins, juice, jam, vinegar and grape-seed oil. Maple syrup comes from maple trees.", wiki: "Grape" },
    { q: "Where do grapes originally come from?", options: ["South America", "The Middle East / Western Asia", "Australia", "Antarctica"], answer: 1, why: "People began growing grapes in the Middle East about 6,000–8,000 years ago.", wiki: "Grape" },
  ],
  intermediate: [
    { q: "Which grape is the classic taste of grape jelly and juice?", options: ["Chardonnay", "Concord", "Riesling", "Red Globe"], answer: 1, why: "Concord's sweet, musky flavour is the classic grape juice and jelly taste.", wiki: "Concord grape" },
    { q: "Thompson Seedless is also known as…", options: ["Sultana", "Muscat", "Merlot", "Catawba"], answer: 0, why: "Thompson Seedless is the Sultana grape, the main grape for raisins.", wiki: "Sultana (grape)" },
    { q: "What do ripe Niagara grapes taste like?", options: ["Sour", "Bitter", "Sweet and musky (\"foxy\")", "Salty"], answer: 2, why: "Ripe Niagara grapes are sweet with a musky \"foxy\" flavour. Only unripe ones taste tart.", wiki: "Niagara (grape)" },
    { q: "Roughly how long have people been growing grapes?", options: ["About 500 years", "About 2,000 years", "About 8,000 years", "About 50,000 years"], answer: 2, why: "Grape growing began approximately 8,000 years ago.", wiki: "Grape" },
    { q: "Dionysus (the Roman Bacchus) was the Greek god of…", options: ["The sea", "War", "Wine-making and festivity", "The sun"], answer: 2, why: "Dionysus was the god of wine-making, fruit, fertility and festivity.", wiki: "Dionysus" },
    { q: "About what share of the world's grapes were pressed for wine and juice in 2024?", options: ["About 10%", "About 47%", "About 71%", "About 99%"], answer: 1, why: "47% were pressed, 46% eaten fresh and 7% dried. The old \"71% wine\" figure is out of date (OIV 2024).", wiki: "Grape", src: "oiv-2024" },
    { q: "After China, which country grows the most grapes?", options: ["Italy", "Brazil", "Germany", "Australia"], answer: 0, why: "Italy is second with 7.3 million tonnes, ahead of the USA (OIV 2024).", wiki: "Grape", src: "oiv-2024" },
    { q: "Which grape is the world's most used grape for table grapes and raisins?", options: ["Niagara", "Sultana (Thompson Seedless)", "Pinot Noir", "Concord"], answer: 1, why: "Sultanina (Sultana, Thompson Seedless) covers about 273,000 ha and is the top grape for eating and drying (OIV, 2015 data).", wiki: "Sultana (grape)", src: "oiv-varieties-2017" },
    { q: "Shine Muscat and Kyoho are table grapes from…", options: ["Japan", "Chile", "Italy", "Canada"], answer: 0, why: "Both are Japanese table grapes, popular across East Asia.", wiki: "Shine Muscat" },
    { q: "Gewürztraminer wines famously smell of…", options: ["Smoke", "Lychees", "Mint", "Coconut"], answer: 1, why: "Gewürztraminer and lychees share the same aroma compounds.", wiki: "Gewürztraminer" },
    { q: "Pinot Noir is a thin-skinned grape known for being…", options: ["Hard to grow", "Always seedless", "Bright orange", "Grown only in deserts"], answer: 0, why: "Pinot Noir is a thin-skinned black grape that is hard to grow.", wiki: "Pinot noir" },
    { q: "Sweet, sparkling Moscato wine is made from…", options: ["Muscat grapes", "Concord grapes", "Red Globe grapes", "Cabernet grapes"], answer: 0, why: "Muscat grapes are eaten fresh, dried and made into sweet and sparkling wines like Moscato.", wiki: "Muscat (grape)" },
    { q: "Red Globe grapes are best known for being…", options: ["Tiny and sour", "Very large and crunchy", "Blue", "Used only for raisins"], answer: 1, why: "Red Globe is a very large red table grape with seeds and firm, crunchy flesh.", wiki: "Red Globe" },
    { q: "Cabernet Sauvignon makes what kind of wine?", options: ["Light sweet white", "Full-bodied red", "Sparkling rosé", "Dessert white"], answer: 1, why: "It's a thick-skinned black grape making full-bodied red wine with high tannins.", wiki: "Cabernet Sauvignon" },
    { q: "Riesling is known for being very aromatic and…", options: ["High in acidity", "Totally flavourless", "Always red", "Grown underwater"], answer: 0, why: "Riesling is a very aromatic white wine grape with high acidity.", wiki: "Riesling" },
    { q: "About how many calories are in 100 g of raw grapes?", options: ["About 9 kcal", "About 69 kcal", "About 250 kcal", "About 600 kcal"], answer: 1, why: "100 g of raw grapes has about 69 kcal and some vitamin K.", wiki: "Grape" },
  ],
  pro: [
    { q: "Niagara grapes were first bred in 1868 by crossing Concord with…", options: ["Cassady", "Riesling", "Muscat", "Delaware"], answer: 0, why: "Niagara is a cross of Concord and Cassady, bred in Niagara County, New York.", wiki: "Niagara (grape)" },
    { q: "Where is the oldest known winery (about 4100 BCE)?", options: ["Italy", "Armenia", "Egypt", "France"], answer: 1, why: "The Areni-1 winery in Armenia is the oldest known.", wiki: "History of wine" },
    { q: "The earliest known traces of wine (about 6000 BCE) were found near…", options: ["Tbilisi, Georgia", "Rome, Italy", "Bordeaux, France", "Cairo, Egypt"], answer: 0, why: "The earliest known traces of wine come from near Tbilisi, Georgia.", wiki: "History of wine" },
    { q: "Concord and Niagara belong to which North American grape species?", options: ["Vitis vinifera", "Vitis labrusca", "Vitis rotundifolia", "Vitis alba"], answer: 1, why: "Both are Vitis labrusca grapes, the source of their musky \"foxy\" flavour.", wiki: "Vitis labrusca" },
    { q: "Vitis vinifera, the species behind most grapes we eat and drink, is native to…", options: ["The Mediterranean and Central Asia", "South America", "Japan", "Southern Africa"], answer: 0, why: "Vitis vinifera is native to the Mediterranean and Central Asia.", wiki: "Vitis vinifera" },
    { q: "\"White\" grapes lost the genes for which purple pigment?", options: ["Chlorophyll", "Anthocyanins", "Carotene", "Melanin"], answer: 1, why: "White grapes descend from purple ones, with two genes switched off that make anthocyanins.", wiki: "Grape" },
    { q: "Wine grapes are usually picked at about what sugar level?", options: ["2%", "8%", "24%", "60%"], answer: 2, why: "Wine grapes are picked very sweet, at about 24% sugar.", wiki: "Grape" },
    { q: "Scuppernong is a muscadine grape of which species?", options: ["Vitis rotundifolia", "Vitis labrusca", "Vitis vinifera", "Vitis riparia"], answer: 0, why: "Scuppernong is a large muscadine, Vitis rotundifolia, native to the southern US.", wiki: "Scuppernong" },
    { q: "Shine Muscat was bred from Muscat of Alexandria and which very sugary American grape?", options: ["Steuben", "Concord", "Catawba", "Niagara"], answer: 0, why: "Shine Muscat (registered 2006) comes from Muscat of Alexandria × Steuben.", wiki: "Shine Muscat" },
    { q: "Gewürztraminer has a pink-to-red skin, but it makes…", options: ["Red wine", "White wine", "Only juice", "Only raisins"], answer: 1, why: "Despite its pink-red skin, Gewürztraminer is used for white wines.", wiki: "Gewürztraminer" },
    { q: "Spain's 12-grapes New Year custom was popularised in which year?", options: ["1492", "1809", "1909", "1999"], answer: 2, why: "Grape growers with a huge harvest to sell popularised it in 1909.", wiki: "Twelve Grapes" },
    { q: "Which grape variety covers the most vineyard area in the world?", options: ["Kyoho", "Chardonnay", "Niagara", "Riesling"], answer: 0, why: "Kyoho, a Japanese table grape grown mostly in China, covered about 365,000 ha, just ahead of Cabernet Sauvignon (OIV, 2015 data).", wiki: "Kyoho (grape)", src: "oiv-varieties-2017" },
    { q: "What share of the world's grapes is dried into raisins, currants and sultanas?", options: ["About 7%", "About 20%", "About 30%", "About 50%"], answer: 0, why: "About 7% in 2024. It takes about 4 kg of fresh grapes to make 1 kg of raisins (OIV).", wiki: "Raisin", src: "oiv-2024" },
    { q: "Chardonnay grapes taste fairly neutral. Chardonnay wine gets most of its flavour from…", options: ["Climate and oak", "Added sugar", "Food colouring", "The bottle shape"], answer: 0, why: "Cool climates give apple and citrus, warm ones tropical fruit, and oak makes it buttery.", wiki: "Chardonnay" },
    { q: "The Delaware grape is especially famed for which wine?", options: ["Sparkling wine", "Port", "Red table wine", "Brandy"], answer: 0, why: "Delaware is used as a table grape and for wines, and is famed for sparkling wine.", wiki: "Delaware (grape)" },
    { q: "Kyoho grapes are slip-skin with large bitter seeds, so they're usually…", options: ["Peeled and eaten as a dessert", "Only made into wine", "Dried for a year", "Eaten with the seeds crunched"], answer: 0, why: "Kyoho is usually peeled and eaten as a dessert in Japan, Taiwan, China and Korea.", wiki: "Kyoho (grape)" },
    { q: "Vinotherapy is a beauty treatment that uses…", options: ["Grape pips and pulp from wine-making", "A bath full of grape juice", "Frozen grapes on the eyes", "Raisin powder"], answer: 0, why: "Wine-making leftovers (pips and pulp) are rubbed into the skin. It's not a juice bath.", wiki: "Vinotherapy" },
    { q: "Catawba, a late-ripening American grape, has what skin colour?", options: ["Copper-red / pink", "Jet black", "Bright green", "Blue"], answer: 0, why: "Catawba is a copper-red to pink grape, mostly used for wine and juice.", wiki: "Catawba (grape)" },
  ],
};

export const ROUND_SIZE = 8;

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const seenKey = (level: Level) => `quiz-seen-${level}`;
function readSeen(level: Level): string[] {
  try {
    const v = JSON.parse(readPref(seenKey(level)) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// A fresh round: questions you haven't had yet come first; once the level runs out, it starts over.
// The answer options are shuffled too.
export function newRound(level: Level, n = ROUND_SIZE): QuizQuestion[] {
  const bank = BANK[level];
  const seen = new Set(readSeen(level));
  let picked = shuffle(bank.filter((q) => !seen.has(q.q))).slice(0, n);
  // Seen (almost) everything: top up with others, without repeating anything inside this round.
  if (picked.length < n) picked = picked.concat(shuffle(bank.filter((q) => !picked.includes(q))).slice(0, n - picked.length));

  return picked.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
  });
}

// Call once a round is on screen. When the whole level has been seen, the cycle starts again.
export function markSeen(level: Level, round: QuizQuestion[]) {
  const all = BANK[level].length;
  let seen = new Set(readSeen(level));
  if (seen.size >= all) seen = new Set();
  round.forEach((q) => seen.add(q.q));
  if (seen.size >= all) seen = new Set(round.map((q) => q.q));
  writePref(seenKey(level), JSON.stringify([...seen]));
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
        "Not quite ripe yet. A quick look at the home page and you'll be juicier next time.",
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
        level === "pro" ? "Impressive. Dionysus is nodding slowly at you." : "Great job! You might be ready for the next level.",
      ]),
    };
  return {
    emoji: "🏆",
    text:
      level === "pro"
        ? "Perfect in Dionysus mode?! The god of wine himself raises a glass (of grape juice) to you. 🍷"
        : level === "intermediate"
          ? "Perfect score! Dare to try Pro: Dionysus mode?"
          : "Perfect! You're no newbie anymore. Try Intermediate next?",
  };
}
