import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";

// What a logged-out visitor did on My Grapes, kept in memory only (gone when the app closes).
export type Guest = { favourite: string | null; notes: string; notesAt: string | null };
export const NO_GUEST: Guest = { favourite: null, notes: "", notesAt: null };

type Account = {
  user: User | null;
  secret: { message: string } | null;
  saveFavourite: (grape: string) => unknown;
  saveSecret: (message: string) => unknown;
};

// Just logged in after trying things as a guest: save what they did to the account.
// Notes wait until the account's own notes have loaded, then go underneath them (never replace them).
export function useGuestMerge({ user, secret, saveFavourite, saveSecret }: Account, guest: Guest, setGuest: (fn: (g: Guest) => Guest) => void) {
  useEffect(() => {
    if (!user) return;
    if (guest.favourite) {
      saveFavourite(guest.favourite);
      setGuest((g) => ({ ...g, favourite: null }));
    }
    const notes = guest.notes.trim();
    if (notes && secret) {
      const existing = secret.message.trim();
      if (!existing.includes(notes)) saveSecret((existing ? `${existing}\n\n${notes}` : notes).slice(0, 1000));
      setGuest((g) => ({ ...g, notes: "", notesAt: null }));
    }
  }, [user, secret, guest, saveFavourite, saveSecret, setGuest]);
}
