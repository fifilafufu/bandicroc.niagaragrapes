import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Counter from "./Counter";
import ChatBubble from "./ChatBubble";
import JuiceMeter from "./JuiceMeter";
import { GREETING, SUGGESTIONS, type Msg } from "../lib/chatMessages";
import { ChatProblem, askGrapeBot, photosFor, rememberJoke, saveDraft, savedDraft, savedJuice, saveJuice } from "../lib/grapeBot";
import { useLang } from "../lib/lang";

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
  // What you're typing is kept on this device until you send it, so leaving the chat, a slip of the
  // finger or a reload doesn't lose it.
  const [input, setInputState] = useState(savedDraft);
  const setInput = (text: string) => {
    setInputState(text);
    saveDraft(text);
  };
  const [busy, setBusy] = useState(false);
  // Today's grape juice, % left (null: unknown yet, or no daily limit on the server).
  const [juice, setJuice] = useState<number | null>(savedJuice);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const { t, lang } = useLang();
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
    if (text === input) setInput(""); // a suggestion or a question from another page keeps your draft
    setBusy(true);

    // Grapes that already had a photo in this chat don't get another one.
    const shown = new Set(messages.flatMap((m) => m.photos?.map((p) => p.wiki) ?? []));

    try {
      for await (const ev of askGrapeBot(history, loggedIn ? favourite : null, lang)) {
        if (ev.type === "meta") {
          if (ev.joke) rememberJoke(ev.joke);
          patchLast(gen, (m) => ({ ...m, sources: ev.sources ?? [], followUps: ev.followUps ?? [] }));
          const photos = photosFor(ev.grapes ?? [], shown);
          if (photos.length) patchLast(gen, (m) => ({ ...m, photos }));
        } else if (ev.type === "text" || ev.type === "error") {
          patchLast(gen, (m) => ({ ...m, content: m.content + (ev.text ?? "") }));
        } else if (ev.type === "done" && typeof ev.juice === "number") {
          setJuice(ev.juice);
          saveJuice(ev.juice);
        } else if (ev.type === "replace") {
          patchLast(gen, (m) => ({ ...m, content: ev.text ?? "", sources: ev.sources ?? [], photos: undefined }));
        }
      }
      patchLast(gen, (m) => ({ ...m, pending: false, content: m.content.trim() || t("bot.lost") }));
    } catch (error) {
      // Always a plain reason: part of an answer keeps it and says it was cut off.
      const why = error instanceof ChatProblem ? error.why : "chat.serverDown";
      patchLast(gen, (m) => ({
        ...m,
        pending: false,
        followUps: [],
        content: m.content.trim() ? m.content.trimEnd() + t("bot.cutOff") : t(why === "bot.cutOff" ? "chat.noServer" : why),
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
          <span>{t("chat.tagline")}</span>
        </div>
        <button className="clear-btn" onClick={clearChat} disabled={messages.length <= 1 && !busy} aria-label={t("chat.clear")}>
          🧹
        </button>
      </div>
      {juice !== null && <JuiceMeter left={juice} />}

          <div
            className="messages"
            aria-live="polite"
            ref={listRef}
            onWheel={stopFollowing}
            onTouchStart={stopFollowing}
            onPointerDown={stopFollowing}
          >
            {messages.map((m, i) => (
              <ChatBubble key={i} m={m} />
            ))}

            {/* Follow-up questions under the latest answer; starter questions on an empty chat. */}
            {!busy && (
              <div className="suggestions">
                {(messages.length === 1 ? SUGGESTIONS.map((k) => t(k)) : messages[lastIndex].followUps ?? []).map((s) => (
                  <button key={s} className="chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
                {messages.length === 1 && (
                  <button className="chip quiz-chip" onClick={onQuiz}>
                    {t("chat.quiz")}
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
              placeholder={t("chat.placeholder")}
              maxLength={MAX}
              aria-label={t("chat.message")}
              enterKeyHint="send"
            />
            <button className="primary" disabled={busy || !input.trim()}>
              {t("chat.send")}
            </button>
            <Counter length={input.length} max={MAX} />
          </form>
    </div>
  );
}
