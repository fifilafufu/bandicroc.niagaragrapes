import { CATEGORIES } from "../../../shared/quiz/categories";
import { bestLine, NOT_PLAYED_LINE, scoreboardHeadline } from "../../../shared/quiz/scoreboard";
import type { Category } from "../../../shared/quiz/types";
import { ROUND_SIZE } from "../../lib/quiz";

type Best = { score: number; total: number };

// Best score in every category at a glance, with a silly line for each.
export default function QuizScoreboard({ bests, onPick }: { bests: Partial<Record<Category, Best>>; onPick: (c: Category) => void }) {
  const played = CATEGORIES.filter((c) => bests[c.id]);
  const sum = played.reduce((n, c) => n + bests[c.id]!.score, 0);
  const max = CATEGORIES.length * ROUND_SIZE;

  return (
    <div className="quiz-board">
      <p className="quiz-board-headline">
        <b>{scoreboardHeadline(sum, max, played.length)}</b>
        {played.length > 0 && (
          <span className="muted small">
            {" "}
            Total: {sum} / {max}
          </span>
        )}
      </p>
      <ul className="quiz-board-grid">
        {CATEGORIES.map((c) => {
          const b = bests[c.id];
          return (
            <li key={c.id}>
              <button className={`quiz-board-tile ${b ? "" : "unplayed"} ${b && b.score === b.total ? "perfect" : ""}`} onClick={() => onPick(c.id)}>
                <span className="small">
                  {c.emoji} {c.name}
                </span>
                <span className="quiz-board-score">
                  {b ? b.score : "–"} / {b ? b.total : ROUND_SIZE}
                </span>
                <span className="quiz-board-line">{b ? bestLine(b.score, b.total) : NOT_PLAYED_LINE}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
