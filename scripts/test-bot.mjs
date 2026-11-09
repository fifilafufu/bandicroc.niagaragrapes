// Grape Bot question list: re-run after every Grape Bot change so old problems don't come back.
//
//   node scripts/test-bot.mjs                      (tests the live site)
//   node scripts/test-bot.mjs http://localhost:8788 (tests a local `npm run dev:api`)
//
// Each case checks the answer loosely (AI wording varies): what it must mention, what it must not
// say, and which Wikipedia article it should cite. Uses ~20 chats of the free daily allowance.

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
  { q: "where do grapes grow", must: [/china/i] },
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
  { history: ["What is Pinot noir?", "Pinot noir is a red wine grape."], q: "Where is it grown?", must: [/burgundy|france|oregon|california|new zealand/i], source: "Pinot noir" },
  // Polish
  { q: "skąd pochodzą winogrona?", must: [/wschod|azj/i], source: "Grape" },
  { q: "czy psy mogą jeść winogrona?", must: [/toksycz|trując|nerk|weteryn|niebezpiecz/i], notRefuse: true, source: "Grape toxicity in dogs" },
  { q: "słodkiego? przecież niagara jest kwaśna jak cholera", must: [/słodk/i] },
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
  if (c.source && !r.sources.some((s) => s.title === c.source)) problems.push(`didn't cite "${c.source}"`);
  if (r.error) problems.push(`error: ${r.error}`);
  if (problems.length) failed++;
  console.log(`${problems.length ? "FAIL" : "ok  "}  ${c.q}`);
  console.log(`      ${r.text.replace(/\s+/g, " ").slice(0, 220)}`);
  console.log(`      sources: ${r.sources.map((s) => s.title).join(", ") || "-"} | follow-ups: ${r.followUps.join(" / ") || "-"}`);
  if (problems.length) console.log(`      ⚠ ${problems.join("; ")}`);
}
console.log(`\n${CASES.length - failed}/${CASES.length} passed`);
process.exit(failed ? 1 : 0);
