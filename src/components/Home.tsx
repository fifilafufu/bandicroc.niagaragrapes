const FACTS = [
  { emoji: "🗽", title: "Born in New York", text: "Bred in 1868 in Lockport, Niagara County, by crossing Concord with Cassady." },
  { emoji: "🍬", title: "Green-gold & sweet", text: "A white (green) grape with a sweet, foxy, candy-like flavour and slip-skin." },
  { emoji: "🧃", title: "Juice & jelly star", text: "The leading green grape grown in the US, used for juice, jelly, wine and eating fresh." },
  { emoji: "❄️", title: "Tough vines", text: "A hardy grape that handles cold winters around the Great Lakes." },
];

export default function Home({ onChat, onGetApp }: { onChat: () => void; onGetApp: (() => void) | null }) {
  return (
    <div className="stack">
      <section className="hero card">
        <img className="hero-grapes" src="/favicon.svg" alt="" width={84} height={84} />
        <h1>Niagara grapes</h1>
        <p>The sweet green grape of the Great Lakes, and Grape Bot's one true love.</p>
        <button className="primary" onClick={onChat}>
          💬 Ask Grape Bot
        </button>
      </section>

      <section className="facts">
        {FACTS.map((f) => (
          <article key={f.title} className="card fact">
            <span className="emoji" aria-hidden="true">{f.emoji}</span>
            <div>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </div>
          </article>
        ))}
      </section>

      {onGetApp && (
        <section className="card install">
          <h2>Get the app</h2>
          <p className="muted">Works on iPhone, Android and Windows. Free, no app store needed.</p>
          <button className="primary" onClick={onGetApp}>
            📲 Show me how
          </button>
        </section>
      )}
    </div>
  );
}
