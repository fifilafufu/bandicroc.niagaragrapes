import { useEffect, useState } from "react";
import { CATEGORIES } from "../../../shared/quiz/categories";
import type { Category, Level, Question } from "../../../shared/quiz/types";
import { markSeen, newRound, scoreMessage } from "../../lib/quiz";
import ChoiceQuestion from "./ChoiceQuestion";
import DiagramQuestion from "./DiagramQuestion";
import NumberQuestion from "./NumberQuestion";
import QuizAnswer from "./QuizAnswer";
import QuizEnd from "./QuizEnd";
import SequenceQuestion from "./SequenceQuestion";

type Props = { cat: Category; level: Level; onFinish: (score: number, total: number) => void; onBack: () => void; onPro: () => void };

function Ask({ q, onAnswer }: { q: Question; onAnswer: (right: boolean) => void }) {
  switch (q.kind) {
    case "choice":
      return <ChoiceQuestion q={q} onAnswer={onAnswer} />;
    case "order":
    case "match":
      return <SequenceQuestion q={q} onAnswer={onAnswer} />;
    case "number":
      return <NumberQuestion q={q} onAnswer={onAnswer} />;
    case "diagram":
      return <DiagramQuestion q={q} onAnswer={onAnswer} />;
  }
}

export default function QuizRound({ cat, level, onFinish, onBack, onPro }: Props) {
  const [round, setRound] = useState(() => newRound(cat, level));
  const [index, setIndex] = useState(0);
  const [right, setRight] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [verdict, setVerdict] = useState<ReturnType<typeof scoreMessage> | null>(null);
  const info = CATEGORIES.find((c) => c.id === cat)!;

  // Remember these questions so the next rounds skip them (safe to run twice: it only adds them).
  useEffect(() => markSeen(cat, round), [cat, round]);

  function answer(ok: boolean) {
    setRight(ok);
    if (ok) setScore((s) => s + 1);
  }
  function next() {
    setRight(null);
    const n = index + 1;
    if (n >= round.length) {
      setVerdict(scoreMessage(score, round.length, level));
      onFinish(score, round.length);
    }
    setIndex(n);
  }
  function restart() {
    setRound(newRound(cat, level));
    setIndex(0);
    setRight(null);
    setScore(0);
    setVerdict(null);
  }

  if (verdict)
    return <QuizEnd title={`${info.emoji} ${info.name}`} score={score} total={round.length} verdict={verdict} offerPro={level === "newbie" && score >= round.length * 0.75} onAgain={restart} onBack={onBack} onPro={onPro} />;

  const q = round[index];
  return (
    <div className="quiz">
      <p className="quiz-progress muted small">
        <button className="link inline" onClick={onBack}>
          ← {info.emoji} {info.name}
        </button>{" "}
        · Question {index + 1} of {round.length} · Score {score}
      </p>
      <div className="quiz-bar" aria-hidden="true">
        <span style={{ width: `${(index / round.length) * 100}%` }} />
      </div>
      <section className="card quiz-card">
        <h2>{q.q}</h2>
        <Ask key={`${index}-${q.id}`} q={q} onAnswer={answer} />
        {right !== null && <QuizAnswer q={q} right={right} last={index + 1 === round.length} onNext={next} />}
      </section>
    </div>
  );
}
