import { useState } from "react";
import { GRAPES } from "../../../shared/grapes";
import { GENERAL_CALENDAR, GENERAL_DISEASE, GENERAL_PRUNING, GROW, rootstockAdvice } from "../../../shared/grow";
import { MONTHS } from "../../../shared/growthCycle";
import { photoOf, speciesLabel, varietyInfo } from "../../lib/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import VineDiagram from "../grow/VineDiagram";

// Grow Your Grape: a care guide for one grape. Grape-specific advice comes only from its sources
// (shared/grow.ts); where none exist the page says "No reliable data" and shows the general advice
// from University of Minnesota Extension, labelled as general.

const NONE = "No reliable data";

function Fact({ label, value }: { label: string; value?: string }) {
  return (
    <div className={`fact ${value ? "" : "missing"}`}>
      <span className="muted small">{label}</span>
      <b>{value ?? NONE}</b>
    </div>
  );
}

export default function GrowPage({ favourite }: { favourite: string | null }) {
  const [name, setName] = useState(GRAPES.some((g) => g.name === favourite) ? favourite! : "Marquette");
  const [south, setSouth] = useState(false);
  const [coldest, setColdest] = useState(-20);
  const g = GROW[name];
  const v = varietyInfo(name);
  const photo = photoOf(name);
  const species = speciesLabel(v?.vivc?.species ?? null);
  const shift = (m: number) => MONTHS[(m - 1 + (south ? 6 : 0)) % 12];

  // Winter check: only with a temperature a source gives.
  let winter: { tone: "good" | "warn" | "bad" | "none"; text: string };
  if (g?.cold?.minC !== undefined) {
    const margin = coldest - g.cold.minC;
    winter =
      margin >= 3
        ? { tone: "good", text: `${name} should survive ${coldest} °C (sources: down to about ${g.cold.minC} °C).` }
        : margin >= 0
          ? { tone: "warn", text: `Borderline: ${coldest} °C is close to the ${g.cold.minC} °C limit. Expect some winter injury in harsh years.` }
          : { tone: "bad", text: `Too cold: ${coldest} °C is below the ${g.cold.minC} °C our sources give. Expect serious winter injury.` };
  } else
    winter = {
      tone: "none",
      text: g?.cold ? `No temperature in our sources. They say: ${g.cold.text}` : "No reliable data on how much cold this grape survives.",
    };

  // Calendar: general tasks plus this grape's own notes (only from its sourced traits).
  const own: { months: [number, number]; task: string }[] = [];
  if (g?.frostRisk) own.push({ months: [3, 5], task: `Frost risk: ${g.frostRisk}` });
  // Only when a source calls it susceptible (Marquette, for example, resists black rot).
  if (/susceptible[^.]*black rot/i.test(g?.diseases ?? "")) own.push({ months: [5, 7], task: "Black rot window (bloom to about 6 weeks after): this grape is susceptible." });
  if (g?.diseases) own.push({ months: [4, 10], task: `Disease notes: ${g.diseases}` });
  if (g?.ripening === "early") own.push({ months: [8, 9], task: "Early ripener: check ripeness sooner than for most grapes." });
  if (g?.ripening === "late") own.push({ months: [10, 10], task: "Late ripener: needs a long enough season; harvest comes later." });
  if (g?.cold?.text.toLowerCase().includes("autumn frost")) own.push({ months: [10, 11], task: g.cold.text });

  return (
    <div className="stack grow">
      <section className="card">
        <h1 className="page-title">🌿 Grow Your Grape</h1>
        <p className="muted">A care guide for one grape. Advice for that grape comes from its sources; where they say nothing, we say so instead of guessing.</p>
        <label className="slider">
          <span>Grape</span>
          <select value={name} onChange={(e) => setName(e.target.value)}>
            {GRAPES.map((x) => (
              <option key={x.name} value={x.name}>
                {x.name}
                {GROW[x.name] ? "" : " (little data)"}
              </option>
            ))}
          </select>
        </label>
        <div className="grape-basis">
          {photo && <img src={photo.thumb} alt="" />}
          <span className="muted small">
            {species ?? "Species not in VIVC"}
            {photo && (
              <>
                {" "}
                · <PhotoCredit photo={photo} className="inline" />
              </>
            )}
          </span>
        </div>
      </section>

      <section className="card">
        <h2>📋 At a glance</h2>
        <div className="facts">
          <Fact label="Cold hardiness" value={g?.cold?.text} />
          <Fact label="Budbreak" value={g?.budding} />
          <Fact label="Ripening" value={g?.ripening} />
          <Fact label="Vigour" value={g?.vigour} />
          <Fact label="Pruning" value={g?.pruning ? `${g.pruning.type === "spur" ? "Spur" : "Cane"}: ${g.pruning.text}` : undefined} />
          <Fact label="Training" value={g?.training} />
          <Fact label="Climate and soil" value={g?.climateSoil} />
        </div>
        {g ? <SourceLine ids={g.src.ids} wiki={(g.src.wiki ?? []).map((w) => ({ label: w, title: w }))} /> : <p className="muted small">No grape-specific growing source found yet. The general advice below still applies.</p>}
      </section>

      <section className="card">
        <h2>❄️ Will it survive my winter?</h2>
        <label className="slider">
          <span>
            My coldest winter night <b>{coldest} °C</b>
          </span>
          <input type="range" min={-45} max={5} value={coldest} onChange={(e) => setColdest(+e.target.value)} />
        </label>
        <p className={`verdict ${winter.tone === "good" ? "good" : winter.tone === "none" ? "" : "off"}`} aria-live="polite">
          {winter.text}
        </p>
      </section>

      <section className="card">
        <h2>🦠 Diseases</h2>
        <p>
          <b>This grape:</b> {g?.diseases ?? NONE}
        </p>
        <p>
          <b>Roots and phylloxera:</b> {rootstockAdvice(name, v?.vivc?.species)}
        </p>
        <h3>For every grape (general)</h3>
        <ul className="tips">
          {GENERAL_DISEASE.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <SourceLine ids={["umn-home-grapes"]} wiki={[{ label: "Phylloxera", title: "Phylloxera" }]} />
      </section>

      <section className="card visual">
        <h2>✂️ Pruning</h2>
        {g?.pruning ? (
          <p className="muted small">
            Our sources say {name} suits <b>{g.pruning.type} pruning</b>: {g.pruning.text}
          </p>
        ) : (
          <p className="muted small">No source says whether {name} prefers spur or cane pruning, so both are shown.</p>
        )}
        <VineDiagram type={g?.pruning?.type ?? null} />
        <h3>For every grape (general)</h3>
        <ul className="tips">
          {GENERAL_PRUNING.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <SourceLine ids={["umn-home-grapes", "oiv-varieties-2017"]} />
      </section>

      <section className="card">
        <h2>📅 Care calendar</h2>
        <div className="chips-row" role="group" aria-label="Hemisphere">
          <button className={`chip ${!south ? "on" : ""}`} onClick={() => setSouth(false)} aria-pressed={!south}>
            Northern Hemisphere
          </button>
          <button className={`chip ${south ? "on" : ""}`} onClick={() => setSouth(true)} aria-pressed={south}>
            Southern Hemisphere
          </button>
        </div>
        <ol className="calendar">
          {[...own.map((o) => ({ ...o, own: true })), ...GENERAL_CALENDAR.map((o) => ({ ...o, own: false }))]
            .sort((a, b) => a.months[0] - b.months[0])
            .map((o) => (
              <li key={o.task} className={o.own ? "own" : ""}>
                <span className="cal-months">{o.months[0] === o.months[1] ? shift(o.months[0]) : `${shift(o.months[0])} to ${shift(o.months[1])}`}</span>
                <span>
                  {o.own && <b>{name}: </b>}
                  {o.task}
                </span>
              </li>
            ))}
        </ol>
        <p className="muted small">Usual months for a cold-winter climate like Minnesota's; they move with your weather. Lines starting with “{name}” come from this grape's sources.</p>
        <SourceLine ids={["umn-home-grapes"]} wiki={[{ label: "Annual growth cycle of grapevines", title: "Annual growth cycle of grapevines" }]} />
      </section>
    </div>
  );
}
