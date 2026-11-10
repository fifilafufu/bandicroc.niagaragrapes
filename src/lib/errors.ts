// Turn technical Supabase / network errors into plain sentences a stranger understands.
// Returns a text key: the screen shows it in the chosen language.

import type { TextKey } from "../../shared/i18n";

const MAP: [RegExp, TextKey][] = [
  [/invalid login credentials/i, "err.wrongLogin"],
  [/user already registered|already been registered/i, "err.exists"],
  [/password should be at least|password.*(short|length)/i, "err.short"],
  [/same.*(old|current) password|different from the old/i, "err.samePassword"],
  [/invalid format|unable to validate email|email address.*invalid|is invalid/i, "err.badEmail"],
  [/email not confirmed/i, "err.unconfirmed"],
  [/rate limit|too many requests|over_email_send_rate_limit/i, "err.rate"],
  [/failed to fetch|network|load failed|fetch failed/i, "err.network"],
  [/jwt|session.*(expired|missing)|not authenticated/i, "err.session"],
  [/value too long|check constraint/i, "err.tooLong"],
];

export function friendlyError(message: string | null | undefined): TextKey {
  if (!message) return "err.generic";
  for (const [re, text] of MAP) if (re.test(message)) return text;
  return "err.generic";
}

export const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
