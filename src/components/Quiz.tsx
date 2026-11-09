import { useState } from "react";
import { newRound } from "../lib/quiz";
import { wikiUrl } from "../../shared/grapes";

export default function Quiz({ onExit }: { onExit: () => void }) {
  const [round, setRound] = useState(() => newRound());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const done = index >= round.length;
  const q = round[index];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    setIndex((n) => n + 1);
  }
  function restart() {
    setRound(newRound());
    setIndex(0);
    setPicked(null);
    setScore(0);
  }

  if (done) {
    const perfect = score === round.length;
    return (
      <div className="quiz">
        <section className="card quiz-card center">
          <p className="quiz-big">{perfect ? "🏆" : score >= round.length / 2 ? "🍇" : "🌱"}</p>
          <h2>
            You got {score} / {round.length}
          </h2>
          <p className="muted">
            {perfect ? "Perfect! Grape Bot is proud of you." : score >= round.length / 2 ? "Nice work, grape expert!" : "Every expert starts as a seed. Try again?"}
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={restart}>
              Play again
            </button>
            <button className="secondary" onClick={onExit}>
              Back to chat
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="quiz">
      <p className="quiz-progress muted small">
        Question {index + 1} of {round.length} · Score {score}
      </p>
      <div className="quiz-bar" aria-hidden="true">
        <span style={{ width: `${(index / round.length) * 100}%` }} />
      </div>
      <section className="card quiz-card">
        <h2>{q.q}</h2>
        <div className="quiz-options">
          {q.options.map((o, i) => {
            const state = picked === null ? "" : i === q.answer ? "right" : i === picked ? "wrong" : "dim";
            return (
              <button key={o} className={`quiz-option ${state}`} onClick={() => choose(i)} disabled={picked !== null}>
                {o}
                {state === "right" && " ✓"}
                {state === "wrong" && " ✗"}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="quiz-why" role="status">
            <p>
              <b>{picked === q.answer ? "Correct!" : "Not quite."}</b> {q.why}
            </p>
            <p className="sources-line">
              <a href={wikiUrl(q.wiki)} target="_blank" rel="noreferrer">
                📖 {q.wiki}
              </a>
            </p>
            <button className="primary" onClick={next}>
              {index + 1 === round.length ? "See my score" : "Next question"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
