import { DISEASE_NAMES, diseaseName, resistanceWord, type DiseaseKey } from "../../../shared/diseases";
import { generalAdvice, rootstockAdvice, type GrowInfo } from "../../../shared/grow";
import { pluralForm } from "../../../shared/i18n";
import type { Resistance } from "../../../shared/varieties";
import { useLang } from "../../lib/lang";
import SourceLine from "../SourceLine";

type Props = { name: string; g?: GrowInfo; res: Resistance | null; species?: string | null; hasVivc: boolean };

// VIVC resistance scores as bars, other sources' disease notes, phylloxera advice and general tips.
export default function GrowDiseases({ name, g, res, species, hasVivc }: Props) {
  const { lang, t } = useLang();
  return (
    <section className="card">
      <h2>{t("grow.diseases")}</h2>
      {res ? (
        <>
          <p className="muted small">{t("grow.resIntro")}</p>
          <ul className="res-bars">
            {(Object.keys(DISEASE_NAMES) as DiseaseKey[])
              .filter((k) => res[k])
              .map((k) => {
                const r = res[k]!;
                const word = resistanceWord(r.score);
                return (
                  <li key={k} className={`res-${word}`}>
                    <span>{diseaseName(k, lang)}</span>
                    <span className="res-track" aria-hidden="true">
                      <i style={{ width: `${(r.score / 9) * 100}%` }} />
                    </span>
                    <b>
                      {String(r.score).replace(".", lang === "pl" ? "," : ".")} {t(`grow.res.${word}`)}
                    </b>
                    <span className="muted small">{t(`grow.study.${pluralForm(lang, r.studies)}`, { n: r.studies })}</span>
                  </li>
                );
              })}
          </ul>
          {hasVivc && <SourceLine ids={["vivc"]} wiki={[]} />}
        </>
      ) : (
        <p className="muted small">{t("grow.noRes")}</p>
      )}
      {g?.diseases ? (
        <p>
          <b>{t("grow.otherSay")}</b> {g.diseases}
        </p>
      ) : (
        !res && <p>{t("grow.noDisease")}</p>
      )}
      <p>
        <b>{t("grow.roots")}</b> {rootstockAdvice(name, species, lang)}
      </p>
      <h3>{t("grow.general")}</h3>
      <ul className="tips">
        {generalAdvice(lang).disease.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <SourceLine ids={["umn-home-grapes"]} wiki={[{ label: "Phylloxera", title: "Phylloxera" }]} />
    </section>
  );
}
