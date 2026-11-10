// Grow Your Grape: growing traits per grape, each with its source. Empty means no reliable source was
// found; the app then says so and shows only the general advice (University of Minnesota Extension),
// labelled as general. Checked 2026-11-10.
//
// Sources: OIV "Distribution of the world's grapevine varieties" (Focus 2017) for the 11 grapes it
// describes; each grape's Wikipedia article; University of Minnesota Extension "Growing grapes in the
// home garden" (Marquette zones and harvest, and all general advice); Wikipedia "Phylloxera".

import type { SourceId } from "./sources";

export type Level = "low" | "medium" | "high";
export type Pruning = "spur" | "cane";

export type GrowInfo = {
  cold?: { text: string; minC?: number }; // minC: the lowest winter temperature a source gives
  budding?: "early" | "average" | "late";
  ripening?: "early" | "mid" | "late";
  vigour?: string;
  diseases?: string; // in the source's words, shortened
  frostRisk?: string; // spring or autumn frost notes
  pruning?: { type: Pruning; text: string };
  training?: string;
  climateSoil?: string;
  rootstock?: string;
  src: { ids?: SourceId[]; wiki?: string[] };
};

const OIV: SourceId[] = ["oiv-varieties-2017"];

export const GROW: Record<string, GrowInfo> = {
  "Cabernet Sauvignon": {
    budding: "late",
    ripening: "late",
    diseases: "Particularly susceptible to grapevine trunk diseases (esca, eutypa, excoriose) and to powdery mildew.",
    src: { ids: OIV },
  },
  Merlot: {
    budding: "early",
    ripening: "mid",
    vigour: "Normal vigour, trailing growth habit.",
    diseases: "Sensitive to downy and powdery mildew, botrytis, leafhoppers and drought; prone to poor fruit set (coulure).",
    frostRisk: "Buds and flowers early, so spring frost can hit young shoots.",
    pruning: { type: "spur", text: "Suited to close (short) pruning." },
    climateSoil: "Tends to over-ripen in warm climates; sensitive to drought.",
    src: { ids: OIV },
  },
  "Pinot Noir": {
    cold: { text: "Very resistant to winter frosts." },
    budding: "early",
    diseases: "Susceptible to downy mildew, botrytis and leafhoppers.",
    frostRisk: "Early budding makes it sensitive to early spring frosts.",
    climateSoil: "Ripens quickly in warm climates. Cool, humid weather at flowering causes poor fruit set, so it's unsuited to clay and humid soils.",
    src: { ids: OIV },
  },
  Syrah: {
    budding: "late",
    ripening: "late",
    vigour: "Highly vigorous, low fertility.",
    diseases: "Extremely susceptible to chlorosis (yellowing leaves); less so to mites and botrytis.",
    pruning: { type: "cane", text: "Better suited to long (cane) pruning; close pruning can still give good wine in warm southern regions." },
    src: { ids: OIV },
  },
  Grenache: {
    cold: { text: "Sensitive to autumn frosts, and it hardens off poorly for winter: a real challenge in cold places." },
    ripening: "late",
    vigour: "Highly vigorous, upright.",
    diseases: "Susceptible to downy mildew, excoriose, botrytis, poor fruit set (coulure) and magnesium deficiency.",
    climateSoil: "Extremely drought resistant and adapts easily to different soils; needs hot, dry conditions to ripen.",
    src: { ids: OIV, wiki: ["Grenache"] },
  },
  Tempranillo: {
    budding: "early",
    ripening: "early",
    vigour: "Very high vigour, upright.",
    diseases: "Susceptible to excoriose and powdery mildew; sensitive to extreme drought and wind.",
    pruning: { type: "spur", text: "Suited to short pruning." },
    climateSoil: "Particularly suited to southern growing conditions; short growing cycle.",
    src: { ids: OIV },
  },
  Chardonnay: {
    budding: "late",
    ripening: "early",
    vigour: "High vigour.",
    diseases: "Susceptible to powdery mildew, phytoplasmas and botrytis.",
    frostRisk: "OIV notes its budburst timing makes it sensitive to spring frosts.",
    pruning: { type: "spur", text: "Close pruning gives low to medium yields." },
    src: { ids: OIV },
  },
  "Sauvignon Blanc": {
    budding: "average",
    ripening: "late",
    vigour: "Highly vigorous, low fertility; small clusters prone to poor fruit set.",
    diseases: "Extremely susceptible to powdery mildew and black rot; less so to downy mildew and botrytis. Also trunk diseases.",
    src: { ids: OIV },
  },
  "Thompson Seedless": {
    vigour: "Highly vigorous, with reduced fertility.",
    diseases: "Susceptible to powdery and downy mildew, anthracnose, excoriose, botrytis, uneven berries (millerandage) and berry splitting.",
    pruning: { type: "cane", text: "Needs a trellis and long (cane) pruning." },
    training: "Grown on trellises.",
    src: { ids: OIV },
  },
  "Red Globe": {
    budding: "early",
    ripening: "late",
    vigour: "Highly vigorous, with large clusters and berries.",
    src: { ids: OIV },
  },
  Kyoho: {
    diseases: "Moderate resistance to disease.",
    src: { ids: OIV },
  },
  Marquette: {
    cold: { text: "Cold hardy: survives about −37 °C when fully dormant. Grows very well in USDA zone 4 and does well in zone 3.", minC: -37 },
    ripening: "mid",
    diseases: "Good resistance to downy mildew, powdery mildew and black rot.",
    climateSoil: "Bred in Minnesota for cold climates. Harvest mid to late September there.",
    src: { ids: ["umn-home-grapes"], wiki: ["Marquette (grape)"] },
  },
  Regent: {
    ripening: "late",
    diseases: "Broad resistance to the main fungal diseases such as downy mildew. Its weak spot: if flowers get wet during bloom they are highly susceptible to botrytis, which can stop fruit set.",
    pruning: { type: "cane", text: "Canes tied to the low fruiting wire." },
    training: "Upright growth; can be trained to VSP (vertical shoot positioning).",
    src: { wiki: ["Regent (grape)"] },
  },
  Solaris: {
    cold: { text: "Hardy, with good resistance to frost: grown in northern Europe (Belgium, Netherlands, England, Denmark, Sweden, Norway)." },
    ripening: "early",
    diseases: "Good resistance to fungal diseases.",
    src: { wiki: ["Solaris (grape)"] },
  },
  "Vidal Blanc": {
    cold: { text: "Very winter-hardy; grown mostly in Canada (Ontario, British Columbia, Quebec, Nova Scotia)." },
    ripening: "late",
    diseases: "Somewhat resistant to downy mildew, but very susceptible to powdery mildew and poor fruit set (coulure).",
    climateSoil: "Reaches high sugar in cold climates with moderate to high acidity; often left on the vine into winter for ice wine.",
    src: { wiki: ["Vidal blanc"] },
  },
  "Seyval Blanc": {
    ripening: "early",
    climateSoil: "Ripens early, is productive and suits fairly cool climates.",
    src: { wiki: ["Seyval blanc"] },
  },
  Catawba: {
    cold: { text: "A hardy vine that handles cold continental winters and hot, humid summers." },
    ripening: "late",
    diseases: "More susceptible to downy and powdery mildew than typical American grapes.",
    climateSoil: "Ripens one to two weeks after Concord and Delaware, so it needs a long enough season.",
    src: { wiki: ["Catawba (grape)"] },
  },
  Delaware: {
    ripening: "early",
    diseases: "Susceptible to downy mildew.",
    rootstock: "Needs grafting onto phylloxera-resistant rootstock (probably because of its European ancestry); vigorous when grafted.",
    climateSoil: "Grown in the north-east and Midwest United States; ripens earlier than Concord.",
    src: { wiki: ["Delaware (grape)"] },
  },
  Scuppernong: {
    cold: { text: "Winter injury or freeze where temperatures drop below about −18 °C (0 °F).", minC: -18 },
    diseases: "Muscadines have a high tolerance to diseases and pests.",
    climateSoil: "Adapted to the warm, humid south-eastern USA.",
    src: { wiki: ["Scuppernong", "Vitis rotundifolia"] },
  },
  "Shine Muscat": {
    cold: { text: "Relatively resistant to cold; keeps its colour even in very hot summers." },
    vigour: "Vigorous; first harvest about three years after planting.",
    src: { wiki: ["Shine Muscat"] },
  },
  "Pinot Gris": {
    climateSoil: "Thrives in cooler climates (Alsace, north-eastern Italy, Oregon); dry autumns let grapes hang long.",
    src: { wiki: ["Pinot gris"] },
  },
  Riesling: {
    ripening: "late",
    climateSoil: "Particularly well suited to slate and sandy clay soils.",
    src: { wiki: ["Riesling"] },
  },
};

// American species (and their rootstocks) resist phylloxera; European Vitis vinifera roots don't, so
// vinifera is grafted onto resistant American rootstock where the pest is present (Wikipedia "Phylloxera").
export function rootstockAdvice(name: string, species: string | null | undefined): string {
  const own = GROW[name]?.rootstock;
  if (own) return own;
  const s = (species ?? "").toUpperCase();
  if (s.startsWith("VITIS VINIFERA"))
    return "European Vitis vinifera roots are attacked by phylloxera: where it is present, graft onto phylloxera-resistant American rootstock.";
  if (s.includes("ROTUNDIFOLIA")) return "No source on rootstocks for muscadines found.";
  return "Has American ancestry, which helps against phylloxera; no grape-specific rootstock advice found.";
}

// General advice for everyone (University of Minnesota Extension). Months are for the Northern
// Hemisphere; add six months in the south.
export const GENERAL_CALENDAR: { months: [number, number]; task: string; stage?: string }[] = [
  { months: [3, 3], task: "Prune existing vines before growth starts.", stage: "dormancy" },
  { months: [4, 5], task: "Plant bare-root vines as soon as the soil can be worked.", stage: "budbreak" },
  { months: [4, 6], task: "Rub off shoots that start growing low on the trunk.", stage: "budbreak" },
  { months: [4, 8], task: "Tie new growth to the trellis.", stage: "flowering" },
  { months: [4, 10], task: "Inspect vines for disease and insects.", stage: "fruitset" },
  { months: [5, 6], task: "Plant potted vines after the risk of frost has passed.", stage: "flowering" },
  { months: [9, 10], task: "Watch for bird damage as fruit ripens; cover with netting if needed.", stage: "veraison" },
  { months: [9, 10], task: "Harvest by colour and taste.", stage: "harvest" },
  { months: [10, 11], task: "Clean up fallen leaves, fruit and prunings, where diseases overwinter.", stage: "dormancy" },
];

export const GENERAL_PRUNING = [
  "Prune every winter or early spring while the vine is dormant. 80 to 90% of last year's growth is removed, because fruit grows on new shoots from last year's wood.",
  "Keep 1 to 2 trunks and 2 to 4 cordons (woody arms), with spurs of one or two buds.",
  "After pruning: table and juice grapes 40 to 60 buds per vine, wine grapes 20 to 30. Heavy pruning gives the best fruit; light pruning gives lots of poor fruit.",
];

export const GENERAL_DISEASE = [
  "Plant in full sun with good air circulation, and prune to keep the canopy open.",
  "Rake up leaves and fallen fruit each autumn; diseases overwinter there.",
  "Water the roots, not the leaves: wet foliage encourages disease.",
  "Black rot: grapes are susceptible from bloom until about 6 weeks later.",
  "Keep lawn weed killers with 2,4-D or dicamba well away: grapes are very sensitive to them.",
];
