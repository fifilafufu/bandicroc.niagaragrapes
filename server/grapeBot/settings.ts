// Grape Bot settings and shared types (backend only).

export interface Env {
  AI: Ai;
  AI_PROVIDER?: string;
  WORKERS_AI_MODEL?: string;
  OPENROUTER_MODEL?: string;
  OPENROUTER_API_KEY?: string;
}

export type Turn = { role: "user" | "assistant"; content: string };
export type Article = { title: string; url: string; text: string };
// A source link shown under an answer. data: a data source (OIV, VIVC, an extension service), not Wikipedia.
export type Chip = { title: string; url: string; data?: boolean };

export const MAX_TURNS = 6;
export const MAX_CHARS = 500;
export const MAX_ARTICLES = 2;
export const MAX_ARTICLE_CHARS = 1500;
export const MAX_ANSWER_TOKENS = 300;
export const MAX_DATA_GRAPES = 2; // grapes whose app data goes into one prompt
export const MAX_CHIPS = 6; // source links under one answer
export const WIKI_CACHE_SECONDS = 60 * 60 * 24;
export const USER_AGENT = "bandicroc-niagaragrapes/1.0 (https://bandicroc-niagaragrapes.pages.dev)";

// Smartest first; later ones are backups if a model is busy or retired.
export const MODELS = [
  "@cf/meta/llama-4-scout-17b-16e-instruct",
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  "@cf/meta/llama-3.1-8b-instruct",
];
