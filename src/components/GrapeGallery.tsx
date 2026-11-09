import { useEffect, useState } from "react";
import { GRAPES } from "../../shared/grapes";
import { fetchSummary } from "../lib/wiki";

type Use = "eat" | "wine" | "juice" | "raisin";
const USE_ICON: Record<Use, string> = { eat: "🍽️", wine: "🍷", juice: "🧃", raisin: "☀️" };
const USE_LABEL: Record<Use, string> = { eat: "eating", wine: "wine", juice: "juice & jelly", raisin: "raisins" };

// Skin colour, taste and main uses of each grape: summarised from its checked facts (shared/grapes.ts).
const INFO: Record<string, { colour: string; dot: string; taste: string; uses: Use[] }> = {
  Niagara: { colour: "Green", dot: "#b9cf5a", taste: "Sweet, musky “foxy”", uses: ["eat", "juice", "wine"] },
  Concord: { colour: "Blue-purple", dot: "#3b2a5c", taste: "Sweet, musky; tart skin", uses: ["juice", "eat", "wine"] },
  Catawba: { colour: "Copper-pink", dot: "#c46a5a", taste: "Musky, grapey, tangy", uses: ["wine", "juice"] },
  Delaware: { colour: "Pale red", dot: "#d98b8b", taste: "Juicy, sweet, mild", uses: ["eat", "wine"] },
  "Cotton Candy": { colour: "Green", dot: "#b9cf5a", taste: "Very sweet, like cotton candy", uses: ["eat"] },
  "Thompson Seedless": { colour: "Pale green", dot: "#cfdc8a", taste: "Mild, sweet", uses: ["raisin", "eat", "wine"] },
  "Red Globe": { colour: "Crimson red", dot: "#a8323c", taste: "Crunchy, gently sweet", uses: ["eat"] },
  Muscat: { colour: "Green to black", dot: "linear-gradient(90deg,#b9cf5a,#2a1f33)", taste: "Sweet, very floral", uses: ["eat", "raisin", "wine"] },
  Chardonnay: { colour: "Green", dot: "#b9cf5a", taste: "Neutral; wine takes on oak & climate", uses: ["wine"] },
  Riesling: { colour: "Green", dot: "#b9cf5a", taste: "Flowery, high acidity", uses: ["wine"] },
  "Pinot Noir": { colour: "Black", dot: "#2a1f33", taste: "Wine: cherry & raspberry", uses: ["wine"] },
  "Cabernet Sauvignon": { colour: "Black", dot: "#2a1f33", taste: "Wine: blackcurrant, tannic", uses: ["wine"] },
  "Shine Muscat": { colour: "Yellow-green", dot: "#e6cf4c", taste: "Sweet, muscat aroma; edible skin", uses: ["eat"] },
  Scuppernong: { colour: "Bronze (orange-ish)", dot: "#c98a3a", taste: "Big berry, thick tough skin", uses: ["eat"] },
  "Gewürztraminer": { colour: "Pink", dot: "#e79bb0", taste: "Wine smells of lychee", uses: ["wine"] },
  Kyoho: { colour: "Almost black", dot: "#241a2e", taste: "Very sweet, juicy; peel it", uses: ["eat", "juice"] },
};

export default function GrapeGallery({ onAsk }: { onAsk: (question: string) => void }) {
  const [photos, setPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    for (const g of GRAPES) {
      fetchSummary(g.wiki).then((s) => {
        if (!cancelled && s?.thumbnail) setPhotos((p) => ({ ...p, [g.name]: s.thumbnail!.source }));
      });
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="card">
      <h2>🖼️ Meet {GRAPES.length} grapes</h2>
      <p className="muted small">Colour, taste and what each is used for. Tap one to ask Grape Bot about it.</p>
      <div className="gallery">
        {GRAPES.map((g) => {
          const info = INFO[g.name];
          return (
            <button key={g.name} className="gallery-item" onClick={() => onAsk(`Tell me about ${g.name} grapes`)}>
              <span className="gallery-img">{photos[g.name] ? <img src={photos[g.name]} alt="" loading="lazy" /> : "🍇"}</span>
              <b>{g.name}</b>
              <span className="tag">
                <i style={{ background: info?.dot }} aria-hidden="true" />
                {info?.colour}
              </span>
              <span className="taste">👅 {info?.taste}</span>
              <span className="uses" aria-label={`Used for ${info?.uses.map((u) => USE_LABEL[u]).join(", ")}`}>
                {info?.uses.map((u) => (
                  <span key={u} title={USE_LABEL[u]}>
                    {USE_ICON[u]}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <p className="legend muted small">
        {(Object.keys(USE_ICON) as Use[]).map((u) => (
          <span key={u}>
            {USE_ICON[u]} {USE_LABEL[u]}
          </span>
        ))}
      </p>
    </section>
  );
}
