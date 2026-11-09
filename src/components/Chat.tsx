import { useEffect, useRef, useState, type FormEvent } from "react";
import Counter from "./Counter";

type Source = { title: string; url: string };
export type Msg = { role: "user" | "assistant"; content: string; sources?: Source[] };

export const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Grape Bot, your grape tutor. Ask me anything about grapes, and I'll answer from Wikipedia. 🍇",
};
const SUGGESTIONS = [
  "Where do Niagara grapes come from?",
  "How are Concord and Niagara different?",
  "What's my favourite grape?",
  "What is Riesling used for?",
];

type Props = {
  favourite: string | null;
  loggedIn: boolean;
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
};

export default function Chat({ favourite, loggedIn, messages, setMessages }: Props) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  // Bumped by "Clear chat" so a reply that arrives afterwards is ignored.
  const generation = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const gen = generation.current;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    let reply: Msg;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
          favourite: loggedIn ? favourite : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; sources?: Source[] };
      reply = {
        role: "assistant",
        content: data.reply || "Something went wrong on the vine. Try again? 🍇",
        sources: Array.isArray(data.sources) ? data.sources : [],
      };
    } catch {
      reply = { role: "assistant", content: "I can't reach the vineyard. Are you offline? 🍇" };
    }
    if (gen === generation.current) setMessages((m) => [...m, reply]);
    setBusy(false);
  }

  function clearChat() {
    generation.current += 1;
    setBusy(false);
    setMessages([GREETING]);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="chat">
      <div className="chat-head">
        <img src="/favicon.svg" alt="" width={36} height={36} />
        <div className="who">
          <b>Grape Bot</b>
          <span>Grape tutor · answers from Wikipedia</span>
        </div>
        <button className="clear-btn" onClick={clearChat} disabled={messages.length <= 1 && !busy}>
          🧹 Clear chat
        </button>
      </div>

      <div className="messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
            {m.sources && m.sources.length > 0 && (
              <div className="sources">
                {m.sources.map((s) => (
                  <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                    📖 {s.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div className="bubble assistant typing" aria-label="Grape Bot is typing">
            <span />
            <span />
            <span />
          </div>
        )}
        {messages.length === 1 && !busy && (
          <div className="suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="chip" onClick={() => send(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Grape Bot about grapes…"
          maxLength={500}
          aria-label="Message"
        />
        <button className="primary" disabled={busy || !input.trim()}>
          Send
        </button>
        <Counter length={input.length} max={500} />
      </form>
    </div>
  );
}
