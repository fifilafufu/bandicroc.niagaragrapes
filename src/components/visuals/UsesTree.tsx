import { wikiUrl } from "../../../shared/grapes";

// Facts: Wikipedia "Grape" (2023: 72.5 million tonnes; about 71% wine, 27% fresh fruit, 2% dried;
// also juice, jam, vinegar, oil), "Grape seed oil" (made from seeds, a wine-making by-product),
// "Grape seed extract" (an industrial derivative of the seeds, sold as a supplement), "Vinotherapy"
// (beauty treatment using pips and pulp from wine-making), "Vinegar" ("sour wine").

const TOTAL = 72.5; // million tonnes in 2023

const BRANCHES = [
  {
    icon: "🍷",
    name: "Wine",
    pct: 71,
    colour: "#7b2d4a",
    leaves: ["Wine", "Vinegar (made from wine)"],
    extra: {
      title: "From the leftovers (seeds, skins, pulp):",
      leaves: ["🍳 Grape seed oil (cooking)", "💊 Grape seed extract (supplements)", "🧴 Vinotherapy (cosmetics)"],
    },
  },
  {
    icon: "🍽️",
    name: "Fresh",
    pct: 27,
    colour: "#5b8a2d",
    leaves: ["Eaten as table grapes", "Juice, jam & jelly"],
  },
  {
    icon: "☀️",
    name: "Dried",
    pct: 2,
    colour: "#c08a2b",
    leaves: ["Raisins", "Sultanas", "Currants"],
  },
];

export default function UsesTree() {
  return (
    <section className="card visual">
      <h2>🌳 Where the world's grapes go</h2>
      <p className="muted small">Every grape grown in a year, split by what it's used for.</p>

      <div className="tree">
        <div className="tree-root">
          <span className="t-icon">🍇</span>
          <b>{TOTAL} million tonnes</b>
          <span>grown worldwide in 2023</span>
        </div>

        <div className="tree-branches">
          {BRANCHES.map((b) => (
            <div key={b.name} className="tree-branch" style={{ ["--branch" as string]: b.colour }}>
              <div className="tree-node">
                <span className="t-icon">{b.icon}</span>
                <b className="pct">{b.pct}%</b>
                <span className="branch-name">{b.name}</span>
                <span className="tonnes">≈ {((TOTAL * b.pct) / 100).toFixed(1)} M t</span>
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
        Why no separate % for cosmetics or medicine? There's no reliable world figure: they're made from wine-making leftovers (seeds,
        skins, pulp), so they come out of the 71%.
      </p>

      <p className="sources-line">
        <a href={wikiUrl("Grape")} target="_blank" rel="noreferrer">
          📖 Grape: production
        </a>
        <a href={wikiUrl("Grape seed oil")} target="_blank" rel="noreferrer">
          📖 Grape seed oil
        </a>
        <a href={wikiUrl("Grape seed extract")} target="_blank" rel="noreferrer">
          📖 Grape seed extract
        </a>
        <a href={wikiUrl("Vinotherapy")} target="_blank" rel="noreferrer">
          📖 Vinotherapy
        </a>
      </p>
    </section>
  );
}
