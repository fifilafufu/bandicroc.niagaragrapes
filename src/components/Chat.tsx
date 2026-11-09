import { useEffect, useRef, useState, type FormEvent } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = { role: "assistant", content: "Hi! I'm Grape Bot. Ask me anything (about grapes). 🍇" };
const SUGGESTIONS = ["What's your favourite grape?", "What's my favourite grape?", "I don't like Niagara grapes"];

export default function Chat({ favourite, loggedIn }: { favourite: string | null; loggedIn: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== GREETING),
          favourite: loggedIn ? favourite : null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string };
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "Grapes. (Something went wrong.)" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "I can't reach the vineyard. Are you offline? 🍇" }]);
    } finally {
      setBusy(false);
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="chat">
      <div className="messages" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="bubble assistant typing" aria-label="Grape Bot is typing">
            <span />
            <span />
            <span />
          </div>
        )}
        {messages.length === 1 && (
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
          placeholder="Say something to Grape Bot…"
          maxLength={500}
          aria-label="Message"
        />
        <button className="primary" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
