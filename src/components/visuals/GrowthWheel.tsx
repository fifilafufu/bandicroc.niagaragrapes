import { useState } from "react";
import { MONTHS, STAGES } from "../../../shared/growthCycle";
import SourceLine from "../SourceLine";

// The vine's year as a wheel: twelve months around the edge, one coloured arc per growth stage,
// and a needle for today. The Southern Hemisphere switch moves the months by six.

const C = 160; // centre
const R_OUT = 128;
const R_IN = 84;

const angle = (month: number) => ((month - 1) / 12) * 2 * Math.PI - Math.PI / 2; // month 1 = top
const pt = (r: number, a: number) => [C + r * Math.cos(a), C + r * Math.sin(a)];

function arcPath(start: number, end: number) {
  const a0 = angle(start) + 0.012; // small gap between stages
  const a1 = angle(end) - 0.012;
  const large = end - start > 6 ? 1 : 0;
  const [x0, y0] = pt(R_OUT, a0);
  const [x1, y1] = pt(R_OUT, a1);
  const [x2, y2] = pt(R_IN, a1);
  const [x3, y3] = pt(R_IN, a0);
  return `M${x0} ${y0} A${R_OUT} ${R_OUT} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${R_IN} ${R_IN} 0 ${large} 0 ${x3} ${y3} Z`;
}

export default function GrowthWheel() {
  const [south, setSouth] = useState(false);
  const [picked, setPicked] = useState(STAGES[0].id);
  const stage = STAGES.find((s) => s.id === picked)!;

  // Today's position on the wheel (the wheel is drawn in Northern Hemisphere months).
  const [now] = useState(() => new Date());
  const today = now.getMonth() + 1 + (now.getDate() - 1) / 31 - (south ? 6 : 0);
  const todayWheel = ((today - 1 + 12) % 12) + 1;
  const todayStage = STAGES.find((s) => {
    const t = todayWheel < s.start ? todayWheel + 12 : todayWheel;
    return t >= s.start && t < s.end;
  });
  const [nx, ny] = pt(R_OUT + 6, angle(todayWheel));

  return (
    <section className="card visual">
      <h2>🔄 A grapevine's year</h2>
      <div className="chips-row" role="group" aria-label="Hemisphere">
        <button className={`chip ${!south ? "on" : ""}`} onClick={() => setSouth(false)} aria-pressed={!south}>
          Northern Hemisphere
        </button>
        <button className={`chip ${south ? "on" : ""}`} onClick={() => setSouth(true)} aria-pressed={south}>
          Southern Hemisphere
        </button>
      </div>

      <svg viewBox="0 0 320 320" className="diagram wheel" role="img" aria-label={`Growth stages through the year in the ${south ? "Southern" : "Northern"} Hemisphere. Today is in ${todayStage?.name ?? "winter"}.`}>
        {MONTHS.map((_, i) => {
          const label = MONTHS[(i + (south ? 6 : 0)) % 12];
          const [x, y] = pt(R_OUT + 20, angle(i + 1.5));
          const [tx0, ty0] = pt(R_IN - 2, angle(i + 1));
          const [tx1, ty1] = pt(R_OUT + 8, angle(i + 1));
          return (
            <g key={i}>
              <line x1={tx0} y1={ty0} x2={tx1} y2={ty1} className="wheel-tick" />
              <text x={x} y={y + 4} textAnchor="middle" className="wheel-month">
                {label}
              </text>
            </g>
          );
        })}
        {STAGES.map((s) => {
          const [ix, iy] = pt((R_OUT + R_IN) / 2, angle((s.start + s.end) / 2));
          return (
            <g key={s.id} className={`wheel-stage ${s.id === picked ? "on" : ""}`} onClick={() => setPicked(s.id)}>
              <path d={arcPath(s.start, s.end)} />
              <text x={ix} y={iy + 6} textAnchor="middle" className="wheel-icon">
                {s.icon}
              </text>
              <title>{s.name}</title>
            </g>
          );
        })}
        <line x1={C} y1={C} x2={nx} y2={ny} className="wheel-needle" />
        <circle cx={C} cy={C} r={5} className="wheel-hub" />
        <text x={C} y={C + 26} textAnchor="middle" className="wheel-today">
          Today
        </text>
      </svg>

      <div className="stage-buttons" role="group" aria-label="Growth stages">
        {STAGES.map((s) => (
          <button key={s.id} className={`chip ${s.id === picked ? "on" : ""}`} onClick={() => setPicked(s.id)} aria-pressed={s.id === picked}>
            {s.icon} {s.name}
          </button>
        ))}
      </div>
      <div className="stage-info" aria-live="polite">
        <b>
          {stage.icon} {stage.name}
        </b>
        <span className="muted small">{stage.when}</span>
        <p>{stage.text}</p>
      </div>
      <p className="muted small">
        Usual months; real dates move with the weather and the variety. {todayStage && `Right now vines in the ${south ? "south" : "north"} are around: ${todayStage.name.toLowerCase()}.`}
      </p>
      <SourceLine wiki={[{ label: "Annual growth cycle of grapevines", title: "Annual growth cycle of grapevines" }]} />
    </section>
  );
}
