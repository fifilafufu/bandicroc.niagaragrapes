import { diseaseList, type DiseaseKey } from "../../../shared/diseases";
import type { GrowInfo } from "../../../shared/grow";
import type { Resistance } from "../../../shared/varieties";
import { useLang } from "../../lib/lang";
import SourceLine from "../SourceLine";

function Fact({ label, value }: { label: string; value?: string }) {
  const { t } = useLang();
  return (
    <div className={`fact ${value ? "" : "missing"}`}>
      <span className="muted small">{label}</span>
      <b>{value ?? t("grow.none")}</b>
    </div>
  );
}

// The grape's traits in one grid; "No reliable data" where its sources say nothing.
export default function GrowGlance({ g, res, weak }: { g?: GrowInfo; res: Resistance | null; weak: DiseaseKey[] }) {
  const { lang, t } = useLang();
  const scored = res ? Object.keys(res).length : 0;
  const risk = weak.length ? t("grow.riskWeak", { list: diseaseList(weak, lang) }) : res ? (scored === 1 ? t("grow.riskNoneOne") : t("grow.riskNoneMany", { n: scored })) : undefined;
  const when = (w?: string) => (w ? t(`grow.when.${w}` as "grow.when.early") : undefined);

  return (
    <section className="card">
      <h2>{t("grow.glance")}</h2>
      <div className="facts">
        <Fact label={t("grow.cold")} value={g?.cold?.text} />
        <Fact label={t("grow.risk")} value={risk} />
        <Fact label={t("grow.budbreak")} value={when(g?.budding)} />
        <Fact label={t("grow.ripening")} value={when(g?.ripening)} />
        <Fact label={t("grow.vigour")} value={g?.vigour} />
        <Fact label={t("grow.pruning")} value={g?.pruning ? `${t(g.pruning.type === "spur" ? "grow.spur" : "grow.cane")}: ${g.pruning.text}` : undefined} />
        <Fact label={t("grow.training")} value={g?.training} />
        <Fact label={t("grow.climate")} value={g?.climateSoil} />
      </div>
      {g ? <SourceLine ids={g.src.ids} wiki={(g.src.wiki ?? []).map((w) => ({ label: w, title: w }))} /> : <p className="muted small">{t("grow.noSource")}</p>}
    </section>
  );
}
