import { useEffect, useRef, useState, type FormEvent } from "react";
import Counter from "./Counter";
import { fetchSummary } from "../lib/wiki";
import { readPref, writePref } from "../lib/prefs";
import { findGrapeByWiki, wikiUrl } from "../../shared/grapes";

import { GREETING, type Msg } from "../lib/chatMessages";

const SUGGESTIONS = [
  "Where are grapes from?",
  "Can dogs eat grapes?",
  "What colours do grapes come in?",
  "What's my favourite grape?",
];
const MAX = 500;

// Jokes this device has heard, so Grape Bot tells a new one each time (see shared/jokes.ts).
const JOKES_KEY = "jokes-heard";
function heardJokes(): string[] {
  try {
    const v = JSON.parse(readPref(JOKES_KEY) ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function rememberJoke(id: string) {
  const heard = heardJokes().filter((j) => j !== id);
  writePref(JOKES_KEY, JSON.stringify([...heard, id].slice(-60)));
}

type Props = {
  favourite: string | null;
  loggedIn: boolean;
  messages: Msg[];
  setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
  autoAsk?: string | null;
  onAutoAsked?: () => void;
  onQuiz: () => void;
};

export default function Chat({ favourite, loggedIn, messages, setMessages, autoAsk, onAutoAsked, onQuiz }: Props) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  // Bumped by "Clear chat" so a reply that arrives afterwards is ignored.
  const generation = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  // Update the reply being written (always the last message).
  const patchLast = (gen: number, fn: (m: Msg) => Msg) => {
    if (gen !== generation.current) return;
    setMessages((all) => {
      const last = all[all.length - 1];
      if (!last || last.role !== "assistant" || !last.pending) return all;
      return [...all.slice(0, -1), fn(last)];
    });
  };

  async function send(text: string) {
    const content = text.trim().slice(0, MAX);
    if (!content || busy) return;
    const gen = generation.current;
    const history = [...messages, { role: "user" as const, content }];
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages([...history, { role: "assistant", content: "", pending: true, id }]);
    setInput("");
    setBusy(true);

    // Grapes that already had a photo in this chat don't get another one.
    const shown = new Set(messages.flatMap((m) => m.photos?.map((p) => p.wiki) ?? []));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.filter((m) => m !== GREETING).map(({ role, content }) => ({ role, content })),
          favourite: loggedIn ? favourite : null,
          seenJokes: heardJokes(),
        }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf("\n")) >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) continue;
          const ev = JSON.parse(line) as {
            type: string;
            text?: string;
            sources?: Msg["sources"];
            followUps?: string[];
            grapes?: string[];
            joke?: string | null;
          };
          if (ev.type === "meta") {
            if (ev.joke) rememberJoke(ev.joke);
            patchLast(gen, (m) => ({ ...m, sources: ev.sources ?? [], followUps: ev.followUps ?? [] }));
            // First time a grape comes up in this chat: show its Wikipedia photo.
            for (const wiki of (ev.grapes ?? []).filter((w) => !shown.has(w)).slice(0, 2)) {
              shown.add(wiki);
              fetchSummary(wiki).then((s) => {
                if (!s?.thumbnail || gen !== generation.current) return;
                const photo = { wiki, name: findGrapeByWiki(wiki)?.name ?? s.title, src: s.thumbnail.source };
                setMessages((all) =>
                  all.map((m) =>
                    m.id === id && !m.photos?.some((p) => p.wiki === wiki)
                      ? { ...m, photos: [...(m.photos ?? []), photo] }
                      : m,
                  ),
                );
              });
            }
          } else if (ev.type === "text" || ev.type === "error") {
            patchLast(gen, (m) => ({ ...m, content: m.content + (ev.text ?? "") }));
          }
        }
      }
      patchLast(gen, (m) => ({ ...m, pending: false, content: m.content.trim() || "Something went wrong on the vine. Try again? 🍇" }));
    } catch {
      patchLast(gen, (m) => ({
        ...m,
        pending: false,
        followUps: [],
        content: m.content.trim() || (navigator.onLine ? "Something went wrong on the vine. Try again? 🍇" : "I can't reach the vineyard. Are you offline? 🍇"),
      }));
    } finally {
      if (gen === generation.current) setBusy(false);
    }
  }

  // Send a question handed over from another screen, once.
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    if (!autoAsk) return;
    onAutoAsked?.();
    sendRef.current(autoAsk);
  }, [autoAsk, onAutoAsked]);

  function clearChat() {
    generation.current += 1;
    setBusy(false);
    setMessages([GREETING]);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  // The message box grows with the text (up to about 5 lines, then it scrolls inside).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    box.style.height = "auto";
    box.style.height = `${Math.min(box.scrollHeight, 132)}px`;
  }, [input]);

  const lastIndex = messages.length - 1;

  return (
    <div className="chat">
      <div className="chat-head">
        <img src="/favicon.svg" alt="" width={36} height={36} />
        <div className="who">
          <b>Grape Bot</b>
          <span>Grape tutor · checked facts and Wikipedia</span>
        </div>
        <button className="clear-btn" onClick={clearChat} disabled={messages.length <= 1 && !busy} aria-label="Clear chat">
          🧹
        </button>
      </div>

          <div className="messages" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role} ${m.pending && !m.content ? "typing" : ""}`}>
                {m.pending && !m.content ? (
                  <>
                    <span />
                    <span />
                    <span />
                  </>
                ) : (
                  <>
                    {m.photos?.map((p) => (
                      <a key={p.wiki} className="bubble-photo" href={wikiUrl(p.wiki)} target="_blank" rel="noreferrer">
                        <img src={p.src} alt={`${p.name} grapes`} loading="lazy" />
                        <span>{p.name}</span>
                      </a>
                    ))}
                    {m.content}
                    {m.pending && <span className="caret" aria-hidden="true" />}
                    {m.role === "assistant" && !m.pending && m !== GREETING && <AnswerTools text={m.content} />}
                    {m.sources && m.sources.length > 0 && !m.pending && (
                      <div className="sources">
                        {m.sources.map((s) => (
                          <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
                            {s.data ? "📊" : "📖"} {s.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Follow-up questions under the latest answer; starter questions on an empty chat. */}
            {!busy && (
              <div className="suggestions">
                {(messages.length === 1 ? SUGGESTIONS : messages[lastIndex].followUps ?? []).map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
                {messages.length === 1 && (
                  <button className="chip quiz-chip" onClick={onQuiz}>
                    🎯 Try a grape quiz
                  </button>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form className="composer" onSubmit={onSubmit}>
            <textarea
              ref={boxRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Enter sends; Shift+Enter makes a new line. On phones the keyboard's send key does the same.
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask Grape Bot about grapes…"
              maxLength={MAX}
              aria-label="Message"
              enterKeyHint="send"
            />
            <button className="primary" disabled={busy || !input.trim()}>
              Send
            </button>
            <Counter length={input.length} max={MAX} />
          </form>
    </div>
  );
}

// Copy an answer, or send it with the phone's share sheet.
function AnswerTools({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }
  async function share() {
    try {
      await navigator.share({ text: `${text}\n\nGrape Bot 🍇 https://bandicroc-niagaragrapes.pages.dev` });
    } catch {
      /* closed the share sheet */
    }
  }

  return (
    <div className="answer-tools">
      <button onClick={copy} aria-label="Copy answer">
        {copied ? "✓ Copied" : "📋 Copy"}
      </button>
      {canShare && (
        <button onClick={share} aria-label="Share answer">
          📤 Share
        </button>
      )}
    </div>
  );
}
