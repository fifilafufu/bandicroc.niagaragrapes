import { useEffect, useMemo, useState } from "react";
import { wikiUrl } from "../../../shared/grapes";

// "Where grapes grow" as a world map: each country coloured by how many grapes it grew.
// The paths are pre-drawn by scripts/build-map.mjs (FAO data via Our World in Data) and loaded
// only when this card is shown, so the rest of the app stays light.

type Country = { name: string; d: string; t: number }; // t = thousand tonnes
type MapData = { width: number; height: number; year: number; worldKt: number; countries: Country[] };

// Thousand tonnes. Darker purple = more grapes.
const BANDS = [
  { min: 10000, label: "10M+ t", color: "#4a1f73" },
  { min: 3000, label: "3–10M", color: "#6d3a9c" },
  { min: 1000, label: "1–3M", color: "#9566c0" },
  { min: 300, label: "0.3–1M", color: "#b99ad8" },
  { min: 1, label: "under 0.3M", color: "#dccbec" },
];
const bandOf = (t: number) => BANDS.find((b) => t >= b.min);

const NAMES: Record<string, string> = { "United States of America": "United States" };
const nice = (n: string) => NAMES[n] ?? n;

function tonnes(kt: number) {
  if (kt >= 1000) return `${(kt / 1000).toFixed(1)} million tonnes`;
  return `${kt.toLocaleString("en")} thousand tonnes`;
}

export default function WorldMap() {
  const [data, setData] = useState<MapData | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<string | null>("China");

  useEffect(() => {
    import("../../data/worldMap.json")
      .then((m) => setData(m.default as MapData))
      .catch(() => setFailed(true));
  }, []);

  const ranked = useMemo(
    () => (data ? [...data.countries].filter((c) => c.t > 0).sort((a, b) => b.t - a.t) : []),
    [data],
  );
  const current = data?.countries.find((c) => c.name === picked) ?? null;
  const rank = current ? ranked.indexOf(current) + 1 : 0;

  return (
    <article className="card topic visual">
      <h2>
        <span aria-hidden="true">🌍</span> Where they grow
      </h2>
      <p>
        The world grew {data ? `${(data.worldKt / 1000).toFixed(1)} million tonnes` : "about 76 million tonnes"} of grapes in{" "}
        {data?.year ?? 2024}. China grows the most by far, then Italy, Spain, the US and France. Tap a country to see its harvest.
      </p>

      {failed ? (
        <p className="muted small">The map couldn't load. Check your connection and open this page again.</p>
      ) : !data ? (
        <div className="map-skeleton" aria-hidden="true" />
      ) : (
        <>
          <svg
            className="world-map"
            viewBox={`0 0 ${data.width} ${data.height}`}
            role="img"
            aria-label="World map of grape production by country"
          >
            {data.countries.map((c) => {
              const band = bandOf(c.t);
              return (
                <path
                  key={c.name}
                  d={c.d}
                  className={`${band ? "grows" : "none"} ${picked === c.name ? "picked" : ""}`}
                  style={band ? { fill: band.color } : undefined}
                  onClick={() => setPicked(c.name)}
                  onMouseEnter={() => setPicked(c.name)}
                >
                  <title>{`${nice(c.name)}: ${c.t ? tonnes(c.t) : "few or no grapes"}`}</title>
                </path>
              );
            })}
          </svg>

          <p className="map-readout" aria-live="polite">
            {current ? (
              <>
                <b>{nice(current.name)}</b>{" "}
                {current.t ? (
                  <>
                    · {tonnes(current.t)} <span className="muted">(#{rank} in the world)</span>
                  </>
                ) : (
                  <span className="muted">· grows few or no grapes</span>
                )}
              </>
            ) : (
              <span className="muted">Tap a country</span>
            )}
          </p>

          <div className="map-legend" aria-label="Legend">
            {BANDS.map((b) => (
              <span key={b.label}>
                <i style={{ background: b.color }} />
                {b.label}
              </span>
            ))}
            <span>
              <i className="none" />
              few / none
            </span>
          </div>

          <ol className="map-top">
            {ranked.slice(0, 5).map((c) => (
              <li key={c.name}>
                <button className={picked === c.name ? "on" : ""} onClick={() => setPicked(c.name)}>
                  <span>{nice(c.name)}</span>
                  <i style={{ width: `${(c.t / ranked[0].t) * 100}%`, background: bandOf(c.t)!.color }} />
                  <b>{(c.t / 1000).toFixed(1)}M t</b>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      <p className="sources-line">
        <a href={wikiUrl("Grape")} target="_blank" rel="noreferrer">
          📖 Grape: production
        </a>
        <a href="https://ourworldindata.org/grapher/grapes-production" target="_blank" rel="noreferrer">
          📊 FAO data (Our World in Data)
        </a>
      </p>
    </article>
  );
}
