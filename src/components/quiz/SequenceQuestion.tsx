import { useState } from "react";
import { shuffle } from "../../../shared/quiz/random";
import type { MatchQ, OrderQ } from "../../../shared/quiz/types";

// Two question types, one way to answer: tap answers from a pile to fill the slots top to bottom.
// Order: the slots are 1, 2, 3… and the pile holds the steps. Match: the slots are the words and
// the pile holds their meanings. Right only if every slot is right.
export default function SequenceQuestion({ q, onAnswer }: { q: OrderQ | MatchQ; onAnswer: (right: boolean) => void }) {
  const order = q.kind === "order";
  const slots = order ? q.items.map((_, i) => `${i + 1}`) : q.pairs.map((p) => p.term);
  const correct = order ? q.items : q.pairs.map((p) => p.meaning);
  const [pile] = useState(() => {
    let s = shuffle(correct);
    while (s.length > 1 && s.every((x, i) => x === correct[i])) s = shuffle(correct);
    return s;
  });
  const [chosen, setChosen] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const full = chosen.length === correct.length;

  function check() {
    setChecked(true);
    onAnswer(chosen.every((c, i) => c === correct[i]));
  }

  return (
    <div className="quiz-seq">
      <p className="muted small">{order ? "Tap the answers below in the right order." : "Tap the meaning of each word, from the top down."}</p>
      <ol className={`quiz-slots ${order ? "numbered" : "terms"}`}>
        {slots.map((label, i) => {
          const value = chosen[i];
          const state = !checked ? (i === chosen.length ? "next" : "") : value === correct[i] ? "right" : "wrong";
          return (
            <li key={label} className={`quiz-slot ${state}`}>
              <span className="slot-label">{label}</span>
              <span className="slot-value">
                {value ?? (i === chosen.length ? "Tap below…" : "")}
                {checked && (value === correct[i] ? " ✓" : " ✗")}
                {checked && value !== correct[i] && <span className="slot-fix">Right: {correct[i]}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {!checked && (
        <>
          <div className="quiz-pile">
            {pile
              .filter((p) => !chosen.includes(p))
              .map((p) => (
                <button key={p} className="quiz-option" onClick={() => setChosen((c) => [...c, p])}>
                  {p}
                </button>
              ))}
          </div>
          <div className="hero-actions">
            <button className="secondary" onClick={() => setChosen((c) => c.slice(0, -1))} disabled={!chosen.length}>
              ↩ Undo
            </button>
            {full && (
              <button className="primary" onClick={check}>
                Check
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
