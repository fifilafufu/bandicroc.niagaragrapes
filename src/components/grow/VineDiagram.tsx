import type { Pruning } from "../../../shared/grow";
import { useLang } from "../../lib/lang";

// A dormant vine on a wire, drawn in code, showing where to cut (red marks) for spur or cane pruning.
// Faded canes are last year's growth that gets removed. Based on University of Minnesota Extension
// (spurs of one or two buds; 80 to 90% of last year's growth removed) and OIV's "close" vs "long" pruning.

const BUD = (x: number, y: number) => <circle key={`bud-${x}-${y}`} cx={x} cy={y} r={3} className="vd-bud" />;
const CUT = (x: number, y: number) => <line x1={x - 7} y1={y - 5} x2={x + 7} y2={y + 5} className="vd-cut" />;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 340 230" className="diagram vine-diagram" role="img" aria-label={label}>
      <line x1={10} y1={210} x2={330} y2={210} className="vd-ground" />
      <line x1={22} y1={210} x2={22} y2={70} className="vd-post" />
      <line x1={318} y1={210} x2={318} y2={70} className="vd-post" />
      <line x1={22} y1={110} x2={318} y2={110} className="vd-wire" />
      {children}
    </svg>
  );
}

function Spur() {
  const { t } = useLang();
  const spurs = [70, 115, 225, 270];
  return (
    <Frame label={t("vd.spurLabel")}>
      <path d="M170 210 V112" className="vd-trunk" />
      <path d="M170 112 H40 M170 112 H300" className="vd-arm" />
      {spurs.map((x) => (
        <g key={x}>
          <path d={`M${x} 110 c4 -20 18 -46 30 -70`} className="vd-old" />
          <path d={`M${x} 110 v-14`} className="vd-spur" />
          {BUD(x, 102)}
          {BUD(x + 1, 96)}
          {CUT(x + 2, 90)}
        </g>
      ))}
      <text x={170} y={36} textAnchor="middle" className="vd-title">
        {t("vd.spurTitle")}
      </text>
      <text x={170} y={226} textAnchor="middle" className="vd-note">
        {t("vd.spurNote")}
      </text>
    </Frame>
  );
}

function Cane() {
  const { t } = useLang();
  return (
    <Frame label={t("vd.caneLabel")}>
      <path d="M170 210 V118" className="vd-trunk" />
      {/* the old fruiting cane being removed */}
      <path d="M170 120 C130 112 90 112 40 112" className="vd-old" />
      {CUT(160, 118)}
      {/* new cane kept and tied to the wire */}
      <path d="M172 118 C200 110 240 110 300 110" className="vd-cane" />
      {[190, 210, 230, 250, 270, 290].map((x) => BUD(x, 108))}
      {/* other canes removed */}
      <path d="M170 120 c-6 -26 -2 -50 10 -80" className="vd-old" />
      {CUT(169, 104)}
      {/* renewal spur */}
      <path d="M168 124 l-12 -10" className="vd-spur" />
      {BUD(160, 117)}
      {BUD(156, 113)}
      <text x={110} y={140} textAnchor="middle" className="vd-label">
        {t("vd.renewal")}
      </text>
      <text x={248} y={96} textAnchor="middle" className="vd-label">
        {t("vd.newCane")}
      </text>
      <text x={170} y={36} textAnchor="middle" className="vd-title">
        {t("vd.caneTitle")}
      </text>
      <text x={170} y={226} textAnchor="middle" className="vd-note">
        {t("vd.caneNote")}
      </text>
    </Frame>
  );
}

export default function VineDiagram({ type }: { type: Pruning | null }) {
  const { t } = useLang();
  return (
    <div className="vine-diagrams">
      {(type === null || type === "spur") && <Spur />}
      {(type === null || type === "cane") && <Cane />}
      <p className="legend muted small">
        <span>
          <i className="lg-cut" /> {t("vd.cut")}
        </span>
        <span>
          <i className="lg-old" /> {t("vd.old")}
        </span>
        <span>
          <i className="lg-bud" /> {t("vd.bud")}
        </span>
      </p>
    </div>
  );
}
