import { BALANCE_2024 as B } from "../../../shared/grapeUses";
import UsesShareChart from "../charts/UsesShareChart";
import SourceLine from "../SourceLine";

// Where the world's grapes go, using the OIV grape balance sheet for 2024. OIV counts juice and
// musts as "pressed", together with wine. By-products (seed oil, extract, vinotherapy) come from
// wine-making leftovers: Wikipedia "Grape seed oil", "Grape seed extract", "Vinotherapy".

const BRANCHES = [
  {
    key: "pressed",
    icon: "🍷",
    name: "Pressed",
    pct: B.shares.pressed,
    mt: B.pressed,
    leaves: [`Wine: ${B.wine} M t of grapes → ${B.wineHl} million hl`, `Musts & juices: ${B.mustsJuices} M t (juice, jelly)`, "Vinegar (made from wine)"],
    extra: {
      title: "From the leftovers (seeds, skins, pulp):",
      leaves: ["🍳 Grape seed oil (cooking)", "💊 Grape seed extract (supplements)", "🧴 Vinotherapy (cosmetics)"],
    },
  },
  {
    key: "table",
    icon: "🍽️",
    name: "Table",
    pct: B.shares.table,
    mt: B.table,
    leaves: ["Eaten fresh as table grapes"],
  },
  {
    key: "dried",
    icon: "☀️",
    name: "Dried",
    pct: B.shares.dried,
    mt: B.driedFresh,
    leaves: ["Raisins, sultanas, currants", `${B.driedFresh} M t of fresh grapes → ${B.driedProduct} M t dried (about 4 kg make 1 kg)`],
  },
];

export default function UsesTree() {
  return (
    <section className="card visual">
      <h2>🌳 Where the world's grapes go</h2>
      <p className="muted small">
        In {B.year} the world grew {B.produced} million tonnes of grapes. About {B.lost} M t were lost along the way, so the split below is
        of the {B.available} M t that were used.
      </p>

      <div className="tree">
        <div className="tree-root">
          <span className="t-icon">🍇</span>
          <b>{B.available} million tonnes</b>
          <span>used in {B.year}</span>
        </div>

        <div className="tree-branches">
          {BRANCHES.map((b) => (
            <div key={b.name} className={`tree-branch s-${b.key}`}>
              <div className="tree-node">
                <span className="t-icon">{b.icon}</span>
                <b className="pct">{b.pct}%</b>
                <span className="branch-name">{b.name}</span>
                <span className="tonnes">{b.mt} M t</span>
                <span className="bar" aria-hidden="true">
                  <i style={{ width: `${b.pct}%` }} />
                </span>
              </div>
              <ul className="tree-leaves">
                {b.leaves.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              {b.extra && (
                <div className="tree-extra">
                  <span>{b.extra.title}</span>
                  <ul className="tree-leaves">
                    {b.extra.leaves.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="muted small note">
        Older books say about 71% of grapes become wine. That figure is out of date: wine's share has been falling, while table-grape
        growing has more than doubled since 2000, led by China.
      </p>

      <UsesShareChart />

      <SourceLine
        ids={[B.source]}
        wiki={[
          { label: "Grape seed oil", title: "Grape seed oil" },
          { label: "Grape seed extract", title: "Grape seed extract" },
          { label: "Vinotherapy", title: "Vinotherapy" },
        ]}
      />
    </section>
  );
}
