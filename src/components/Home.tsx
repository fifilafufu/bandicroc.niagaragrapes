import { useState } from "react";
import { wikiUrl } from "../../shared/grapes";
import SourceLine from "./SourceLine";
import { readPref, writePref } from "../lib/prefs";
import GrapeGallery from "./GrapeGallery";
import ColourCompare from "./visuals/ColourCompare";
import type { Page } from "../lib/route";
import VarietiesExplainer from "./visuals/VarietiesExplainer";
import { DID_YOU_KNOW, SECTIONS, STATS, STATS_TITLE, type Section } from "../../shared/overview";

const WELCOME_KEY = "welcome-dismissed";

type Props = { onChat: () => void; onMyGrapes: () => void; onAsk: (q: string) => void; go: (p: Page) => void };

export default function Home({ onChat, onMyGrapes, onAsk, go }: Props) {
  const [fact, setFact] = useState(() => Math.floor(Math.random() * DID_YOU_KNOW.length));
  const [welcome, setWelcome] = useState(() => readPref(WELCOME_KEY) !== "1");
  const closeWelcome = () => {
    setWelcome(false);
    writePref(WELCOME_KEY, "1");
  };

  return (
    <div className="stack">
      {welcome && (
        <section className="card welcome" role="note">
          <button className="close corner" onClick={closeWelcome} aria-label="Close welcome">
            ✕
          </button>
          <h2>👋 Welcome!</h2>
          <ol className="welcome-steps">
            <li>
              <b>Read</b> about grapes below
            </li>
            <li>
              <b>Ask</b> Grape Bot anything about grapes
            </li>
            <li>
              <b>Save</b> your favourite grape in My Grapes
            </li>
          </ol>
          <button className="secondary" onClick={closeWelcome}>
            Got it
          </button>
        </section>
      )}

      <section className="hero card">
        <img className="hero-grapes" src="/favicon.svg" alt="" width={84} height={84} />
        <h1>Grapes</h1>
        <p>One of humanity's oldest fruits: eaten fresh, dried, juiced and made into wine for about 8,000 years.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onChat}>
            💬 Ask Grape Bot
          </button>
          <button className="secondary" onClick={onMyGrapes}>
            🧺 My Grapes
          </button>
        </div>
      </section>

      <section className="card dyk" aria-live="polite">
        <p className="eyebrow">💡 Did you know?</p>
        <p className="dyk-text">{DID_YOU_KNOW[fact]}</p>
        <button className="link" onClick={() => setFact((f) => (f + 1) % DID_YOU_KNOW.length)}>
          Another fact →
        </button>
      </section>

      <h2 className="stats-title">{STATS_TITLE}</h2>
      <section className="stats" aria-label={STATS_TITLE}>
        {STATS.map((s) => (
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
          return <MoreCard key="stats" icon="📊" title="Statistics" text="Where grapes grow, what they're used for, and who sells the most." onOpen={() => go("stats")} />;
        if (s.title === "What is a grape?")
          return [
            <Topic key={s.title} s={s} />,
            <MoreCard key="bio" icon="🌱" title="Biology" text="Grape species, inside a grape, and the vine's year from budbreak to harvest." onOpen={() => go("biology")} />,
            <MoreCard key="wine" icon="🍷" title="Winemaking & wine basics" text="How red, white, rosé and sparkling wine are made, and what acidity, tannin and body mean." onOpen={() => go("winemaking")} />,
            <MoreCard key="grow" icon="🌿" title="Grow Your Grape" text="A care guide per grape: winter hardiness, diseases, pruning and a yearly calendar." onOpen={() => go("grow")} />,
            <MoreCard key="taste" icon="👅" title="Taste" text="Why some grapes taste “foxy”, and which grape tastes of pepper, lychee or grass." onOpen={() => go("taste")} />,
          ];
        return <Topic key={s.title} s={s} />;
      })}

      <article className="card spotlight">
        <div>
          <p className="eyebrow">Grape Bot's favourite</p>
          <h2>Niagara 💚</h2>
          <p>
            A sweet, green-gold American grape with a musky "foxy" flavour, bred in 1868 in Niagara County, New York, by
            crossing Concord with Cassady. It's the leading green grape grown in the US.
          </p>
          <div className="hero-actions left">
            <button className="secondary" onClick={onChat}>
              Ask Grape Bot about it
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

function Topic({ s }: { s: Section }) {
  return (
    <article className="card topic">
      <h2>
        <span aria-hidden="true">{s.emoji}</span> {s.title}
      </h2>
      {s.body.map((p) => (
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
