import { useMemo, useState } from "react";
import { accountsAvailable, type User } from "../../lib/account";
import { SIM_GRAPES, TABLE_ONLY, simGrape, type SimGrape } from "../../../shared/simGrapes";
import { brixToSugar, defaultInputs, describe, makeWine, MODEL_VERSION, SKIN_STEPS, skinLabel, type Inputs } from "../../../shared/wineSim";
import { abvFromSugar } from "../../../shared/wine";
import { useSavedWines, type SavedWine } from "../../lib/useSavedWines";
import { photoOf } from "../../../shared/varieties";
import WineGlass from "./WineGlass";
import WineHowItWorks from "./WineHowItWorks";
import { Range, Segmented } from "./Controls";
import { GROUPS } from "../../../shared/simGroups";
import { useLang } from "../../lib/lang";
import { num } from "../../../shared/i18n/countries";
import { pluralForm } from "../../../shared/i18n";
import { BASIS_PL, colourPl, countPl, describePl, bodyPl, GROUPS_PL, notePl, skinLabelPl, styleNamePl, sweetnessPl } from "../../../shared/i18n/pl/wineSim";

// Make Your Wine: choose a grape and how to make it, and see the wine that comes out.
// All the maths is in shared/wineSim.ts (tested by scripts/test-wine.ts).

export default function MakeWinePage({ user, favourite, onLogin }: { user: User | null; favourite: string | null; onLogin: () => void }) {
  const start = simGrape(favourite) ?? simGrape("Cabernet Sauvignon")!;
  const [grape, setGrape] = useState<SimGrape>(start);
  const { t, lang } = useLang();
  const pl = lang === "pl";
  const [inp, setInp] = useState<Inputs>(() => defaultInputs(start));
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const { wines, save, remove, synced } = useSavedWines(user);

  const wine = useMemo(() => makeWine(grape, inp), [grape, inp]);
  const note = useMemo(() => (pl ? describePl(grape, wine) : describe(grape, wine)), [grape, wine, pl]);
  const colour = (words: string) => (pl ? colourPl(words) : words);
  // English counts as before; Polish uses its own plural forms.
  const months = (n: number) => (pl ? countPl(n, "month") : `${n} months`);
  const years = (n: number) => (pl ? countPl(n, "year") : `${n} ${pluralForm("en", n) === "one" ? "year" : "years"}`);
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
  const favNote = favourite && !simGrape(favourite) ? t(TABLE_ONLY.includes(favourite) ? "mw.notInTable" : "mw.notIn", { name: favourite }) : null;
  const photo = photoOf(grape.name);
  const styleNameEn = `${wine.sweetnessWord} ${wine.bubblesWord === "still" ? "" : wine.bubblesWord.split(" (")[0] + " "}${wine.style === "orange" ? "orange" : wine.style}`;
  const styleName = pl ? styleNamePl(wine) : styleNameEn;

  async function onSave() {
    const label = name.trim() || t("mw.myWine", { name: grape.name });
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
        <h1 className="page-title">{t("mw.title")}</h1>
        <p className="muted">{t("mw.sub")}</p>
        {favNote && <p className="muted small">{favNote}</p>}
      </section>

      <div className="wine-layout">
        <section className="card wine-result" aria-live="polite">
          <WineGlass
            core={wine.colour.core}
            rim={wine.colour.rim}
            rimWidth={wine.colour.rimWidth}
            pressureBar={wine.pressureBar}
            label={t(wine.pressureBar ? "mw.glassBubbles" : "mw.glass", { colour: colour(wine.colour.words) })}
          />
          <p className="wine-style">{styleName}</p>
          <p className="muted small center">{t("mw.colour", { colour: colour(wine.colour.words) })}</p>
          <div className="big-numbers">
            <div>
              <b>{num(wine.abv, lang, 1)}%</b>
              <span>{t("mw.alcohol")}</span>
            </div>
            <div>
              <b>{Math.round(wine.residualSugar)} g/L</b>
              <span>{t("mw.sugarLeft")}</span>
            </div>
            <div>
              <b>{pl ? bodyPl(wine.body) : wine.body}</b>
              <span>{t("mw.body")}</span>
            </div>
          </div>
          <div className="tasting">
            {note.map((n) => (
              <p key={n}>{n}</p>
            ))}
            {wine.notes.map((n) => (
              <p key={n} className="callout small">
                {pl ? notePl(n) : n}
              </p>
            ))}
          </div>
        </section>

        <section className="card wine-controls">
          <label className="slider">
            <span>{t("mw.grape")}</span>
            <select value={grape.name} onChange={(e) => pickGrape(e.target.value)}>
              {GROUPS.map((gr) => (
                <optgroup key={gr.label} label={pl ? (GROUPS_PL[gr.label] ?? gr.label) : gr.label}>
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
              {pl ? (BASIS_PL[grape.name] ?? grape.basis) : grape.basis} {t("mw.usually", { brix: num(grape.brix, lang), ta: num(grape.ta, lang) })}
              {grape.estimate && <b className="estimate"> {t("mw.estimate")}</b>}
            </span>
          </div>

          <h3>{t("mw.s1")}</h3>
          <Range
            label={t("mw.ripeness")}
            value={inp.brix}
            min={grape.brix - 4}
            max={grape.brix + 6}
            step={0.5}
            onChange={set("brix")}
            show={`${num(inp.brix, lang)} °Brix`}
            hint={t("mw.ripeHint", { sugar: Math.round(sugar), abv: num(abvFromSugar(sugar), lang, 1) })}
          />

          <h3>{t("mw.s2")}</h3>
          <Range label={t("mw.skins")} value={skinIndex} min={0} max={SKIN_STEPS.length - 1} onChange={(i) => set("skinDays")(SKIN_STEPS[i])} show={pl ? skinLabelPl(inp.skinDays) : skinLabel(inp.skinDays)} hint={grape.colour >= 0.4 ? t("mw.skinHintDark") : t("mw.skinHintLight")} />

          <h3>{t("mw.s3")}</h3>
          <Range label={t("mw.yeastEats")} value={inp.fermentPct} min={0} max={100} onChange={set("fermentPct")} show={`${inp.fermentPct}%`} hint={t("mw.yeastHint")} />
          <span className="field-label">{t("mw.mlfField")}</span>
          <Segmented label={t("mw.mlf")} value={inp.mlf} onChange={set("mlf")} options={[{ v: 0, label: t("mw.none") }, { v: 0.5, label: t("mw.half") }, { v: 1, label: t("mw.full") }]} />

          <h3>{t("mw.s4")}</h3>
          <span className="field-label">{t("mw.oakField")}</span>
          <Segmented label={t("mw.oak")} value={inp.oak} onChange={set("oak")} options={[{ v: "none", label: t("mw.steel") }, { v: "old", label: t("mw.oldOak") }, { v: "new", label: t("mw.newOak") }]} />
          {inp.oak !== "none" && <Range label={t("mw.oakTime")} value={inp.oakMonths} min={3} max={36} onChange={set("oakMonths")} show={months(inp.oakMonths)} />}
          <Range label={t("mw.bottleAge")} value={inp.bottleYears} min={0} max={30} onChange={set("bottleYears")} show={years(inp.bottleYears)} />

          <h3>{t("mw.s5")}</h3>
          <Segmented label={t("mw.bubbles")} value={inp.bubbles} onChange={set("bubbles")} options={[{ v: "still", label: t("mw.still") }, { v: "semi", label: t("mw.semi") }, { v: "sparkling", label: t("mw.sparkling") }]} />
          {inp.bubbles === "sparkling" && (
            <>
              <Range label={t("mw.lees")} value={inp.leesMonths} min={9} max={60} onChange={set("leesMonths")} show={months(inp.leesMonths)} />
              <Range label={t("mw.dosage")} value={inp.dosage} min={0} max={50} onChange={set("dosage")} show={t("mw.dosageShow", { n: inp.dosage })} hint={t("mw.dosageHint")} />
            </>
          )}

          <h3>{t("mw.saveTitle")}</h3>
          <div className="save-row">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder={t("mw.myWine", { name: grape.name })} aria-label={t("mw.wineName")} />
            <button className="primary" onClick={onSave} disabled={saved}>
              {saved ? t("mw.saved") : t("mw.save")}
            </button>
          </div>
          {!user && accountsAvailable && (
            <p className="muted small">
              {t("mw.onDevice")}{" "}
              <button className="link inline" onClick={onLogin}>
                {t("mw.logIn")}
              </button>{" "}
              {t("mw.keepAll")}
            </p>
          )}
          {user && !synced && <p className="muted small">{t("mw.noSync")}</p>}
        </section>
      </div>

      {wines.length > 0 && (
        <section className="card">
          <h2>{t("mw.yours")}</h2>
          <ul className="wine-list">
            {wines.map((w) => (
              <li key={w.id}>
                <i style={{ background: w.result.core }} aria-hidden="true" />
                <span>
                  <b>{w.name}</b>
                  <span className="muted small">
                    {w.grape} · {num(w.result.abv, lang)}% · {pl ? sweetnessPl(w.result.sweetness) : w.result.sweetness} · {colour(w.result.words)}
                  </span>
                </span>
                <button className="link inline" onClick={() => load(w)}>
                  {t("mw.open")}
                </button>
                <button className="link inline danger" onClick={() => remove(w.id)} aria-label={t("mw.delete", { name: w.name })}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <WineHowItWorks />
    </div>
  );
}
