import { useMemo, useState } from "react";
import { accountsAvailable, type User } from "../../lib/account";
import { SIM_GRAPES, TABLE_ONLY, simGrape, type SimGrape } from "../../../shared/simGrapes";
import { brixToSugar, defaultInputs, describe, makeWine, MODEL_VERSION, SKIN_STEPS, skinLabel, type Inputs } from "../../../shared/wineSim";
import { abvFromSugar } from "../../../shared/wine";
import { useSavedWines, type SavedWine } from "../../lib/useSavedWines";
import { photoOf } from "../../lib/varieties";
import SourceLine from "../SourceLine";
import WineGlass from "./WineGlass";
import { Range, Segmented } from "./Controls";
import { GROUPS } from "../../../shared/simGroups";

// Make Your Wine: choose a grape and how to make it, and see the wine that comes out.
// All the maths is in shared/wineSim.ts (tested by scripts/test-wine.ts).

export default function MakeWinePage({ user, favourite, onLogin }: { user: User | null; favourite: string | null; onLogin: () => void }) {
  const start = simGrape(favourite) ?? simGrape("Cabernet Sauvignon")!;
  const [grape, setGrape] = useState<SimGrape>(start);
  const [inp, setInp] = useState<Inputs>(() => defaultInputs(start));
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const { wines, save, remove, synced } = useSavedWines(user);

  const wine = useMemo(() => makeWine(grape, inp), [grape, inp]);
  const note = useMemo(() => describe(grape, wine), [grape, wine]);
  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) => {
    setInp((o) => ({ ...o, [k]: v }));
    setSaved(false);
  };
  const pickGrape = (n: string) => {
    const g = simGrape(n)!;
    setGrape(g);
    setInp(defaultInputs(g));
    setSaved(false);
  };
  const load = (w: SavedWine) => {
    const g = simGrape(w.grape);
    if (!g) return;
    setGrape(g);
    setInp(w.inputs);
    setName(w.name);
    document.querySelector(".content")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const skinIndex = Math.max(0, SKIN_STEPS.indexOf(inp.skinDays));
  const sugar = brixToSugar(inp.brix);
  const favNote = favourite && !simGrape(favourite) ? `${favourite} isn't in the simulator${TABLE_ONLY.includes(favourite) ? " (it's grown for eating)" : ""}.` : null;
  const photo = photoOf(grape.name);
  const styleName = `${wine.sweetnessWord} ${wine.bubblesWord === "still" ? "" : wine.bubblesWord.split(" (")[0] + " "}${wine.style === "orange" ? "orange" : wine.style}`;

  async function onSave() {
    const label = name.trim() || `My ${grape.name}`;
    await save({
      name: label.slice(0, 40),
      grape: grape.name,
      inputs: inp,
      result: { abv: +wine.abv.toFixed(1), residualSugar: Math.round(wine.residualSugar), style: wine.style, sweetness: wine.sweetnessWord, bubbles: wine.bubblesWord, core: wine.colour.core, words: wine.colour.words },
      model_version: MODEL_VERSION,
    });
    setSaved(true);
  }

  return (
    <div className="stack make-wine">
      <section className="card">
        <h1 className="page-title">🍷 Make Your Wine</h1>
        <p className="muted">Pick a grape, decide how to make it, and watch the wine change. The rules come from real winemaking: alcohol only comes from sugar, tannin only from skins and oak.</p>
        {favNote && <p className="muted small">{favNote}</p>}
      </section>

      <div className="wine-layout">
        <section className="card wine-result" aria-live="polite">
          <WineGlass
            core={wine.colour.core}
            rim={wine.colour.rim}
            rimWidth={wine.colour.rimWidth}
            pressureBar={wine.pressureBar}
            label={`A glass of ${wine.colour.words} wine${wine.pressureBar ? " with bubbles" : ""}`}
          />
          <p className="wine-style">{styleName}</p>
          <p className="muted small center">Colour: {wine.colour.words}</p>
          <div className="big-numbers">
            <div>
              <b>{wine.abv.toFixed(1)}%</b>
              <span>alcohol</span>
            </div>
            <div>
              <b>{Math.round(wine.residualSugar)} g/L</b>
              <span>sugar left</span>
            </div>
            <div>
              <b>{wine.body}</b>
              <span>body</span>
            </div>
          </div>
          <div className="tasting">
            {note.map((n) => (
              <p key={n}>{n}</p>
            ))}
            {wine.notes.map((n) => (
              <p key={n} className="callout small">
                {n}
              </p>
            ))}
          </div>
        </section>

        <section className="card wine-controls">
          <label className="slider">
            <span>Grape</span>
            <select value={grape.name} onChange={(e) => pickGrape(e.target.value)}>
              {GROUPS.map((gr) => (
                <optgroup key={gr.label} label={gr.label}>
                  {gr.names.filter((n) => SIM_GRAPES.some((s) => s.name === n)).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <div className="grape-basis">
            {photo && <img src={photo.thumb} alt="" />}
            <span className="muted small">
              {grape.basis} Usually picked at {grape.brix} °Brix, acidity {grape.ta} g/L.{grape.estimate && <b className="estimate"> Estimate</b>}
            </span>
          </div>

          <h3>1. Harvest</h3>
          <Range
            label="Ripeness"
            value={inp.brix}
            min={grape.brix - 4}
            max={grape.brix + 6}
            step={0.5}
            onChange={set("brix")}
            show={`${inp.brix} °Brix`}
            hint={`${Math.round(sugar)} g/L sugar, up to ${abvFromSugar(sugar).toFixed(1)}% alcohol`}
          />

          <h3>2. Skin contact</h3>
          <Range label="Juice on the skins" value={skinIndex} min={0} max={SKIN_STEPS.length - 1} onChange={(i) => set("skinDays")(SKIN_STEPS[i])} show={skinLabel(inp.skinDays)} hint={grape.colour >= 0.4 ? "short = rosé, long = red" : "long = orange wine"} />

          <h3>3. Fermentation</h3>
          <Range label="Sugar the yeast eats" value={inp.fermentPct} min={0} max={100} onChange={set("fermentPct")} show={`${inp.fermentPct}%`} hint="stop early for a sweeter, lighter wine" />
          <span className="field-label">Malolactic fermentation (softens acidity)</span>
          <Segmented label="Malolactic fermentation" value={inp.mlf} onChange={set("mlf")} options={[{ v: 0, label: "None" }, { v: 0.5, label: "Half" }, { v: 1, label: "Full" }]} />

          <h3>4. Ageing</h3>
          <span className="field-label">Oak barrels</span>
          <Segmented label="Oak" value={inp.oak} onChange={set("oak")} options={[{ v: "none", label: "None (steel)" }, { v: "old", label: "Old oak" }, { v: "new", label: "New oak" }]} />
          {inp.oak !== "none" && <Range label="Time in oak" value={inp.oakMonths} min={3} max={36} onChange={set("oakMonths")} show={`${inp.oakMonths} months`} />}
          <Range label="Age in the bottle" value={inp.bottleYears} min={0} max={30} onChange={set("bottleYears")} show={`${inp.bottleYears} ${inp.bottleYears === 1 ? "year" : "years"}`} />

          <h3>5. Bubbles</h3>
          <Segmented label="Bubbles" value={inp.bubbles} onChange={set("bubbles")} options={[{ v: "still", label: "Still" }, { v: "semi", label: "Semi-sparkling" }, { v: "sparkling", label: "Sparkling" }]} />
          {inp.bubbles === "sparkling" && (
            <>
              <Range label="Time on the lees" value={inp.leesMonths} min={9} max={60} onChange={set("leesMonths")} show={`${inp.leesMonths} months`} />
              <Range label="Dosage" value={inp.dosage} min={0} max={50} onChange={set("dosage")} show={`${inp.dosage} g/L sugar`} hint="sets brut, demi-sec…" />
            </>
          )}

          <h3>Save it</h3>
          <div className="save-row">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder={`My ${grape.name}`} aria-label="Wine name" />
            <button className="primary" onClick={onSave} disabled={saved}>
              {saved ? "Saved ✓" : "Save wine"}
            </button>
          </div>
          {!user && accountsAvailable && (
            <p className="muted small">
              Saved on this device.{" "}
              <button className="link inline" onClick={onLogin}>
                Log in
              </button>{" "}
              to keep your wines on all your devices.
            </p>
          )}
          {user && !synced && <p className="muted small">Saved on this device (account sync isn't set up yet).</p>}
        </section>
      </div>

      {wines.length > 0 && (
        <section className="card">
          <h2>🍾 Your wines</h2>
          <ul className="wine-list">
            {wines.map((w) => (
              <li key={w.id}>
                <i style={{ background: w.result.core }} aria-hidden="true" />
                <span>
                  <b>{w.name}</b>
                  <span className="muted small">
                    {w.grape} · {w.result.abv}% · {w.result.sweetness} · {w.result.words}
                  </span>
                </span>
                <button className="link inline" onClick={() => load(w)}>
                  Open
                </button>
                <button className="link inline danger" onClick={() => remove(w.id)} aria-label={`Delete ${w.name}`}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="card how-it-works">
        <summary>How this works</summary>
        <ul>
          <li>
            <b>Sugar:</b> ripeness in °Brix becomes grams of sugar per litre using the OIV table. Usual ripeness comes from Wikipedia's ripeness article (reds near 22 °Brix, whites near 20) and, for Concord, from growers' reports of 16 to 17 °Brix.
          </li>
          <li>
            <b>Alcohol:</b> sugar (g/L) × 0.05943 = % alcohol (OIV). Only sugar the yeast eats becomes alcohol; yeast stops at about 15.5%.
          </li>
          <li>
            <b>Acidity:</b> falls and pH rises as grapes ripen. Malolactic fermentation turns part of the acid (malic) into a softer one (lactic).
          </li>
          <li>
            <b>Colour and tannin:</b> come only from skins (and tannin also from oak). Colour comes out within days, tannin more slowly. With age, reds turn from purple to ruby, garnet, tawny and brick, lightest at the rim; whites deepen from lemon to gold and amber, faster in oak.
          </li>
          <li>
            <b>Bubbles:</b> 18 g/L of sugar fermented in a closed bottle makes about 6 bar; semi-sparkling wine has 1 to 2.5. Label words (dry, brut…) follow EU rules.
          </li>
          <li>
            <b>A teaching model:</b> the directions are real, the exact numbers are simplified. Grapes marked “Estimate” have no grape-specific source yet. Model version {MODEL_VERSION}.
          </li>
        </ul>
        <SourceLine
          ids={["oiv-sugar-alcohol", "eu-2019-33", "gp-concord-2014", "oiv-code"]}
          wiki={[
            { label: "Ripeness in viticulture", title: "Ripeness in viticulture" },
            { label: "Traditional method", title: "Traditional method" },
            { label: "Sparkling wine", title: "Sparkling wine" },
            { label: "Phenolic content in wine", title: "Phenolic content in wine" },
            { label: "Oak (wine)", title: "Oak (wine)" },
          ]}
        />
      </details>
    </div>
  );
}
