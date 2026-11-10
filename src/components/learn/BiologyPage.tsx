import { photoOf } from "../../lib/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import GrapeAnatomy from "../visuals/GrapeAnatomy";
import GrowthWheel from "../visuals/GrowthWheel";

// Biology: the main species (Wikipedia "Vitis vinifera", "Vitis labrusca", "Vitis riparia",
// "Vitis rotundifolia"), inside a grape and the vine, and the yearly growth cycle.

const SPECIES = [
  {
    name: "Vitis vinifera",
    nick: "the common grape vine",
    where: "Mediterranean, Central Europe and south-west Asia",
    text: "The species behind most wine and table grapes. Tamed about 4100 to 3000 BC. Grown vines have flowers that are both male and female, so they fruit on their own; wild ones are either male or female.",
    example: "Cabernet Sauvignon",
  },
  {
    name: "Vitis labrusca",
    nick: "the fox grape",
    where: "North America",
    text: "Musky “foxy” taste and “slip-skin” berries whose skin pops off whole. Has tendrils at every joint of the cane. It is in the family tree of Concord, Niagara and other American grapes.",
    example: "Concord",
    exampleNote: "mostly labrusca",
  },
  {
    name: "Vitis riparia",
    nick: "the riverbank grape",
    where: "North America",
    text: "Very cold hardy and resists fungal diseases, so breeders use it to make hardy hybrids, and growers graft European vines onto its roots (rootstock).",
    example: null,
  },
  {
    name: "Vitis rotundifolia",
    nick: "the muscadine",
    where: "South-east and south-central USA",
    text: "Likes warm, humid weather. Big berries, bronze, dark purple or black. So different that it gets its own subgroup, Muscadinia; some botanists call it a separate genus.",
    example: "Scuppernong",
  },
];

export default function BiologyPage() {
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">🌱 Grape biology</h1>
        <p className="muted">What kind of plant a grape is, what's inside a berry, and what a vine does all year.</p>
      </section>

      <section className="card visual">
        <h2>🌍 The main species</h2>
        <p className="muted small">A species is a wild kind of vine. Varieties like Merlot or Concord come from these (see “How grape varieties work” on the Overview).</p>
        <div className="species-list">
          {SPECIES.map((s) => {
            const p = s.example ? photoOf(s.example) : null;
            return (
              <article key={s.name} className="species-card">
                {p && <img src={p.thumb} alt={`${s.example} grapes`} loading="lazy" />}
                <div>
                  <b>
                    <i>{s.name}</i>
                  </b>
                  <span className="muted small">
                    {s.nick} · {s.where}
                  </span>
                  <p>{s.text}</p>
                  {p && (
                    <span className="muted small">
                      Pictured: {s.example}{"exampleNote" in s ? ` (${s.exampleNote})` : ""}. <PhotoCredit photo={p} className="inline" />
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <SourceLine
          wiki={[
            { label: "Vitis vinifera", title: "Vitis vinifera" },
            { label: "Vitis labrusca", title: "Vitis labrusca" },
            { label: "Vitis riparia", title: "Vitis riparia" },
            { label: "Vitis rotundifolia", title: "Vitis rotundifolia" },
          ]}
        />
      </section>

      <GrapeAnatomy />
      <GrowthWheel />
    </div>
  );
}
