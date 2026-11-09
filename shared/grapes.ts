// One list used by both the app (favourite picker, Wikipedia cards) and Grape Bot (which articles to read).

export type Grape = {
  name: string; // shown in the app and saved as the favourite
  wiki: string; // English Wikipedia article title (all checked to exist)
  keywords: string[]; // lowercase words that mean a question is about this grape
  // Checked taste and key facts, taken from the full Wikipedia articles (the intros the bot reads
  // often skip taste). Always given to Grape Bot so it never guesses or caves on these.
  facts: string;
};

export const GRAPES: Grape[] = [
  {
    name: "Niagara",
    wiki: "Niagara (grape)",
    keywords: ["niagara"],
    facts:
      "Pale greenish-white, large and juicy. Ripe Niagara grapes are SWEET, with a strong sweet aroma and a musky \"foxy\" flavour (Vitis labrusca). Slip-skin with seeds. Eaten fresh, and used for white grape juice, jelly and sweet wines. Only unripe grapes, or the skin on its own, taste tart.",
  },
  {
    name: "Concord",
    wiki: "Concord grape",
    keywords: ["concord"],
    facts:
      "Dark blue-purple, highly aromatic, large seeds. Sweet, musky \"foxy\" flavour: the classic taste of grape juice and grape jelly. The skin is more tart than the flesh.",
  },
  {
    name: "Catawba",
    wiki: "Catawba (grape)",
    keywords: ["catawba"],
    facts:
      "Copper-red/pink, late-ripening American grape. Musky \"foxy\", grapey flavour with moderate acidity. Mostly used for wines (sweet, sparkling, rosé) and juice.",
  },
  {
    name: "Delaware",
    wiki: "Delaware (grape)",
    keywords: ["delaware"],
    facts:
      "Small pale red/pinkish berries with tender skin and juicy, sweet flesh; milder foxiness than other labrusca grapes. Used as a table grape and for wines, famed for sparkling wine.",
  },
  {
    name: "Cotton Candy",
    wiki: "Cotton Candy grapes",
    keywords: ["cotton candy"],
    facts: "Very sweet green seedless table grape whose flavour is compared to cotton candy, with no artificial flavouring added.",
  },
  {
    name: "Thompson Seedless",
    wiki: "Sultana (grape)",
    keywords: ["thompson", "sultana"],
    facts:
      "Pale green seedless grape (also called sultana) with a mild, sweet, fairly neutral taste. The main grape for raisins; also eaten fresh and made into bland, sweetish white wine.",
  },
  {
    name: "Red Globe",
    wiki: "Red Globe",
    keywords: ["red globe"],
    facts: "Very large red table grape with seeds and firm, crunchy flesh; mild, gently sweet flavour. Grown mainly in very warm regions.",
  },
  {
    name: "Muscat",
    wiki: "Muscat (grape)",
    keywords: ["muscat", "moscato"],
    facts:
      "Large family of green to black grapes with a strongly floral, \"grapey\" aroma; sweet. Eaten fresh, dried as raisins, and made into sweet and sparkling wines (Moscato).",
  },
  {
    name: "Chardonnay",
    wiki: "Chardonnay",
    keywords: ["chardonnay"],
    facts:
      "Green-skinned wine grape with a fairly neutral flavour. Chardonnay wine gets its taste from climate and oak: apple, pear and citrus when cool, tropical fruit when warm, buttery when oaked.",
  },
  {
    name: "Riesling",
    wiki: "Riesling",
    keywords: ["riesling"],
    facts: "White wine grape that is very aromatic (flowery, perfumed) with high acidity; makes dry to sweet wines with apple, citrus and peach notes.",
  },
  {
    name: "Pinot Noir",
    wiki: "Pinot noir",
    keywords: ["pinot"],
    facts: "Thin-skinned black wine grape, hard to grow; makes light to medium-bodied red wine with cherry, raspberry and strawberry aromas.",
  },
  {
    name: "Cabernet Sauvignon",
    wiki: "Cabernet Sauvignon",
    keywords: ["cabernet"],
    facts:
      "Thick-skinned black wine grape; full-bodied red wine with high tannins and noticeable acidity. Blackcurrant and green pepper flavours in cool areas, black cherry in warm ones.",
  },
];

export const GENERAL_GRAPE_ARTICLE = "Grape";

// Checked facts about grapes in general (from the full Wikipedia "Grape", "History of wine" and
// "Twelve Grapes" articles). The intro Grape Bot reads leaves most of this out, so it's always included.
export const GENERAL_FACTS = [
  "Origin: grapes come from the Middle East / Western Asia, where people began growing them 6,000–8,000 years ago. The main species, Vitis vinifera, is native to the Mediterranean and Central Asia. North America has its own wild species, such as Vitis labrusca (Concord, Niagara).",
  "Early history: the earliest known traces of wine are from near Tbilisi, Georgia (c. 6000 BCE); the oldest known winery is Areni-1 in Armenia (c. 4100 BCE). Ancient Egyptians, Greeks, Phoenicians and Romans grew grapes.",
  "Where grown today: world production in 2023 was 72.5 million tonnes, led by China (19%), with Italy and France as major producers. Peru and Chile were the top exporters.",
  "Uses: about 71% of grapes become wine, 27% are eaten fresh and 2% are dried (raisins, currants, sultanas). Also juice, jam, jelly, vinegar and grape-seed oil.",
  "Plant: a grape is botanically a berry, growing in clusters of 15–300 on woody vines of the genus Vitis. Table grapes are usually large, seedless and thin-skinned; wine grapes are picked very sweet (about 24% sugar). The most widely planted variety is believed to be Sultana (Thompson Seedless).",
  "Nutrition: raw grapes are 81% water and 18% carbohydrates; 100 g has about 69 kcal and some vitamin K.",
  "Culture: Dionysus (Roman Bacchus) was the Greek god of wine-making and fertility. In Spain people eat twelve grapes at midnight on New Year's Eve, one per bell strike, for luck in each month (popularised in 1909).",
];

// Extra Wikipedia articles for common general topics (all checked to exist). Matched on the question's words.
export const TOPICS: { wiki: string; keywords: string[] }[] = [
  { wiki: "Winemaking", keywords: ["wine is made", "wine made", "made into wine", "make wine", "making wine", "winemaking", "ferment", "robi się wino", "produkcja wina"] },
  { wiki: "Raisin", keywords: ["raisin", "currant", "dried grape", "rodzyn"] },
  { wiki: "Viticulture", keywords: ["vineyard", "grow grapes", "growing grapes", "plant grapes", "prune", "vine", "uprawa", "winnic"] },
  { wiki: "Grape juice", keywords: ["juice", "sok", "soku"] },
  { wiki: "Twelve Grapes", keywords: ["new year", "twelve grapes", "12 grapes", "sylwester", "nowy rok"] },
  { wiki: "Dionysus", keywords: ["dionysus", "bacchus", "god of wine", "myth", "bóg wina"] },
  { wiki: "History of wine", keywords: ["history", "ancient", "oldest", "historia", "starożyt"] },
];

export const wikiUrl = (title: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

// Keywords match at the start of a word ("rodzyn" finds "rodzynki", "juice" doesn't match inside
// another word). Keep keywords that aren't the start of an unrelated word: e.g. no "wino" (→ "winogrona").
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const mentions = (text: string, keyword: string) =>
  new RegExp(`(^|[^\\p{L}])${escapeRegExp(keyword)}`, "u").test(text);

export const findGrape = (name: string | null | undefined) =>
  GRAPES.find((g) => g.name.toLowerCase() === (name ?? "").toLowerCase()) ?? null;

export const findGrapeByWiki = (title: string) => GRAPES.find((g) => g.wiki === title) ?? null;
