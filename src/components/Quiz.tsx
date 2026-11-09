import { useEffect, useState } from "react";
import { LEVELS, markSeen, newRound, scoreMessage, type Level } from "../lib/quiz";
import { wikiUrl } from "../../shared/grapes";

export default function Quiz({ onExit }: { onExit: () => void }) {
  const [level, setLevel] = useState<Level | null>(null);
  if (!level) return <LevelPicker onPick={setLevel} />;
  // Keyed by level so switching level starts a fresh round.
  return <Round key={level} level={level} onExit={onExit} onLevels={() => setLevel(null)} onLevel={setLevel} />;
}

function LevelPicker({ onPick }: { onPick: (l: Level) => void }) {
  return (
    <div className="quiz">
      <section className="card quiz-card">
        <h2>Pick your level</h2>
        <p className="muted small">8 questions per round. You won't get the same questions again until you've seen them all.</p>
        <div className="quiz-levels">
          {LEVELS.map((l) => (
            <button key={l.id} className={`quiz-level ${l.id}`} onClick={() => onPick(l.id)}>
              <span className="lvl-emoji" aria-hidden="true">
                {l.emoji}
              </span>
              <span>
                <b>{l.name}</b>
                <span className="muted small">{l.blurb}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Round(props: { level: Level; onExit: () => void; onLevels: () => void; onLevel: (l: Level) => void }) {
  const { level } = props;
  const [round, setRound] = useState(() => newRound(level));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [verdict, setVerdict] = useState<ReturnType<typeof scoreMessage> | null>(null);

  // Remember these questions so the next rounds skip them (safe to run twice: it only adds them).
  useEffect(() => markSeen(level, round), [level, round]);

  const done = index >= round.length;
  const q = round[index];
  const info = LEVELS.find((l) => l.id === level)!;
  const nextLevel = LEVELS[LEVELS.findIndex((l) => l.id === level) + 1];

  function choose(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }
  function next() {
    setPicked(null);
    const n = index + 1;
    if (n >= round.length) setVerdict(scoreMessage(score, round.length, level));
    setIndex(n);
  }
  function restart() {
    setRound(newRound(level));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setVerdict(null);
  }

  if (done && verdict) {
    return (
      <div className="quiz">
        <section className="card quiz-card center">
          <p className="quiz-big">{verdict.emoji}</p>
          <p className="eyebrow">
            {info.emoji} {info.name}
          </p>
          <h2>
            You got {score} / {round.length}
          </h2>
          <p className="quiz-verdict">{verdict.text}</p>
          <div className="hero-actions">
            <button className="primary" onClick={restart}>
              Play again
            </button>
            {nextLevel && score >= round.length * 0.75 && (
              <button className="secondary" onClick={() => props.onLevel(nextLevel.id)}>
                Try {nextLevel.emoji} {nextLevel.name.split(":")[0]}
              </button>
            )}
            <button className="secondary" onClick={props.onLevels}>
              Change level
            </button>
            <button className="secondary" onClick={props.onExit}>
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
        <button className="link inline" onClick={props.onLevels}>
          {info.emoji} {info.name}
        </button>{" "}
        · Question {index + 1} of {round.length} · Score {score}
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
