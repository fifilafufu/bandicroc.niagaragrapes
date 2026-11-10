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
      "Pale greenish-white, large and juicy. Ripe Niagara grapes are SWEET, with a strong sweet aroma and a musky \"foxy\" flavour (Vitis labrusca; in Polish: piżmowy, not \"muskularny\"). Slip-skin with seeds. Eaten fresh, and used for white grape juice, jelly and sweet wines. Only unripe grapes, or the skin on its own, taste tart.",
  },
  {
    name: "Concord",
    wiki: "Concord grape",
    keywords: ["concord"],
    facts:
      "Dark blue-purple, highly aromatic, large seeds. Sweet, musky \"foxy\" flavour (Polish: piżmowy): the classic taste of grape juice and grape jelly. The skin is more tart than the flesh.",
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

// Added so every grape skin colour has a real example (facts from each Wikipedia article).
GRAPES.push(
  {
    name: "Shine Muscat",
    wiki: "Shine Muscat",
    keywords: ["shine muscat"],
    facts:
      "Yellowish-green Japanese table grape, registered in 2006, bred from Muscat of Alexandria and the very sugary American grape Steuben. Large and sweet with a muscat aroma; with treatment it grows seedless and the whole skin can be eaten.",
  },
  {
    name: "Scuppernong",
    wiki: "Scuppernong",
    keywords: ["scuppernong", "muscadine"],
    facts:
      "A large muscadine grape (Vitis rotundifolia) native to the southern United States. Usually greenish or bronze (the closest a grape gets to orange), round and larger than common grapes, with a thick, tough skin.",
  },
  {
    name: "Gewürztraminer",
    wiki: "Gewürztraminer",
    keywords: ["gewürztraminer", "gewurztraminer", "gewürz", "gewurz", "traminer"],
    facts:
      "Aromatic wine grape with a pink to red skin, yet used for white wines. High natural sugar; its usually off-dry wines smell strongly of lychees (they share the same aroma compounds). Grows best in cooler climates.",
  },
  {
    name: "Kyoho",
    wiki: "Kyoho (grape)",
    keywords: ["kyoho"],
    facts:
      "Japanese table grape, blackish-purple to almost black, with very sweet, juicy flesh, mild acidity and large bitter seeds. Slip-skin like Concord, with some Concord-like flavour; usually peeled and eaten as a dessert. Popular in Japan, Taiwan, China and Korea.",
  },
);

export const GENERAL_GRAPE_ARTICLE = "Grape";

// Checked facts about grapes in general (from the full Wikipedia "Grape", "History of wine" and
// "Twelve Grapes" articles). The intro Grape Bot reads leaves most of this out, so it's always included.
export const GENERAL_FACTS = [
  "Origin: grapes come from the Middle East / Western Asia, where people began growing them 6,000–8,000 years ago. The main species, Vitis vinifera, is native to the Mediterranean and Central Asia. North America has its own wild species, such as Vitis labrusca (Concord, Niagara).",
  "Early history: the earliest known traces of wine are from near Tbilisi, Georgia (c. 6000 BCE); the oldest known winery is Areni-1 in Armenia (c. 4100 BCE). Ancient Egyptians, Greeks, Phoenicians and Romans grew grapes.",
  "Where grown today (OIV 2024): the world grew 77.7 million tonnes of grapes in 2024. China grows by far the most (17.0 million tonnes, about 22%), followed by Italy (7.3) and the USA (6.4). The top ten countries grow 70% of all grapes.",
  "Uses (OIV 2024): of the grapes used in 2024, 47% were pressed (wine plus musts and juices), 46% were eaten fresh as table grapes and 7% were dried into raisins, currants and sultanas. The old figure of about 71% for wine is out of date: wine's share has fallen (57% in 2018) while table grapes have grown (26% in 2000, about 48% in 2025, provisional). Grapes also give jam, jelly, vinegar and grape-seed oil.",
  "Plant: a grape is botanically a berry, growing in clusters of 15–300 on woody vines of the genus Vitis. Table grapes are usually large, seedless and thin-skinned; wine grapes are picked very sweet (about 24% sugar). The variety with the most vineyard area is Kyoho (365,000 ha, a table grape mostly in China), then Cabernet Sauvignon (341,000 ha) and Sultanina, also called Sultana or Thompson Seedless (273,000 ha), the most used grape for table grapes and raisins (OIV, 2015 data).",
  "Nutrition: raw grapes are 81% water and 18% carbohydrates; 100 g has about 69 kcal and some vitamin K.",
  "Culture: Dionysus (Roman Bacchus) was the Greek god of wine-making and fertility. In Spain people eat twelve grapes at midnight on New Year's Eve, one per bell strike, for luck in each month (popularised in 1909).",
  "Colours: ripe grapes can be crimson, black, dark blue, yellow, green, orange or pink. \"White\" grapes are actually green; they descend from purple grapes, with two genes switched off that make the purple pigment (anthocyanins). So it's not just white, black and Cotton Candy: there are thousands of varieties.",
];

// Extra Wikipedia articles for common topics (all checked to exist), matched on the question's words.
// `facts` are checked sentences from that article, always given to the bot when the topic comes up.
export const TOPICS: { wiki: string; keywords: string[]; facts?: string }[] = [
  {
    wiki: "Grape toxicity in dogs",
    keywords: ["dog", "puppy", "puppies", "pet", "pies", "psa", "psy", "psu", "piesek", "szczeni"],
    facts:
      "SAFETY: grapes and raisins are toxic to dogs. Eating them can cause sudden kidney failure. A dog that eats grapes or raisins should see a vet straight away. Always say this clearly when dogs or pets come up.",
  },
  {
    wiki: "Vinotherapy",
    keywords: ["bath", "spa treatment", "day spa", "the spa", "a spa", "skincare", "beauty", "face mask", "cosmetic", "kąpiel", "wanna", "skór", "kosmety"],
    facts:
      "Vinotherapy is a real beauty treatment where wine-making leftovers (grape pips and pulp) are rubbed into the skin; the pulp is claimed to exfoliate. It is not a bath in grape juice: juice is sugary and sticky and would stain.",
  },
  { wiki: "Grape seed oil", keywords: ["oil", "olej"], facts: "Grape seed oil is pressed from grape seeds, a wine-making by-product; it is a light-tasting cooking oil with a smoke point around 216 °C, used in salad dressings and mayonnaise." },
  { wiki: "Vinegar", keywords: ["vinegar", "ocet", "octu"], facts: "Vinegar's name comes from Old French for 'sour wine'; wine vinegar is made by fermenting wine further with acetic acid bacteria." },
  { wiki: "Winemaking", keywords: ["wine is made", "wine made", "made into wine", "make wine", "making wine", "winemaking", "ferment", "robi się wino", "produkcja wina"] },
  { wiki: "Raisin", keywords: ["raisin", "currant", "dried grape", "rodzyn"] },
  { wiki: "Viticulture", keywords: ["vineyard", "grow grapes", "growing grapes", "plant grapes", "prune", "grapevine", "vines", "uprawa", "winnic"] },
  { wiki: "Grape juice", keywords: ["juice", "sok", "soku"] },
  { wiki: "Twelve Grapes", keywords: ["new year", "twelve grapes", "12 grapes", "sylwester", "nowy rok"] },
  { wiki: "Dionysus", keywords: ["dionysus", "bacchus", "god of wine", "myth", "bóg wina"] },
  { wiki: "History of wine", keywords: ["history", "ancient", "oldest", "historia", "starożyt"] },
];

export const findTopicByWiki = (title: string) => TOPICS.find((t) => t.wiki === title) ?? null;

export const wikiUrl = (title: string) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`;

// Keywords match at the start of a word ("rodzyn" finds "rodzynki", "juice" doesn't match inside
// another word). Keep keywords that aren't the start of an unrelated word: e.g. no "wino" (→ "winogrona").
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const mentions = (text: string, keyword: string) =>
  new RegExp(`(^|[^\\p{L}])${escapeRegExp(keyword)}`, "u").test(text);

export const findGrape = (name: string | null | undefined) =>
  GRAPES.find((g) => g.name.toLowerCase() === (name ?? "").toLowerCase()) ?? null;

export const findGrapeByWiki = (title: string) => GRAPES.find((g) => g.wiki === title) ?? null;
