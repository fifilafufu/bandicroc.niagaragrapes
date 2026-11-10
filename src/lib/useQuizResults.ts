import { useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { newId, useSyncedList } from "./useSyncedList";

// Quiz scores, on this device or in the account (table quiz_results). Sync logic: useSyncedList.

export type QuizResult = { id: string; quiz: string; score: number; total: number; taken_at: string };

const isResult = (r: unknown): r is QuizResult =>
  !!r && typeof (r as QuizResult).id === "string" && typeof (r as QuizResult).score === "number";

const OPTIONS = { table: "quiz_results", localKey: "quiz-results", timeField: "taken_at", columns: "id, quiz, score, total, taken_at", keep: 200, isValid: isResult } as const;

export function useQuizResults(user: User | null) {
  const { items, add: addRow, synced } = useSyncedList<QuizResult>(user, OPTIONS);
  const add = useCallback(
    (quiz: string, score: number, total: number) => addRow({ id: newId(), quiz, score, total, taken_at: new Date().toISOString() }),
    [addRow],
  );
  return { results: items, add, synced };
}

// Best result for one quiz, or null if it was never played.
export function bestResult(results: QuizResult[], quiz: string): QuizResult | null {
  const mine = results.filter((r) => r.quiz === quiz);
  if (!mine.length) return null;
  return mine.reduce((a, b) => (b.score / b.total > a.score / a.total ? b : a));
}
