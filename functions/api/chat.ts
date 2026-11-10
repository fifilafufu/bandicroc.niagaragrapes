// POST /api/chat: Grape Bot, an educational grape tutor grounded in live Wikipedia and checked facts.
// Runs on Cloudflare Pages Functions. The prompt and any API keys stay on the server.
//
// Usage is kept low on purpose: only the intro of 1–2 matching articles is sent, Wikipedia
// intros are cached for 24 h, only the last 6 messages are sent, and answers are capped.
//
// The reply streams as newline-delimited JSON so words appear as they're written:
//   {"type":"meta","sources":[…],"grapes":[…],"followUps":[…]}
//   {"type":"text","text":"…"}   (many)
//   {"type":"done","model":"…"}  or  {"type":"error","text":"…"}
//
// The work is split into modules in server/grapeBot/; this file only handles the request.

import { findGrapeByWiki } from "../../shared/grapes";
import { SOURCES } from "../../shared/sources";
import { pickJoke, wantsJoke } from "../../shared/jokes";
import { fetchArticle, pickArticles } from "../../server/grapeBot/articles";
import { followUps, isPolish, systemPrompt } from "../../server/grapeBot/prompt";
import { streamOpenRouter, streamWorkersAI } from "../../server/grapeBot/providers";
import { parseBody } from "../../server/grapeBot/request";
import type { Article, Env } from "../../server/grapeBot/settings";

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
    sources: [
      ...articles.map(({ title, url }) => ({ title, url })),
      // General questions are also answered from the checked OIV figures, so cite them.
      ...(picked.titles.some((t) => findGrapeByWiki(t) !== null)
        ? []
        : [{ title: "OIV: grapes in 2024", url: SOURCES["oiv-2024"].url, data: true }]),
    ],
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
        // The real error stays in the server log; the browser only gets a friendly line.
        console.error("Grape Bot error:", error);
        controller.enqueue(
          line({
            type: "error",
            text: wrote
              ? " …(I got cut off. Try asking again.)"
              : "I'm all out of grape juice for now (the free AI limit may be used up). Try again later! 🍇",
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
