import { useState } from "react";
import { wikiUrl } from "../../shared/grapes";
import type { SourceId } from "../../shared/sources";
import SourceLine from "./SourceLine";
import { readPref, writePref } from "../lib/prefs";
import GrapeGallery from "./GrapeGallery";
import ColourCompare from "./visuals/ColourCompare";
import type { Page } from "../lib/route";
import VarietiesExplainer from "./visuals/VarietiesExplainer";

// Short checked facts for the "Did you know?" card.
const DID_YOU_KNOW = [
  "Grapes first come from the Middle East / Western Asia, where people started growing them 6,000–8,000 years ago.",
  "\"White\" grapes are actually green: they're purple grapes with two pigment genes switched off.",
  "Grapes and raisins are toxic to dogs. Never share them with your dog!",
  "China grows the most grapes in the world: 17.0 of the 77.7 million tonnes grown in 2024, about 22% (OIV).",
  "The oldest known winery, Areni-1 in Armenia, is about 6,000 years old (c. 4100 BCE).",
  "In Spain, people eat 12 grapes at midnight on New Year's Eve, one for luck in each month.",
  "A bunch can hold anywhere from 15 to 300 grapes.",
  "Ripe grapes can be crimson, black, dark blue, yellow, green, orange or pink.",
  "Vinotherapy is a real beauty treatment that uses grape pips and pulp from wine-making.",
  "The grape with the most vineyard area in the world is Kyoho, a Japanese table grape grown mostly in China (OIV, 2015 data).",
  "Fewer grapes become wine than before: 47% were pressed for wine and juice in 2024, while 46% were eaten fresh (OIV).",
];

// Checked against the linked sources (November 2026). Grape totals and uses: OIV 2024.
const STATS = [
  { value: "8,000", label: "years of growing grapes" },
  { value: "77.7M", label: "tonnes grown in 2024 (OIV)" },
  { value: "47%", label: "pressed for wine & juice (OIV 2024)" },
  { value: "15–300", label: "grapes per bunch" },
];

type Section = { emoji: string; title: string; body: string[]; wiki: { label: string; title: string }[]; src?: SourceId[] };

const SECTIONS: Section[] = [
  {
    emoji: "🌿",
    title: "What is a grape?",
    body: [
      "Botanically, a grape is a berry. It grows in bunches of 15 to 300 on woody vines of the genus Vitis.",
      "Most grapes we eat and drink come from one species, Vitis vinifera, native to the Mediterranean and Central Asia. North America has its own wild species, like Vitis labrusca (the family of Concord and Niagara).",
    ],
    wiki: [{ label: "Grape", title: "Grape" }],
  },
  {
    emoji: "🎨",
    title: "Types & colours",
    body: [
      "Not just white and black! Ripe grapes can be crimson, black, dark blue, yellow, green, orange or pink. \"White\" grapes are really green: they're purple grapes with the pigment genes switched off.",
      "There are thousands of varieties. The big split is table grapes (for eating, often seedless) and wine grapes. Meet some of them below.",
    ],
    wiki: [{ label: "Grape", title: "Grape" }],
  },
  {
    emoji: "🏺",
    title: "A very old fruit",
    body: [
      "People have grown grapes for about 8,000 years, starting in the Middle East.",
      "The earliest known traces of wine come from near Tbilisi, Georgia (around 6000 BCE), and the oldest known winery, Areni-1 in Armenia, is from around 4100 BCE. Ancient Egyptians, Greeks, Phoenicians and Romans all grew grapes.",
    ],
    wiki: [
      { label: "Grape", title: "Grape" },
      { label: "History of wine", title: "History of wine" },
    ],
  },
  {
    emoji: "🌍",
    title: "Where they grow",
    body: [
      "In 2024 the world grew 77.7 million tonnes of grapes. China grew the most (17.0 M t, about 22%), followed by Italy and the USA.",
    ],
    wiki: [{ label: "Grape: production", title: "Grape" }],
    src: ["oiv-2024"],
  },
  {
    emoji: "🍷",
    title: "What we use them for",
    body: [
      "In 2024, 47% of the world's grapes were pressed for wine, musts and juice, 46% were eaten fresh and 7% were dried into raisins, currants and sultanas.",
      "Grapes also give us juice, jam and jelly, vinegar and grape-seed oil.",
    ],
    wiki: [
      { label: "Grape", title: "Grape" },
      { label: "Raisin", title: "Raisin" },
    ],
  },
  {
    emoji: "🍇",
    title: "Table grapes vs wine grapes",
    body: [
      "Table grapes are bred for eating: usually large, seedless and thin-skinned. Wine grapes are picked very sweet, at about 24% sugar.",
      "The grape with the most vineyard area is Kyoho, a table grape, ahead of the wine grape Cabernet Sauvignon and the Sultana (Thompson Seedless), according to OIV's variety survey (2015 data).",
    ],
    wiki: [{ label: "Grape: table and wine grapes", title: "Grape" }],
    src: ["oiv-varieties-2017"],
  },
  {
    emoji: "✨",
    title: "Meaning & traditions",
    body: [
      "In ancient Greece, Dionysus was the god of wine-making, fruit, fertility and festivity; the Romans called him Bacchus.",
      "In Spain, people eat twelve grapes at midnight on New Year's Eve, one for each bell strike, for luck in each coming month. The custom was popularised in 1909 by grape growers with a huge harvest to sell.",
    ],
    wiki: [
      { label: "Dionysus", title: "Dionysus" },
      { label: "Twelve Grapes", title: "Twelve Grapes" },
    ],
  },
  {
    emoji: "🥗",
    title: "Nutrition",
    body: ["Raw grapes are 81% water and 18% carbohydrates. 100 g has about 69 kcal and some vitamin K."],
    wiki: [{ label: "Grape: nutrition", title: "Grape" }],
  },
];

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

      <section className="stats" aria-label="Grapes in numbers">
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
