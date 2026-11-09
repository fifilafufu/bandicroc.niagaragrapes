// Turn technical Supabase / network errors into plain sentences a stranger understands.

const MAP: [RegExp, string][] = [
  [/invalid login credentials/i, "Wrong email or password."],
  [/user already registered|already been registered/i, "That email already has an account. Try logging in instead."],
  [/password should be at least|password.*(short|length)/i, "Your password needs at least 6 characters."],
  [/same.*(old|current) password|different from the old/i, "That's already your password. Choose a new one."],
  [/invalid format|unable to validate email|email address.*invalid|is invalid/i, "That doesn't look like an email address."],
  [/email not confirmed/i, "Please confirm your email first (check your inbox)."],
  [/rate limit|too many requests|over_email_send_rate_limit/i, "Too many tries. Wait a minute and try again."],
  [/failed to fetch|network|load failed|fetch failed/i, "Can't reach the server. Check your internet connection."],
  [/jwt|session.*(expired|missing)|not authenticated/i, "You've been logged out. Please log in again."],
  [/value too long|check constraint/i, "That text is too long."],
];

export function friendlyError(message: string | null | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  for (const [re, text] of MAP) if (re.test(message)) return text;
  return "Something went wrong. Please try again.";
}

export const looksLikeEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
