import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Counter from "./Counter";
import AnswerTools from "./AnswerTools";
import { wikiUrl } from "../../shared/grapes";
import { GREETING, plainAnswer, SUGGESTIONS, type Msg } from "../lib/chatMessages";
import { askGrapeBot, photosFor, rememberJoke } from "../lib/grapeBot";

const MAX = 500;

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
  const boxRef = useRef<HTMLTextAreaElement>(null);
  // Bumped by "Clear chat" so a reply that arrives afterwards is ignored.
  const generation = useRef(0);

  // Scrolling (only the message list, never the page around it):
  // - opening the chat shows the newest messages;
  // - while an answer comes in, the list follows it only until your question reaches the top, so the
  //   start of the answer never slides out of view;
  // - as soon as you touch, scroll or use the wheel on the list, it stops moving by itself.
  const listRef = useRef<HTMLDivElement>(null);
  const question = useRef<number | null>(null); // index of the question being answered
  const userScrolled = useRef(false);
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  useLayoutEffect(() => {
    const el = listRef.current;
    const i = question.current;
    if (!el || i === null) return;
    const bubble = el.querySelectorAll<HTMLElement>(".bubble")[i];
    if (bubble && !userScrolled.current) {
      const questionTop = bubble.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 8;
      el.scrollTop = Math.min(el.scrollHeight - el.clientHeight, questionTop);
    }
    if (!busy) question.current = null; // answer finished: stop following
  }, [messages, busy]);
  const stopFollowing = () => {
    userScrolled.current = true;
  };

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
    question.current = messages.length; // your new question: bring it and its answer into view
    userScrolled.current = false;
    const gen = generation.current;
    const history = [...messages, { role: "user" as const, content }];
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages([...history, { role: "assistant", content: "", pending: true, id }]);
    setInput("");
    setBusy(true);

    // Grapes that already had a photo in this chat don't get another one.
    const shown = new Set(messages.flatMap((m) => m.photos?.map((p) => p.wiki) ?? []));

    try {
      for await (const ev of askGrapeBot(history, loggedIn ? favourite : null)) {
        if (ev.type === "meta") {
          if (ev.joke) rememberJoke(ev.joke);
          patchLast(gen, (m) => ({ ...m, sources: ev.sources ?? [], followUps: ev.followUps ?? [] }));
          const photos = photosFor(ev.grapes ?? [], shown);
          if (photos.length) patchLast(gen, (m) => ({ ...m, photos }));
        } else if (ev.type === "text" || ev.type === "error") {
          patchLast(gen, (m) => ({ ...m, content: m.content + (ev.text ?? "") }));
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
    question.current = null;
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

          <div
            className="messages"
            aria-live="polite"
            ref={listRef}
            onWheel={stopFollowing}
            onTouchStart={stopFollowing}
            onPointerDown={stopFollowing}
          >
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
                      <span key={p.wiki} className="bubble-photo">
                        <img src={p.src} alt={`${p.name} grapes`} loading="lazy" />
                        <span>
                          <a href={wikiUrl(p.wiki)} target="_blank" rel="noreferrer">
                            {p.name}
                          </a>
                          {p.credit && (
                            <span className="photo-credit">
                              Photo:{" "}
                              <a href={p.credit.page} target="_blank" rel="noreferrer">
                                {p.credit.author.slice(0, 40)}
                              </a>
                              , {p.credit.licence}
                            </span>
                          )}
                        </span>
                      </span>
                    ))}
                    {m.role === "assistant" ? plainAnswer(m.content) : m.content}
                    {m.pending && <span className="caret" aria-hidden="true" />}
                    {m.role === "assistant" && !m.pending && m !== GREETING && <AnswerTools text={plainAnswer(m.content)} />}
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
