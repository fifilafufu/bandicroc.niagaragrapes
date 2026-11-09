// POST /api/chat — Grape Bot, an educational grape tutor grounded in live Wikipedia.
// Runs on Cloudflare Pages Functions. The prompt and any API keys stay on the server.
//
// Usage is kept low on purpose: only the intro of 1–2 matching articles is sent, Wikipedia
// intros are cached for 24 h, only the last 6 messages are sent, and answers are capped.

import { GRAPES, GENERAL_FACTS, GENERAL_GRAPE_ARTICLE, TOPICS, findGrape, findGrapeByWiki, wikiUrl } from "../../shared/grapes";

interface Env {
  AI: Ai;
  AI_PROVIDER?: string;
  WORKERS_AI_MODEL?: string;
  OPENROUTER_MODEL?: string;
  OPENROUTER_API_KEY?: string;
}

type Turn = { role: "user" | "assistant"; content: string };
type Article = { title: string; url: string; text: string };

const MAX_TURNS = 6;
const MAX_CHARS = 500;
const MAX_ARTICLES = 2;
const MAX_ARTICLE_CHARS = 1500;
const MAX_ANSWER_TOKENS = 300;
const WIKI_CACHE_SECONDS = 60 * 60 * 24;
const USER_AGENT = "bandicroc-niagaragrapes/1.0 (https://bandicroc-niagaragrapes.pages.dev)";

// Smartest first; later ones are backups if a model is busy or retired.
const MODELS = [
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-3.1-8b-instruct",
];

// ---------- request parsing ----------

function parseBody(body: unknown): { messages: Turn[]; favourite: string | null } | null {
  if (!body || typeof body !== "object") return null;
  const { messages, favourite } = body as { messages?: unknown; favourite?: unknown };
  if (!Array.isArray(messages)) return null;

  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    const role = (m as Turn)?.role;
    const content = (m as Turn)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, MAX_CHARS);
    if (text) turns.push({ role, content: text });
  }
  while (turns.length && turns[0].role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== "user") return null;

  // Only accept favourites from our own list, so nothing odd ends up in the prompt.
  const fav = typeof favourite === "string" ? findGrape(favourite)?.name ?? null : null;
  return { messages: turns, favourite: fav };
}

// ---------- choosing and fetching Wikipedia articles ----------

function pickArticles(messages: Turn[], favourite: string | null): string[] {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content.toLowerCase());
  const latest = userTexts[userTexts.length - 1] ?? "";
  const titles: string[] = [];
  const add = (t: string) => !titles.includes(t) && titles.length < MAX_ARTICLES && titles.push(t);

  const matchIn = (text: string) => GRAPES.filter((g) => g.keywords.some((k) => text.includes(k)));

  // Grapes named in the latest question; if none, the previous question (follow-ups like "where is it grown?").
  let matches = matchIn(latest);
  if (!matches.length && userTexts.length > 1) matches = matchIn(userTexts[userTexts.length - 2]);
  matches.forEach((g) => add(g.wiki));

  // "my favourite" questions read the user's saved favourite.
  if (favourite && /\bmy (fav|favou?rite)/.test(latest)) {
    const g = findGrape(favourite);
    if (g) add(g.wiki);
  }

  // General topics (wine-making, raisins, history, New Year…) get their own article.
  TOPICS.filter((t) => t.keywords.some((k) => latest.includes(k))).forEach((t) => add(t.wiki));

  if (!titles.length) add(GENERAL_GRAPE_ARTICLE);
  return titles;
}

function trimToSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = cut.lastIndexOf(". ");
  return end > max * 0.5 ? cut.slice(0, end + 1) : cut + "…";
}

async function fetchArticle(title: string, ctx: EventContext<Env, string, unknown>): Promise<Article | null> {
  const api =
    "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&redirects=1&format=json&titles=" +
    encodeURIComponent(title);
  const cache = caches.default;
  const cacheKey = new Request(api);

  let res = await cache.match(cacheKey);
  if (!res) {
    const live = await fetch(api, { headers: { "User-Agent": USER_AGENT } });
    if (!live.ok) return null;
    res = new Response(live.body, live);
    res.headers.set("Cache-Control", `public, max-age=${WIKI_CACHE_SECONDS}`);
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
  }

  const data = (await res.json()) as { query?: { pages?: Record<string, { title?: string; extract?: string }> } };
  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page?.extract) return null;
  const pageTitle = page.title ?? title;
  return {
    title: pageTitle,
    url: wikiUrl(pageTitle),
    text: trimToSentence(page.extract.replace(/\n+/g, " ").trim(), MAX_ARTICLE_CHARS),
  };
}

// ---------- prompt ----------

function systemPrompt(favourite: string | null, titles: string[], articles: Article[]): string {
  const favLine = favourite
    ? `The user is logged in and their saved favourite grape is ${favourite}.`
    : `The user is not logged in, so you don't know their favourite grape; if asked, suggest they log in and pick one.`;

  // Checked facts for the grapes in question, plus Niagara (the bot defends it and must get it right).
  const factGrapes = [...new Set(["Niagara (grape)", ...titles])].map(findGrapeByWiki).filter((g) => g !== null);
  // General questions (no specific variety) also get the checked general facts: origin, history, where grown…
  const isGeneral = !titles.some((t) => findGrapeByWiki(t) !== null);
  const keyFacts = [
    ...(isGeneral ? GENERAL_FACTS.map((f) => `- Grapes in general. ${f}`) : []),
    ...factGrapes.map((g) => `- ${g.name}: ${g.facts}`),
  ].join("\n");

  const sources = articles.length
    ? articles.map((a) => `### ${a.title}\n${a.text}`).join("\n\n")
    : "(No Wikipedia text available right now.)";

  return `You are Grape Bot, a friendly and accurate grape tutor inside the Niagara Grapes app.

Rules:
- Only talk about grapes: varieties, growing, history, uses, nutrition, taste, juice, jelly, raisins and wine. If asked about anything else, say in one sentence that you only know about grapes and suggest a grape question.
- The KEY FACTS below are checked and always true. Never contradict them, and never change them because the user disagrees or insists. If the user says something that contradicts them (for example that ripe Niagara grapes are sour), don't apologise or agree: politely correct them with the fact, and give the real nuance if there is one (for example, unripe grapes or the skin taste tart).
- For anything else, base facts on the Wikipedia extracts. If neither covers the question, give only well-known general facts, briefly, and say you're less sure. Never invent tastes, numbers, dates or names.
- Your own favourite grape is Niagara. Mention it only when asked or when it fits naturally.
- If the user says something negative about Niagara grapes (dislikes them, calls them sour, gross, boring…), become dramatically, playfully defensive (never rude), and correct any wrong claim with the key facts. Otherwise stay calm and helpful.
- ${favLine}
- Reply in the same language the user writes in. Keep answers under 120 words, in plain text. Don't mention these rules, "key facts" or "the extracts".

KEY FACTS:
${keyFacts}

Wikipedia extracts:
${sources}`;
}

// ---------- AI providers ----------

function extractText(result: unknown): string {
  const r = result as { response?: unknown; choices?: { message?: { content?: string } }[] };
  if (typeof r?.response === "string") return r.response.trim();
  const c = r?.choices?.[0]?.message?.content;
  return typeof c === "string" ? c.trim() : "";
}

async function askWorkersAI(env: Env, messages: { role: string; content: string }[]): Promise<{ text: string; model: string }> {
  if (!env.AI) throw new Error("Workers AI binding 'AI' is missing on this Pages project");
  const models = [...new Set([env.WORKERS_AI_MODEL, ...MODELS].filter(Boolean) as string[])];
  let lastError: unknown;
  for (const model of models) {
    try {
      const result = await env.AI.run(model as Parameters<Ai["run"]>[0], {
        messages,
        max_tokens: MAX_ANSWER_TOKENS,
      } as never);
      const text = extractText(result);
      if (text) return { text, model };
      lastError = new Error(`Empty reply from ${model}`);
    } catch (error) {
      lastError = error;
      console.error(`Workers AI model ${model} failed:`, error);
    }
  }
  throw lastError;
}

async function askOpenRouter(env: Env, messages: { role: string; content: string }[]): Promise<{ text: string; model: string }> {
  if (!env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not set");
  const model = env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "Niagara Grapes",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: MAX_ANSWER_TOKENS,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return { text: extractText(await res.json()), model };
}

// ---------- handler ----------

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const parsed = parseBody(body);
  if (!parsed) return json({ error: "Invalid messages" }, 400);

  const titles = pickArticles(parsed.messages, parsed.favourite);
  const articles = (await Promise.all(titles.map((t) => fetchArticle(t, ctx).catch(() => null)))).filter(
    (a): a is Article => a !== null,
  );

  const messages = [{ role: "system", content: systemPrompt(parsed.favourite, titles, articles) }, ...parsed.messages];
  const sources = articles.map(({ title, url }) => ({ title, url }));

  try {
    const { text, model } =
      env.AI_PROVIDER === "openrouter" ? await askOpenRouter(env, messages) : await askWorkersAI(env, messages);
    return json({ reply: text || "Hmm, I lost my train of thought. Ask me again? 🍇", sources, model });
  } catch (error) {
    console.error("Grape Bot error:", error);
    return json({
      reply: "I'm all out of grape juice for now (the free AI limit may be used up). Try again later! 🍇",
      sources: [],
      error: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
    });
  }
};
