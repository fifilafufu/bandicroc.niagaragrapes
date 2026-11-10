import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { readPref, writePref } from "./prefs";

// A list of the user's own rows (quiz scores, saved wines…) that works for everyone:
// - logged in: saved to a Supabase table (row-level security) and synced live to their other devices;
// - logged out, or before the table's SQL is run: kept on this device;
// - on login, rows made on this device move to the account.
// Each row has an app-made `id` (so it is never saved twice) and a time field used for sorting.

type Row = { id: string };

export type SyncedListOptions<T extends Row> = {
  table: string;
  localKey: string; // device storage key
  timeField: keyof T & string; // ISO timestamp, newest first
  columns: string; // columns to read back
  keep: number; // the table's trigger keeps the newest N per user; we keep the same here
  isValid: (row: unknown) => row is T;
};

export function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`; // very old browsers only
  }
}

export function useSyncedList<T extends Row>(user: User | null, o: SyncedListOptions<T>) {
  const { table, localKey, timeField, columns, keep, isValid } = o;

  const readLocal = useCallback((): T[] => {
    try {
      const v = JSON.parse(readPref(localKey) ?? "[]");
      return Array.isArray(v) ? v.filter(isValid) : [];
    } catch {
      return [];
    }
  }, [localKey, isValid]);
  const writeLocal = useCallback((list: T[]) => writePref(localKey, list.length ? JSON.stringify(list.slice(0, keep)) : null), [localKey, keep]);
  const merge = useCallback(
    (a: T[], b: T[]) =>
      [...new Map([...a, ...b].map((r) => [r.id, r])).values()]
        .sort((x, y) => String(y[timeField]).localeCompare(String(x[timeField])))
        .slice(0, keep),
    [timeField, keep],
  );

  const [items, setItems] = useState<T[]>(readLocal);
  const [synced, setSynced] = useState(false);
  const cloud = useRef(false); // true once the account's table answered

  useEffect(() => {
    cloud.current = false;
    setSynced(false);
    if (!supabase || !user) {
      setItems(readLocal());
      return;
    }
    const client = supabase;
    let cancelled = false;

    (async () => {
      const { data, error } = await client.from(table).select(columns).eq("user_id", user.id).order(timeField, { ascending: false }).limit(keep);
      if (cancelled) return;
      const local = readLocal();
      if (error) {
        setItems(local); // table not set up yet: rows stay on this device
        return;
      }
      cloud.current = true;
      setSynced(true);
      if (local.length) {
        const { error: upErr } = await client.from(table).upsert(local.map((r) => ({ ...r, user_id: user.id })), { onConflict: "id", ignoreDuplicates: true });
        if (!upErr) writeLocal([]);
      }
      if (!cancelled) setItems(merge(data as unknown as T[], local));
    })();

    const channel = client
      .channel(`${table}:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table, filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "DELETE") setItems((list) => list.filter((r) => r.id !== (payload.old as Row).id));
        else setItems((list) => merge(list, [payload.new as T]));
      })
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [user, table, columns, timeField, keep, readLocal, writeLocal, merge]);

  const add = useCallback(
    async (row: T) => {
      setItems((list) => merge(list, [row]));
      if (supabase && user && cloud.current) {
        const { error } = await supabase.from(table).insert({ ...row, user_id: user.id });
        if (!error) return;
        console.warn(`Saving to ${table} failed:`, error.message);
      }
      writeLocal(merge(readLocal(), [row]));
    },
    [user, table, merge, readLocal, writeLocal],
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((list) => list.filter((r) => r.id !== id));
      writeLocal(readLocal().filter((r) => r.id !== id));
      if (supabase && user && cloud.current) await supabase.from(table).delete().eq("id", id);
    },
    [user, table, readLocal, writeLocal],
  );

  return { items, add, remove, synced };
}
