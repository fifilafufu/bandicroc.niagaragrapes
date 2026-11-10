import { BALANCE_2024 as B } from "../../../shared/grapeUses";
import UsesShareChart from "../charts/UsesShareChart";
import SourceLine from "../SourceLine";
import { useLang } from "../../lib/lang";
import { num } from "../../../shared/i18n/countries";
import type { TextKey } from "../../../shared/i18n";

// Where the world's grapes go, using the OIV grape balance sheet for 2024. OIV counts juice and
// musts as "pressed", together with wine. By-products (seed oil, extract, vinotherapy) come from
// wine-making leftovers: Wikipedia "Grape seed oil", "Grape seed extract", "Vinotherapy".

// Each leaf is a text key with the numbers it needs.
type Leaf = [TextKey, Record<string, number>?];
const BRANCHES: { key: string; icon: string; name: TextKey; pct: number; mt: number; leaves: Leaf[]; extra?: { title: TextKey; leaves: Leaf[] } }[] = [
  {
    key: "pressed",
    icon: "🍷",
    name: "tree.pressed",
    pct: B.shares.pressed,
    mt: B.pressed,
    leaves: [["tree.wine", { mt: B.wine, hl: B.wineHl }], ["tree.musts", { mt: B.mustsJuices }], ["tree.vinegar"]],
    extra: {
      title: "tree.leftovers",
      leaves: [["tree.oil"], ["tree.extract"], ["tree.vino"]],
    },
  },
  {
    key: "table",
    icon: "🍽️",
    name: "tree.table",
    pct: B.shares.table,
    mt: B.table,
    leaves: [["tree.fresh"]],
  },
  {
    key: "dried",
    icon: "☀️",
    name: "tree.dried",
    pct: B.shares.dried,
    mt: B.driedFresh,
    leaves: [["tree.raisins"], ["tree.driedLine", { fresh: B.driedFresh, dried: B.driedProduct }]],
  },
];

export default function UsesTree() {
  const { t, lang } = useLang();
  const n = (x: number) => num(x, lang);
  const leaf = ([key, vars]: Leaf) => t(key, vars && Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, n(v)])));
  return (
    <section className="card visual">
      <h2>{t("tree.title")}</h2>
      <p className="muted small">
        {t("tree.sub", { year: B.year, produced: n(B.produced), lost: n(B.lost), available: n(B.available) })}
      </p>

      <div className="tree">
        <div className="tree-root">
          <span className="t-icon">🍇</span>
          <b>{t("tree.rootMt", { n: n(B.available) })}</b>
          <span>{t("tree.used", { year: B.year })}</span>
        </div>

        <div className="tree-branches">
          {BRANCHES.map((b) => (
            <div key={b.name} className={`tree-branch s-${b.key}`}>
              <div className="tree-node">
                <span className="t-icon">{b.icon}</span>
                <b className="pct">{b.pct}%</b>
                <span className="branch-name">{t(b.name)}</span>
                <span className="tonnes">{n(b.mt)} {t("unit.mt")}</span>
                <span className="bar" aria-hidden="true">
                  <i style={{ width: `${b.pct}%` }} />
                </span>
              </div>
              <ul className="tree-leaves">
                {b.leaves.map((l) => (
                  <li key={l[0]}>{leaf(l)}</li>
                ))}
              </ul>
              {b.extra && (
                <div className="tree-extra">
                  <span>{t(b.extra.title)}</span>
                  <ul className="tree-leaves">
                    {b.extra.leaves.map((l) => (
                      <li key={l[0]}>{leaf(l)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="muted small note">
        {t("tree.old")}
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
