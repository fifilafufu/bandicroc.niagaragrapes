import { useLang } from "../../lib/lang";

// Saved wines live in Make Your Wine; this card points there.
export default function WinesCard({ onOpen }: { onOpen: () => void }) {
  const { t } = useLang();
  return (
    <button className="card more-card" onClick={onOpen}>
      <span className="more-icon" aria-hidden="true">
        🍾
      </span>
      <span>
        <b>{t("mine.winesTitle")}</b>
        <span className="muted small">{t("mine.winesNote")}</span>
      </span>
      <span className="more-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
