import Bunch from "./Bunch";
import { photoOf } from "../../../shared/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import { CLASSES, vivc } from "../../../shared/colourClasses";
import { CLASSES_PL } from "../../../shared/i18n/pl/varieties";
import { useLang } from "../../lib/lang";

// Grape skin colours the way grape scientists record them: the five OIV classes (OIV descriptor
// "berry: colour of skin"), as used by VIVC. Every example below was checked on its VIVC passport
// page (2026-11-10). Other facts: Wikipedia "Grape" (white grapes come from purple ones with two
// genes switched off) and "Vitis vinifera" (5,000 to 10,000 varieties as of 2012).

export default function ColourCompare({ onAsk }: { onAsk: (question: string) => void }) {
  const { t, lang } = useLang();
  const meaning = (c: (typeof CLASSES)[number]) => (lang === "pl" ? CLASSES_PL[c.cls].meaning : c.meaning);
  const note = (c: (typeof CLASSES)[number]) => (lang === "pl" ? CLASSES_PL[c.cls].note : c.note);
  return (
    <section className="card visual">
      <h2>{t("col.title")}</h2>
      <p className="muted small">{t("col.sub")}</p>

      <div className="vs">
        <figure>
          <Bunch fill="#2b1d3a" shade="#120b1a" size={92} label={t("col.blackLabel")} />
          <figcaption>
            <b>{t("col.black")}</b>
            <span>{t("col.blackText")}</span>
          </figcaption>
        </figure>

        <div className="vs-arrow" aria-hidden="true">
          <span>{t("col.genesOff")}</span>
          <svg viewBox="0 0 60 16" width="60" height="16">
            <path d="M2 8 H52 M44 2 L54 8 L44 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span>{t("col.noPigment")}</span>
        </div>

        <figure>
          <Bunch fill="#b9cf5a" shade="#7f9a2f" size={92} label={t("col.whiteLabel")} />
          <figcaption>
            <b>{t("col.white")}</b>
            <span>{t("col.whiteText")}</span>
          </figcaption>
        </figure>
      </div>

      <div className="big-numbers">
        <div>
          <b>{t("col.n1")}</b>
          <span>{t("col.n1Text")}</span>
        </div>
        <div>
          <b>{t("col.n2")}</b>
          <span>{t("col.n2Text")}</span>
        </div>
        <div>
          <b>5</b>
          <span>{t("col.n3Text")}</span>
        </div>
      </div>

      <h3 className="swatch-title">{t("col.fiveTitle")}</h3>
      <p className="muted small">
        {t("col.fiveText")}
      </p>
      <div className="swatches" role="list" aria-label={t("col.listLabel")}>
        {CLASSES.map((c) => (
          <button
            key={c.cls}
            role="listitem"
            className="swatch"
            style={{ ["--sw" as string]: c.hex }}
            onClick={() => onAsk(t("col.ask", { grape: c.grape }))}
            aria-label={t("col.swatchLabel", { cls: c.cls, meaning: meaning(c), grape: c.grape })}
          >
            <i>{photoOf(c.grape) && <img src={photoOf(c.grape)!.thumb} alt="" />}</i>
            <b>{c.cls}</b>
            <span className="swatch-meaning">{meaning(c)}</span>
            <span>{c.grape.replace("Gewürztraminer", "Gewürz­traminer")}</span>
          </button>
        ))}
      </div>
      <ul className="class-notes">
        {CLASSES.map((c) => (
          <li key={c.cls}>
            <b>{c.cls}</b> ({meaning(c)}): {note(c)}.{c.also && <> {t("col.also")} {c.also}.</>}{" "}
            <a href={vivc(c.vivcId)} target="_blank" rel="noreferrer">
              {t("col.inVivc", { grape: c.grape })}
            </a>
          </li>
        ))}
      </ul>
      <p className="muted small">{t("col.tap")}</p>
      <details className="credits">
        <summary>{t("col.credits")}</summary>
        <ul>
          {CLASSES.map((c) => {
            const p = photoOf(c.grape);
            return p ? (
              <li key={c.cls}>
                {c.grape}: <PhotoCredit photo={p} />
              </li>
            ) : null;
          })}
        </ul>
      </details>

      <SourceLine
        ids={["vivc"]}
        wiki={[
          { label: "Grape", title: "Grape" },
          { label: "Vitis vinifera", title: "Vitis vinifera" },
        ]}
      />
    </section>
  );
}
