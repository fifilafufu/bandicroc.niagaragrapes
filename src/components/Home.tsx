import { useState } from "react";
import { wikiUrl } from "../../shared/grapes";
import SourceLine from "./SourceLine";
import { readPref, writePref } from "../lib/prefs";
import GrapeGallery from "./GrapeGallery";
import ColourCompare from "./visuals/ColourCompare";
import type { Page } from "../lib/route";
import VarietiesExplainer from "./visuals/VarietiesExplainer";
import { DID_YOU_KNOW, SECTIONS, STATS, STATS_TITLE, type Section } from "../../shared/overview";
import { DID_YOU_KNOW_PL, SECTIONS_PL, STATS_PL, STATS_TITLE_PL } from "../../shared/i18n/pl/overview";
import { pick, type Lang } from "../../shared/i18n";
import { useLang } from "../lib/lang";

const WELCOME_KEY = "welcome-dismissed";

type Props = { onChat: () => void; onMyGrapes: () => void; onAsk: (q: string) => void; go: (p: Page) => void };

export default function Home({ onChat, onMyGrapes, onAsk, go }: Props) {
  const [fact, setFact] = useState(() => Math.floor(Math.random() * DID_YOU_KNOW.length));
  const [welcome, setWelcome] = useState(() => readPref(WELCOME_KEY) !== "1");
  const { t, lang } = useLang();
  const facts = pick(lang, DID_YOU_KNOW, DID_YOU_KNOW_PL);
  const stats = pick(lang, STATS, STATS_PL);
  const statsTitle = pick(lang, STATS_TITLE, STATS_TITLE_PL);
  const closeWelcome = () => {
    setWelcome(false);
    writePref(WELCOME_KEY, "1");
  };

  return (
    <div className="stack">
      {welcome && (
        <section className="card welcome" role="note">
          <button className="close corner" onClick={closeWelcome} aria-label={t("home.closeWelcome")}>
            ✕
          </button>
          <h2>{t("home.welcome")}</h2>
          <ol className="welcome-steps">
            <li>
              <b>{t("home.read")}</b>{t("home.readRest")}
            </li>
            <li>
              <b>{t("home.ask")}</b>{t("home.askRest")}
            </li>
            <li>
              <b>{t("home.save")}</b>{t("home.saveRest")}
            </li>
          </ol>
          <button className="secondary" onClick={closeWelcome}>
            {t("home.gotIt")}
          </button>
        </section>
      )}

      <section className="hero card">
        <img className="hero-grapes" src="/favicon.svg" alt="" width={84} height={84} />
        <h1>Grapes</h1>
        <p>{t("home.heroText")}</p>
        <div className="hero-actions">
          <button className="primary" onClick={onChat}>
            {t("home.askBot")}
          </button>
          <button className="secondary" onClick={onMyGrapes}>
            {t("home.myGrapes")}
          </button>
        </div>
      </section>

      <section className="card dyk" aria-live="polite">
        <p className="eyebrow">{t("home.dyk")}</p>
        <p className="dyk-text">{facts[fact]}</p>
        <button className="link" onClick={() => setFact((f) => (f + 1) % DID_YOU_KNOW.length)}>
          {t("home.anotherFact")}
        </button>
      </section>

      <h2 className="stats-title">{statsTitle}</h2>
      <section className="stats" aria-label={statsTitle}>
        {stats.map((s) => (
          <div key={s.label} className="stat card">
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </section>
      <SourceLine ids={["oiv-2024"]} wiki={[{ label: "Grape", title: "Grape" }]} />

      {SECTIONS.map((s) => {
        // Some topics are shown as pictures and numbers instead of text.
        if (s.title === "Types & colours")
          return [
            <ColourCompare key="colours" onAsk={onAsk} />,
            <VarietiesExplainer key="explainer" />,
            <GrapeGallery key="gallery" onAsk={onAsk} />,
          ];
        // Numbers and biology have their own pages now: show a short card that links there.
        if (s.title === "What we use them for") return null;
        if (s.title === "Where they grow")
          return <MoreCard key="stats" icon="📊" title={t("home.statsTitle")} text={t("home.statsText")} onOpen={() => go("stats")} />;
        if (s.title === "What is a grape?")
          return [
            <Topic key={s.title} s={s} lang={lang} />,
            <MoreCard key="bio" icon="🌱" title={t("home.bioTitle")} text={t("home.bioText")} onOpen={() => go("biology")} />,
            <MoreCard key="wine" icon="🍷" title={t("home.wineTitle")} text={t("home.wineText")} onOpen={() => go("winemaking")} />,
            <MoreCard key="grow" icon="🌿" title={t("home.growTitle")} text={t("home.growText")} onOpen={() => go("grow")} />,
            <MoreCard key="taste" icon="👅" title={t("home.tasteTitle")} text={t("home.tasteText")} onOpen={() => go("taste")} />,
          ];
        return <Topic key={s.title} s={s} lang={lang} />;
      })}

      <article className="card spotlight">
        <div>
          <p className="eyebrow">{t("home.favEyebrow")}</p>
          <h2>Niagara 💚</h2>
          <p>{t("home.niagara")}</p>
          <div className="hero-actions left">
            <button className="secondary" onClick={onChat}>
              {t("home.askAbout")}
            </button>
            <a href={wikiUrl("Niagara (grape)")} target="_blank" rel="noreferrer">
              📖 Niagara (grape)
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}

// Text in the chosen language; the sources stay the same.
function Topic({ s, lang }: { s: Section; lang: Lang }) {
  const text = pick(lang, { title: s.title, body: s.body }, SECTIONS_PL[s.title]);
  return (
    <article className="card topic">
      <h2>
        <span aria-hidden="true">{s.emoji}</span> {text.title}
      </h2>
      {text.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <SourceLine ids={s.src} wiki={s.wiki} />
    </article>
  );
}

function MoreCard({ icon, title, text, onOpen }: { icon: string; title: string; text: string; onOpen: () => void }) {
  return (
    <button className="card more-card" onClick={onOpen}>
      <span className="more-icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <b>{title}</b>
        <span className="muted small">{text}</span>
      </span>
      <span className="more-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
