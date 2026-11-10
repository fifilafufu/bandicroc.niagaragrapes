import { useState } from "react";
import { GRAPES, wikiUrl } from "../../shared/grapes";
import { COLOUR_CLASS, speciesLabel, varietyInfo, VARIETIES_CHECKED } from "../lib/varieties";
import PhotoCredit from "./PhotoCredit";
import SourceLine from "./SourceLine";
import { INFO, USE_ICON, USE_LABEL, type Use } from "../../shared/gallery";

const isHybrid = (name: string) => !!INFO[name]?.hybrid || !!varietyInfo(name)?.vivc?.species?.includes("INTERSPECIFIC");

const FILTERS = [
  { id: "all", label: "All" },
  { id: "eat", label: "🍽️ Table" },
  { id: "wine", label: "🍷 Wine" },
  { id: "hybrid", label: "🧬 Hybrids" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

export default function GrapeGallery({ onAsk }: { onAsk: (question: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const shown = GRAPES.filter((g) => {
    const info = INFO[g.name];
    if (filter === "all") return true;
    if (filter === "hybrid") return isHybrid(g.name);
    return info?.uses.includes(filter);
  });

  return (
    <section className="card">
      <h2>🖼️ Meet {GRAPES.length} grapes</h2>
      <p className="muted small">Real photos, official colour class and species. Tap “Ask” to chat with Grape Bot about one.</p>

      <div className="chips-row" role="group" aria-label="Show grapes">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? "on" : ""}`} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="gallery">
        {shown.map((g) => {
          const info = INFO[g.name];
          const v = varietyInfo(g.name);
          const colour = v?.vivc?.colour ? COLOUR_CLASS[v.vivc.colour] : null;
          return (
            <article key={g.name} className="gallery-item">
              <span className="gallery-img">{v?.photo ? <img src={v.photo.thumb} alt={`${g.name} grapes`} loading="lazy" /> : "🍇"}</span>
              {v?.photo && <PhotoCredit photo={v.photo} className="tiny" />}
              <b>{g.name}</b>
              <span className="tag">
                {colour ? (
                  <>
                    <i style={{ background: colour.dot }} aria-hidden="true" />
                    {colour.label} <span className="muted">({colour.meaning.split(" (")[0]})</span>
                  </>
                ) : g.name === "Muscat" ? (
                  "A family: green to black"
                ) : (
                  "Not in VIVC"
                )}
              </span>
              {v?.vivc && (
                <span className="species">
                  {speciesLabel(v.vivc.species)}
                  {/* Regent and Solaris: VIVC and the EU file them as vinifera despite some hybrid ancestry. */}
                  {info?.hybrid && " (officially; has hybrid ancestry)"}
                </span>
              )}
              <span className="taste">👅 {info?.taste}</span>
              <span className="uses" aria-label={`Used for ${info?.uses.map((u) => USE_LABEL[u]).join(", ")}`}>
                {info?.uses.map((u) => (
                  <span key={u} title={USE_LABEL[u]}>
                    {USE_ICON[u]}
                  </span>
                ))}
              </span>
              <span className="gallery-links">
                <button className="link inline" onClick={() => onAsk(`Tell me about ${g.name} grapes`)}>
                  💬 Ask
                </button>
                {v?.vivc ? (
                  <a href={v.vivc.url} target="_blank" rel="noreferrer" title={`VIVC number ${v.vivc.id}: ${v.vivc.primeName}`}>
                    VIVC {v.vivc.id}
                  </a>
                ) : (
                  <a href={wikiUrl(g.wiki)} target="_blank" rel="noreferrer">
                    📖 Wiki
                  </a>
                )}
              </span>
            </article>
          );
        })}
      </div>
      <p className="legend muted small">
        {(Object.keys(USE_ICON) as Use[]).map((u) => (
          <span key={u}>
            {USE_ICON[u]} {USE_LABEL[u]}
          </span>
        ))}
      </p>
      <SourceLine ids={["vivc"]} />
      <p className="muted small">
        Colour class, species and VIVC numbers checked {VARIETIES_CHECKED}. Photos from Wikimedia Commons. Muscat is a whole family of
        varieties and Cotton Candy (a 2000s patented grape) isn't listed in VIVC.
      </p>
    </section>
  );
}
