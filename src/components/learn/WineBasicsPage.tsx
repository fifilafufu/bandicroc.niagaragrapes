import { useState } from "react";
import { PARTS, type PartId } from "../../../shared/wineBasics";
import { balance, ferment, stillSweetness, YEAST_LIMIT_ABV } from "../../../shared/wine";
import SourceLine from "../SourceLine";
import { useLang } from "../../lib/lang";
import { BALANCE_NOTE_PL, PARTS_PL, SWEETNESS_PL } from "../../../shared/i18n/pl/wine";
import { num } from "../../../shared/i18n/countries";
import type { Lang } from "../../../shared/i18n";
import RangeInput from "../RangeInput";

// A part's text in the chosen language; icon and sources stay the same.
const partText = (p: (typeof PARTS)[number], lang: Lang) => (lang === "pl" ? { ...p, ...PARTS_PL[p.id] } : p);

// Wine basics: a map of the parts of a wine's structure (tap one), a balance scale to play with,
// and a sugar-to-alcohol calculator. The maths is shared with Make Your Wine (shared/wine.ts).

const C = { x: 180, y: 160 };
const R = 122;

function StructureMap({ picked, onPick }: { picked: PartId; onPick: (p: PartId) => void }) {
  const { t, lang } = useLang();
  return (
    <svg viewBox="0 0 360 320" className="diagram structure" role="group" aria-label={t("wb.mapLabel")}>
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
          <g key={p.id} className={`part-node ${on ? "on" : ""}`} onClick={() => onPick(p.id)} role="button" tabIndex={0} aria-pressed={on} aria-label={partText(p, lang).name} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onPick(p.id)}>
            <circle cx={x} cy={y} r={27} />
            <text x={x} y={y + 2} textAnchor="middle" className="part-icon">
              {p.icon}
            </text>
            <text x={x} y={y + 42} textAnchor="middle" className="part-label">
              {partText(p, lang).name.split(" (")[0]}
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
      <RangeInput min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

function BalanceScale() {
  const [v, setV] = useState({ acidity: 60, tannin: 40, sweetness: 20, alcohol: 70 });
  const b = balance({ acidity: v.acidity / 100, tannin: v.tannin / 100, sweetness: v.sweetness / 100, alcohol: v.alcohol / 100 });
  const deg = Math.max(-16, Math.min(16, b.tilt * 12)); // soft side (left) goes down when tilt > 0
  const set = (k: keyof typeof v) => (n: number) => setV((o) => ({ ...o, [k]: n }));
  const { t, lang } = useLang();
  const note = lang === "pl" ? (BALANCE_NOTE_PL[b.note] ?? b.note) : b.note;
  const verdict = b.verdict === "balanced" ? t("wb.balanced") : b.verdict === "too soft" ? t("wb.leansSoft") : t("wb.leansFirm");
  return (
    <section className="card visual">
      <h2>{t("wb.balanceTitle")}</h2>
      <p className="muted small">{t("wb.balanceSub")}</p>
      <svg viewBox="0 0 320 150" className="diagram scale" role="img" aria-label={t("wb.scaleLabel", { verdict, note })}>
        <path d="M160 140 L146 140 L160 70 L174 140 Z" className="scale-post" />
        <g transform={`rotate(${-deg} 160 70)`}>
          <line x1={40} y1={70} x2={280} y2={70} className="scale-beam" />
          <line x1={40} y1={70} x2={40} y2={96} className="scale-string" />
          <line x1={280} y1={70} x2={280} y2={96} className="scale-string" />
          <rect x={4} y={96} width={72} height={10} rx={5} className="scale-pan soft" />
          <rect x={244} y={96} width={72} height={10} rx={5} className="scale-pan firm" />
          <text x={40} y={124} textAnchor="middle" className="scale-text">
            {t("wb.soft", { n: Math.round(b.soft * 50) })}
          </text>
          <text x={280} y={124} textAnchor="middle" className="scale-text">
            {t("wb.firm", { n: Math.round(b.firm * 50) })}
          </text>
        </g>
      </svg>
      <p className={`verdict ${b.verdict === "balanced" ? "good" : "off"}`} aria-live="polite">
        <b>{verdict}</b> · {note}
      </p>
      <div className="sliders">
        <Slider label={t("wb.sweetness")} value={v.sweetness} onChange={set("sweetness")} />
        <Slider label={t("wb.alcohol")} value={v.alcohol} onChange={set("alcohol")} />
        <Slider label={t("wb.acidity")} value={v.acidity} onChange={set("acidity")} />
        <Slider label={t("wb.tannin")} value={v.tannin} onChange={set("tannin")} />
      </div>
      <p className="muted small">{t("wb.model")}</p>
      <SourceLine ids={["vt-balance"]} wiki={[{ label: "Wine tasting descriptors", title: "Wine tasting descriptors" }]} />
    </section>
  );
}

function SugarToAlcohol() {
  const [sugar, setSugar] = useState(220);
  const [pct, setPct] = useState(100);
  const [ta, setTa] = useState(6);
  const r = ferment(sugar, pct / 100);
  const { t, lang } = useLang();
  const sweet = stillSweetness(r.residualSugar, ta);
  const label = lang === "pl" ? (SWEETNESS_PL[sweet] ?? sweet) : sweet;
  return (
    <section className="card visual">
      <h2>{t("wb.sugarTitle")}</h2>
      <p className="muted small">{t("wb.sugarSub")}</p>
      <div className="sliders">
        <label className="slider">
          <span>
            {t("wb.sugarIn")} <b>{sugar} g/L</b>
          </span>
          <RangeInput min={120} max={320} step={5} value={sugar} onChange={(e) => setSugar(+e.target.value)} />
        </label>
        <label className="slider">
          <span>
            {t("wb.fermented")} <b>{pct}%</b>
          </span>
          <RangeInput min={0} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} />
        </label>
        <label className="slider">
          <span>
            {t("wb.acidityTa")} <b>{num(ta, lang)} g/L</b> <span className="muted small">{t("wb.asTartaric")}</span>
          </span>
          <RangeInput min={3} max={12} step={0.5} value={ta} onChange={(e) => setTa(+e.target.value)} />
        </label>
      </div>
      <div className="big-numbers" aria-live="polite">
        <div>
          <b>{num(r.abv, lang, 1)}%</b>
          <span>{t("wb.alcoholOut")}</span>
        </div>
        <div>
          <b>{Math.round(r.residualSugar)} g/L</b>
          <span>{t("wb.sugarLeft")}</span>
        </div>
        <div>
          <b>{label}</b>
          <span>{t("wb.euWord")}</span>
        </div>
      </div>
      {r.stoppedByYeast && (
        <p className="callout small">
          {t("wb.yeastGaveUp", { typical: num(YEAST_LIMIT_ABV.typical, lang), low: YEAST_LIMIT_ABV.low, high: YEAST_LIMIT_ABV.high })}
        </p>
      )}
      <p className="muted small">{t("wb.onlySugar")}</p>
      <SourceLine ids={["oiv-sugar-alcohol", "eu-2019-33"]} wiki={[{ label: "Alcohol by volume", title: "Alcohol by volume" }]} />
    </section>
  );
}

export default function WineBasicsPage() {
  const [picked, setPicked] = useState<PartId>("acidity");
  const { t, lang } = useLang();
  const part = partText(PARTS.find((p) => p.id === picked)!, lang);
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("wb.title")}</h1>
        <p className="muted">{t("wb.sub")}</p>
      </section>

      <section className="card visual">
        <StructureMap picked={picked} onPick={setPicked} />
        <div className="part-info" aria-live="polite">
          <h2>
            {part.icon} {part.name}
          </h2>
          <p>{part.what}</p>
          <dl>
            <dt>{t("wb.from")}</dt>
            <dd>{part.from}</dd>
            <dt>{t("wb.changes")}</dt>
            <dd>{part.changes}</dd>
            <dt>{t("wb.numbers")}</dt>
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
