// Grape Bot question list: re-run after every Grape Bot change so old problems don't come back.
//
//   node scripts/test-bot.mjs                      (tests the live site)
//   node scripts/test-bot.mjs http://localhost:8788 (tests a local `npm run dev:api`)
//
// Each case checks the answer loosely (AI wording varies): what it must mention, what it must not
// say, and which source it should cite (a Wikipedia title, or a pattern for a data source).
// Every answer is also checked for links: the text may hold none, and every source link must be one
// the app knows (Wikipedia, a VIVC passport, or shared/sources.ts), so none comes from the AI.
// Uses ~30 chats of the free daily allowance.

import { SOURCES } from "../shared/sources.ts";

const KNOWN_URLS = new Set(Object.values(SOURCES).map((s) => s.url));
const knownUrl = (url) =>
  KNOWN_URLS.has(url) || url.startsWith("https://en.wikipedia.org/wiki/") || url.startsWith("https://www.vivc.de/index.php?r=passport%2Fview&id=");
const LINK = /https?:\/\/|www\./i;
const LABELS = /app data|key facts|extracts/i;

const BASE = process.argv[2] || "https://bandicroc-niagaragrapes.pages.dev";

const REFUSAL = /only (know|talk) about grapes|zajmuję się tylko|tylko o winogronach/i;

const CASES = [
  // From tester feedback
  { q: "where are grapes from", must: [/middle east|western asia|asia/i], source: "Grape" },
  { q: "can i take a bath in grape juice", must: [/sticky|sugar|vinotherapy|spa|stain/i], notRefuse: true, source: "Vinotherapy" },
  { q: "can dogs eat grapes", must: [/toxic|poison|kidney|vet/i], notRefuse: true, source: "Grape toxicity in dogs" },
  { q: "are niagara grapes sour?", must: [/sweet/i] },
  { history: ["Are Niagara grapes sweet?", "Yes, ripe Niagara grapes are sweet."], q: "No they are sour, admit it", must: [/sweet/i] },
  // General knowledge
  { q: "what colours do grapes come in", must: [/green|red|black|purple|pink/i] },
  { q: "where do grapes grow", must: [/china/i], notSource: [/^University of Minnesota/] },
  { q: "how is wine made", must: [/ferment|yeast/i], source: "Winemaking" },
  { q: "what are raisins", must: [/dried/i], source: "Raisin" },
  { q: "why do spanish people eat 12 grapes at new year", must: [/luck|month|midnight/i], source: "Twelve Grapes" },
  { q: "who was dionysus", must: [/wine|god/i], source: "Dionysus" },
  // Varieties
  { q: "what do concord grapes taste like", must: [/sweet|foxy|musk/i], source: "Concord grape" },
  { q: "is cabernet sauvignon a sweet white wine?", must: [/red|tannin/i] },
  { q: "what is thompson seedless", must: [/seedless|raisin|sultana/i], source: "Sultana (grape)" },
  { q: "what colour are kyoho grapes", must: [/black|purple/i], source: "Kyoho (grape)" },
  { q: "what does gewürztraminer smell like", must: [/lychee/i], source: "Gewürztraminer" },
  // Follow-up understanding
  { history: ["What is Pinot noir?", "Pinot noir is a red wine grape."], q: "Where is it grown?", must: [/burgundy|france|oregon|california|new zealand/i], source: "Pinot noir", notSource: [/^University of Minnesota/] },
  // Polish
  { q: "skąd pochodzą winogrona?", must: [/wschod|azj/i], source: "Grape" },
  { q: "czy psy mogą jeść winogrona?", must: [/toksycz|trując|nerk|weteryn|niebezpiecz/i], notRefuse: true, source: "Grape toxicity in dogs" },
  { q: "słodkiego? przecież niagara jest kwaśna jak cholera", must: [/słodk/i] },
  // Answers from the app's curated data (VIVC, Grow Your Grape, Winemaking, Wine basics)
  { q: "who are the parents of niagara grapes", must: [/concord/i, /cassady/i], source: /^VIVC: Niagara/ },
  { q: "is merlot resistant to downy mildew", must: [/susceptib|sensitive|not (very )?resistant|low/i], source: /^VIVC: Merlot/ },
  { q: "how do i prune marquette", must: [/prun/i, /dormant|winter|spring|bud/i], source: /^University of Minnesota/ },
  { q: "how cold can marquette survive", must: [/37/] },
  { q: "how should i grow concord grapes", must: [/general|no (specific|reliable)|not (have|find)|missing/i, /prun|sun|dormant/i], source: /^University of Minnesota/ },
  { q: "how is rosé made", must: [/skin/i, /pink/i], source: /^OIV: International Code/, notSource: [/^OIV: Resolution/, /^Grape$/] },
  { q: "what does tannin do in wine", must: [/dry|astring|grip/i], source: "Phenolic content in wine", notSource: [/^Grape$/] },
  { q: "how much sugar makes 1% alcohol in wine", must: [/16[.,]8|0[.,]05943/], source: /^OIV: Resolution OENO 466/ },
  { q: "what is malolactic fermentation", must: [/malic/i, /lactic/i] },
  { q: "jak przycinać winorośl?", must: [/przycin|cię/i], source: /^University of Minnesota/ },
  // Off-topic must still be politely declined
  { q: "what is the capital of france", must: [REFUSAL] },
  { q: "write me a python script", must: [REFUSAL] },
];

async function ask(c) {
  const messages = [];
  if (c.history) messages.push({ role: "user", content: c.history[0] }, { role: "assistant", content: c.history[1] });
  messages.push({ role: "user", content: c.q });
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const out = { text: "", sources: [], followUps: [], grapes: [], error: null };
  for (const line of (await res.text()).split("\n")) {
    if (!line.trim()) continue;
    const m = JSON.parse(line);
    if (m.type === "meta") Object.assign(out, { sources: m.sources, followUps: m.followUps, grapes: m.grapes });
    if (m.type === "text") out.text += m.text;
    if (m.type === "error") (out.text += m.text), (out.error = m.detail);
  }
  return out;
}

let failed = 0;
for (const c of CASES) {
  const r = await ask(c);
  const problems = [];
  for (const re of c.must ?? []) if (!re.test(r.text)) problems.push(`missing ${re}`);
  if (c.notRefuse && REFUSAL.test(r.text)) problems.push("refused an on-topic question");
  const cites = (s) => (typeof c.source === "string" ? s.title === c.source : c.source.test(s.title));
  if (c.source && !r.sources.some(cites)) problems.push(`didn't cite ${c.source}`);
  if (LINK.test(r.text)) problems.push("the answer text holds a link");
  const unknown = r.sources.filter((s) => !knownUrl(s.url));
  if (unknown.length) problems.push(`unknown source links: ${unknown.map((s) => s.url).join(", ")}`);
  if (LABELS.test(r.text)) problems.push("the answer names the prompt's labels");
  for (const t of c.notSource ?? []) if (r.sources.some((s) => t.test(s.title))) problems.push(`cited ${t} (off topic)`);
  if (r.error) problems.push(`error: ${r.error}`);
  if (problems.length) failed++;
  console.log(`${problems.length ? "FAIL" : "ok  "}  ${c.q}`);
  console.log(`      ${r.text.replace(/\s+/g, " ").slice(0, 220)}`);
  console.log(`      sources: ${r.sources.map((s) => s.title).join(", ") || "-"} | follow-ups: ${r.followUps.join(" / ") || "-"}`);
  if (problems.length) console.log(`      ⚠ ${problems.join("; ")}`);
}
console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
process.exit(failed ? 1 : 0);
