import { photoOf } from "../../../shared/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import GrapeAnatomy from "../visuals/GrapeAnatomy";
import GrowthWheel from "../visuals/GrowthWheel";
import { SPECIES } from "../../../shared/species";
import { SPECIES_TEXT_PL } from "../../../shared/i18n/pl/biology";
import { useLang } from "../../lib/lang";

// Biology: the main species (Wikipedia "Vitis vinifera", "Vitis labrusca", "Vitis riparia",
// "Vitis rotundifolia"), inside a grape and the vine, and the yearly growth cycle.

export default function BiologyPage() {
  const { t, lang } = useLang();
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("bio.title")}</h1>
        <p className="muted">{t("bio.sub")}</p>
      </section>

      <section className="card visual">
        <h2>{t("bio.speciesTitle")}</h2>
        <p className="muted small">{t("bio.speciesSub")}</p>
        <div className="species-list">
          {SPECIES.map((s) => {
            const p = s.example ? photoOf(s.example) : null;
            // Polish text when chosen; the species name and example grape stay as they are.
            const tx = lang === "pl" ? { ...s, ...SPECIES_TEXT_PL[s.name] } : s;
            return (
              <article key={s.name} className="species-card">
                {p && <img src={p.thumb} alt={t("chat.photoOf", { name: s.example! })} loading="lazy" />}
                <div>
                  <b>
                    <i>{s.name}</i>
                  </b>
                  <span className="muted small">
                    {tx.nick} · {tx.where}
                  </span>
                  <p>{tx.text}</p>
                  {p && (
                    <span className="muted small">
                      {t("bio.pictured", { name: s.example! })}{"exampleNote" in tx && tx.exampleNote ? ` (${tx.exampleNote})` : ""}. <PhotoCredit photo={p} className="inline" />
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
