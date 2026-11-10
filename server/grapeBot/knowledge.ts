// Grape Bot's curated knowledge: the same checked data the app's pages show (VIVC passports and
// resistance scores, Grow Your Grape, Winemaking, Wine basics), picked to fit the question. Each note
// comes with the source chips the app shows under the answer, so every link is ours, never the AI's.

import { mentions, wikiUrl, type Grape } from "../../shared/grapes";
import { DISEASE_NAMES, resistanceWord, type DiseaseKey } from "../../shared/diseases";
import { GENERAL_CALENDAR, GENERAL_DISEASE, GENERAL_PRUNING, GROW, rootstockAdvice } from "../../shared/grow";
import { MONTHS } from "../../shared/growthCycle";
import { SOURCES, type SourceId } from "../../shared/sources";
import { COLOUR_CLASS, niceCase, speciesLabel, varietyInfo } from "../../shared/varieties";
import { PARTS, type PartId } from "../../shared/wineBasics";
import { STEPS, STYLES, type Style, type StepId } from "../../shared/winemaking";
import { MAX_DATA_GRAPES, type Chip } from "./settings";

export type Knowledge = { notes: string[]; chips: Chip[] };

const sourceChip = (id: SourceId): Chip => ({ title: `${SOURCES[id].publisher}: ${SOURCES[id].title}`, url: SOURCES[id].url, data: true });
const wikiChip = (title: string): Chip => ({ title, url: wikiUrl(title) });
const any = (text: string, words: string[]) => words.some((w) => mentions(text, w));

// Words that show what a question is about (English and Polish word starts).
// Not plain "grow": "where do grapes grow" and "where is it grown" are about places, not gardening.
const GROWING = ["how to grow", "how do i grow", "how should i grow", "how can i grow", "i grow", "growing", "plant", "prune", "pruning", "trellis", "frost", "winter", "cold", "hardy", "hardiness", "disease", "mildew", "rot", "garden", "rootstock", "phylloxera", "care", "vigour", "vigor", "ripen", "upraw", "sadz", "przycin", "mróz", "mroz", "zim", "chorob", "mączniak", "ogród", "ogrod", "podkład", "filoksera"];
const ABOUT = ["what is", "what are", "tell me about", "co to", "opowiedz", "czym jest"];
const PASSPORT = ["parent", "bred", "cross", "origin", "come from", "species", "hybrid", "colour", "color", "vivc", "rodzic", "skrzyżow", "pochodz", "gatun", "kolor", "mieszańc"];
const MADE = ["made", "make", "making", "process", "produce", "steps", "robi", "powstaj", "produk", "wytwarza"];
const WINEMAKING = ["winemaking", "wine made", "wine is made", "make wine", "making wine", "ferment", "robi się wino", "produkcja wina", "fermentac"];
const STYLE_WORDS: Record<Style["id"], string[]> = {
  red: ["red wine", "czerwone wino", "wino czerwone", "czerwonego wina"],
  white: ["white wine", "białe wino", "wino białe", "białego wina"],
  rose: ["rosé", "rose wine", "różowe", "różowego"],
  sparkling: ["sparkling", "champagne", "bubbles", "musując", "szampan"],
};
const STEP_WORDS: Partial<Record<StepId, string[]>> = {
  maceration: ["macerat", "skin contact", "maceracj"],
  press: ["pressing", "pressed", "tłocz"],
  mlf: ["malolactic", "mlf", "malolakty"],
  age: ["ageing", "aging", "barrel", "beczk", "dojrzewa"],
  clarify: ["clarif", "fining", "filtering", "klarow", "filtrow"],
  tirage: ["tirage"],
  second: ["second fermentation", "druga fermentacja"],
  lees: ["lees", "osad"],
  riddle: ["riddl", "remuage"],
  disgorge: ["disgorg", "degorż"],
};
const PART_WORDS: Record<PartId, string[]> = {
  acidity: ["acidity", "acidic", "tartaric", "kwasowo"],
  sugar: ["residual sugar", "dry wine", "sweet wine", "sweetness", "off-dry", "semi-sweet", "wytrawn", "półsłodk", "półwytrawn"],
  alcohol: ["alcohol", "abv", "alkohol"],
  tannin: ["tannin", "astringen", "tanin", "garbnik"],
  body: ["body", "full-bodied", "light-bodied"],
  balance: ["balance", "balanced", "równowag"],
};

function passportNotes(g: Grape, out: Knowledge) {
  const v = varietyInfo(g.name)?.vivc;
  if (!v) return;
  const bits = [
    v.colour && `skin colour class ${COLOUR_CLASS[v.colour].label} (${COLOUR_CLASS[v.colour].meaning})`,
    v.species && `species ${speciesLabel(v.species)}`,
    v.origin && `country of origin ${niceCase(v.origin)}`,
    v.pedigree && !/[?\d=]/.test(v.pedigree) && `parents ${niceCase(v.pedigree)}`,
  ].filter(Boolean);
  out.notes.push(`${g.name}, VIVC passport no. ${v.id} (official name ${v.primeName}): ${bits.join("; ")}.`);
  out.chips.push({ title: `VIVC: ${g.name} passport`, url: v.url, data: true });
}

function growNotes(g: Grape, out: Knowledge) {
  const info = varietyInfo(g.name);
  const res = info?.resistance;
  if (res && info?.vivc) {
    const scores = (Object.keys(res) as DiseaseKey[]).map((d) => `${DISEASE_NAMES[d]} ${res[d]!.score} (${resistanceWord(res[d]!.score)})`);
    out.notes.push(`${g.name}, VIVC disease resistance on the OIV 1 to 9 scale (1 very susceptible, 9 very resistant): ${scores.join(", ")}.`);
    out.chips.push({ title: `VIVC: ${g.name} passport`, url: info.vivc.url, data: true });
  }
  const gi = GROW[g.name];
  if (!gi) {
    out.notes.push(`${g.name}: the app has no grape-specific growing source; say so and give only the general advice.`);
  } else {
    const bits = [
      gi.cold && `winter: ${gi.cold.text}${gi.cold.minC !== undefined ? ` (sources give down to about ${gi.cold.minC} °C)` : ""}`,
      gi.budding && `budding ${gi.budding}`,
      gi.ripening && `ripening ${gi.ripening}`,
      gi.vigour && `vigour: ${gi.vigour}`,
      gi.diseases && `diseases: ${gi.diseases}`,
      gi.frostRisk && `frost: ${gi.frostRisk}`,
      gi.pruning && `${gi.pruning.type} pruning: ${gi.pruning.text}`,
      gi.training && `training: ${gi.training}`,
      gi.climateSoil && `climate and soil: ${gi.climateSoil}`,
    ].filter(Boolean);
    out.notes.push(`${g.name}, growing: ${bits.join("; ")}`);
    gi.src.ids?.forEach((id) => out.chips.push(sourceChip(id)));
    gi.src.wiki?.forEach((w) => out.chips.push(wikiChip(w)));
  }
  out.notes.push(`${g.name}, rootstock: ${rootstockAdvice(g.name, info?.vivc?.species)}`);
  if (!gi?.rootstock) out.chips.push(wikiChip("Phylloxera"));
}

function generalGrowing(out: Knowledge) {
  const span = ([a, b]: [number, number]) => (a === b ? MONTHS[a - 1] : `${MONTHS[a - 1]} to ${MONTHS[b - 1]}`);
  out.notes.push(
    `Growing any grape (University of Minnesota Extension). Pruning: ${GENERAL_PRUNING.join(" ")} Disease: ${GENERAL_DISEASE.join(" ")}`,
    `Yearly care, Northern Hemisphere months (add six months in the south): ${GENERAL_CALENDAR.map((c) => `${span(c.months)}: ${c.task}`).join(" ")}`,
  );
  out.chips.push(sourceChip("umn-home-grapes"));
}

function stepChips(id: StepId, out: Knowledge) {
  STEPS[id].src?.forEach((s) => out.chips.push(sourceChip(s)));
  STEPS[id].wiki?.forEach((w) => out.chips.push(wikiChip(w)));
}

function winemakingNotes(text: string, out: Knowledge) {
  const styles = STYLES.filter((s) => any(text, STYLE_WORDS[s.id]));
  const steps = (Object.keys(STEP_WORDS) as StepId[]).filter((id) => any(text, STEP_WORDS[id]!));
  const general = any(text, WINEMAKING) || (styles.length > 0 && any(text, MADE));
  if (!general && !steps.length) return;

  for (const s of styles.length ? styles : general ? STYLES : []) {
    const list = s.steps.map((st) => `${STEPS[st.id].name}${st.note ? ` (${st.note})` : ""}${st.sometimes ? " [sometimes]" : ""}`);
    out.notes.push(`${s.name} wine: ${s.blurb} Steps in order: ${list.join(" → ")}.`);
  }
  // A style is cited by the OIV code (its step wording) and the Winemaking article.
  if (styles.length) out.chips.push(sourceChip("oiv-code"), wikiChip("Winemaking"));
  for (const id of steps) {
    out.notes.push(`${STEPS[id].name}: ${STEPS[id].what} Why: ${STEPS[id].why}`);
    stepChips(id, out);
  }
  if (!styles.length && !steps.length) out.chips.push(sourceChip("oiv-code"));
}

function wineBasicsNotes(text: string, out: Knowledge) {
  for (const p of PARTS.filter((p) => any(text, PART_WORDS[p.id]))) {
    out.notes.push(`${p.name}: ${p.what} Comes from: ${p.from} Changes: ${p.changes} Numbers: ${p.numbers}`);
    p.src?.forEach((s) => out.chips.push(sourceChip(s)));
    p.wiki.forEach((w) => out.chips.push(wikiChip(w)));
  }
}

// The checked notes and source chips for one question. `grapes` are the grapes it is about.
export function curatedKnowledge(latest: string, grapes: Grape[]): Knowledge {
  const out: Knowledge = { notes: [], chips: [] };
  const focus = grapes.slice(0, MAX_DATA_GRAPES);
  const growing = any(latest, GROWING);
  if (growing || any(latest, PASSPORT) || any(latest, ABOUT)) focus.forEach((g) => passportNotes(g, out));
  if (growing) {
    focus.forEach((g) => growNotes(g, out));
    generalGrowing(out);
  }
  winemakingNotes(latest, out);
  wineBasicsNotes(latest, out);
  return out;
}
