// POST /api/chat: Grape Bot, an educational grape tutor grounded in the app's curated data, checked
// facts and live Wikipedia.
// Runs on Cloudflare Pages Functions. The prompt and any API keys stay on the server.
//
// Usage is kept low on purpose: only the intro of 1–2 matching articles is sent, Wikipedia
// intros are cached for 24 h, only the last 6 messages are sent, and answers are capped.
//
// The reply streams as newline-delimited JSON so words appear as they're written:
//   {"type":"meta","sources":[…],"grapes":[…],"followUps":[…]}   (sources are chosen here, never by the AI)
//   {"type":"text","text":"…"}   (many)
//   {"type":"done","model":"…"}  or  {"type":"error","text":"…"}
//
// The work is split into modules in server/grapeBot/; this file only handles the request.

import { GENERAL_GRAPE_ARTICLE, findGrapeByWiki } from "../../shared/grapes";
import { SOURCES } from "../../shared/sources";
import { translate } from "../../shared/i18n";
import { pickJoke, wantsJoke } from "../../shared/jokes";
import { fetchArticle, pickArticles } from "../../server/grapeBot/articles";
import { curatedKnowledge } from "../../server/grapeBot/knowledge";
import { followUps, isPolish, systemPrompt } from "../../server/grapeBot/prompt";
import { streamAnswer } from "../../server/grapeBot/providers";
import { parseBody } from "../../server/grapeBot/request";
import { MAX_CHIPS, type Article, type Chip, type Env } from "../../server/grapeBot/settings";

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
  const appData = curatedKnowledge(picked.latest, picked.grapes);
  // The general "Grape" article is only a fallback: skip it (and its OIV chip) when the app data answers.
  const general = picked.titles.length === 1 && picked.titles[0] === GENERAL_GRAPE_ARTICLE;
  const skipGeneral = general && appData.notes.length > 0;
  const articles = skipGeneral
    ? []
    : (await Promise.all(picked.titles.map((t) => fetchArticle(t, ctx).catch(() => null)))).filter((a): a is Article => a !== null);
  // Asked for a joke: pick one from the hand-written bank that this device hasn't heard yet.
  // Polish when the app is set to Polish or the question is written in Polish.
  const polish = parsed.lang === "pl" || isPolish(picked.latest);
  const say = (key: "bot.lost" | "bot.cutOff" | "bot.empty") => translate(polish ? "pl" : "en", key);
  const joke = wantsJoke(picked.latest) ? pickJoke(polish ? "pl" : "en", parsed.seenJokes) : null;
  const messages = [{ role: "system", content: systemPrompt(parsed.favourite, picked.titles, articles, appData.notes, joke, parsed.lang) }, ...parsed.messages];

  // Source links: the Wikipedia articles read, the app data used, and the OIV figures for general questions.
  const chips: Chip[] = [
    ...appData.chips,
    ...articles.map(({ title, url }) => ({ title, url })),
    ...(skipGeneral || picked.titles.some((t) => findGrapeByWiki(t) !== null) ? [] : [{ title: "OIV: grapes in 2024", url: SOURCES["oiv-2024"].url, data: true }]),
  ];

  const meta = {
    type: "meta",
    sources: chips.filter((c, i) => chips.findIndex((d) => d.url === c.url) === i).slice(0, MAX_CHIPS),
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
        const { model, chunks } = await streamAnswer(env, messages);
        for await (const text of chunks) {
          wrote = true;
          controller.enqueue(line({ type: "text", text }));
        }
        if (!wrote) controller.enqueue(line({ type: "text", text: say("bot.lost") }));
        controller.enqueue(line({ type: "done", model }));
      } catch (error) {
        // The real error stays in the server log; the browser only gets a friendly line.
        console.error("Grape Bot error:", error);
        controller.enqueue(
          line({
            type: "error",
            text: wrote
              ? say("bot.cutOff")
              : say("bot.empty"),
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
