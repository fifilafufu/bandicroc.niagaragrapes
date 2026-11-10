import { useState } from "react";
import { USES_SERIES, type UsesYear } from "../../../shared/grapeUses";
import { SOURCES, type SourceId } from "../../../shared/sources";
import SourceLine from "../SourceLine";

// Line chart of what the world's grapes are used for, OIV years only. Lines join published years;
// the long 2000 to 2018 gap and the provisional 2025 figure are dashed so nothing looks invented.

type Key = "pressed" | "table" | "dried";
const SERIES: { key: Key; label: string; shape: "circle" | "square" | "diamond" }[] = [
  { key: "pressed", label: "Pressed (wine, musts, juice)", shape: "circle" },
  { key: "table", label: "Table grapes (eaten fresh)", shape: "square" },
  { key: "dried", label: "Dried (raisins)", shape: "diamond" },
];
const SHORT: Record<Key, string> = { pressed: "Pressed", table: "Table", dried: "Dried" };

const W = 360;
const H = 210;
const M = { l: 30, r: 58, t: 12, b: 26 };
const X0 = 2000;
const X1 = 2025;
const YMAX = 60;
const x = (year: number) => M.l + ((year - X0) / (X1 - X0)) * (W - M.l - M.r);
const y = (pct: number) => M.t + (1 - pct / YMAX) * (H - M.t - M.b);

function Marker({ shape, cx, cy, hollow }: { shape: string; cx: number; cy: number; hollow?: boolean }) {
  const common = { className: hollow ? "mk hollow" : "mk" };
  if (shape === "square") return <rect {...common} x={cx - 4} y={cy - 4} width={8} height={8} rx={1.5} />;
  if (shape === "diamond") return <rect {...common} x={cx - 4} y={cy - 4} width={8} height={8} rx={1} transform={`rotate(45 ${cx} ${cy})`} />;
  return <circle {...common} cx={cx} cy={cy} r={4.5} />;
}

export default function UsesShareChart() {
  const [picked, setPicked] = useState<UsesYear>(USES_SERIES.find((d) => d.year === 2024)!);
  // Newest source first.
  const sourceIds = [...new Set(USES_SERIES.map((d) => d.source))].sort((a, b) => SOURCES[b].year - SOURCES[a].year) as SourceId[];

  return (
    <figure className="chart">
      <figcaption className="chart-title">
        <b>Where the world's grapes go, 2000 to 2025</b>
        <span className="muted small">Share of grapes available after harvest losses (%)</span>
      </figcaption>

      <ul className="chart-legend" aria-label="Legend">
        {SERIES.map((s) => (
          <li key={s.key} className={`s-${s.key}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <Marker shape={s.shape} cx={6} cy={6} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>

      <svg viewBox={`0 0 ${W} ${H}`} className="line-chart" role="img" aria-label="Line chart: pressed grapes fell from 57% in 2018 to 47% in 2024, table grapes rose from 26% in 2000 to 48% in 2025, dried grapes stayed around 7%.">
        {[0, 20, 40, 60].map((v) => (
          <g key={v}>
            <line className="grid" x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
            <text className="axis" x={M.l - 6} y={y(v) + 4} textAnchor="end">
              {v}%
            </text>
          </g>
        ))}
        {[2000, 2005, 2010, 2015, 2020, 2025].map((yr) => (
          <text key={yr} className="axis" x={x(yr)} y={H - 8} textAnchor="middle">
            {yr}
          </text>
        ))}

        <line className="rule" x1={x(picked.year)} x2={x(picked.year)} y1={M.t} y2={H - M.b} />

        {SERIES.map((s) => {
          const pts = USES_SERIES.filter((d) => d[s.key] !== undefined);
          const last = pts[pts.length - 1];
          return (
            <g key={s.key} className={`s-${s.key}`}>
              {pts.slice(1).map((d, i) => {
                const prev = pts[i];
                const dashed = d.year - prev.year > 5 || d.provisional;
                return (
                  <line
                    key={d.year}
                    className={`ln ${dashed ? "dashed" : ""}`}
                    x1={x(prev.year)}
                    y1={y(prev[s.key]!)}
                    x2={x(d.year)}
                    y2={y(d[s.key]!)}
                  />
                );
              })}
              {pts.map((d) => (
                <Marker key={d.year} shape={s.shape} cx={x(d.year)} cy={y(d[s.key]!)} hollow={d.provisional} />
              ))}
              <text className="direct" x={x(last.year) + 8} y={y(last[s.key]!) + (s.key === "table" ? -2 : s.key === "pressed" ? 10 : 4)}>
                {SHORT[s.key]} {last[s.key]}%
              </text>
            </g>
          );
        })}

        {/* Big invisible tap targets, one per published year. */}
        {USES_SERIES.map((d) => (
          <rect
            key={d.year}
            className="hit"
            x={x(d.year) - 12}
            y={M.t}
            width={24}
            height={H - M.t - M.b}
            onClick={() => setPicked(d)}
            onMouseEnter={() => setPicked(d)}
          >
            <title>{d.year}</title>
          </rect>
        ))}
      </svg>

      <p className="map-readout" aria-live="polite">
        <b>{picked.year}</b>
        {picked.provisional && <span className="muted"> (provisional)</span>}
        {SERIES.map((s) =>
          picked[s.key] !== undefined ? (
            <span key={s.key}>
              {" "}
              · {SHORT[s.key]} {picked[s.key]}%
            </span>
          ) : null,
        )}
        <span className="muted"> · {SOURCES[picked.source].publisher}</span>
      </p>
      <p className="muted small">
        Tap a year. Lines only join years OIV has published; dashed parts cover a long gap or a provisional figure. For 2000 and 2025
        OIV has only given the table-grape share so far.
      </p>

      <details className="chart-table">
        <summary>Show as a table</summary>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Pressed</th>
              <th>Table</th>
              <th>Dried</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {USES_SERIES.map((d) => (
              <tr key={d.year}>
                <td>
                  {d.year}
                  {d.provisional ? "*" : ""}
                </td>
                <td>{d.pressed ?? "n/a"}{d.pressed !== undefined && "%"}</td>
                <td>{d.table ?? "n/a"}{d.table !== undefined && "%"}</td>
                <td>{d.dried ?? "n/a"}{d.dried !== undefined && "%"}</td>
                <td>{SOURCES[d.source].publisher}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">* provisional. n/a: not published by OIV.</p>
      </details>

      <SourceLine ids={sourceIds} />
    </figure>
  );
}
