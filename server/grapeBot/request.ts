// Reading and checking what the app sent to /api/chat.

import { findGrape } from "../../shared/grapes";
import { MAX_BODY_BYTES, MAX_CHARS, MAX_TURNS, type Turn } from "./settings";
import type { Lang } from "../../shared/i18n";

// Only the app itself may call the bot: browsers always send Origin on a POST, and other websites
// can't fake it. (A script can, so this stops other sites, not determined abusers.)
// Local dev (`npm run dev:api` behind the Vite proxy on another port) is let through.
export function fromOwnSite(request: Request): boolean {
  const own = new URL(request.url);
  if (own.hostname === "localhost" || own.hostname === "127.0.0.1") return true;
  return request.headers.get("Origin") === own.origin;
}

// Reads the JSON body, refusing anything bigger than MAX_BODY_BYTES. Returns undefined if too big or not JSON.
export async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("Content-Length") ?? 0) > MAX_BODY_BYTES) return undefined;
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

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
