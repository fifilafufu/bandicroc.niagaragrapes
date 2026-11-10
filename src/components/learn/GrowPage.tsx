import { useState } from "react";
import { GRAPES } from "../../../shared/grapes";
import { GROW, growFor } from "../../../shared/grow";
import type { DiseaseKey } from "../../../shared/diseases";
import { photoOf, speciesLabel, varietyInfo } from "../../../shared/varieties";
import { SPECIES_PL } from "../../../shared/i18n/pl/varieties";
import { useLang } from "../../lib/lang";
import PhotoCredit from "../PhotoCredit";
import GrowCalendar from "../grow/GrowCalendar";
import GrowDiseases from "../grow/GrowDiseases";
import GrowGlance from "../grow/GrowGlance";
import GrowPruning from "../grow/GrowPruning";
import GrowWinter from "../grow/GrowWinter";

// Grow Your Grape: a care guide for one grape. Grape-specific advice comes only from its sources
// (shared/grow.ts); where none exist the page says "No reliable data" and shows the general advice
// from University of Minnesota Extension, labelled as general.

export default function GrowPage({ favourite }: { favourite: string | null }) {
  const { lang, t } = useLang();
  const [name, setName] = useState(GRAPES.some((g) => g.name === favourite) ? favourite! : "Marquette");
  const g = growFor(name, lang);
  const v = varietyInfo(name);
  const photo = photoOf(name);
  const label = speciesLabel(v?.vivc?.species ?? null);
  const species = (lang === "pl" && label ? SPECIES_PL[label] : undefined) ?? label;
  const res = v?.resistance ?? null;
  const weak = res ? (Object.keys(res) as DiseaseKey[]).filter((k) => res[k]!.score <= 3) : [];

  return (
    <div className="stack grow">
      <section className="card">
        <h1 className="page-title">{t("grow.title")}</h1>
        <p className="muted">{t("grow.intro")}</p>
        <label className="slider">
          <span>{t("grow.grape")}</span>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {GRAPES.map((x) => (
              <option key={x.name} value={x.name}>
                {x.name}
                {GROW[x.name] || varietyInfo(x.name)?.resistance ? "" : t("grow.littleData")}
              </option>
            ))}
          </select>
        </label>
        <div className="grape-basis">
          {photo && <img src={photo.thumb} alt="" />}
          <span className="muted small">
            {species ?? t("grow.noSpecies")}
            {photo && (
              <>
                {" "}
                · <PhotoCredit photo={photo} className="inline" />
              </>
            )}
          </span>
        </div>
      </section>
      <GrowGlance g={g} res={res} weak={weak} />
      <GrowWinter name={name} g={g} />
      <GrowDiseases name={name} g={g} res={res} species={v?.vivc?.species} hasVivc={!!v?.vivc} />
      <GrowPruning name={name} g={g} />
      <GrowCalendar name={name} g={g} en={GROW[name]} weak={weak} />
    </div>
  );
}
