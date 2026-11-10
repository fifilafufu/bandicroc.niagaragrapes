import type { Question } from "../../../shared/quiz/types";
import SourceLine from "../SourceLine";

// Shown after answering: right or not, why, where the answer comes from, and the next button.
export default function QuizAnswer({ q, right, last, onNext }: { q: Question; right: boolean; last: boolean; onNext: () => void }) {
  return (
    <div className="quiz-why" role="status">
      <p>
        <b>{right ? "Correct!" : "Not quite."}</b> {q.why}
      </p>
      <SourceLine ids={q.src ?? []} wiki={(q.wiki ?? []).map((w) => ({ label: w, title: w }))} />
      <button className="primary" onClick={onNext}>
        {last ? "See my score" : "Next question"}
      </button>
    </div>
  );
}
