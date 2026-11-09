import { LoginForm } from "./auth";

// Login / sign-up in a sheet that slides up over any screen.
export function LoginSheet({ mode, onClose }: { mode: "in" | "up"; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet login-sheet" role="dialog" aria-modal="true" aria-label="Log in" onClick={(e) => e.stopPropagation()}>
        <button className="close corner" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <LoginForm initialMode={mode} />
      </div>
    </div>
  );
}

// Shown when someone who isn't logged in picks a grape or writes notes: it works, but only until they leave.
export function SavePrompt({ what, onLogin, onClose }: { what: string; onLogin: () => void; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet save-prompt" role="alertdialog" aria-modal="true" aria-labelledby="save-title" onClick={(e) => e.stopPropagation()}>
        <p className="quiz-big" aria-hidden="true">
          🧺
        </p>
        <h2 id="save-title">Log in to save it</h2>
        <p className="muted">
          {what} is kept for now, but it will disappear when you close the app. Log in (or create a free account) to keep it on
          all your devices. We'll save what you've done so far.
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={onLogin}>
            🔑 Log in to save
          </button>
          <button className="secondary" onClick={onClose}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
