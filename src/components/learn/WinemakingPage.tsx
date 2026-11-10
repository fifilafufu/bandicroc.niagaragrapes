import { useState } from "react";
import { STEPS, STYLES, type StepId, type Style } from "../../../shared/winemaking";
import SourceLine from "../SourceLine";
import { useLang } from "../../lib/lang";
import { STEPS_PL, STYLES_PL } from "../../../shared/i18n/pl/wine";

// Winemaking: pick a style and walk through its steps; tap a step for what it does and why.
// Below, a table compares where each step happens in red, white, rosé and sparkling wine.

const ORDER: StepId[] = ["harvest", "crush", "maceration", "press", "ferment", "mlf", "age", "clarify", "bottle", "tirage", "second", "lees", "riddle", "disgorge"];

export default function WinemakingPage() {
  const [styleId, setStyleId] = useState<Style["id"]>("red");
  const [open, setOpen] = useState<StepId | null>("maceration");
  const style = STYLES.find((s) => s.id === styleId)!;
  const { t, lang } = useLang();
  const pl = lang === "pl";
  // Text in the chosen language; icons, order and sources stay the same.
  const stepText = (id: StepId) => (pl ? { ...STEPS[id], ...STEPS_PL[id] } : STEPS[id]);
  const styleName = (s: Style) => (pl ? STYLES_PL[s.id].name : s.name);
  const note = (s: Style, id: StepId, en?: string) => (pl ? (STYLES_PL[s.id].notes[id] ?? en) : en);

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">{t("wm.title")}</h1>
        <p className="muted">{t("wm.sub")}</p>
      </section>

      <section className="card visual">
        <div className="chips-row" role="group" aria-label={t("wm.style")}>
          {STYLES.map((s) => (
            <button key={s.id} className={`chip ${styleId === s.id ? "on" : ""}`} onClick={() => setStyleId(s.id)} aria-pressed={styleId === s.id}>
              {s.icon} {styleName(s)}
            </button>
          ))}
        </div>
        <p className="style-blurb">{pl ? STYLES_PL[style.id].blurb : style.blurb}</p>

        <ol className={`flow flow-${style.id}`}>
          {style.steps.map((s, i) => {
            const step = stepText(s.id);
            const stepNote = note(style, s.id, s.note);
            const isOpen = open === s.id;
            return (
              <li key={s.id} className={`flow-step ${s.sometimes ? "sometimes" : ""} ${isOpen ? "open" : ""}`}>
                <button className="flow-head" onClick={() => setOpen(isOpen ? null : s.id)} aria-expanded={isOpen}>
                  <span className="flow-num">{i + 1}</span>
                  <span className="flow-icon" aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className="flow-name">
                    <b>{step.name}</b>
                    {(stepNote || s.sometimes) && (
                      <span className="muted small">
                        {s.sometimes ? t("wm.sometimes") : ""}
                        {s.sometimes && stepNote ? ": " : ""}
                        {stepNote}
                      </span>
                    )}
                  </span>
                  <span className="flow-caret" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="flow-body">
                    <p>
                      <b>{t("wm.what")}</b> {step.what}
                    </p>
                    <p>
                      <b>{t("wm.why")}</b> {step.why}
                    </p>
                    <SourceLine ids={step.src} wiki={(step.wiki ?? []).map((w) => ({ label: w, title: w }))} />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="card visual">
        <h2>{t("wm.compareTitle")}</h2>
        <p className="muted small">{t("wm.compareSub")}</p>
        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>{t("wm.step")}</th>
                {STYLES.map((s) => (
                  <th key={s.id}>
                    <span aria-hidden="true">{s.icon}</span> {styleName(s)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDER.map((id) => (
                <tr key={id} className={id === "press" ? "highlight" : ""}>
                  <th scope="row">
                    {STEPS[id].icon} {stepText(id).name}
                  </th>
                  {STYLES.map((s) => {
                    const i = s.steps.findIndex((x) => x.id === id);
                    const st = s.steps[i];
                    return (
                      <td key={s.id} className={i < 0 ? "no" : st.sometimes ? "maybe" : "yes"}>
                        {i < 0 ? "–" : st.sometimes ? `(${i + 1})` : i + 1}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">{t("wm.legend")}</p>
        <SourceLine ids={["oiv-code", "awri-mlf-red"]} wiki={[{ label: "Winemaking", title: "Winemaking" }, { label: "Traditional method", title: "Traditional method" }]} />
      </section>
    </div>
  );
}
