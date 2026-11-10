import SourceLine from "../SourceLine";

// "How grape varieties work", for beginners. Parents and colour mutations come from VIVC passports
// (shared/varietyData.json); the rest from Wikipedia "Propagation of grapevines" (varieties are
// copied by cuttings; crossings vs hybrids), "Grape" (table vs wine grapes) and "Vitis riparia".

const LADDER = [
  { step: "Genus", name: "Vitis", text: "All grapevines. Muscadines (like Scuppernong) are close cousins in Muscadinia." },
  {
    step: "Species",
    name: "Wild kinds of vine",
    text: "Vitis vinifera (Europe and Western Asia: almost all wine grapes), Vitis labrusca (North America: the musky “foxy” taste), Vitis riparia (North America: very cold hardy, used for rootstocks and breeding).",
  },
  {
    step: "Variety",
    name: "One named plant, copied",
    text: "Every Merlot vine is a cutting of a cutting of the first Merlot plant. A seed would grow into a brand new variety, which is how breeders make new ones.",
  },
  { step: "Mutation / clone", name: "Small changes", text: "Sometimes a vine changes by itself. Pinot Gris is a colour mutation of Pinot Noir." },
];

const NAMES = [
  ["Syrah", "Shiraz"],
  ["Grenache", "Garnacha"],
  ["Thompson Seedless", "Sultana, Sultanina"],
  ["Pinot Gris", "Pinot Grigio, Grauburgunder"],
  ["Tempranillo", "Tinta Roriz, Aragonez"],
];

// Two real family trees from VIVC pedigrees.
function FamilyTree() {
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
    <svg viewBox="0 0 360 300" className="diagram" role="img" aria-label="Family trees from VIVC: Cabernet Franc is a parent of both Merlot and Cabernet Sauvignon. Pinot and Heunisch Weiss are the parents of Chardonnay. Pinot Gris is a colour mutation of Pinot Noir.">
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
        half-siblings
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
        mutation
      </text>
    </svg>
  );
}

export default function VarietiesExplainer() {
  return (
    <section className="card visual explainer">
      <h2>🧬 How grape varieties work</h2>
      <p className="muted small">A quick guide to the words you'll see on every grape below.</p>

      <ol className="ladder">
        {LADDER.map((l) => (
          <li key={l.step}>
            <span className="ladder-step">{l.step}</span>
            <b>{l.name}</b>
            <span>{l.text}</span>
          </li>
        ))}
      </ol>

      <h3>Crosses and hybrids</h3>
      <div className="two-col">
        <div className="mini-card">
          <b>Cross</b>
          <span>Two parents of the same species. Cabernet Sauvignon is Cabernet Franc × Sauvignon Blanc, all Vitis vinifera.</span>
        </div>
        <div className="mini-card">
          <b>Hybrid</b>
          <span>
            Parents from different species, often bred for cold winters or to resist fungus. Marquette survives about −37 °C. Even Concord is
            one: VIVC gives its parents as Catawba × wild Vitis labrusca, and Catawba is itself Vitis labrusca × Sémillon.
          </span>
        </div>
      </div>

      <h3>Real family trees</h3>
      <FamilyTree />
      <p className="muted small">Parents as recorded by VIVC, the international grape catalogue.</p>

      <h3>One grape, many names</h3>
      <ul className="names">
        {NAMES.map(([a, b]) => (
          <li key={a}>
            <b>{a}</b> = {b}
          </li>
        ))}
      </ul>
      <p className="muted small">VIVC picks one official “prime name” for each variety and lists the others as synonyms.</p>

      <h3>Table grapes vs wine grapes</h3>
      <div className="two-col">
        <div className="mini-card">
          <b>🍽️ Table</b>
          <span>Bred for eating: large, often seedless, thin skins.</span>
        </div>
        <div className="mini-card">
          <b>🍷 Wine</b>
          <span>Smaller, usually with seeds, thicker skins: much of a wine's aroma comes from the skin.</span>
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
