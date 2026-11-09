import Bunch from "./Bunch";
import { wikiUrl } from "../../../shared/grapes";

// Facts: Wikipedia "Grape" (colours, white grapes derive from purple via two genes) and
// "Vitis vinifera" (5,000–10,000 varieties as of 2012; more than 3,000 white cultivars).
const COLOURS = [
  { name: "Green", hex: "#9fc24a" },
  { name: "Yellow", hex: "#e6cf4c" },
  { name: "Orange", hex: "#e3913a" },
  { name: "Pink", hex: "#e79bb0" },
  { name: "Crimson", hex: "#b0243c" },
  { name: "Dark blue", hex: "#2f3f7a" },
  { name: "Black", hex: "#241a2e" },
];

export default function ColourCompare() {
  return (
    <section className="card visual">
      <h2>🎨 “White” vs “black” grapes</h2>
      <p className="muted small">Not just two kinds: they're two ends of a whole rainbow.</p>

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
          <b>7</b>
          <span>skin colours, from green to black</span>
        </div>
      </div>

      <div className="swatches" role="list" aria-label="Grape skin colours">
        {COLOURS.map((c) => (
          <div key={c.name} role="listitem">
            <i style={{ background: c.hex }} />
            <span>{c.name}</span>
          </div>
        ))}
      </div>

      <p className="sources-line">
        <a href={wikiUrl("Grape")} target="_blank" rel="noreferrer">
          📖 Grape
        </a>
        <a href={wikiUrl("Vitis vinifera")} target="_blank" rel="noreferrer">
          📖 Vitis vinifera
        </a>
      </p>
    </section>
  );
}
