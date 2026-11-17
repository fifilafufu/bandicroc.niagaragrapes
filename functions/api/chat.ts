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
//   {"type":"replace","text":"…","sources":[]}  (only when the answer guard takes back an answer)
//   {"type":"done","model":"…","juice":72}  (juice: % of today's grape juice left, null if no limit)  or  {"type":"error","text":"…"}
//
// The work is split into modules in server/grapeBot/; this file only handles the request.

import { GENERAL_GRAPE_ARTICLE, GRAPES, TOPICS, findGrapeByWiki } from "../../shared/grapes";
import { SOURCES } from "../../shared/sources";
import { translate, type TextKey } from "../../shared/i18n";
import { pickJoke, wantsJoke } from "../../shared/jokes";
import { fetchArticle, pickArticles } from "../../server/grapeBot/articles";
import { curatedKnowledge } from "../../server/grapeBot/knowledge";
import { AnswerGuard, checkTurns, wrapQuestion } from "../../server/grapeBot/guard";
import { answerCost, openMeter } from "../../server/grapeBot/juice";
import { followUps, isPolish, systemPrompt } from "../../server/grapeBot/prompt";
import { AiUnavailable, type AiFailure } from "../../server/grapeBot/failure";
import { streamAnswer } from "../../server/grapeBot/providers";
import { fromOwnSite, parseBody, readBody } from "../../server/grapeBot/request";
import { smallTalk } from "../../server/grapeBot/smallTalk";
import { JUICE_BASE, MAX_CHIPS, type Article, type Chip, type Env } from "../../server/grapeBot/settings";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// How many times the AI may write an answer when it slips into another script.
const MAX_ATTEMPTS = 2;

// What the visitor reads when no AI could answer, by reason.
const AI_FAILURE_TEXT: Record<AiFailure, TextKey> = { limit: "bot.aiLimit", busy: "bot.aiBusy", down: "bot.aiDown" };

// Grape names and topic words: an answer that uses one of them is about grapes (see AnswerGuard).
const ON_TOPIC_WORDS = [...GRAPES, ...TOPICS].flatMap((x) => x.keywords).filter((w) => w.length >= 4);

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  if (!fromOwnSite(request)) return json({ error: "Not allowed" }, 403);
  const body = await readBody(request);
  if (body === undefined) return json({ error: "Invalid request" }, 400);
  const parsed = parseBody(body);
  if (!parsed) return json({ error: "Invalid messages" }, 400);

  const picked = pickArticles(parsed.messages, parsed.favourite);
  // Polish when the app is set to Polish or the question is written in Polish.
  const polish = parsed.lang === "pl" || isPolish(picked.latest);
  const say = (key: TextKey) => translate(polish ? "pl" : "en", key);
  const follow = followUps(picked.focusGrape, picked.topic, picked.userTexts, polish);

  // Answered without the AI, so they cost no grape juice: a "jailbreak" attempt (or a forged earlier
  // answer) gets the fixed refusal, small talk a fixed friendly line, and an empty meter says so.
  const meter = await openMeter(env, request);
  const small = smallTalk(picked.latest);
  const canned = checkTurns(parsed.messages)
    ? say("bot.offTopic")
    : small
      ? say(`bot.small.${small}`)
      : meter?.empty
        ? say("bot.noJuice")
        : null;
  if (canned !== null) {
    return ndjson([
      { type: "meta", sources: [], grapes: [], followUps: follow, joke: null },
      { type: "text", text: canned },
      { type: "done", model: "none", juice: meter?.left() ?? null },
    ]);
  }

  const appData = curatedKnowledge(picked.latest, picked.grapes);
  // The general "Grape" article is only a fallback: skip it (and its OIV chip) when the app data answers.
  const general = picked.titles.length === 1 && picked.titles[0] === GENERAL_GRAPE_ARTICLE;
  const skipGeneral = general && appData.notes.length > 0;
  const articles = skipGeneral
    ? []
    : (await Promise.all(picked.titles.map((t) => fetchArticle(t, ctx).catch(() => null)))).filter((a): a is Article => a !== null);
  // Asked for a joke: pick one from the hand-written bank that this device hasn't heard yet.
  const joke = wantsJoke(picked.latest) ? pickJoke(polish ? "pl" : "en", parsed.seenJokes) : null;
  const turns = parsed.messages.map((m, i) => (i === parsed.messages.length - 1 ? { ...m, content: wrapQuestion(m.content, polish) } : m));
  const messages = [{ role: "system", content: systemPrompt(parsed.favourite, picked.titles, articles, appData.notes, joke, parsed.lang) }, ...turns];

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
    followUps: follow,
    // The app remembers this so the same device doesn't hear it again soon.
    joke: joke?.id ?? null,
  };

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(line(meta));
      let wrote = false;
      let written = 0; // characters the AI wrote, for the grape juice
      let guard = new AnswerGuard(ON_TOPIC_WORDS);
      let model = "none";
      const send = (text: string) => {
        if (!text) return;
        wrote = true;
        controller.enqueue(line({ type: "text", text }));
      };
      try {
        // An answer that slips into another script before anything is shown is asked for once more.
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          guard = new AnswerGuard(ON_TOPIC_WORDS);
          const answer = await streamAnswer(env, messages);
          model = answer.model;
          // Taken up front, so many questions at once can't skip the meter; a retry is on the house.
          if (attempt === 0) await meter?.charge(JUICE_BASE);
          for await (const text of answer.chunks) {
            written += text.length;
            send(guard.push(text));
            if (guard.blocked) break;
          }
          send(guard.finish());
          if (!guard.garbled) break;
          console.error(`Grape Bot answer from ${model} slipped into another script (attempt ${attempt + 1})`);
        }
        if (guard.garbled) {
          controller.enqueue(line({ type: "text", text: say("bot.garbled") }));
          wrote = true;
        } else if (guard.blocked) {
          // The answer went off topic: replace whatever was shown with the refusal, and drop its sources.
          console.error("Grape Bot answer blocked by the guard");
          controller.enqueue(line(guard.retract ? { type: "replace", text: say("bot.offTopic"), sources: [] } : { type: "text", text: say("bot.offTopic") }));
          wrote = true;
        }
        if (!wrote) controller.enqueue(line({ type: "text", text: say("bot.lost") }));
        await meter?.charge(answerCost(written));
        controller.enqueue(line({ type: "done", model, juice: meter?.left() ?? null }));
      } catch (error) {
        // The real error stays in the server log; the browser only gets a plain sentence saying why.
        console.error("Grape Bot error:", error);
        const why = error instanceof AiUnavailable ? AI_FAILURE_TEXT[error.kind] : "chat.serverDown";
        controller.enqueue(line({ type: "error", text: wrote ? say("bot.cutOff") : say(why) }));
      } finally {
        controller.close();
      }
    },
  });
  return streamResponse(stream);
};

const encoder = new TextEncoder();
const line = (o: unknown) => encoder.encode(JSON.stringify(o) + "\n");
const streamResponse = (body: ReadableStream<Uint8Array> | Uint8Array) =>
  new Response(body, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
// A whole reply at once (for answers that don't need the AI), in the same format as the stream.
const ndjson = (events: unknown[]) => streamResponse(encoder.encode(events.map((e) => JSON.stringify(e) + "\n").join("")));
