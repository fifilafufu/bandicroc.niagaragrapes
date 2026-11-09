import { useEffect, useState } from "react";
import { wikiUrl, type Grape } from "../../shared/grapes";

type Summary = { extract: string; thumbnail?: { source: string; width: number; height: number } };

// Loads straight from Wikipedia in the browser, so it uses none of the AI allowance.
const cache = new Map<string, Summary>();

export default function GrapeCard({ grape }: { grape: Grape }) {
  const [summary, setSummary] = useState<Summary | null>(cache.get(grape.wiki) ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (cache.has(grape.wiki)) {
      setSummary(cache.get(grape.wiki)!);
      return;
    }
    let cancelled = false;
    setSummary(null);
    setFailed(false);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(grape.wiki.replace(/ /g, "_"))}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: Summary) => {
        cache.set(grape.wiki, data);
        if (!cancelled) setSummary(data);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [grape.wiki]);

  return (
    <section className="card grape-card">
      <h2>About {grape.name}</h2>
      {summary?.thumbnail && (
        <img
          src={summary.thumbnail.source}
          alt={grape.name}
          width={summary.thumbnail.width}
          height={summary.thumbnail.height}
          loading="lazy"
        />
      )}
      {summary ? (
        <p>{summary.extract}</p>
      ) : failed ? (
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
