import { BALANCE_2024 as B, OIV_2024_MORE as M } from "../../../shared/grapeUses";
import HBarList from "../charts/HBarList";
import SourceLine from "../SourceLine";
import UsesTree from "../visuals/UsesTree";
import WorldMap from "../visuals/WorldMap";

// Statistics: production by country (FAO map), uses (OIV), table grapes, raisins and trade (OIV 2024).
export default function StatsPage() {
  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">📊 Grapes in numbers</h1>
        <p className="muted">Every number names its source and year. OIV and FAO count slightly differently, so they're never mixed in one chart.</p>
        <div className="big-numbers">
          <div>
            <b>{B.produced} M t</b>
            <span>grapes grown in {B.year}</span>
          </div>
          <div>
            <b>{M.vineyardMha} M ha</b>
            <span>of vineyards worldwide</span>
          </div>
          <div>
            <b>{M.tradeMt} M t</b>
            <span>fresh grapes exported</span>
          </div>
        </div>
        <SourceLine ids={[M.source]} />
      </section>

      <WorldMap />
      <UsesTree />

      <section className="card visual">
        <h2>🍽️ Who grows the most table grapes</h2>
        <p className="muted small">
          Grapes for eating fresh, {B.year}. These five grow {M.tableTop5Share}% of the world's {B.table} million tonnes.
        </p>
        <HBarList label="Table grape production by country, million tonnes" unit="M t" items={M.tableProducers.map((p) => ({ name: p.name, value: p.mt }))} />

        <h2 className="mt">☀️ Who makes the most raisins</h2>
        <p className="muted small">
          Dried grapes, {B.year}. These five make {M.driedTop5Share}% of the world's {B.driedProduct} million tonnes.
        </p>
        <HBarList label="Dried grape production by country, thousand tonnes" unit="kt" items={M.driedProducers.map((p) => ({ name: p.name, value: p.kt }))} />
        <SourceLine ids={[M.source]} />
      </section>

      <section className="card visual">
        <h2>🚢 Who sells grapes abroad</h2>
        <p className="muted small">
          Fresh grapes exported in {B.year}, thousand tonnes. The world traded {M.tradeMt} million tonnes, worth {M.tradeBnEur} billion euros.
        </p>
        <HBarList label="Fresh grape exports by country, thousand tonnes" unit="kt" items={M.exporters.map((e) => ({ name: e.name, value: e.kt }))} />
        <p className="muted small note">
          {`The biggest buyers were the USA (${M.topImporters[0].kt} kt), the Netherlands (${M.topImporters[1].kt} kt) and Germany (${M.topImporters[2].kt} kt). `}
          {`The Netherlands is on both lists: it buys ${M.topImporters[1].kt} kt and sells ${M.exporters[4].kt} kt.`}
        </p>
        <SourceLine ids={[M.source]} />
      </section>
    </div>
  );
}
