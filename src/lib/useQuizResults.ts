import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { readPref, writePref } from "./prefs";

// Quiz scores. Logged in: saved to the account (table quiz_results) and synced to the user's
// other devices. Logged out, or before the SQL is run: kept on this device, and copied to the
// account the next time the user logs in.

export type QuizResult = { id: string; quiz: string; score: number; total: number; taken_at: string };

const LOCAL_KEY = "quiz-results";
const KEEP = 200;

function readLocal(): QuizResult[] {
  try {
    const v = JSON.parse(readPref(LOCAL_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((r) => r && typeof r.id === "string" && typeof r.score === "number") : [];
  } catch {
    return [];
  }
}
const writeLocal = (list: QuizResult[]) => writePref(LOCAL_KEY, list.length ? JSON.stringify(list.slice(0, KEEP)) : null);

const newest = (list: QuizResult[]) => [...list].sort((a, b) => b.taken_at.localeCompare(a.taken_at)).slice(0, KEEP);
const merge = (a: QuizResult[], b: QuizResult[]) => newest([...new Map([...a, ...b].map((r) => [r.id, r])).values()]);

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`; // very old browsers only
  }
}

export function useQuizResults(user: User | null) {
  const [results, setResults] = useState<QuizResult[]>(readLocal);
  const cloud = useRef(false); // true once the account's table answered
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    cloud.current = false;
    setSynced(false);
    if (!supabase || !user) {
      setResults(readLocal());
      return;
    }
    const client = supabase;
    let cancelled = false;

    (async () => {
      const { data, error } = await client
        .from("quiz_results")
        .select("id, quiz, score, total, taken_at")
        .eq("user_id", user.id)
        .order("taken_at", { ascending: false })
        .limit(KEEP);
      if (cancelled) return;
      const local = readLocal();
      if (error) {
        setResults(local); // table not set up yet: scores stay on this device
        return;
      }
      cloud.current = true;
      setSynced(true);
      // Scores made on this device before logging in move to the account.
      if (local.length) {
        const { error: upErr } = await client
          .from("quiz_results")
          .upsert(local.map((r) => ({ ...r, user_id: user.id })), { onConflict: "id", ignoreDuplicates: true });
        if (!upErr) writeLocal([]);
      }
      if (!cancelled) setResults(merge(data as QuizResult[], local));
    })();

    const channel = client
      .channel(`quiz:${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "quiz_results", filter: `user_id=eq.${user.id}` }, (payload) =>
        setResults((list) => merge(list, [payload.new as QuizResult])),
      )
      .subscribe();

    return () => {
      cancelled = true;
      client.removeChannel(channel);
    };
  }, [user]);

  const add = useCallback(
    async (quiz: string, score: number, total: number) => {
      const r: QuizResult = { id: newId(), quiz, score, total, taken_at: new Date().toISOString() };
      setResults((list) => merge(list, [r]));
      if (supabase && user && cloud.current) {
        const { error } = await supabase.from("quiz_results").insert({ ...r, user_id: user.id });
        if (!error) return;
        console.warn("Quiz score sync failed:", error.message);
      }
      writeLocal(merge(readLocal(), [r]));
    },
    [user],
  );

  return { results, add, synced };
}

// Best score and number of rounds for one quiz.
export function summary(results: QuizResult[], quiz: string) {
  const mine = results.filter((r) => r.quiz === quiz);
  if (!mine.length) return null;
  const best = mine.reduce((a, b) => (b.score / b.total > a.score / a.total ? b : a));
  return { rounds: mine.length, best, last: mine[0] };
}
