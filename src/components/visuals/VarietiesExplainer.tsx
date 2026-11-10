import SourceLine from "../SourceLine";
import { LADDER, NAMES } from "../../../shared/varietiesGuide";
import { LADDER_PL } from "../../../shared/i18n/pl/varieties";
import { pick } from "../../../shared/i18n";
import { useLang } from "../../lib/lang";

// "How grape varieties work", for beginners. Parents and colour mutations come from VIVC passports
// (shared/varietyData.json); the rest from Wikipedia "Propagation of grapevines" (varieties are
// copied by cuttings; crossings vs hybrids), "Grape" (table vs wine grapes) and "Vitis riparia".

// Two real family trees from VIVC pedigrees.
function FamilyTree() {
  const { t } = useLang();
  const box = (x: number, y: number, label: string, kind: "parent" | "child" | "other" = "other") => (
    <g key={`${x}-${y}`}>
      <rect x={x - 54} y={y - 14} width={108} height={28} rx={9} className={`ft-box ${kind}`} />
      <text x={x} y={y + 4} textAnchor="middle" className="ft-text">
        {label}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number, dashed = false) => (
    <path key={`${x1}${y1}${x2}${y2}`} d={`M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}`} className={`ft-line ${dashed ? "dashed" : ""}`} />
  );
  return (
    <svg viewBox="0 0 360 300" className="diagram" role="img" aria-label={t("var.treesLabel")}>
      {/* Cabernet family */}
      {line(180, 32, 70, 104)}
      {line(180, 32, 290, 104)}
      {line(62, 32, 70, 104)}
      {line(298, 32, 290, 104)}
      {box(180, 22, "Cabernet Franc", "parent")}
      {box(62, 22, "Magdeleine N.")}
      {box(298, 22, "Sauvignon Blanc")}
      {box(70, 114, "Merlot", "child")}
      {box(290, 114, "Cabernet Sauv.", "child")}
      <text x={180} y={118} textAnchor="middle" className="ft-note">
        {t("var.halfSiblings")}
      </text>

      {/* Chardonnay's parents, and Pinot Gris as a colour mutation of Pinot Noir */}
      {line(62, 192, 120, 264)}
      {line(180, 192, 120, 264)}
      {line(298, 192, 298, 264, true)}
      {box(62, 182, "Pinot", "parent")}
      {box(180, 182, "Heunisch Weiss")}
      {box(120, 274, "Chardonnay", "child")}
      {box(298, 182, "Pinot Noir", "parent")}
      {box(298, 274, "Pinot Gris", "child")}
      <text x={304} y={232} textAnchor="start" className="ft-note">
        {t("var.mutation")}
      </text>
    </svg>
  );
}

export default function VarietiesExplainer() {
  const { t, lang } = useLang();
  const ladder = pick(lang, LADDER, LADDER_PL);
  return (
    <section className="card visual explainer">
      <h2>{t("var.title")}</h2>
      <p className="muted small">{t("var.sub")}</p>

      <ol className="ladder">
        {ladder.map((l) => (
          <li key={l.step}>
            <span className="ladder-step">{l.step}</span>
            <b>{l.name}</b>
            <span>{l.text}</span>
          </li>
        ))}
      </ol>

      <h3>{t("var.crossTitle")}</h3>
      <div className="two-col">
        <div className="mini-card">
          <b>{t("var.cross")}</b>
          <span>{t("var.crossText")}</span>
        </div>
        <div className="mini-card">
          <b>{t("var.hybrid")}</b>
          <span>{t("var.hybridText")}</span>
        </div>
      </div>

      <h3>{t("var.treesTitle")}</h3>
      <FamilyTree />
      <p className="muted small">{t("var.treesNote")}</p>

      <h3>{t("var.namesTitle")}</h3>
      <ul className="names">
        {NAMES.map(([a, b]) => (
          <li key={a}>
            <b>{a}</b> = {b}
          </li>
        ))}
      </ul>
      <p className="muted small">{t("var.namesNote")}</p>

      <h3>{t("var.tableTitle")}</h3>
      <div className="two-col">
        <div className="mini-card">
          <b>{t("var.table")}</b>
          <span>{t("var.tableText")}</span>
        </div>
        <div className="mini-card">
          <b>{t("var.wine")}</b>
          <span>{t("var.wineText")}</span>
        </div>
      </div>

      <SourceLine
        ids={["vivc"]}
        wiki={[
          { label: "Propagation of grapevines", title: "Propagation of grapevines" },
          { label: "Grape", title: "Grape" },
          { label: "Vitis riparia", title: "Vitis riparia" },
        ]}
      />
    </section>
  );
}
