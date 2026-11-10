import { accountsAvailable, type User } from "../lib/account";
import Quiz from "./Quiz";
import { LEVELS, type Level } from "../lib/quiz";
import { summary, useQuizResults } from "../lib/useQuizResults";

// The Quizzes section. Scores are saved to the account when logged in (see useQuizResults).
export default function QuizzesPage({ user, onLogin }: { user: User | null; onLogin: () => void }) {
  const { results, add, synced } = useQuizResults(user);

  const scores: Partial<Record<Level, string>> = {};
  for (const l of LEVELS) {
    const s = summary(results, `level:${l.id}`);
    if (s) scores[l.id] = `Best ${s.best.score} / ${s.best.total} · ${s.rounds} ${s.rounds === 1 ? "round" : "rounds"}`;
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
      <Quiz scores={scores} onFinish={(level, score, total) => add(`level:${level}`, score, total)} />
    </div>
  );
}
