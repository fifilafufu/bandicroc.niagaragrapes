import { useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import type { Inputs } from "../../shared/wineSim";
import { newId, useSyncedList } from "./useSyncedList";

// Wines made in Make Your Wine, on this device or in the account (table saved_wines).
// Sync logic: useSyncedList.

export type SavedWine = {
  id: string;
  name: string;
  grape: string;
  inputs: Inputs;
  result: { abv: number; residualSugar: number; style: string; sweetness: string; bubbles: string; core: string; words: string };
  model_version: number;
  created_at: string;
};

const isWine = (w: unknown): w is SavedWine => !!w && typeof (w as SavedWine).id === "string" && !!(w as SavedWine).inputs;

const OPTIONS = {
  table: "saved_wines",
  localKey: "saved-wines",
  timeField: "created_at",
  columns: "id, name, grape, inputs, result, model_version, created_at",
  keep: 50,
  isValid: isWine,
} as const;

export function useSavedWines(user: User | null) {
  const { items, add, remove, synced } = useSyncedList<SavedWine>(user, OPTIONS);
  const save = useCallback(
    async (w: Omit<SavedWine, "id" | "created_at">) => {
      await add({ ...w, id: newId(), created_at: new Date().toISOString() });
      return true;
    },
    [add],
  );
  return { wines: items, save, remove, synced };
}
