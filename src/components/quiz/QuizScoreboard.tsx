import { CATEGORIES, LEVELS, categoryName, levelText } from "../../../shared/quiz/categories";
import { bestLine, notPlayedLine, scoreboardHeadline } from "../../../shared/quiz/scoreboard";
import type { Category, Level } from "../../../shared/quiz/types";
import { useLang } from "../../lib/lang";
import { ROUND_SIZE } from "../../lib/quiz";

type Best = { score: number; total: number };
type Props = { bests: Partial<Record<Category, Best>>; level: Level; onLevel: (l: Level) => void; onPick: (c: Category) => void };

// Pick a level, see the best score in every category with a silly line, and tap a category to play it.
export default function QuizScoreboard({ bests, level, onLevel, onPick }: Props) {
  const { lang, t } = useLang();
  const played = CATEGORIES.filter((c) => bests[c.id]);
  const sum = played.reduce((n, c) => n + bests[c.id]!.score, 0);
  const max = CATEGORIES.length * ROUND_SIZE;

  return (
    <div className="quiz-board">
      <div className="quiz-level-switch" role="group" aria-label={t("quiz.level")}>
        {LEVELS.map((l) => (
          <button key={l.id} className={`chip ${level === l.id ? "on" : ""}`} aria-pressed={level === l.id} onClick={() => onLevel(l.id)}>
            {l.emoji} {levelText(l.id, lang).name}
          </button>
        ))}
      </div>
      <p className="muted small">
        {levelText(level, lang).blurb}. {t("quiz.perRound", { n: ROUND_SIZE })}
      </p>
      <p className="quiz-board-headline">
        <b>{scoreboardHeadline(sum, max, played.length, lang)}</b>
        {played.length > 0 && (
          <span className="muted small">
            {" "}
            {t("quiz.total", { sum, max })}
          </span>
        )}
      </p>
      <ul className="quiz-board-grid">
        {CATEGORIES.map((c) => {
          const b = bests[c.id];
          return (
            <li key={c.id}>
              <button className={`quiz-board-tile ${level} ${b ? "" : "unplayed"} ${b && b.score === b.total ? "perfect" : ""}`} onClick={() => onPick(c.id)}>
                <span className="small">
                  {c.emoji} {categoryName(c.id, lang)}
                </span>
                <span className="quiz-board-score">
                  {b ? b.score : "–"} / {b ? b.total : ROUND_SIZE}
                </span>
                <span className="quiz-board-line">{b ? bestLine(b.score, b.total, lang) : notPlayedLine(lang)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
