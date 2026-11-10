import { useState } from "react";
import { STEPS, STYLES, type StepId, type Style } from "../../../shared/winemaking";
import SourceLine from "../SourceLine";

// Winemaking: pick a style and walk through its steps; tap a step for what it does and why.
// Below, a table compares where each step happens in red, white, rosé and sparkling wine.

const ORDER: StepId[] = ["harvest", "crush", "maceration", "press", "ferment", "mlf", "age", "clarify", "bottle", "tirage", "second", "lees", "riddle", "disgorge"];

export default function WinemakingPage() {
  const [styleId, setStyleId] = useState<Style["id"]>("red");
  const [open, setOpen] = useState<StepId | null>("maceration");
  const style = STYLES.find((s) => s.id === styleId)!;

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">🍷 How wine is made</h1>
        <p className="muted">The same few steps, in a different order, make red, white, rosé or sparkling wine.</p>
      </section>

      <section className="card visual">
        <div className="chips-row" role="group" aria-label="Wine style">
          {STYLES.map((s) => (
            <button key={s.id} className={`chip ${styleId === s.id ? "on" : ""}`} onClick={() => setStyleId(s.id)} aria-pressed={styleId === s.id}>
              {s.icon} {s.name}
            </button>
          ))}
        </div>
        <p className="style-blurb">{style.blurb}</p>

        <ol className={`flow flow-${style.id}`}>
          {style.steps.map((s, i) => {
            const step = STEPS[s.id];
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
                    {(s.note || s.sometimes) && (
                      <span className="muted small">
                        {s.sometimes ? "sometimes" : ""}
                        {s.sometimes && s.note ? ": " : ""}
                        {s.note}
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
                      <b>What happens:</b> {step.what}
                    </p>
                    <p>
                      <b>Why:</b> {step.why}
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
        <h2>🔀 How the four styles differ</h2>
        <p className="muted small">The number is when each step happens. The big difference: red wine is pressed after fermenting, white and rosé before.</p>
        <div className="compare-wrap">
          <table className="compare">
            <thead>
              <tr>
                <th>Step</th>
                {STYLES.map((s) => (
                  <th key={s.id}>
                    <span aria-hidden="true">{s.icon}</span> {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ORDER.map((id) => (
                <tr key={id} className={id === "press" ? "highlight" : ""}>
                  <th scope="row">
                    {STEPS[id].icon} {STEPS[id].name}
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
        <p className="muted small">(n) = sometimes. – = not part of this style.</p>
        <SourceLine ids={["oiv-code", "awri-mlf-red"]} wiki={[{ label: "Winemaking", title: "Winemaking" }, { label: "Traditional method", title: "Traditional method" }]} />
      </section>
    </div>
  );
}
