// Saved wines live in Make Your Wine; this card points there.
export default function WinesCard({ onOpen }: { onOpen: () => void }) {
  return (
    <button className="card more-card" onClick={onOpen}>
      <span className="more-icon" aria-hidden="true">
        🍾
      </span>
      <span>
        <b>Your wines</b>
        <span className="muted small">Wines you made and saved in Make Your Wine.</span>
      </span>
      <span className="more-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}
