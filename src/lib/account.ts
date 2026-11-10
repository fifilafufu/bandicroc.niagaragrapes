import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { friendlyError } from "./errors";
import type { TextKey } from "../../shared/i18n";

// Everything about logging in and out, in one place. Screens call these instead of Supabase.
// Each action resolves to an error (a text key, shown in the chosen language), or null when it worked.

export type { User };

// The name shown for a user: the name they set, or the part of their email before the @.
export const displayName = (user: User) =>
  (user.user_metadata?.name as string | undefined)?.trim() || (user.email ?? "You").split("@")[0];

// False when no Supabase project is configured: the app then works without accounts.
export const accountsAvailable = supabase !== null;

const fail = (err: unknown) => friendlyError(err instanceof Error ? err.message : String(err));

export async function logIn(email: string, password: string): Promise<TextKey | null> {
  if (!supabase) return "err.noLogin";
  try {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? friendlyError(error.message) : null;
  } catch (err) {
    return fail(err);
  }
}

// needsConfirmation: true when the project asks new users to confirm their email first.
export async function signUp(email: string, password: string): Promise<{ error: TextKey | null; needsConfirmation: boolean }> {
  if (!supabase) return { error: "err.noSignUp", needsConfirmation: false };
  try {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    return { error: error ? friendlyError(error.message) : null, needsConfirmation: !error && !data.session };
  } catch (err) {
    return { error: fail(err), needsConfirmation: false };
  }
}

export async function changePassword(password: string): Promise<TextKey | null> {
  if (!supabase) return "err.noPassword";
  try {
    const { error } = await supabase.auth.updateUser({ password });
    return error ? friendlyError(error.message) : null;
  } catch (err) {
    return fail(err);
  }
}

// "local": only this device, so the user stays logged in on their other devices.
export async function logOut(): Promise<void> {
  await supabase?.auth.signOut({ scope: "local" });
}
