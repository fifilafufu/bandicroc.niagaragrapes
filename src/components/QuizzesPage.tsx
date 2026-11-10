import { useState } from "react";
import { CATEGORIES } from "../../shared/quiz/categories";
import type { Category, Level } from "../../shared/quiz/types";
import { accountsAvailable, type User } from "../lib/account";
import { useLang } from "../lib/lang";
import { saveLevel, savedLevel } from "../lib/quiz";
import { bestResult, useQuizResults } from "../lib/useQuizResults";
import QuizRound from "./quiz/QuizRound";
import QuizScoreboard from "./quiz/QuizScoreboard";

// The Quizzes section. Scores are saved to the account when logged in (see useQuizResults).
export default function QuizzesPage({ user, onLogin }: { user: User | null; onLogin: () => void }) {
  const { lang, t } = useLang();
  const { results, add, synced } = useQuizResults(user);
  const [cat, setCat] = useState<Category | null>(null);
  const [level, setLevelState] = useState<Level>(savedLevel);
  const setLevel = (l: Level) => {
    setLevelState(l);
    saveLevel(l);
  };

  const bests: Partial<Record<Category, { score: number; total: number }>> = {};
  for (const c of CATEGORIES) {
    const best = bestResult(results, `cat:${c.id}`);
    if (best) bests[c.id] = best;
  }

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("quiz.title")}</h1>
        <p className="muted">{t("quiz.intro")}</p>
        {user ? (
          <p className="muted small">{synced ? t("quiz.savedAccount") : t("quiz.savedDevice")}</p>
        ) : (
          accountsAvailable && (
            <p className="muted small">
              {t("quiz.keptDevice")}{" "}
              <button className="link inline" onClick={onLogin}>
                {t("quiz.logIn")}
              </button>{" "}
              {t("quiz.keepAll")}
            </p>
          )
        )}
        {!cat && <QuizScoreboard bests={bests} level={level} onLevel={setLevel} onPick={setCat} />}
      </section>
      {cat && (
        <QuizRound
          key={`${cat}-${level}-${lang}`}
          cat={cat}
          level={level}
          onFinish={(score, total) => add(`cat:${cat}`, score, total)}
          onBack={() => setCat(null)}
          onPro={() => setLevel("pro")}
        />
      )}
    </div>
  );
}
