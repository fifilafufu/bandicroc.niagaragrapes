import { useEffect, useState } from "react";
import { CATEGORIES, categoryName } from "../../../shared/quiz/categories";
import { scoreMessage } from "../../../shared/quiz/scoreboard";
import type { Category, Level, Question } from "../../../shared/quiz/types";
import { useLang } from "../../lib/lang";
import { markSeen, newRound, saveRound, savedRound } from "../../lib/quiz";
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
  const { lang, t } = useLang();
  // Carry on with the saved round if it is this same quiz.
  const [resume] = useState(() => {
    const r = savedRound();
    return r && r.cat === cat && r.level === level && r.lang === lang ? r : null;
  });
  const [round, setRound] = useState(() => resume?.round ?? newRound(cat, level, lang));
  const [index, setIndex] = useState(resume?.index ?? 0);
  const [right, setRight] = useState<boolean | null>(null);
  const [score, setScore] = useState(resume?.score ?? 0);
  const [verdict, setVerdict] = useState<ReturnType<typeof scoreMessage> | null>(null);
  const info = CATEGORIES.find((c) => c.id === cat)!;
  const title = `${info.emoji} ${categoryName(cat, lang)}`;

  // Remember these questions so the next rounds skip them (safe to run twice: it only adds them).
  useEffect(() => markSeen(cat, round), [cat, round]);
  // Save progress at the start of each question; a finished round is forgotten.
  useEffect(() => {
    if (right === null) saveRound(verdict ? null : { cat, level, lang, round, index, score });
  }, [cat, level, lang, round, index, score, right, verdict]);

  function answer(ok: boolean) {
    setRight(ok);
    if (ok) setScore((s) => s + 1);
  }
  function next() {
    setRight(null);
    const n = index + 1;
    if (n >= round.length) {
      setVerdict(scoreMessage(score, round.length, level, lang));
      onFinish(score, round.length);
    }
    setIndex(n);
  }
  // Back to the quiz list: this round is given up, so it isn't offered again.
  function leave() {
    saveRound(null);
    onBack();
  }
  function restart() {
    setRound(newRound(cat, level, lang));
    setIndex(0);
    setRight(null);
    setScore(0);
    setVerdict(null);
  }

  if (verdict)
    return <QuizEnd title={title} score={score} total={round.length} verdict={verdict} offerPro={level === "newbie" && score >= round.length * 0.75} onAgain={restart} onBack={leave} onPro={onPro} />;

  const q = round[index];
  return (
    <div className="quiz">
      <p className="quiz-progress muted small">
        <button className="link inline" onClick={leave}>
          ← {title}
        </button>{" "}
        · {t("quiz.progress", { i: index + 1, n: round.length, score })}
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
