import { useEffect, useMemo, useState } from "react";
import SourceLine from "../SourceLine";
import { useLang } from "../../lib/lang";
import { countryName, num } from "../../../shared/i18n/countries";
import type { TextKey } from "../../../shared/i18n";

// "Where grapes grow" as a world map: each country coloured by how many grapes it grew.
// The paths are pre-drawn by scripts/build-map.mjs (FAO data via Our World in Data) and loaded
// only when this card is shown, so the rest of the app stays light.

type Country = { name: string; d: string; t: number; y?: number }; // t = thousand tonnes; y = data year, if older than the map's
type MapData = { width: number; height: number; year: number; worldKt: number; countries: Country[] };

// Thousand tonnes. Darker purple = more grapes.
const BANDS: { min: number; label: TextKey; color: string }[] = [
  { min: 10000, label: "map.b1", color: "#4a1f73" },
  { min: 3000, label: "map.b2", color: "#6d3a9c" },
  { min: 1000, label: "map.b3", color: "#9566c0" },
  { min: 300, label: "map.b4", color: "#b99ad8" },
  { min: 1, label: "map.b5", color: "#dccbec" },
];
const bandOf = (t: number) => BANDS.find((b) => t >= b.min);



export default function WorldMap() {
  const [data, setData] = useState<MapData | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<string | null>("China");
  const { t, lang } = useLang();
  const nice = (name: string) => countryName(name, lang);
  const mln = (kt: number) => num(Math.round(kt / 100) / 10, lang);
  const tonnes = (kt: number) => (kt >= 1000 ? t("map.mln", { n: mln(kt) }) : t("map.kt", { n: num(kt, lang) }));

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
        <span aria-hidden="true">🌍</span> {t("map.title")}
      </h2>
      <p>
        {t("map.text", { total: data ? t("map.mln", { n: mln(data.worldKt) }) : t("map.about76"), year: data?.year ?? 2024 })}
      </p>

      {failed ? (
        <p className="muted small">{t("map.failed")}</p>
      ) : !data ? (
        <div className="map-skeleton" aria-hidden="true" />
      ) : (
        <>
          <svg
            className="world-map"
            viewBox={`0 0 ${data.width} ${data.height}`}
            role="img"
            aria-label={t("map.aria")}
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
                  <title>{`${nice(c.name)}: ${c.t ? tonnes(c.t) : t("map.few")}${c.y ? ` (${t("map.dataYear", { y: c.y })})` : ""}`}</title>
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
                    · {tonnes(current.t)}{" "}
                    <span className="muted">
                      ({t("map.rank", { rank })}{current.y ? `, ${t("map.dataYear", { y: current.y })}` : ""})
                    </span>
                  </>
                ) : (
                  <span className="muted">· {t("map.growsFew")}</span>
                )}
              </>
            ) : (
              <span className="muted">{t("map.tap")}</span>
            )}
          </p>

          <div className="map-legend" aria-label={t("chart.legend")}>
            {BANDS.map((b) => (
              <span key={b.label}>
                <i style={{ background: b.color }} />
                {t(b.label)}
              </span>
            ))}
            <span>
              <i className="none" />
              {t("map.fewNone")}
            </span>
          </div>

          <ol className="map-top">
            {ranked.slice(0, 10).map((c) => (
              <li key={c.name}>
                <button className={picked === c.name ? "on" : ""} onClick={() => setPicked(c.name)}>
                  <span>{nice(c.name)}</span>
                  <i style={{ width: `${(c.t / ranked[0].t) * 100}%`, background: bandOf(c.t)!.color }} />
                  <b>{t("map.topMt", { n: mln(c.t) })}</b>
                </button>
              </li>
            ))}
          </ol>
        </>
      )}

      <SourceLine ids={["fao-owid", "oiv-2024"]} />
    </article>
  );
}
