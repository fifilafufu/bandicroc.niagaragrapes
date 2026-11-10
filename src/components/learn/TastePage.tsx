import { useState } from "react";
import { AROMA_FAMILIES, GRAPE_AROMAS, grapesWithAroma } from "../../../shared/aromas";
import { photoOf } from "../../lib/varieties";
import PhotoCredit from "../PhotoCredit";
import SourceLine from "../SourceLine";

// Taste: why American labrusca grapes taste "foxy" (Wikipedia "Vitis labrusca", "Methyl anthranilate"),
// how ripening changes taste ("Annual growth cycle of grapevines"), and an aroma finder built from
// each grape's checked facts (shared/aromas.ts).

export default function TastePage({ onAsk }: { onAsk: (q: string) => void }) {
  const [aroma, setAroma] = useState<string>("black pepper");
  const matches = grapesWithAroma(aroma);

  return (
    <div className="stack">
      <section className="card">
        <h1 className="page-title">👅 How grapes taste</h1>
        <p className="muted">Taste comes from the grape's species, its variety, how ripe it is, and for wine, how it was made.</p>
      </section>

      <section className="card visual">
        <h2>🦊 “Foxy” grapes vs European grapes</h2>
        <div className="two-col">
          <div className="mini-card">
            <b>American: Vitis labrusca</b>
            <span>
              The “fox grape”. A sweet, earthy musk called <i>foxy</i>, plus strawberry and raspberry notes. Its skin slips off whole when you
              squeeze the berry (“slip-skin”).
            </span>
            <span className="muted">Concord, Niagara, Catawba, Delaware</span>
          </div>
          <div className="mini-card">
            <b>European: Vitis vinifera</b>
            <span>No foxy musk. Each variety has its own aromas, and for wine, climate and winemaking (like oak) change them a lot.</span>
            <span className="muted">Chardonnay, Riesling, Syrah, Pinot Noir</span>
          </div>
        </div>
        <div className="callout">
          <b>The molecule behind “foxy”</b>
          <span>
            In the 1920s scientists found it: <b>methyl anthranilate</b>. It occurs naturally in Concord and other labrusca grapes, and it's
            used to flavour grape soda and grape Kool-Aid. It smells like Concord grapes, which is why “grape flavour” drinks taste like
            Concord juice, not like wine grapes.
          </span>
        </div>
        <SourceLine
          wiki={[
            { label: "Vitis labrusca", title: "Vitis labrusca" },
            { label: "Methyl anthranilate", title: "Methyl anthranilate" },
          ]}
        />
      </section>

      <section className="card visual">
        <h2>🍬 Ripe grapes taste sweeter</h2>
        <p>
          A young green berry is hard, with very little sugar and lots of acid. From véraison (when it changes colour) to harvest, sugar
          goes up and acids such as malic acid go down. That's why unripe grapes taste sour and ripe ones sweet.
        </p>
        <SourceLine wiki={[{ label: "Annual growth cycle of grapevines", title: "Annual growth cycle of grapevines" }]} />
      </section>

      <section className="card visual">
        <h2>🔎 Aroma finder</h2>
        <p className="muted small">Tap an aroma to see which grapes are known for it.</p>
        {AROMA_FAMILIES.map((f) => (
          <div key={f.family} className="aroma-family">
            <span className="aroma-family-name">
              {f.icon} {f.family}
            </span>
            <div className="chips-row">
              {f.aromas.map((a) => (
                <button key={a} className={`chip ${aroma === a ? "on" : ""}`} onClick={() => setAroma(a)} aria-pressed={aroma === a}>
                  {a}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="aroma-results" aria-live="polite">
          <p>
            <b>{aroma}</b>: {matches.length} {matches.length === 1 ? "grape" : "grapes"}
          </p>
          <ul>
            {matches.map((g) => {
              const p = photoOf(g);
              return (
                <li key={g}>
                  {p && <img src={p.thumb} alt="" loading="lazy" />}
                  <span>
                    <b>{g}</b>
                    <span className="muted small">Also: {GRAPE_AROMAS[g].filter((a) => a !== aroma).join(", ") || "none listed"}</span>
                    {p && <PhotoCredit photo={p} />}
                  </span>
                  <button className="link inline" onClick={() => onAsk(`What does ${g} taste like?`)}>
                    💬 Ask
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="muted small">
          From each grape's facts in the app (Wikipedia). For wine grapes these are the aromas of the wine. Grapes whose sources name no
          aroma aren't listed.
        </p>
      </section>
    </div>
  );
}
