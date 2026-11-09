import { wikiUrl } from "../../../shared/grapes";

// Facts: Wikipedia "Grape" (flesh 75–85% water, yeast on the skins, clusters of 15–300, berries
// appear within ~60 days, véraison ~45 days), "Vitis" (twining plants; each pollinated flower in a
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
  return (
    <svg viewBox="0 0 360 240" className="diagram" role="img" aria-label="Inside a grape: stem, skin, flesh and seeds">
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
      <Label x={210} y={26} title="Stem" sub="holds it to the bunch" />
      <Label x={210} y={76} title="Skin" sub="wild yeast lives on it" />
      <Label x={210} y={132} title="Flesh (pulp)" sub="75–85% water" />
      <Label x={210} y={194} title="Seeds (pips)" sub="→ grape seed oil" />
    </svg>
  );
}

function Vine() {
  const berries: [number, number][] = [
    [162, 138], [176, 138], [190, 138], [169, 151], [183, 151], [176, 164], [176, 125],
  ];
  return (
    <svg viewBox="0 0 380 270" className="diagram" role="img" aria-label="A grapevine: trunk, arm on a support wire, leaves, tendril and a bunch of grapes">
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
      <Label x={110} y={20} title="Leaves" sub="make sugar from sunlight" />
      <Label x={372} y={36} title="Tendril" sub="curls around supports" anchor="end" />
      <Label x={206} y={124} title="Arm on a wire" />
      <Label x={206} y={160} title="Bunch" sub="15–300 grapes" />
      <Label x={88} y={200} title="Trunk" sub="thick woody stem" />
    </svg>
  );
}

export default function GrapeAnatomy() {
  return (
    <section className="card visual">
      <h2>🔬 Inside a grape</h2>
      <Berry />

      <h2 className="mt">🌱 What grapes grow on</h2>
      <p className="muted small">
        Not a tree: a <b>vine</b>. Grapevines are climbing plants (lianas) that grab supports with tendrils. In the wild a vine
        can climb <b>12–15 m</b>; on farms it's trained along wires.
      </p>
      <Vine />

      <div className="timeline" aria-label="From flower to grape">
        <div>
          <span className="t-icon">🌼</span>
          <b>Flowers</b>
          <span>tiny flowers grow in bunches</span>
        </div>
        <div className="t-arrow" aria-hidden="true">→</div>
        <div>
          <span className="t-icon">🟢</span>
          <b>~60 days</b>
          <span>each pollinated flower becomes a hard green berry</span>
        </div>
        <div className="t-arrow" aria-hidden="true">→</div>
        <div>
          <span className="t-icon">🍇</span>
          <b>~45 days</b>
          <span>ripening: berries grow, colour up and get sweet</span>
        </div>
      </div>

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
