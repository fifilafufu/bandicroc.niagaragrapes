import { photoOf } from "../../../shared/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import GrapeAnatomy from "../visuals/GrapeAnatomy";
import GrowthWheel from "../visuals/GrowthWheel";
import { SPECIES } from "../../../shared/species";

// Biology: the main species (Wikipedia "Vitis vinifera", "Vitis labrusca", "Vitis riparia",
// "Vitis rotundifolia"), inside a grape and the vine, and the yearly growth cycle.

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
