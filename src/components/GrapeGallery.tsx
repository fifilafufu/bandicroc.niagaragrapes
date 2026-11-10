import { useState } from "react";
import { GRAPES, wikiUrl } from "../../shared/grapes";
import { COLOUR_CLASS, speciesLabel, varietyInfo, VARIETIES_CHECKED } from "../../shared/varieties";
import PhotoCredit from "./PhotoCredit";
import SourceLine from "./SourceLine";
import { INFO, USE_ICON, USE_LABEL, type Use } from "../../shared/gallery";
import { COLOUR_MEANING_PL, SPECIES_PL, TASTE_PL, USE_LABEL_PL } from "../../shared/i18n/pl/varieties";
import type { TextKey } from "../../shared/i18n";
import { useLang } from "../lib/lang";

const isHybrid = (name: string) => !!INFO[name]?.hybrid || !!varietyInfo(name)?.vivc?.species?.includes("INTERSPECIFIC");

const FILTERS: { id: "all" | "eat" | "wine" | "hybrid"; label: TextKey }[] = [
  { id: "all", label: "gal.all" },
  { id: "eat", label: "gal.table" },
  { id: "wine", label: "gal.wine" },
  { id: "hybrid", label: "gal.hybrids" },
];
type Filter = (typeof FILTERS)[number]["id"];

// Shown in the chosen language; grape and species names stay as they are.
const inLang = (pl: boolean) => ({
  use: (u: Use) => (pl ? USE_LABEL_PL[u] : USE_LABEL[u]),
  taste: (name: string) => (pl ? TASTE_PL[name] : undefined) ?? INFO[name]?.taste,
  meaning: (code: string, en: string) => (pl ? COLOUR_MEANING_PL[code] : undefined) ?? en,
  species: (label: string | null) => (pl && label ? SPECIES_PL[label] : undefined) ?? label,
});

export default function GrapeGallery({ onAsk }: { onAsk: (question: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const { t, lang } = useLang();
  const L = inLang(lang === "pl");
  const shown = GRAPES.filter((g) => {
    const info = INFO[g.name];
    if (filter === "all") return true;
    if (filter === "hybrid") return isHybrid(g.name);
    return info?.uses.includes(filter);
  });

  return (
    <section className="card">
      <h2>{t("gal.title", { n: GRAPES.length })}</h2>
      <p className="muted small">{t("gal.sub")}</p>

      <div className="chips-row" role="group" aria-label={t("gal.show")}>
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? "on" : ""}`} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
            {t(f.label)}
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
              <span className="gallery-img">{v?.photo ? <img src={v.photo.thumb} alt={t("chat.photoOf", { name: g.name })} loading="lazy" /> : "🍇"}</span>
              {v?.photo && <PhotoCredit photo={v.photo} className="tiny" />}
              <b>{g.name}</b>
              <span className="tag">
                {colour ? (
                  <>
                    <i style={{ background: colour.dot }} aria-hidden="true" />
                    {colour.label} <span className="muted">({L.meaning(v!.vivc!.colour!, colour.meaning).split(" (")[0]})</span>
                  </>
                ) : g.name === "Muscat" ? (
                  t("gal.muscat")
                ) : (
                  t("gal.notVivc")
                )}
              </span>
              {v?.vivc && (
                <span className="species">
                  {L.species(speciesLabel(v.vivc.species))}
                  {/* Regent and Solaris: VIVC and the EU file them as vinifera despite some hybrid ancestry. */}
                  {info?.hybrid && t("gal.officially")}
                </span>
              )}
              <span className="taste">👅 {L.taste(g.name)}</span>
              <span className="uses" aria-label={t("gal.usedFor", { uses: (info?.uses ?? []).map(L.use).join(", ") })}>
                {info?.uses.map((u) => (
                  <span key={u} title={L.use(u)}>
                    {USE_ICON[u]}
                  </span>
                ))}
              </span>
              <span className="gallery-links">
                <button className="link inline" onClick={() => onAsk(t("col.ask", { grape: g.name }))}>
                  {t("gal.ask")}
                </button>
                {v?.vivc ? (
                  <a href={v.vivc.url} target="_blank" rel="noreferrer" title={t("gal.vivcNumber", { id: v.vivc.id, name: v.vivc.primeName })}>
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
            {USE_ICON[u]} {L.use(u)}
          </span>
        ))}
      </p>
      <SourceLine ids={["vivc"]} />
      <p className="muted small">
        {t("gal.note", { date: VARIETIES_CHECKED })}
      </p>
    </section>
  );
}
