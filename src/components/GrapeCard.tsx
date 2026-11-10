import { useEffect, useState } from "react";
import { wikiUrl, type Grape } from "../../shared/grapes";
import { fetchSummary, type Summary } from "../lib/wiki";
import { photoOf } from "../../shared/varieties";
import PhotoCredit from "./PhotoCredit";
import { useLang } from "../lib/lang";

// A short Wikipedia summary of one grape, with its checked Commons photo and credit.
export default function GrapeCard({ grape }: { grape: Grape }) {
  const [state, setState] = useState<{ wiki: string; summary: Summary | null; failed: boolean } | null>(null);
  const photo = photoOf(grape.name);
  const { t, lang } = useLang();

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
      <h2>{t("card.about", { name: grape.name })}</h2>
      {photo && (
        <figure className="grape-photo">
          <img src={photo.thumb} alt={t("chat.photoOf", { name: grape.name })} loading="lazy" />
          <figcaption>
            <PhotoCredit photo={photo} />
          </figcaption>
        </figure>
      )}
      {summary ? (
        <>
          <p lang="en">{summary.extract}</p>
          {lang !== "en" && <p className="muted small">{t("card.english")}</p>}
        </>
      ) : current?.failed ? (
        <p className="muted">{t("card.failed")}</p>
      ) : (
        <p className="muted">{t("card.loading")}</p>
      )}
      <a href={wikiUrl(grape.wiki)} target="_blank" rel="noreferrer">
        {t("card.full")}
      </a>
    </section>
  );
}
