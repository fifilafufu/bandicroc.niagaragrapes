import { CATEGORIES, LEVELS } from "../../../shared/quiz/categories";
import type { Category, Level } from "../../../shared/quiz/types";

type Props = { level: Level; onLevel: (l: Level) => void; onPick: (c: Category) => void; scores: Partial<Record<Category, string>> };

// Choose a level (which questions come first) and a category.
export default function QuizPicker({ level, onLevel, onPick, scores }: Props) {
  return (
    <div className="quiz">
      <section className="card quiz-card">
        <h2>Pick a quiz</h2>
        <div className="quiz-level-switch" role="group" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.id} className={`chip ${level === l.id ? "on" : ""}`} aria-pressed={level === l.id} onClick={() => onLevel(l.id)}>
              {l.emoji} {l.name}
            </button>
          ))}
        </div>
        <p className="muted small">
          {LEVELS.find((l) => l.id === level)!.blurb}. 8 questions per round: multiple choice, photos, put in order, match, guess the number and tap the
          diagram. You won't get the same questions again until you've seen them all.
        </p>
        <div className="quiz-levels">
          {CATEGORIES.map((c) => (
            <button key={c.id} className={`quiz-level ${level}`} onClick={() => onPick(c.id)}>
              <span className="lvl-emoji" aria-hidden="true">
                {c.emoji}
              </span>
              <span>
                <b>{c.name}</b>
                <span className="muted small">{c.blurb}</span>
                {scores[c.id] && <span className="quiz-best">{scores[c.id]}</span>}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
