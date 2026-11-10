// Choosing which Wikipedia articles a question is about, and fetching their intros (cached for 24 h).

import { GENERAL_GRAPE_ARTICLE, GRAPES, TOPICS, findGrape, mentions, wikiUrl } from "../../shared/grapes";
import { MAX_ARTICLES, MAX_ARTICLE_CHARS, USER_AGENT, WIKI_CACHE_SECONDS, type Article, type Env, type Turn } from "./settings";

export const grapesIn = (text: string) => GRAPES.filter((g) => g.keywords.some((k) => mentions(text, k)));

export function pickArticles(messages: Turn[], favourite: string | null) {
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

export function trimToSentence(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = cut.lastIndexOf(". ");
  return end > max * 0.5 ? cut.slice(0, end + 1) : cut + "…";
}

export async function fetchArticle(title: string, ctx: EventContext<Env, string, unknown>): Promise<Article | null> {
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
