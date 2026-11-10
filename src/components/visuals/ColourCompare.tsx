import Bunch from "./Bunch";
import { photoOf } from "../../lib/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";
import { CLASSES, vivc } from "../../../shared/colourClasses";

// Grape skin colours the way grape scientists record them: the five OIV classes (OIV descriptor
// "berry: colour of skin"), as used by VIVC. Every example below was checked on its VIVC passport
// page (2026-11-10). Other facts: Wikipedia "Grape" (white grapes come from purple ones with two
// genes switched off) and "Vitis vinifera" (5,000 to 10,000 varieties as of 2012).

export default function ColourCompare({ onAsk }: { onAsk: (question: string) => void }) {
  return (
    <section className="card visual">
      <h2>🎨 “White” vs “black” grapes</h2>
      <p className="muted small">Not just two kinds: they're two ends of a whole range.</p>

      <div className="vs">
        <figure>
          <Bunch fill="#2b1d3a" shade="#120b1a" size={92} label="A bunch of black grapes" />
          <figcaption>
            <b>“Black” grapes</b>
            <span>Skins full of purple pigment (anthocyanins)</span>
          </figcaption>
        </figure>

        <div className="vs-arrow" aria-hidden="true">
          <span>2 genes switched off</span>
          <svg viewBox="0 0 60 16" width="60" height="16">
            <path d="M2 8 H52 M44 2 L54 8 L44 14" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span>no purple pigment</span>
        </div>

        <figure>
          <Bunch fill="#b9cf5a" shade="#7f9a2f" size={92} label="A bunch of white (green) grapes" />
          <figcaption>
            <b>“White” grapes</b>
            <span>Actually green! They came from purple grapes</span>
          </figcaption>
        </figure>
      </div>

      <div className="big-numbers">
        <div>
          <b>5,000–10,000</b>
          <span>varieties of the main grape species</span>
        </div>
        <div>
          <b>3,000+</b>
          <span>“white” (green) varieties</span>
        </div>
        <div>
          <b>5</b>
          <span>official skin colour classes</span>
        </div>
      </div>

      <h3 className="swatch-title">The 5 official skin colours</h3>
      <p className="muted small">
        Grape scientists sort every variety into one of five classes, using the French names from the international grape catalogue. Each
        has a real example.
      </p>
      <div className="swatches" role="list" aria-label="The five official grape skin colour classes, each with an example grape">
        {CLASSES.map((c) => (
          <button
            key={c.cls}
            role="listitem"
            className="swatch"
            style={{ ["--sw" as string]: c.hex }}
            onClick={() => onAsk(`Tell me about ${c.grape} grapes`)}
            aria-label={`${c.cls} (${c.meaning}): for example ${c.grape}. Ask Grape Bot about it`}
          >
            <i>{photoOf(c.grape) && <img src={photoOf(c.grape)!.thumb} alt="" />}</i>
            <b>{c.cls}</b>
            <span className="swatch-meaning">{c.meaning}</span>
            <span>{c.grape.replace("Gewürztraminer", "Gewürz­traminer")}</span>
          </button>
        ))}
      </div>
      <ul className="class-notes">
        {CLASSES.map((c) => (
          <li key={c.cls}>
            <b>{c.cls}</b> ({c.meaning}): {c.note}.{c.also && <> Also: {c.also}.</>}{" "}
            <a href={vivc(c.vivcId)} target="_blank" rel="noreferrer">
              {c.grape} in VIVC
            </a>
          </li>
        ))}
      </ul>
      <p className="muted small">Tap a colour to ask Grape Bot about that grape.</p>
      <details className="credits">
        <summary>Photo credits</summary>
        <ul>
          {CLASSES.map((c) => {
            const p = photoOf(c.grape);
            return p ? (
              <li key={c.cls}>
                {c.grape}: <PhotoCredit photo={p} />
              </li>
            ) : null;
          })}
        </ul>
      </details>

      <SourceLine
        ids={["vivc"]}
        wiki={[
          { label: "Grape", title: "Grape" },
          { label: "Vitis vinifera", title: "Vitis vinifera" },
        ]}
      />
    </section>
  );
}
