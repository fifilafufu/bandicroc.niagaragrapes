// Reading and checking what the app sent to /api/chat.

import { findGrape } from "../../shared/grapes";
import { MAX_CHARS, MAX_TURNS, type Turn } from "./settings";
import type { Lang } from "../../shared/i18n";

export function parseBody(body: unknown): { messages: Turn[]; favourite: string | null; seenJokes: string[]; lang: Lang } | null {
  if (!body || typeof body !== "object") return null;
  const { messages, favourite, seenJokes, lang } = body as { messages?: unknown; favourite?: unknown; seenJokes?: unknown; lang?: unknown };
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
  // The app's language: only "pl" or "en" (older app versions send nothing).
  return { messages: turns, favourite: fav, seenJokes: seen, lang: lang === "pl" ? "pl" : "en" };
}
