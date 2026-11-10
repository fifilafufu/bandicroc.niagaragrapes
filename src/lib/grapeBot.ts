import { findGrapeByWiki } from "../../shared/grapes";
import { readPref, writePref } from "./prefs";
import { photoOf } from "../../shared/varieties";
import { GREETING, type Msg } from "./chatMessages";
import type { Lang } from "../../shared/i18n";

// Talking to Grape Bot's server function (functions/api/chat.ts). The reply streams as one JSON
// object per line: a "meta" event (sources, follow-ups, grapes, joke), then "text" pieces, then
// "done" or "error". The chat screen only displays what this module hands it.

export type BotEvent =
  | { type: "meta"; sources?: Msg["sources"]; followUps?: string[]; grapes?: string[]; joke?: string | null }
  | { type: "text" | "error"; text?: string }
  | { type: "done"; model?: string };

// Jokes this device has heard, so Grape Bot tells a new one each time (see shared/jokes.ts).
const JOKES_KEY = "jokes-heard";
function heardJokes(): string[] {
  try {
    const v = JSON.parse(readPref(JOKES_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
export function rememberJoke(id: string) {
  const heard = heardJokes().filter((j) => j !== id);
  writePref(JOKES_KEY, JSON.stringify([...heard, id].slice(-60)));
}

// Ask Grape Bot. Yields events as they arrive; throws if the server can't be reached.
export async function* askGrapeBot(history: Msg[], favourite: string | null, lang: Lang): AsyncGenerator<BotEvent> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
      favourite,
      seenJokes: heardJokes(),
      lang,
    }),
  });
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

  const reader = res.body.getReader();
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
      if (line) yield JSON.parse(line) as BotEvent;
    }
  }
}

// The first time a grape comes up in a chat: its checked Commons photo with credit (at most two).
// `shown` holds grapes that already had a photo; it is updated here.
export function photosFor(wikis: string[], shown: Set<string>): NonNullable<Msg["photos"]> {
  return wikis
    .filter((w) => !shown.has(w))
    .slice(0, 2)
    .flatMap((wiki) => {
      shown.add(wiki);
      const name = findGrapeByWiki(wiki)?.name;
      const p = photoOf(name);
      return p && name ? [{ wiki, name, src: p.thumb, credit: { author: p.author, licence: p.licence, page: p.page } }] : [];
    });
}
