import { GRAPES, wikiUrl } from "../../../shared/grapes";

// Links to every grape's Wikipedia article.
export default function LearnList() {
  return (
    <details className="card collapsible">
      <summary>
        <span>📖 Learn about each grape</span>
      </summary>
      <p className="muted small">Every grape here has a Wikipedia article. Grape Bot reads them too.</p>
      <ul className="wiki-list">
        {GRAPES.map((g) => (
          <li key={g.name}>
            <a href={wikiUrl(g.wiki)} target="_blank" rel="noreferrer">
              {g.name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
