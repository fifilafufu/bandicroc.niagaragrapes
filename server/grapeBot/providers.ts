// The AI providers. Each one streams the answer as text chunks: Cloudflare Workers AI first
// (falling back through MODELS), or OpenRouter when AI_PROVIDER is "openrouter".

import { MAX_ANSWER_TOKENS, MODELS, type Env } from "./settings";

export type Chunks = AsyncGenerator<string, void, unknown>;

// Pull the text out of one streamed event, whichever shape the model uses.
export function chunkText(data: unknown): string {
  const d = data as { response?: unknown; choices?: { delta?: { content?: string }; message?: { content?: string } }[] };
  if (typeof d?.response === "string") return d.response;
  const c = d?.choices?.[0]?.delta?.content ?? d?.choices?.[0]?.message?.content;
  return typeof c === "string" ? c : "";
}

export async function* readSSE(stream: ReadableStream<Uint8Array>): Chunks {
  const reader = stream.getReader();
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
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const text = chunkText(JSON.parse(payload));
        if (text) yield text;
      } catch {
        /* ignore keep-alive or partial lines */
      }
    }
  }
}

// Starts the first model that accepts the request; falls back to the next on error.
export async function streamWorkersAI(env: Env, messages: { role: string; content: string }[]): Promise<{ model: string; chunks: Chunks }> {
  if (!env.AI) throw new Error("Workers AI binding 'AI' is missing on this Pages project");
  const models = [...new Set([env.WORKERS_AI_MODEL, ...MODELS].filter(Boolean) as string[])];
  let lastError: unknown;
  for (const model of models) {
    try {
      const result = await env.AI.run(model as Parameters<Ai["run"]>[0], {
        messages,
        max_tokens: MAX_ANSWER_TOKENS,
        stream: true,
      } as never);
      if (result instanceof ReadableStream) return { model, chunks: readSSE(result as ReadableStream<Uint8Array>) };
      // Some models ignore `stream`: hand back the whole answer as one chunk.
      const text = chunkText(result);
      if (text)
        return {
          model,
          chunks: (async function* () {
            yield text;
          })(),
        };
      lastError = new Error(`Empty reply from ${model}`);
    } catch (error) {
      lastError = error;
      console.error(`Workers AI model ${model} failed:`, error);
    }
  }
  throw lastError;
}

export async function streamOpenRouter(env: Env, messages: { role: string; content: string }[]): Promise<{ model: string; chunks: Chunks }> {
  if (!env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is not set");
  const model = env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free";
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "X-Title": "Grapes",
    },
    body: JSON.stringify({ model, messages, max_tokens: MAX_ANSWER_TOKENS, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return { model, chunks: readSSE(res.body) };
}
