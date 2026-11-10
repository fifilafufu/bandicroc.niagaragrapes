import { useState } from "react";
import { GRAPES, wikiUrl } from "../../shared/grapes";
import { COLOUR_CLASS, speciesLabel, varietyInfo, VARIETIES_CHECKED } from "../lib/varieties";
import PhotoCredit from "./PhotoCredit";
import SourceLine from "./SourceLine";

type Use = "eat" | "wine" | "juice" | "raisin";
const USE_ICON: Record<Use, string> = { eat: "🍽️", wine: "🍷", juice: "🧃", raisin: "☀️" };
const USE_LABEL: Record<Use, string> = { eat: "eating", wine: "wine", juice: "juice & jelly", raisin: "raisins" };

// Taste and main uses, summarised from each grape's checked facts (shared/grapes.ts).
// hybrid: set by hand only where Wikipedia states hybrid ancestry that VIVC files under Vitis vinifera;
// every other hybrid comes from VIVC ("interspecific crossing").
const INFO: Record<string, { taste: string; uses: Use[]; hybrid?: boolean }> = {
  Niagara: { taste: "Sweet, musky “foxy”", uses: ["eat", "juice", "wine"] },
  Concord: { taste: "Sweet, musky; tart skin", uses: ["juice", "eat", "wine"] },
  Catawba: { taste: "Musky, grapey, tangy", uses: ["wine", "juice"] },
  Delaware: { taste: "Juicy, sweet, mild", uses: ["eat", "wine"] },
  "Cotton Candy": { taste: "Very sweet, like cotton candy", uses: ["eat"] },
  "Thompson Seedless": { taste: "Mild, sweet", uses: ["raisin", "eat", "wine"] },
  "Red Globe": { taste: "Crunchy, gently sweet", uses: ["eat"] },
  Muscat: { taste: "Sweet, very floral", uses: ["eat", "raisin", "wine"] },
  Chardonnay: { taste: "Neutral; wine takes on oak & climate", uses: ["wine"] },
  Riesling: { taste: "Flowery, high acidity", uses: ["wine"] },
  "Pinot Noir": { taste: "Wine: cherry & raspberry", uses: ["wine"] },
  "Cabernet Sauvignon": { taste: "Wine: blackcurrant, tannic", uses: ["wine"] },
  "Shine Muscat": { taste: "Sweet, muscat aroma; edible skin", uses: ["eat"] },
  Scuppernong: { taste: "Big berry, thick tough skin", uses: ["eat"] },
  Gewürztraminer: { taste: "Wine smells of lychee", uses: ["wine"] },
  Kyoho: { taste: "Very sweet, juicy; peel it", uses: ["eat", "juice"] },
  "Pinot Gris": { taste: "Wine: rich & oily, or light & crisp", uses: ["wine"] },
  Merlot: { taste: "Wine: soft, fleshy red", uses: ["wine"] },
  "Sauvignon Blanc": { taste: "Wine: crisp, grassy to tropical", uses: ["wine"] },
  Syrah: { taste: "Wine: blackberry, black pepper", uses: ["wine"] },
  Tempranillo: { taste: "Wine: fairly neutral, often blended", uses: ["wine"] },
  Grenache: { taste: "Wine: raspberry, white pepper", uses: ["wine"] },
  Solaris: { taste: "White wine; resists fungal disease", uses: ["wine"], hybrid: true },
  Regent: { taste: "Red wine; resists fungal disease", uses: ["wine"], hybrid: true },
  Marquette: { taste: "Red wine; survives about −37 °C", uses: ["wine"] },
  "Seyval Blanc": { taste: "White wine; ripens early", uses: ["wine"] },
  "Vidal Blanc": { taste: "White wine and ice wine", uses: ["wine"] },
};

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
