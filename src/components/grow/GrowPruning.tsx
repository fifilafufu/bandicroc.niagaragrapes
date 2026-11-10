import { generalAdvice, type GrowInfo } from "../../../shared/grow";
import { useLang } from "../../lib/lang";
import SourceLine from "../SourceLine";
import VineDiagram from "./VineDiagram";

// Which pruning the sources give for this grape, the vine diagrams and the general pruning rules.
export default function GrowPruning({ name, g }: { name: string; g?: GrowInfo }) {
  const { lang, t } = useLang();
  return (
    <section className="card visual">
      <h2>{t("grow.pruneTitle")}</h2>
      {g?.pruning ? (
        <p className="muted small">
          {t("grow.pruneSays", { name })} <b>{t(g.pruning.type === "spur" ? "grow.pruneSpur" : "grow.pruneCane")}</b>: {g.pruning.text}
        </p>
      ) : (
        <p className="muted small">{t("grow.pruneBoth", { name })}</p>
      )}
      <VineDiagram type={g?.pruning?.type ?? null} />
      <h3>{t("grow.general")}</h3>
      <ul className="tips">
        {generalAdvice(lang).pruning.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <SourceLine ids={["umn-home-grapes", "oiv-varieties-2017"]} />
    </section>
  );
}
