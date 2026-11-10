import { useLang } from "../../lib/lang";

type Props = {
  title: string;
  score: number;
  total: number;
  verdict: { emoji: string; text: string };
  offerPro: boolean;
  onAgain: () => void;
  onBack: () => void;
  onPro: () => void;
};

// The end of a round: score, Grape Bot's verdict, and what to do next.
export default function QuizEnd({ title, score, total, verdict, offerPro, onAgain, onBack, onPro }: Props) {
  const { t } = useLang();
  return (
    <div className="quiz">
      <section className="card quiz-card center">
        <p className="quiz-big">{verdict.emoji}</p>
        <p className="eyebrow">{title}</p>
        <h2>{t("quiz.got", { score, total })}</h2>
        <p className="quiz-verdict">{verdict.text}</p>
        <div className="hero-actions">
          <button className="primary" onClick={onAgain}>
            {t("quiz.again")}
          </button>
          {offerPro && (
            <button className="secondary" onClick={onPro}>
              {t("quiz.tryPro")}
            </button>
          )}
          <button className="secondary" onClick={onBack}>
            {t("quiz.others")}
          </button>
        </div>
      </section>
    </div>
  );
}
