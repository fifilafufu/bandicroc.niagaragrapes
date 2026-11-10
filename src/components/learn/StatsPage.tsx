import { BALANCE_2024 as B, OIV_2024_MORE as M } from "../../../shared/grapeUses";
import HBarList from "../charts/HBarList";
import SourceLine from "../SourceLine";
import UsesTree from "../visuals/UsesTree";
import WorldMap from "../visuals/WorldMap";
import { useLang } from "../../lib/lang";
import { countryName, num } from "../../../shared/i18n/countries";

// Statistics: production by country (FAO map), uses (OIV), table grapes, raisins and trade (OIV 2024).
export default function StatsPage() {
  const { t, lang } = useLang();
  const n = (x: number) => num(x, lang);
  const c = (name: string) => countryName(name, lang);
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("stats.title")}</h1>
        <p className="muted">{t("stats.sub")}</p>
        <div className="big-numbers">
          <div>
            <b>{n(B.produced)} {t("unit.mt")}</b>
            <span>{t("stats.grown", { year: B.year })}</span>
          </div>
          <div>
            <b>{n(M.vineyardMha)} {t("unit.mha")}</b>
            <span>{t("stats.vineyards")}</span>
          </div>
          <div>
            <b>{n(M.tradeMt)} {t("unit.mt")}</b>
            <span>{t("stats.exported")}</span>
          </div>
        </div>
        <SourceLine ids={[M.source]} />
      </section>

      <WorldMap />
      <UsesTree />

      <section className="card visual">
        <h2>{t("stats.tableTitle")}</h2>
        <p className="muted small">
          {t("stats.tableText", { year: B.year, share: M.tableTop5Share, mt: n(B.table) })}
        </p>
        <HBarList label={t("stats.tableLabel")} unit={t("unit.mt")} items={M.tableProducers.map((p) => ({ name: p.name, value: p.mt }))} />

        <h2 className="mt">{t("stats.driedTitle")}</h2>
        <p className="muted small">
          {t("stats.driedText", { year: B.year, share: M.driedTop5Share, mt: n(B.driedProduct) })}
        </p>
        <HBarList label={t("stats.driedLabel")} unit={t("unit.kt")} items={M.driedProducers.map((p) => ({ name: p.name, value: p.kt }))} />
        <SourceLine ids={[M.source]} />
      </section>

      <section className="card visual">
        <h2>{t("stats.tradeTitle")}</h2>
        <p className="muted small">
          {t("stats.tradeText", { year: B.year, mt: n(M.tradeMt), eur: n(M.tradeBnEur) })}
        </p>
        <HBarList label={t("stats.tradeLabel")} unit={t("unit.kt")} items={M.exporters.map((e) => ({ name: e.name, value: e.kt }))} />
        <p className="muted small note">
          {t("stats.buyers", { c1: c(M.topImporters[0].name), a: M.topImporters[0].kt, c2: c(M.topImporters[1].name), b: M.topImporters[1].kt, c3: c(M.topImporters[2].name), c: M.topImporters[2].kt })}
          {t("stats.both", { c: c(M.topImporters[1].name), a: M.topImporters[1].kt, b: M.exporters[4].kt })}
        </p>
        <SourceLine ids={[M.source]} />
      </section>
    </div>
  );
}
