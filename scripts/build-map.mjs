// Builds src/data/worldMap.json: one pre-drawn SVG path per country plus its grape production,
// so the app shows the map without shipping any map libraries.
//
// Data: FAO grape production (tonnes), via Our World in Data. Shapes: Natural Earth 1:110m (world-atlas).
// Run: node scripts/build-map.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import countries from "i18n-iso-countries";

const OWID = "https://ourworldindata.org/grapher/grapes-production.csv?csvType=full";
const W = 800;
const H = 400;

const csv = await (await fetch(OWID)).text();
const latest = {}; // ISO3 -> { year, tonnes }
for (const line of csv.trim().split("\n").slice(1)) {
  const m = line.match(/^("[^"]*"|[^,]*),([A-Z]{3}),(\d+),([\d.]+)/);
  if (!m) continue;
  const [, , iso3, year, tonnes] = m;
  if (!latest[iso3] || +year > latest[iso3].year) latest[iso3] = { year: +year, tonnes: +tonnes };
}
const world = csv.trim().split("\n").filter((l) => l.startsWith("World,")).pop().split(",");

const topo = JSON.parse(readFileSync(new URL("../node_modules/world-atlas/countries-110m.json", import.meta.url), "utf8"));
const geo = feature(topo, topo.objects.countries);
const shapes = geo.features.filter((f) => f.properties.name !== "Antarctica");
const projection = geoNaturalEarth1().fitSize([W, H], { type: "FeatureCollection", features: shapes });
const path = geoPath(projection);
const round = (d) => d.replace(/(\d+\.\d)\d+/g, "$1");

const out = [];
for (const f of shapes) {
  const iso3 = f.id ? countries.numericToAlpha3(f.id) : undefined;
  const d = path(f);
  if (!d) continue;
  const data = iso3 && latest[iso3] && latest[iso3].year >= 2020 ? latest[iso3] : null;
  out.push({ name: f.properties.name, d: round(d), t: data ? Math.round(data.tonnes / 1000) : 0 });
}

mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../src/data/worldMap.json", import.meta.url),
  JSON.stringify({ width: W, height: H, year: +world[2], worldKt: Math.round(+world[3] / 1000), countries: out }),
);
console.log(`${out.length} countries, ${out.filter((c) => c.t).length} with production, world ${world[2]}: ${world[3]} t`);
