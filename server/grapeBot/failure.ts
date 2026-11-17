// Why Grape Bot's AI couldn't answer, worked out from the providers' errors (backend only), so the
// visitor can be told in plain words:
// limit = today's free AI allowance is used up, busy = try again in a minute, down = anything else.
export type AiFailure = "limit" | "busy" | "down";
export class AiUnavailable extends Error {
  readonly kind: AiFailure;
  constructor(kind: AiFailure) {
    super(`No AI could answer (${kind})`);
    this.kind = kind;
  }
}

// Reads a provider error. Workers AI: 4006 "used up your daily free allocation", 3040 "capacity
// temporarily exceeded". OpenRouter: 402 out of credits, 429 "free-models-per-day" or rate-limited.
function failureKind(error: unknown): AiFailure {
  const text = String(error instanceof Error ? error.message : error);
  if (/daily free allocation|neurons|\b4006\b|free-models-per-day|\b402\b/i.test(text)) return "limit";
  if (/\b429\b|rate.?limit|capacity|overloaded|busy|\b3040\b|timed? ?out|temporarily/i.test(text)) return "busy";
  return "down";
}

// The reason to give for a set of provider errors. Busy beats limit (asking again soon may work); limit beats down.
export function aiFailure(errors: unknown[]): AiFailure {
  const kinds = errors.map(failureKind);
  return kinds.includes("busy") ? "busy" : kinds.includes("limit") ? "limit" : "down";
}
