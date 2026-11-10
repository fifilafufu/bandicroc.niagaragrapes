import { useState } from "react";
import { AROMA_FAMILIES, GRAPE_AROMAS, grapesWithAroma } from "../../../shared/aromas";
import { photoOf } from "../../../shared/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import { useLang } from "../../lib/lang";
import { pluralForm } from "../../../shared/i18n";
import { AROMA_PL, FAMILY_PL } from "../../../shared/i18n/pl/biology";

// Taste: why American labrusca grapes taste "foxy" (Wikipedia "Vitis labrusca", "Methyl anthranilate"),
// how ripening changes taste ("Annual growth cycle of grapevines"), and an aroma finder built from
// each grape's checked facts (shared/aromas.ts).

export default function TastePage({ onAsk }: { onAsk: (q: string) => void }) {
  const [aroma, setAroma] = useState<string>("black pepper");
  const matches = grapesWithAroma(aroma);
  const { t, lang } = useLang();
  const aName = (a: string) => (lang === "pl" ? (AROMA_PL[a] ?? a) : a);
  const fName = (f: string) => (lang === "pl" ? (FAMILY_PL[f] ?? f) : f);

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("taste.title")}</h1>
        <p className="muted">{t("taste.sub")}</p>
      </section>

      <section className="card visual">
        <h2>{t("taste.foxyTitle")}</h2>
        <div className="two-col">
          <div className="mini-card">
            <b>{t("taste.amTitle")}</b>
            <span>{t("taste.amText")}</span>
            <span className="muted">Concord, Niagara, Catawba, Delaware</span>
          </div>
          <div className="mini-card">
            <b>{t("taste.euTitle")}</b>
            <span>{t("taste.euText")}</span>
            <span className="muted">Chardonnay, Riesling, Syrah, Pinot Noir</span>
          </div>
        </div>
        <div className="callout">
          <b>{t("taste.molTitle")}</b>
          <span>{t("taste.molText")}</span>
        </div>
        <SourceLine
          wiki={[
            { label: "Vitis labrusca", title: "Vitis labrusca" },
            { label: "Methyl anthranilate", title: "Methyl anthranilate" },
          ]}
        />
      </section>

      <section className="card visual">
        <h2>{t("taste.ripeTitle")}</h2>
        <p>{t("taste.ripeText")}</p>
        <SourceLine wiki={[{ label: "Annual growth cycle of grapevines", title: "Annual growth cycle of grapevines" }]} />
      </section>

      <section className="card visual">
        <h2>{t("taste.finder")}</h2>
        <p className="muted small">{t("taste.finderSub")}</p>
        {AROMA_FAMILIES.map((f) => (
          <div key={f.family} className="aroma-family">
            <span className="aroma-family-name">
              {f.icon} {fName(f.family)}
            </span>
            <div className="chips-row">
              {f.aromas.map((a) => (
                <button key={a} className={`chip ${aroma === a ? "on" : ""}`} onClick={() => setAroma(a)} aria-pressed={aroma === a}>
                  {aName(a)}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="aroma-results" aria-live="polite">
          <p>
            <b>{aName(aroma)}</b>: {t(`taste.count.${pluralForm(lang, matches.length)}`, { n: matches.length })}
          </p>
          <ul>
            {matches.map((g) => {
              const p = photoOf(g);
              return (
                <li key={g}>
                  {p && <img src={p.thumb} alt="" loading="lazy" />}
                  <span>
                    <b>{g}</b>
                    <span className="muted small">{t("taste.also", { list: GRAPE_AROMAS[g].filter((a) => a !== aroma).map(aName).join(", ") || t("taste.none") })}</span>
                    {p && <PhotoCredit photo={p} />}
                  </span>
                  <button className="link inline" onClick={() => onAsk(t("taste.ask", { grape: g }))}>
                    {t("gal.ask")}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="muted small">
          {t("taste.note")}
        </p>
      </section>
    </div>
  );
}
