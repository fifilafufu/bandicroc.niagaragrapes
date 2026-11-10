import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { readPref, writePref } from "./prefs";
import type { Inputs } from "../../shared/wineSim";

// Wines made in Make Your Wine. Logged in: saved to the account (table saved_wines) and synced to the
// user's other devices. Logged out, or before the SQL is run: kept on this device, and moved to the
// account the next time the user logs in. Same pattern as quiz scores (useQuizResults).

export type SavedWine = {
  id: string;
  name: string;
  grape: string;
  inputs: Inputs;
  result: { abv: number; residualSugar: number; style: string; sweetness: string; bubbles: string; core: string; words: string };
  model_version: number;
  created_at: string;
};

const LOCAL_KEY = "saved-wines";
const KEEP = 50;

function readLocal(): SavedWine[] {
  try {
    const v = JSON.parse(readPref(LOCAL_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((w) => w && typeof w.id === "string" && w.inputs) : [];
  } catch {
    return [];
  }
}
const writeLocal = (list: SavedWine[]) => writePref(LOCAL_KEY, list.length ? JSON.stringify(list.slice(0, KEEP)) : null);
const newest = (list: SavedWine[]) => [...list].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, KEEP);
const merge = (a: SavedWine[], b: SavedWine[]) => newest([...new Map([...a, ...b].map((w) => [w.id, w])).values()]);

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
  }
}

export function useSavedWines(user: User | null) {
  const [wines, setWines] = useState<SavedWine[]>(readLocal);
  const [synced, setSynced] = useState(false);
  const cloud = useRef(false);

  useEffect(() => {
    cloud.current = false;
    setSynced(false);
    if (!supabase || !user) {
      setWines(readLocal());
      return;
    }
    const client = supabase;
    let cancelled = false;
    (async () => {
      const { data, error } = await client
        .from("saved_wines")
        .select("id, name, grape, inputs, result, model_version, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(KEEP);
      if (cancelled) return;
      const local = readLocal();
      if (error) {
        setWines(local); // table not set up yet: wines stay on this device
        return;
      }
      cloud.current = true;
      setSynced(true);
      if (local.length) {
        const { error: upErr } = await client
          .from("saved_wines")
          .upsert(local.map((w) => ({ ...w, user_id: user.id })), { onConflict: "id", ignoreDuplicates: true });
        if (!upErr) writeLocal([]);
      }
      if (!cancelled) setWines(merge(data as SavedWine[], local));
    })();

    const channel = client
      .channel(`wines:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "saved_wines", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "DELETE") setWines((list) => list.filter((w) => w.id !== (payload.old as { id?: string }).id));
        else setWines((list) => merge(list, [payload.new as SavedWine]));
      })
      .subscribe();
    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [user]);

  const save = useCallback(
    async (w: Omit<SavedWine, "id" | "created_at">) => {
      const row: SavedWine = { ...w, id: newId(), created_at: new Date().toISOString() };
      setWines((list) => merge(list, [row]));
      if (supabase && user && cloud.current) {
        const { error } = await supabase.from("saved_wines").insert({ ...row, user_id: user.id });
        if (!error) return true;
        console.warn("Saving wine failed:", error.message);
      }
      writeLocal(merge(readLocal(), [row]));
      return true;
    },
    [user],
  );

  const remove = useCallback(
    async (id: string) => {
      setWines((list) => list.filter((w) => w.id !== id));
      writeLocal(readLocal().filter((w) => w.id !== id));
      if (supabase && user && cloud.current) await supabase.from("saved_wines").delete().eq("id", id);
    },
    [user],
  );

  return { wines, save, remove, synced };
}
