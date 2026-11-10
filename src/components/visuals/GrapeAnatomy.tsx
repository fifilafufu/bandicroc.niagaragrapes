import { wikiUrl } from "../../../shared/grapes";
import { useLang } from "../../lib/lang";

// Facts: Wikipedia "Grape" (flesh 75–85% water, yeast on the skins, clusters of 15–300), "Vitis" (twining plants; each pollinated flower in a
// bunch becomes a berry) and "Vitis vinifera" (a liana growing 12–15 m), "Grape seed oil".

function Label({ x, y, title, sub, anchor = "start" }: { x: number; y: number; title: string; sub?: string; anchor?: "start" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="svg-label">
      <tspan className="svg-title">{title}</tspan>
      {sub && (
        <tspan x={x} dy="14" className="svg-sub">
          {sub}
        </tspan>
      )}
    </text>
  );
}

function Berry() {
  const { t } = useLang();
  return (
    <svg viewBox="0 0 360 240" className="diagram" role="img" aria-label={t("ana.berryLabel")}>
      {/* stem */}
      <path d="M103 46 C103 30 107 20 115 10" stroke="var(--wood)" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* skin + flesh */}
      <circle cx="105" cy="135" r="88" fill="var(--g-skin)" />
      <circle cx="105" cy="135" r="80" fill="var(--g-flesh)" />
      <circle cx="77" cy="100" r="16" fill="#fff" opacity="0.25" />
      {/* seeds */}
      <path d="M85 150 c-10 -14 -6 -30 6 -32 c12 2 14 18 4 32 c-3 4 -7 4 -10 0 z" fill="var(--g-seed)" />
      <path d="M119 156 c-10 -14 -6 -30 6 -32 c12 2 14 18 4 32 c-3 4 -7 4 -10 0 z" fill="var(--g-seed)" />

      {/* leader lines */}
      <g className="svg-line">
        <path d="M113 22 H204" />
        <path d="M175 80 L204 72" />
        <path d="M163 128 H204" />
        <path d="M133 140 L204 190" />
      </g>
      <Label x={210} y={26} title={t("ana.stem")} sub={t("ana.stemSub")} />
      <Label x={210} y={76} title={t("ana.skin")} sub={t("ana.skinSub")} />
      <Label x={210} y={132} title={t("ana.flesh")} sub={t("ana.fleshSub")} />
      <Label x={210} y={194} title={t("ana.seeds")} sub={t("ana.seedsSub")} />
    </svg>
  );
}

function Vine() {
  const { t } = useLang();
  const berries: [number, number][] = [
    [162, 138], [176, 138], [190, 138], [169, 151], [183, 151], [176, 164], [176, 125],
  ];
  return (
    <svg viewBox="0 0 380 270" className="diagram" role="img" aria-label={t("ana.vineLabel")}>
      {/* ground, post and wire */}
      <path d="M10 250 H370" stroke="var(--wood)" strokeWidth="3" opacity="0.5" />
      <path d="M345 250 V86" stroke="var(--wood)" strokeWidth="5" opacity="0.6" />
      <path d="M40 98 H345" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* trunk + arm */}
      <path d="M70 250 C64 200 76 150 70 104 C110 92 200 92 300 98" stroke="var(--wood)" strokeWidth="9" fill="none" strokeLinecap="round" />
      {/* leaves */}
      {[
        [110, 76],
        [214, 74],
        [270, 80],
      ].map(([x, y]) => (
        <g key={x} fill="var(--leaf)">
          <circle cx={x} cy={y} r="15" />
          <circle cx={x - 13} cy={y + 8} r="12" />
          <circle cx={x + 13} cy={y + 8} r="12" />
          <circle cx={x} cy={y + 14} r="11" />
        </g>
      ))}
      {/* tendril, curled around the wire */}
      <path d="M300 98 c4 10 16 10 16 2 c0 -8 -12 -8 -10 2 c2 8 12 6 10 -2" stroke="var(--leaf)" strokeWidth="2.5" fill="none" />
      {/* bunch */}
      <path d="M176 98 V118" stroke="var(--wood)" strokeWidth="3" />
      {berries.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="8" fill="var(--g-skin)" stroke="var(--g-seed)" strokeWidth="1" />
      ))}

      <g className="svg-line">
        <path d="M110 60 V40" />
        <path d="M312 92 L330 52" />
        <path d="M76 196 H84" />
      </g>
      <Label x={110} y={20} title={t("ana.leaves")} sub={t("ana.leavesSub")} />
      <Label x={372} y={36} title={t("ana.tendril")} sub={t("ana.tendrilSub")} anchor="end" />
      <Label x={206} y={124} title={t("ana.arm")} />
      <Label x={206} y={160} title={t("ana.bunch")} sub={t("ana.bunchSub")} />
      <Label x={88} y={200} title={t("ana.trunk")} sub={t("ana.trunkSub")} />
    </svg>
  );
}

export default function GrapeAnatomy() {
  const { t } = useLang();
  return (
    <section className="card visual">
      <h2>{t("ana.title")}</h2>
      <Berry />

      <h2 className="mt">{t("ana.vineTitle")}</h2>
      <p className="muted small">
        {t("ana.vineText1")}<b>{t("ana.vineWord")}</b>{t("ana.vineText2")}<b>12–15 m</b>{t("ana.vineText3")}
      </p>
      <Vine />

      <p className="sources-line">
        <a href={wikiUrl("Grape")} target="_blank" rel="noreferrer">
          📖 Grape
        </a>
        <a href={wikiUrl("Vitis")} target="_blank" rel="noreferrer">
          📖 Vitis (grapevine)
        </a>
        <a href={wikiUrl("Vitis vinifera")} target="_blank" rel="noreferrer">
          📖 Vitis vinifera
        </a>
      </p>
    </section>
  );
}
