import { useEffect, useState } from "react";
import { GRAPES } from "../../shared/grapes";
import { fetchSummary } from "../lib/wiki";

// Colour of each grape's skin, from its checked facts / Wikipedia article.
const COLOUR: Record<string, { label: string; dot: string }> = {
  Niagara: { label: "Green", dot: "#b9cf5a" },
  Concord: { label: "Blue-purple", dot: "#3b2a5c" },
  Catawba: { label: "Copper-pink", dot: "#c46a5a" },
  Delaware: { label: "Pale red", dot: "#d98b8b" },
  "Cotton Candy": { label: "Green", dot: "#b9cf5a" },
  "Thompson Seedless": { label: "Pale green", dot: "#cfdc8a" },
  "Red Globe": { label: "Red", dot: "#a8323c" },
  Muscat: { label: "Green to black", dot: "linear-gradient(90deg,#b9cf5a,#2a1f33)" },
  Chardonnay: { label: "Green", dot: "#b9cf5a" },
  Riesling: { label: "Green", dot: "#b9cf5a" },
  "Pinot Noir": { label: "Black", dot: "#2a1f33" },
  "Cabernet Sauvignon": { label: "Black", dot: "#2a1f33" },
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
      <h2>🖼️ Meet 12 grapes</h2>
      <p className="muted small">Tap one to ask Grape Bot about it.</p>
      <div className="gallery">
        {GRAPES.map((g) => (
          <button key={g.name} className="gallery-item" onClick={() => onAsk(`Tell me about ${g.name} grapes`)}>
            <span className="gallery-img">{photos[g.name] ? <img src={photos[g.name]} alt="" loading="lazy" /> : "🍇"}</span>
            <b>{g.name}</b>
            <span className="tag">
              <i style={{ background: COLOUR[g.name]?.dot }} aria-hidden="true" />
              {COLOUR[g.name]?.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
