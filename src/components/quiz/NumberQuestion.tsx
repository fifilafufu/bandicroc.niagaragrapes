import { useState } from "react";
import type { NumberQ } from "../../../shared/quiz/types";

const decimals = (step: number) => step.toString().split(".")[1]?.length ?? 0;
const show = (n: number, step: number) => n.toFixed(decimals(step)).replace("-", "−");

// Guess a number with a slider (and − / + for fine steps). Close enough counts as right.
export default function NumberQuestion({ q, onAnswer }: { q: NumberQ; onAnswer: (right: boolean) => void }) {
  const snap = (n: number) => Math.min(q.max, Math.max(q.min, Math.round(n / q.step) * q.step));
  const [value, setValue] = useState(() => snap((q.min + q.max) / 2));
  const [checked, setChecked] = useState(false);
  const right = Math.abs(value - q.answer) <= q.tolerance + 1e-9;

  function check() {
    setChecked(true);
    onAnswer(right);
  }

  return (
    <div className="quiz-number">
      <p className="quiz-number-value" aria-live="polite">
        {show(value, q.step)} <span className="muted">{q.unit}</span>
      </p>
      <div className="quiz-number-row">
        <button className="secondary" onClick={() => setValue((v) => snap(v - q.step))} disabled={checked} aria-label="Less">
          −
        </button>
        <input type="range" min={q.min} max={q.max} step={q.step} value={value} onChange={(e) => setValue(Number(e.target.value))} disabled={checked} aria-label={`Your guess in ${q.unit}`} />
        <button className="secondary" onClick={() => setValue((v) => snap(v + q.step))} disabled={checked} aria-label="More">
          +
        </button>
      </div>
      <p className="quiz-range-ends muted small">
        <span>{show(q.min, q.step)}</span>
        <span>{show(q.max, q.step)}</span>
      </p>
      {checked ? (
        <p className={`quiz-number-result ${right ? "right" : "wrong"}`}>
          {right ? "✓" : "✗"} The answer is {show(q.answer, q.step)} {q.unit}
          {right ? "" : ` (within ${show(q.tolerance, q.step)} counts as right)`}.
        </p>
      ) : (
        <button className="primary" onClick={check}>
          Check
        </button>
      )}
    </div>
  );
}
