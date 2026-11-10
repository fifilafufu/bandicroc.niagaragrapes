// What Make Your Wine needs to know about each grape: how ripe it usually gets, its acidity, and how
// much colour and tannin its skin can give. Every value says where it comes from.
//
// Starting points (Wikipedia "Ripeness in viticulture"): still red wine grapes are often picked near
// 22 °Brix with acidity 6.0 to 8.0 g/L and pH about 3.4; white wine grapes near 20 °Brix with acidity
// 6.5 to 8.5 g/L and pH about 3.3. Concord-type juice grapes reach about 16 to 17 °Brix (Growing
// Produce, 2014). Each grape then moves up or down only where its own checked facts (shared/grapes.ts)
// say so, e.g. "high acidity", "high natural sugar", "thin-skinned". Everything else is marked estimate.
//
// colour: how much red pigment the skin can give, 0 to 1, from its VIVC colour class.
// skinTannin / seedTannin: 0 to 1. Thin skin less, thick skin more; seedless grapes little seed tannin.

export type SimGrape = {
  name: string;
  brix: number; // usual sugar at harvest, °Brix
  ta: number; // acidity at harvest, g/L as tartaric acid
  ph: number;
  colour: number;
  skinTannin: number;
  seedTannin: number;
  basis: string; // where the numbers come from, in plain words
  estimate?: boolean; // true when no grape-specific source exists
};

const RED = { brix: 22, ta: 7, ph: 3.4 };
const WHITE = { brix: 20, ta: 7.5, ph: 3.3 };
const LABRUSCA = { brix: 16.5, ta: 7.5, ph: 3.3 };
const COLOUR = { blanc: 0, rose: 0.08, gris: 0.12, rouge: 0.45, noir: 0.8 };

export const SIM_GRAPES: SimGrape[] = [
  // American labrusca-type grapes: low sugar
  { name: "Concord", ...LABRUSCA, colour: 0.85, skinTannin: 0.6, seedTannin: 0.6, basis: "Concord reaches about 16 to 17 °Brix; dark blue-purple skin." },
  { name: "Niagara", ...LABRUSCA, colour: COLOUR.blanc, skinTannin: 0.5, seedTannin: 0.6, basis: "Ripeness taken from its parent Concord; green-white skin.", estimate: true },
  { name: "Catawba", ...LABRUSCA, colour: COLOUR.rouge, skinTannin: 0.5, seedTannin: 0.5, basis: "Ripeness taken from Concord; moderate acidity; copper-red skin.", estimate: true },
  { name: "Delaware", ...LABRUSCA, colour: COLOUR.rouge * 0.7, skinTannin: 0.4, seedTannin: 0.5, basis: "Ripeness taken from Concord; tender pale red skin.", estimate: true },
  // European wine grapes
  { name: "Chardonnay", ...WHITE, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "Typical white wine grape; neutral, takes on oak and climate." },
  { name: "Riesling", ...WHITE, ta: 8.5, ph: 3.1, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "White wine grape with high acidity (top of the white range)." },
  { name: "Sauvignon Blanc", ...WHITE, ta: 8, ph: 3.2, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "White wine grape making crisp wine (higher acidity)." },
  { name: "Gewürztraminer", ...WHITE, brix: 22, ta: 6.5, ph: 3.4, colour: COLOUR.rose, skinTannin: 0.5, seedTannin: 0.5, basis: "High natural sugar; pink skin, made into white wine." },
  { name: "Pinot Gris", ...WHITE, brix: 21, ta: 6.5, ph: 3.4, colour: COLOUR.gris, skinTannin: 0.55, seedTannin: 0.5, basis: "Alsace style: low to moderate acidity, higher alcohol; grey-pink skin, popular for skin-contact wine." },
  { name: "Muscat", ...WHITE, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "Typical white wine grape values; a family of green to black grapes.", estimate: true },
  { name: "Thompson Seedless", ...WHITE, colour: 0, skinTannin: 0.4, seedTannin: 0.05, basis: "Typical white values; seedless, so almost no seed tannin.", estimate: true },
  { name: "Pinot Noir", ...RED, colour: 0.5, skinTannin: 0.5, seedTannin: 0.5, basis: "Thin-skinned black grape: less colour and tannin than most reds." },
  { name: "Cabernet Sauvignon", ...RED, ta: 7.5, colour: 0.9, skinTannin: 0.9, seedTannin: 0.7, basis: "Thick-skinned black grape: high tannin, noticeable acidity." },
  { name: "Merlot", ...RED, ta: 6.5, ph: 3.5, colour: 0.8, skinTannin: 0.7, seedTannin: 0.6, basis: "Soft, fleshy black grape (lower acidity)." },
  { name: "Syrah", ...RED, colour: 0.85, skinTannin: 0.8, seedTannin: 0.6, basis: "Dark-skinned grape; medium-plus to high tannin." },
  { name: "Tempranillo", ...RED, colour: COLOUR.noir, skinTannin: 0.7, seedTannin: 0.6, basis: "Typical red values; black grape." },
  { name: "Grenache", ...RED, brix: 24, ta: 6, ph: 3.6, colour: 0.7, skinTannin: 0.6, seedTannin: 0.6, basis: "Ripens late in hot places: high alcohol; soft." },
  // Cold-hardy and disease-resistant crosses
  { name: "Solaris", ...WHITE, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "Typical white values; white wine grape.", estimate: true },
  { name: "Seyval Blanc", ...WHITE, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "Typical white values; ripens early in cool climates.", estimate: true },
  { name: "Vidal Blanc", ...WHITE, brix: 21, ta: 8, ph: 3.2, colour: 0, skinTannin: 0.5, seedTannin: 0.5, basis: "High sugar in cold climates with moderate to high acidity." },
  { name: "Regent", ...RED, colour: 0.85, skinTannin: 0.7, seedTannin: 0.6, basis: "Typical red values; dark-skinned grape.", estimate: true },
  { name: "Marquette", ...RED, colour: COLOUR.noir, skinTannin: 0.7, seedTannin: 0.6, basis: "Typical red values; red wine hybrid.", estimate: true },
  { name: "Scuppernong", ...LABRUSCA, colour: COLOUR.blanc, skinTannin: 0.8, seedTannin: 0.6, basis: "No wine data found; values guessed from other American grapes. Very thick skin.", estimate: true },
];

// Table grapes left out: Cotton Candy, Red Globe, Shine Muscat and Kyoho are grown for eating.
export const TABLE_ONLY = ["Cotton Candy", "Red Globe", "Shine Muscat", "Kyoho"];

export const simGrape = (name: string | null | undefined) => SIM_GRAPES.find((g) => g.name === name) ?? null;
