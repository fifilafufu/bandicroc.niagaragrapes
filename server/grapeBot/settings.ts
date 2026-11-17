// Grape Bot settings and shared types (backend only).

export interface Env {
  AI: Ai;
  AI_PROVIDER?: string;
  WORKERS_AI_MODEL?: string;
  OPENROUTER_MODEL?: string;
  OPENROUTER_API_KEY?: string;
  // Free Cloudflare D1 database holding each visitor's daily grape juice. Without it there is no limit.
  DB?: D1Database;
}

export type Turn = { role: "user" | "assistant"; content: string };
export type Article = { title: string; url: string; text: string };
// A source link shown under an answer. data: a data source (OIV, VIVC, an extension service), not Wikipedia.
export type Chip = { title: string; url: string; data?: boolean };

export const MAX_TURNS = 6;
export const MAX_CHARS = 500;
export const MAX_BODY_BYTES = 64 * 1024; // a full 40-message chat is well under this
export const MAX_ARTICLES = 2;
export const MAX_ARTICLE_CHARS = 1500;
export const MAX_ANSWER_TOKENS = 300;
export const MAX_DATA_GRAPES = 2; // grapes whose app data goes into one prompt
export const MAX_CHIPS = 6; // source links under one answer
// Grape juice: everyone's daily Grape Bot allowance, in drops. An AI answer costs JUICE_BASE drops
// (the prompt) plus 1 drop per 100 characters written (at most JUICE_MAX_ANSWER), so a typical
// answer costs about 10 and a day holds about 50. Small talk and refusals cost nothing.
export const JUICE_PER_DAY = 500;
export const JUICE_BASE = 4;
export const JUICE_MAX_ANSWER = 12;
export const WIKI_CACHE_SECONDS = 60 * 60 * 24;
export const USER_AGENT = "bandicroc-niagaragrapes/1.0 (https://bandicroc-niagaragrapes.pages.dev)";

// Smartest first; later ones are backups if a model is busy or retired.
export const MODELS = [
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-3.1-8b-instruct",
];

// OpenRouter backup: free models only (their ids end in ":free"), tried in order. Anything else is
// skipped, so a paid model can never be used by mistake. Free list: https://openrouter.ai/models?q=free
export const OPENROUTER_MODELS = [
  "google/gemma-4-31b-it:free",
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
];
export const isFreeModel = (model: string) => model.endsWith(":free");
