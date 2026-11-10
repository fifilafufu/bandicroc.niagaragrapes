import { useEffect, useState } from "react";
import { wikiUrl, type Grape } from "../../shared/grapes";
import { fetchSummary, type Summary } from "../lib/wiki";
import { photoOf } from "../lib/varieties";
import PhotoCredit from "./PhotoCredit";

// A short Wikipedia summary of one grape, with its checked Commons photo and credit.
export default function GrapeCard({ grape }: { grape: Grape }) {
  const [state, setState] = useState<{ wiki: string; summary: Summary | null; failed: boolean } | null>(null);
  const photo = photoOf(grape.name);

  useEffect(() => {
    let cancelled = false;
    fetchSummary(grape.wiki).then((summary) => {
      if (!cancelled) setState({ wiki: grape.wiki, summary, failed: summary === null });
    });
    return () => {
      cancelled = true;
    };
  }, [grape.wiki]);

  const current = state?.wiki === grape.wiki ? state : null;
  const summary = current?.summary;

  return (
    <section className="card grape-card">
      <h2>About {grape.name}</h2>
      {photo && (
        <figure className="grape-photo">
          <img src={photo.thumb} alt={`${grape.name} grapes`} loading="lazy" />
          <figcaption>
            <PhotoCredit photo={photo} />
          </figcaption>
        </figure>
      )}
      {summary ? (
        <p>{summary.extract}</p>
      ) : current?.failed ? (
        <p className="muted">Couldn't load Wikipedia right now.</p>
      ) : (
        <p className="muted">Loading from Wikipedia…</p>
      )}
      <a href={wikiUrl(grape.wiki)} target="_blank" rel="noreferrer">
        Read the full article on Wikipedia →
      </a>
    </section>
  );
}
