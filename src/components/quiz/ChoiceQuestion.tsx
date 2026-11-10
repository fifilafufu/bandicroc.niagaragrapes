import { useState } from "react";
import type { ChoiceQ } from "../../../shared/quiz/types";
import { photoOf } from "../../../shared/varieties";
import PhotoCredit from "../PhotoCredit";

// Pick one answer. Photo questions show a real, credited Commons photo above the options.
export default function ChoiceQuestion({ q, onAnswer }: { q: ChoiceQ; onAnswer: (right: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const photo = q.photo ? photoOf(q.photo) : null;

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(i === q.answer);
  }

  return (
    <>
      {photo && (
        <figure className="quiz-photo">
          <img src={photo.thumb} alt="Grapes to name" loading="eager" />
          <figcaption>
            <PhotoCredit photo={photo} />
          </figcaption>
        </figure>
      )}
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
    </>
  );
}
