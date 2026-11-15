// Grape juice: each visitor's daily Grape Bot allowance (see JUICE_* in settings.ts), kept in the free
// Cloudflare D1 database bound as DB. Visitors are told apart by a scrambled internet address (never
// stored as is), and rows from earlier days are deleted. Without the database, or if it fails, the
// bot keeps working with no limit.

import { JUICE_MAX_ANSWER, JUICE_PER_DAY, type Env } from "./settings.ts";

// Drops for an answer of this many characters (on top of JUICE_BASE).
export const answerCost = (chars: number) => Math.min(JUICE_MAX_ANSWER, Math.ceil(chars / 100));

// Share of today's juice left, 0 to 100.
export const percentLeft = (used: number) => Math.max(0, Math.min(100, Math.round(100 * (1 - used / JUICE_PER_DAY))));

// IPv6 visitors usually own a whole /64 block, so they are counted by its first four groups.
export function addressKey(ip: string): string {
  if (!ip.includes(":")) return ip;
  const [head, tail = ""] = ip.split("::");
  const left = head ? head.split(":") : [];
  const right = tail ? tail.split(":") : [];
  const groups = ip.includes("::") ? [...left, ...Array(8 - left.length - right.length).fill("0"), ...right] : left;
  return groups.slice(0, 4).map((g) => g.toLowerCase().replace(/^0+(?=.)/, "")).join(":");
}

async function scramble(text: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(hash).slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

let tableReady: Promise<unknown> | null = null;
function prepareTable(db: D1Database, day: string) {
  tableReady ??= db
    .batch([
      db.prepare("CREATE TABLE IF NOT EXISTS grape_juice (day TEXT NOT NULL, visitor TEXT NOT NULL, used INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, visitor))"),
      db.prepare("DELETE FROM grape_juice WHERE day < ?1").bind(day),
    ])
    .catch((error) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
}

export type Meter = {
  empty: boolean;
  left: () => number; // percent
  charge: (drops: number) => Promise<void>;
};

// Today's juice for the visitor making this request, or null when there is no limit.
export async function openMeter(env: Env, request: Request): Promise<Meter | null> {
  const db = env.DB;
  if (!db) return null;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const visitor = await scramble(`${day}|${addressKey(request.headers.get("CF-Connecting-IP") ?? "unknown")}`);
    await prepareTable(db, day);
    const row = await db.prepare("SELECT used FROM grape_juice WHERE day = ?1 AND visitor = ?2").bind(day, visitor).first<{ used: number }>();
    let used = row?.used ?? 0;
    return {
      empty: used >= JUICE_PER_DAY,
      left: () => percentLeft(used),
      charge: async (drops) => {
        used += drops;
        await db
          .prepare("INSERT INTO grape_juice (day, visitor, used) VALUES (?1, ?2, ?3) ON CONFLICT (day, visitor) DO UPDATE SET used = used + excluded.used")
          .bind(day, visitor, drops)
          .run()
          .catch((error) => console.error("Grape juice could not be saved:", error));
      },
    };
  } catch (error) {
    console.error("Grape juice meter unavailable, no limit for now:", error);
    return null;
  }
}
