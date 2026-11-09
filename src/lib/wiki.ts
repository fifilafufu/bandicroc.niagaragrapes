// Wikipedia summaries (text + photo), loaded straight from Wikipedia in the browser.
// Uses none of the AI allowance; results are kept in memory for the session.

export type Summary = {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
};

const cache = new Map<string, Promise<Summary | null>>();

export function fetchSummary(title: string): Promise<Summary | null> {
  if (!cache.has(title)) {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`;
    const p = fetch(url)
      .then((r) => (r.ok ? (r.json() as Promise<Summary>) : null))
      .catch(() => null);
    cache.set(title, p);
    // Don't remember failures, so a later try can succeed (e.g. after being offline).
    p.then((v) => v === null && cache.delete(title));
  }
  return cache.get(title)!;
}
