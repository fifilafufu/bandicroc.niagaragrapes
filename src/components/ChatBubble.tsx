import AnswerTools from "./AnswerTools";
import { wikiUrl } from "../../shared/grapes";
import { isGreeting, plainAnswer, type Msg } from "../lib/chatMessages";
import { useLang } from "../lib/lang";

// One chat message: the typing dots while waiting, then photos, text, answer tools and source links.
export default function ChatBubble({ m }: { m: Msg }) {
  const { t } = useLang();
  if (m.pending && !m.content) {
    return (
      <div className={`bubble ${m.role} typing`}>
        <span />
        <span />
        <span />
      </div>
    );
  }
  return (
    <div className={`bubble ${m.role}`}>
      {m.photos?.map((p) => (
        <span key={p.wiki} className="bubble-photo">
          <img src={p.src} alt={t("chat.photoOf", { name: p.name })} loading="lazy" />
          <span>
            <a href={wikiUrl(p.wiki)} target="_blank" rel="noreferrer">
              {p.name}
            </a>
            {p.credit && (
              <span className="photo-credit">
                {t("chat.photo")}{" "}
                <a href={p.credit.page} target="_blank" rel="noreferrer">
                  {p.credit.author.slice(0, 40)}
                </a>
                , {p.credit.licence}
              </span>
            )}
          </span>
        </span>
      ))}
      {isGreeting(m) ? t("chat.greeting") : m.role === "assistant" ? plainAnswer(m.content) : m.content}
      {m.pending && <span className="caret" aria-hidden="true" />}
      {m.role === "assistant" && !m.pending && !isGreeting(m) && <AnswerTools text={plainAnswer(m.content)} />}
      {m.sources && m.sources.length > 0 && !m.pending && (
        <div className="sources">
          {m.sources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer">
              {s.data ? "📊" : "📖"} {s.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
