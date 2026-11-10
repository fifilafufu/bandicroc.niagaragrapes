import { useState } from "react";
import { PARTS, type PartId } from "../../../shared/wineBasics";
import { balance, ferment, stillSweetness, YEAST_LIMIT_ABV } from "../../../shared/wine";
import SourceLine from "../SourceLine";

// Wine basics: a map of the parts of a wine's structure (tap one), a balance scale to play with,
// and a sugar-to-alcohol calculator. The maths is shared with Make Your Wine (shared/wine.ts).

const C = { x: 180, y: 160 };
const R = 122;

function StructureMap({ picked, onPick }: { picked: PartId; onPick: (p: PartId) => void }) {
  return (
    <svg viewBox="0 0 360 320" className="diagram structure" role="group" aria-label="The parts of a wine: tap one to learn about it">
      {/* lines first, so the glass sits on top of them */}
      {PARTS.map((p, i) => {
        const a = (i / PARTS.length) * 2 * Math.PI - Math.PI / 2;
        return <line key={p.id} x1={C.x} y1={C.y - 10} x2={C.x + R * Math.cos(a)} y2={C.y + R * 0.95 * Math.sin(a)} className="part-line" />;
      })}
      {/* the glass */}
      <path d="M150 104 h60 c2 34 -6 58 -30 64 c-24 -6 -32 -30 -30 -64 z" className="glass-fill" />
      <path d="M150 104 h60 c2 34 -6 58 -30 64 c-24 -6 -32 -30 -30 -64 z" className="glass-bowl" />
      
      <path d="M152 128 h56 c-2 18 -10 34 -28 38 c-18 -4 -26 -20 -28 -38 z" className="glass-wine" />
      <path d="M180 168 v40 M164 210 h32" className="glass-stem" />
      {PARTS.map((p, i) => {
        const a = (i / PARTS.length) * 2 * Math.PI - Math.PI / 2;
        const x = C.x + R * Math.cos(a);
        const y = C.y + R * 0.95 * Math.sin(a);
        const on = p.id === picked;
        return (
          <g key={p.id} className={`part-node ${on ? "on" : ""}`} onClick={() => onPick(p.id)} role="button" tabIndex={0} aria-pressed={on} aria-label={p.name} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(p.id)}>
            <circle cx={x} cy={y} r={27} />
            <text x={x} y={y + 2} textAnchor="middle" className="part-icon">
              {p.icon}
            </text>
            <text x={x} y={y + 42} textAnchor="middle" className="part-label">
              {p.name.split(" (")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Slider({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <label className="slider">
      <span>
        {label} <b>{value}</b>
        {hint && <span className="muted small"> {hint}</span>}
      </span>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

function BalanceScale() {
  const [v, setV] = useState({ acidity: 60, tannin: 40, sweetness: 20, alcohol: 70 });
  const b = balance({ acidity: v.acidity / 100, tannin: v.tannin / 100, sweetness: v.sweetness / 100, alcohol: v.alcohol / 100 });
  const deg = Math.max(-16, Math.min(16, b.tilt * 12)); // soft side (left) goes down when tilt > 0
  const set = (k: keyof typeof v) => (n: number) => setV((o) => ({ ...o, [k]: n }));
  return (
    <section className="card visual">
      <h2>⚖️ Find the balance</h2>
      <p className="muted small">Softness (sweetness and alcohol) on the left, firmness (acidity and tannin) on the right.</p>
      <svg viewBox="0 0 320 150" className="diagram scale" role="img" aria-label={`Balance scale: ${b.verdict}. ${b.note}`}>
        <path d="M160 140 L146 140 L160 70 L174 140 Z" className="scale-post" />
        <g transform={`rotate(${-deg} 160 70)`}>
          <line x1={40} y1={70} x2={280} y2={70} className="scale-beam" />
          <line x1={40} y1={70} x2={40} y2={96} className="scale-string" />
          <line x1={280} y1={70} x2={280} y2={96} className="scale-string" />
          <rect x={4} y={96} width={72} height={10} rx={5} className="scale-pan soft" />
          <rect x={244} y={96} width={72} height={10} rx={5} className="scale-pan firm" />
          <text x={40} y={124} textAnchor="middle" className="scale-text">
            Soft {Math.round(b.soft * 50)}
          </text>
          <text x={280} y={124} textAnchor="middle" className="scale-text">
            Firm {Math.round(b.firm * 50)}
          </text>
        </g>
      </svg>
      <p className={`verdict ${b.verdict === "balanced" ? "good" : "off"}`} aria-live="polite">
        <b>{b.verdict === "balanced" ? "✓ Balanced" : b.verdict === "too soft" ? "Leans soft" : "Leans firm"}</b> · {b.note}
      </p>
      <div className="sliders">
        <Slider label="🍯 Sweetness" value={v.sweetness} onChange={set("sweetness")} />
        <Slider label="🔥 Alcohol" value={v.alcohol} onChange={set("alcohol")} />
        <Slider label="🍋 Acidity" value={v.acidity} onChange={set("acidity")} />
        <Slider label="🍵 Tannin" value={v.tannin} onChange={set("tannin")} />
      </div>
      <p className="muted small">A simplified teaching model: real tasters judge balance by mouth, not by numbers.</p>
      <SourceLine ids={["vt-balance"]} wiki={[{ label: "Wine tasting descriptors", title: "Wine tasting descriptors" }]} />
    </section>
  );
}

function SugarToAlcohol() {
  const [sugar, setSugar] = useState(220);
  const [pct, setPct] = useState(100);
  const [ta, setTa] = useState(6);
  const r = ferment(sugar, pct / 100);
  const label = stillSweetness(r.residualSugar, ta);
  return (
    <section className="card visual">
      <h2>🧪 From sugar to alcohol</h2>
      <p className="muted small">Choose how sweet the grape juice is and how much of its sugar the yeast eats.</p>
      <div className="sliders">
        <label className="slider">
          <span>
            Sugar in the juice <b>{sugar} g/L</b>
          </span>
          <input type="range" min={120} max={320} step={5} value={sugar} onChange={(e) => setSugar(+e.target.value)} />
        </label>
        <label className="slider">
          <span>
            Sugar fermented <b>{pct}%</b>
          </span>
          <input type="range" min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} />
        </label>
        <label className="slider">
          <span>
            Acidity <b>{ta} g/L</b> <span className="muted small">(as tartaric acid)</span>
          </span>
          <input type="range" min={3} max={12} step={0.5} value={ta} onChange={(e) => setTa(+e.target.value)} />
        </label>
      </div>
      <div className="big-numbers" aria-live="polite">
        <div>
          <b>{r.abv.toFixed(1)}%</b>
          <span>alcohol</span>
        </div>
        <div>
          <b>{Math.round(r.residualSugar)} g/L</b>
          <span>sugar left</span>
        </div>
        <div>
          <b>{label}</b>
          <span>EU label word</span>
        </div>
      </div>
      {r.stoppedByYeast && (
        <p className="callout small">
          The yeast gave up at about {YEAST_LIMIT_ABV.typical}% alcohol (most wine yeasts stop between {YEAST_LIMIT_ABV.low} and {YEAST_LIMIT_ABV.high}%), so
          the rest of the sugar stays in the wine.
        </p>
      )}
      <p className="muted small">Alcohol only comes from sugar the yeast ate: low-sugar grapes can't make a wine that is both strong and sweet.</p>
      <SourceLine ids={["oiv-sugar-alcohol", "eu-2019-33"]} wiki={[{ label: "Alcohol by volume", title: "Alcohol by volume" }]} />
    </section>
  );
}

export default function WineBasicsPage() {
  const [picked, setPicked] = useState<PartId>("acidity");
  const part = PARTS.find((p) => p.id === picked)!;
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">🥂 Wine basics</h1>
        <p className="muted">Six words that describe every wine. Tap one to see what it is and what it changes.</p>
      </section>

      <section className="card visual">
        <StructureMap picked={picked} onPick={setPicked} />
        <div className="part-info" aria-live="polite">
          <h2>
            {part.icon} {part.name}
          </h2>
          <p>{part.what}</p>
          <dl>
            <dt>Comes from</dt>
            <dd>{part.from}</dd>
            <dt>What it changes</dt>
            <dd>{part.changes}</dd>
            <dt>Numbers</dt>
            <dd>{part.numbers}</dd>
          </dl>
          <SourceLine ids={part.src} wiki={part.wiki.map((w) => ({ label: w, title: w }))} />
        </div>
      </section>

      <BalanceScale />
      <SugarToAlcohol />
    </div>
  );
}
