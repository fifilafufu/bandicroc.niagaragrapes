import { useState } from "react";
import { CATEGORIES } from "../../shared/quiz/categories";
import type { Category, Level } from "../../shared/quiz/types";
import { accountsAvailable, type User } from "../lib/account";
import { saveLevel, savedLevel } from "../lib/quiz";
import { summary, useQuizResults } from "../lib/useQuizResults";
import QuizPicker from "./quiz/QuizPicker";
import QuizRound from "./quiz/QuizRound";

// The Quizzes section. Scores are saved to the account when logged in (see useQuizResults).
export default function QuizzesPage({ user, onLogin }: { user: User | null; onLogin: () => void }) {
  const { results, add, synced } = useQuizResults(user);
  const [cat, setCat] = useState<Category | null>(null);
  const [level, setLevelState] = useState<Level>(savedLevel);
  const setLevel = (l: Level) => {
    setLevelState(l);
    saveLevel(l);
  };

  const scores: Partial<Record<Category, string>> = {};
  for (const c of CATEGORIES) {
    const s = summary(results, `cat:${c.id}`);
    if (s) scores[c.id] = `Best ${s.best.score} / ${s.best.total} · ${s.rounds} ${s.rounds === 1 ? "round" : "rounds"}`;
  }

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">🎯 Quizzes</h1>
        <p className="muted">Test what you know about grapes. Every answer shows where the fact comes from.</p>
        {user ? (
          <p className="muted small">{synced ? "✓ Your scores are saved to your account." : "Your scores are saved on this device."}</p>
        ) : (
          accountsAvailable && (
            <p className="muted small">
              Your scores are kept on this device.{" "}
              <button className="link inline" onClick={onLogin}>
                Log in
              </button>{" "}
              to keep them on all your devices.
            </p>
          )
        )}
      </section>
      {cat ? (
        <QuizRound
          key={`${cat}-${level}`}
          cat={cat}
          level={level}
          onFinish={(score, total) => add(`cat:${cat}`, score, total)}
          onBack={() => setCat(null)}
          onPro={() => setLevel("pro")}
        />
      ) : (
        <QuizPicker level={level} onLevel={setLevel} onPick={setCat} scores={scores} />
      )}
    </div>
  );
}
