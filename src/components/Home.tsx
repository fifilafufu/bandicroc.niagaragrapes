import InstallHelp from "./InstallHelp";

const FACTS = [
  { title: "Born in New York", text: "Bred in 1868 in Lockport, Niagara County, by crossing Concord with Cassady." },
  { title: "Green-gold & sweet", text: "A white (green) grape with a sweet, foxy, candy-like flavour and slip-skin." },
  { title: "Juice & jelly star", text: "The leading white grape for juice and jelly in the US, and great eaten fresh." },
  { title: "Tough vines", text: "A hardy grape that handles cold winters around the Great Lakes." },
];

export default function Home({ onChat }: { onChat: () => void }) {
  return (
    <div className="stack">
      <section className="hero card">
        <img className="hero-grapes" src="/favicon.svg" alt="" width={84} height={84} />
        <h1>Niagara grapes</h1>
        <p>The sweet green grape of the Great Lakes, and Grape Bot's one true love.</p>
        <button className="primary" onClick={onChat}>
          Chat with Grape Bot
        </button>
      </section>

      <section className="facts">
        {FACTS.map((f) => (
          <article key={f.title} className="card fact">
            <h2>{f.title}</h2>
            <p>{f.text}</p>
          </article>
        ))}
      </section>

      <InstallHelp />
    </div>
  );
}
