import { wikiUrl } from "../../shared/grapes";
import { SOURCES, type Source, type SourceId } from "../../shared/sources";

// The "where this comes from" line under a card: data sources (📊) first, then Wikipedia (📖).
export default function SourceLine({ ids = [], wiki = [] }: { ids?: SourceId[]; wiki?: { label: string; title: string }[] }) {
  return (
    <p className="sources-line">
      {ids.map((id) => {
        const s: Source = SOURCES[id];
        return (
          <a key={id} href={s.url} target="_blank" rel="noreferrer" title={`${s.title} (${s.year}). Checked ${s.checked}.`}>
            📊 {s.publisher}: {s.title}
          </a>
        );
      })}
      {wiki.map((w) => (
        <a key={w.label} href={wikiUrl(w.title)} target="_blank" rel="noreferrer">
          📖 {w.label}
        </a>
      ))}
    </p>
  );
}
