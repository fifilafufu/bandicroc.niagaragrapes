import { GRAPES, wikiUrl } from "../../../shared/grapes";
import { useLang } from "../../lib/lang";

// Links to every grape's Wikipedia article.
export default function LearnList() {
  const { t } = useLang();
  return (
    <details className="card collapsible">
      <summary>
        <span>{t("mine.learnTitle")}</span>
      </summary>
      <p className="muted small">{t("mine.learnNote")}</p>
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
