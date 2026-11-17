import AnswerTools from "./AnswerTools";
import { wikiUrl } from "../../shared/grapes";
import { isGreeting, plainAnswer, type Msg } from "../lib/chatMessages";
import { useLang } from "../lib/lang";

// One chat message: the typing dots while waiting, then photos, text, answer tools and source links.
// `shown`: for the answer being typed out, how many characters are on screen so far.
export default function ChatBubble({ m, shown }: { m: Msg; shown?: number }) {
  const { t } = useLang();
  const answer = m.role === "assistant" ? plainAnswer(m.content) : m.content;
  const visible = shown === undefined ? answer : answer.slice(0, shown);
  const typing = !!m.pending || visible.length < answer.length;
  if (typing && !visible) {
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
      {isGreeting(m) ? t("chat.greeting") : visible}
      {typing && <span className="caret" aria-hidden="true" />}
      {m.role === "assistant" && !typing && !isGreeting(m) && <AnswerTools text={answer} />}
      {m.sources && m.sources.length > 0 && !typing && (
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
