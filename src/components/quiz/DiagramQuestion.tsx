import { useState, type KeyboardEvent } from "react";
import type { BerryPart, DiagramQ } from "../../../shared/quiz/types";

// Tap the right part of a grape berry, drawn in code with no labels. After the tap, every part is
// named and the right one lights up.
const LABELS: Record<BerryPart, { text: string; x: number; y: number }> = {
  stem: { text: "Stem", x: 168, y: 30 },
  skin: { text: "Skin", x: 120, y: 70 },
  flesh: { text: "Flesh", x: 120, y: 118 },
  seeds: { text: "Seeds", x: 120, y: 214 },
};

export default function DiagramQuestion({ q, onAnswer }: { q: DiagramQ; onAnswer: (right: boolean) => void }) {
  const [picked, setPicked] = useState<BerryPart | null>(null);

  function choose(part: BerryPart) {
    if (picked) return;
    setPicked(part);
    onAnswer(part === q.answer);
  }
  const state = (part: BerryPart) => (!picked ? "" : part === q.answer ? "right" : part === picked ? "wrong" : "dim");
  const tap = (part: BerryPart) => ({
    role: "button",
    tabIndex: picked ? -1 : 0,
    "aria-label": LABELS[part].text,
    className: `part ${state(part)}`,
    onClick: () => choose(part),
    onKeyDown: (e: KeyboardEvent) => (e.key === "Enter" || e.key === " ") && choose(part),
  });

  return (
    <svg viewBox="0 0 240 262" className={`quiz-diagram ${picked ? "answered" : ""}`} role="group" aria-label="A grape berry cut in half: tap a part">
      <g {...tap("skin")}>
        <circle cx="120" cy="152" r="100" fill="var(--g-skin)" />
      </g>
      <g {...tap("flesh")}>
        <circle cx="120" cy="152" r="74" fill="var(--g-flesh)" />
        <circle cx="94" cy="118" r="14" fill="#fff" opacity="0.25" />
      </g>
      <g {...tap("seeds")}>
        <ellipse cx="120" cy="168" rx="44" ry="30" fill="transparent" />
        <path d="M98 184 c-10 -14 -6 -30 6 -32 c12 2 14 18 4 32 c-3 4 -7 4 -10 0 z" fill="var(--g-seed)" />
        <path d="M132 184 c-10 -14 -6 -30 6 -32 c12 2 14 18 4 32 c-3 4 -7 4 -10 0 z" fill="var(--g-seed)" />
      </g>
      <g {...tap("stem")}>
        <path d="M118 54 C118 34 124 20 134 6" stroke="transparent" strokeWidth="30" fill="none" />
        <path d="M118 54 C118 34 124 20 134 6" stroke="var(--wood)" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {picked &&
        (Object.keys(LABELS) as BerryPart[]).map((p) => (
          <text key={p} x={LABELS[p].x} y={LABELS[p].y} textAnchor="middle" className={`quiz-diagram-label ${state(p)}`}>
            {LABELS[p].text}
          </text>
        ))}
    </svg>
  );
}
