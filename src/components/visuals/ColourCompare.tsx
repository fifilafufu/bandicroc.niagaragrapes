import { useEffect, useState } from "react";
import Bunch from "./Bunch";
import { findGrape, wikiUrl } from "../../../shared/grapes";
import { fetchSummary } from "../../lib/wiki";

// Facts: Wikipedia "Grape" (colours, white grapes derive from purple via two genes) and
// "Vitis vinifera" (5,000–10,000 varieties as of 2012; more than 3,000 white cultivars).
// One real grape for each colour (all in the gallery; colours from their Wikipedia articles).
const COLOURS = [
  { name: "Green", hex: "#9fc24a", grape: "Niagara" },
  { name: "Yellow", hex: "#e6cf4c", grape: "Shine Muscat" },
  { name: "Orange", hex: "#e3913a", grape: "Scuppernong", note: "bronze" },
  { name: "Pink", hex: "#e79bb0", grape: "Gewürztraminer" },
  { name: "Crimson", hex: "#b0243c", grape: "Red Globe" },
  { name: "Dark blue", hex: "#2f3f7a", grape: "Concord" },
  { name: "Black", hex: "#241a2e", grape: "Kyoho" },
];

export default function ColourCompare({ onAsk }: { onAsk: (question: string) => void }) {
  const [photos, setPhotos] = useState<Record<string, string>>({});
  useEffect(() => {
    let cancelled = false;
    for (const c of COLOURS) {
      const g = findGrape(c.grape);
      if (g)
        fetchSummary(g.wiki).then((s) => {
          if (!cancelled && s?.thumbnail) setPhotos((p) => ({ ...p, [c.grape]: s.thumbnail!.source }));
        });
    }
    return () => {
      cancelled = true;
    };
  }, []);

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

      <h3 className="swatch-title">One grape for every colour</h3>
      <div className="swatches" role="list" aria-label="Grape skin colours, each with an example grape">
        {COLOURS.map((c) => (
          <button
            key={c.name}
            role="listitem"
            className="swatch"
            style={{ ["--sw" as string]: c.hex }}
            onClick={() => onAsk(`Tell me about ${c.grape} grapes`)}
            aria-label={`${c.name}: ${c.grape}. Ask Grape Bot about it`}
          >
            <i>{photos[c.grape] && <img src={photos[c.grape]} alt="" />}</i>
            <b>{c.name}</b>
            <span>
              {c.grape.replace("Gewürztraminer", "Gewürz­traminer")}
              {c.note && <em> ({c.note})</em>}
            </span>
          </button>
        ))}
      </div>
      <p className="muted small">Tap a colour to ask Grape Bot about that grape.</p>

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
