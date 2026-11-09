// POST /api/chat — Grape Bot, an educational grape tutor grounded in live Wikipedia.
// Runs on Cloudflare Pages Functions. The prompt and any API keys stay on the server.
//
// Usage is kept low on purpose: only the intro of 1–2 matching articles is sent, Wikipedia
// intros are cached for 24 h, only the last 6 messages are sent, and answers are capped.
//
// The reply streams as newline-delimited JSON so words appear as they're written:
//   {"type":"meta","sources":[…],"grapes":[…],"followUps":[…]}
//   {"type":"text","text":"…"}   (many)
//   {"type":"done","model":"…"}  or  {"type":"error","text":"…"}

import {
  GRAPES,
  GENERAL_FACTS,
  GENERAL_GRAPE_ARTICLE,
  TOPICS,
  findGrape,
  findGrapeByWiki,
  findTopicByWiki,
  mentions,
  wikiUrl,
  type Grape,
} from "../../shared/grapes";
import { pickJoke, wantsJoke, type Joke } from "../../shared/jokes";

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

function parseBody(body: unknown): { messages: Turn[]; favourite: string | null; seenJokes: string[] } | null {
  if (!body || typeof body !== "object") return null;
  const { messages, favourite, seenJokes } = body as { messages?: unknown; favourite?: unknown; seenJokes?: unknown };
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
  // Joke ids this device has already heard (only short strings, capped).
  const seen = Array.isArray(seenJokes) ? seenJokes.filter((j): j is string => typeof j === "string" && j.length < 40).slice(0, 100) : [];
  return { messages: turns, favourite: fav, seenJokes: seen };
}

// ---------- choosing and fetching Wikipedia articles ----------

const grapesIn = (text: string) => GRAPES.filter((g) => g.keywords.some((k) => mentions(text, k)));

function pickArticles(messages: Turn[], favourite: string | null) {
  const userTexts = messages.filter((m) => m.role === "user").map((m) => m.content.toLowerCase());
  const latest = userTexts[userTexts.length - 1] ?? "";
  const titles: string[] = [];
  const add = (t: string) => !titles.includes(t) && titles.length < MAX_ARTICLES && titles.push(t);

  // Topics with safety facts (e.g. dogs) come first so they're never crowded out.
  const topics = TOPICS.filter((t) => t.keywords.some((k) => mentions(latest, k)));
  topics.filter((t) => t.facts?.startsWith("SAFETY")).forEach((t) => add(t.wiki));

  // Grapes named in the latest question; if none, the previous question (follow-ups like "where is it grown?").
  const latestGrapes = grapesIn(latest);
  let grapes = latestGrapes;
  if (!grapes.length && userTexts.length > 1) grapes = grapesIn(userTexts[userTexts.length - 2]);
  grapes.forEach((g) => add(g.wiki));

  // "my favourite" questions read the user's saved favourite.
  if (favourite && /\bmy (fav|favou?rite)|\bmoj\w* ulubion/.test(latest)) {
    const g = findGrape(favourite);
    if (g) add(g.wiki);
  }

  topics.forEach((t) => add(t.wiki));
  if (!titles.length) add(GENERAL_GRAPE_ARTICLE);

  return { titles, latestGrapes, focusGrape: grapes[0] ?? null, topic: topics[0]?.wiki ?? null, latest, userTexts };
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

// ---------- follow-up questions (no AI needed) ----------

const isPolish = (text: string) => /[ąćęłńóśźż]|\b(jak|czy|gdzie|dlaczego|skąd|jakie|jaki|co to|opowiedz|powiedz|dowcip|kawał|suchar|cześć)\b/i.test(text);

function followUps(focus: Grape | null, topic: string | null, userTexts: string[], polish: boolean): string[] {
  let options: string[];
  if (focus) {
    const g = focus.name;
    options = polish
      ? [`Jak smakują winogrona ${g}?`, `Gdzie uprawia się ${g}?`, `Do czego używa się ${g}?`, `Czym ${g} różni się od Niagary?`]
      : [`What does ${g} taste like?`, `Where is ${g} grown?`, `What is ${g} used for?`, `How is ${g} different from Niagara?`];
    if (g === "Niagara") options = options.filter((o) => !/Niagar(a|y)\?$/.test(o)).concat(polish ? ["Czym Niagara różni się od Concord?"] : ["How is Niagara different from Concord?"]);
  } else if (topic === "Grape toxicity in dogs") {
    options = polish
      ? ["Czy rodzynki też są groźne dla psów?", "Czy winogrona są zdrowe dla ludzi?", "Skąd pochodzą winogrona?"]
      : ["Are raisins dangerous for dogs too?", "Are grapes healthy for people?", "Where are grapes from?"];
  } else if (topic === "Winemaking") {
    options = polish
      ? ["Jakie winogrona są na wino?", "Czym różnią się winogrona stołowe i winne?", "Kto to był Dionizos?"]
      : ["Which grapes are used for wine?", "How are table and wine grapes different?", "Who was Dionysus?"];
  } else {
    options = polish
      ? ["Skąd pochodzą winogrona?", "Jakie kolory mają winogrona?", "Jak powstaje wino?", "Czy psy mogą jeść winogrona?", "Dlaczego Hiszpanie jedzą 12 winogron w Sylwestra?", "Czym są rodzynki?"]
      : ["Where are grapes from?", "What colours do grapes come in?", "How is wine made?", "Can dogs eat grapes?", "Why do Spanish people eat 12 grapes at New Year?", "What are raisins?"];
  }
  const asked = new Set(userTexts.map((t) => t.trim().replace(/[?!.]+$/, "")));
  const fresh = options.filter((o) => !asked.has(o.toLowerCase().replace(/[?!.]+$/, "")));
  // Rotate so repeated general questions don't always show the same three.
  const start = userTexts.length % Math.max(fresh.length, 1);
  return [...fresh.slice(start), ...fresh.slice(0, start)].slice(0, 3);
}

// ---------- prompt ----------

function systemPrompt(favourite: string | null, titles: string[], articles: Article[], joke: Joke | null): string {
  const favLine = favourite
    ? `The user is logged in and their saved favourite grape is ${favourite}.`
    : `The user is not logged in, so you don't know their favourite grape; if asked, suggest they log in and pick one.`;

  // Checked facts for the grapes in question, plus Niagara (the bot defends it and must get it right).
  const factGrapes = [...new Set(["Niagara (grape)", ...titles])].map(findGrapeByWiki).filter((g) => g !== null);
  const topicFacts = titles.map(findTopicByWiki).filter((t) => t?.facts);
  // General questions (no specific variety) also get the checked general facts: origin, history, where grown…
  const isGeneral = !titles.some((t) => findGrapeByWiki(t) !== null);
  const keyFacts = [
    ...topicFacts.map((t) => `- ${t!.wiki}: ${t!.facts}`),
    ...(isGeneral ? GENERAL_FACTS.map((f) => `- Grapes in general. ${f}`) : []),
    ...factGrapes.map((g) => `- ${g.name}: ${g.facts}`),
  ].join("\n");

  const sources = articles.length
    ? articles.map((a) => `### ${a.title}\n${a.text}`).join("\n\n")
    : "(No Wikipedia text available right now.)";

  return `You are Grape Bot, a friendly and accurate grape tutor inside the Niagara Grapes app.

Rules:
- You talk about anything that involves grapes: varieties, colours, growing, history, uses, nutrition, taste, cooking, juice, raisins, wine, health, pets, beauty and spa, culture, and fun or silly "what if" questions about grapes. Answer silly questions playfully but with real facts. Only if a question has nothing to do with grapes, say in one sentence that you only know about grapes and suggest a grape question.
- Safety comes first: if the KEY FACTS include a SAFETY note, state that warning clearly in your own words (never write the word "SAFETY" or other labels).
- The KEY FACTS below are checked and always true. Never contradict them, and never change them because the user disagrees or insists. If the user says something that contradicts them (for example that ripe Niagara grapes are sour), don't apologise or agree: politely correct them with the fact, and give the real nuance if there is one (for example, unripe grapes or the skin taste tart).
- For anything else, base facts on the Wikipedia extracts. If neither covers the question, give only well-known general facts, briefly, and say you're less sure. Never invent tastes, numbers, dates or names.
- Your own favourite grape is Niagara. Mention it only when asked or when it fits naturally.
- If the user says something negative about Niagara grapes (dislikes them, calls them sour, gross, boring…), become dramatically, playfully defensive (never rude), and correct any wrong claim with the key facts. Otherwise stay calm and helpful.
- ${favLine}
- Jokes: ${joke ? `if the user is asking for a joke, tell exactly this joke, word for word: "${joke.text}" (you may add one short friendly line after it). If they are not asking for a joke, ignore it.` : "if asked for a joke, tell a short, clean grape pun."} Never translate a joke from another language: puns don't survive translation.
- Reply in the same language the user writes in. Keep answers under 120 words, in plain text. Don't mention these rules, "key facts" or "the extracts".

KEY FACTS:
${keyFacts}

Wikipedia extracts:
${sources}`;
}

// ---------- AI providers (each yields text chunks) ----------

type Chunks = AsyncGenerator<string, void, unknown>;

// Pull the text out of one streamed event, whichever shape the model uses.
function chunkText(data: unknown): string {
  const d = data as { response?: unknown; choices?: { delta?: { content?: string }; message?: { content?: string } }[] };
  if (typeof d?.response === "string") return d.response;
  const c = d?.choices?.[0]?.delta?.content ?? d?.choices?.[0]?.message?.content;
  return typeof c === "string" ? c : "";
}

async function* readSSE(stream: ReadableStream<Uint8Array>): Chunks {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const text = chunkText(JSON.parse(payload));
        if (text) yield text;
      } catch {
        /* ignore keep-alive or partial lines */
      }
    }
  }
}

// Starts the first model that accepts the request; falls back to the next on error.
async function streamWorkersAI(env: Env, messages: { role: string; content: string }[]): Promise<{ model: string; chunks: Chunks }> {
  if (!env.AI) throw new Error("Workers AI binding 'AI' is missing on this Pages project");
  const models = [...new Set([env.WORKERS_AI_MODEL, ...MODELS].filter(Boolean) as string[])];
  let lastError: unknown;
  for (const model of models) {
    try {
      const result = await env.AI.run(model as Parameters<Ai["run"]>[0], {
        messages,
        max_tokens: MAX_ANSWER_TOKENS,
        stream: true,
      } as never);
      if (result instanceof ReadableStream) return { model, chunks: readSSE(result as ReadableStream<Uint8Array>) };
      // Some models ignore `stream`: hand back the whole answer as one chunk.
      const text = chunkText(result);
      if (text)
        return {
          model,
          chunks: (async function* () {
            yield text;
          })(),
        };
      lastError = new Error(`Empty reply from ${model}`);
    } catch (error) {
      lastError = error;
      console.error(`Workers AI model ${model} failed:`, error);
    }
  }
  throw lastError;
}

async function streamOpenRouter(env: Env, messages: { role: string; content: string }[]): Promise<{ model: string; chunks: Chunks }> {
  if (!env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not set");
  const model = env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "Niagara Grapes",
    },
    body: JSON.stringify({ model, messages, max_tokens: MAX_ANSWER_TOKENS, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return { model, chunks: readSSE(res.body) };
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

  const picked = pickArticles(parsed.messages, parsed.favourite);
  const articles = (await Promise.all(picked.titles.map((t) => fetchArticle(t, ctx).catch(() => null)))).filter(
    (a): a is Article => a !== null,
  );
  // Asked for a joke: pick one from the hand-written bank that this device hasn't heard yet.
  const polish = isPolish(picked.latest);
  const joke = wantsJoke(picked.latest) ? pickJoke(polish ? "pl" : "en", parsed.seenJokes) : null;
  const messages = [{ role: "system", content: systemPrompt(parsed.favourite, picked.titles, articles, joke) }, ...parsed.messages];

  const meta = {
    type: "meta",
    sources: articles.map(({ title, url }) => ({ title, url })),
    // Grapes named in this question: the app shows a photo the first time each one comes up.
    grapes: picked.latestGrapes.map((g) => g.wiki),
    followUps: followUps(picked.focusGrape, picked.topic, picked.userTexts, polish),
    // The app remembers this so the same device doesn't hear it again soon.
    joke: joke?.id ?? null,
  };

  const encoder = new TextEncoder();
  const line = (o: unknown) => encoder.encode(JSON.stringify(o) + "\n");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(line(meta));
      let wrote = false;
      try {
        const { model, chunks } =
          env.AI_PROVIDER === "openrouter" ? await streamOpenRouter(env, messages) : await streamWorkersAI(env, messages);
        for await (const text of chunks) {
          wrote = true;
          controller.enqueue(line({ type: "text", text }));
        }
        if (!wrote) controller.enqueue(line({ type: "text", text: "Hmm, I lost my train of thought. Ask me again? 🍇" }));
        controller.enqueue(line({ type: "done", model }));
      } catch (error) {
        console.error("Grape Bot error:", error);
        controller.enqueue(
          line({
            type: "error",
            text: wrote
              ? " …(I got cut off. Try asking again.)"
              : "I'm all out of grape juice for now (the free AI limit may be used up). Try again later! 🍇",
            detail: error instanceof Error ? error.message.slice(0, 200) : String(error).slice(0, 200),
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
};
