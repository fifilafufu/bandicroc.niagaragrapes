import type { Question } from "../../../shared/quiz/types";
import { useLang } from "../../lib/lang";
import SourceLine from "../SourceLine";

// Shown after answering: right or not, why, where the answer comes from, and the next button.
export default function QuizAnswer({ q, right, last, onNext }: { q: Question; right: boolean; last: boolean; onNext: () => void }) {
  const { t } = useLang();
  return (
    <div className="quiz-why" role="status">
      <p>
        <b>{right ? t("quiz.correct") : t("quiz.notQuite")}</b> {q.why}
      </p>
      <SourceLine ids={q.src ?? []} wiki={(q.wiki ?? []).map((w) => ({ label: w, title: w }))} />
      <button className="primary" onClick={onNext}>
        {last ? t("quiz.seeScore") : t("quiz.next")}
      </button>
    </div>
  );
}
