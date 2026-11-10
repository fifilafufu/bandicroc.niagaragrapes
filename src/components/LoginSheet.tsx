import { LoginForm } from "./auth";
import { useLang } from "../lib/lang";
import type { TextKey } from "../../shared/i18n";

// Login / sign-up in a sheet that slides up over any screen.
export function LoginSheet({ mode, onClose }: { mode: "in" | "up"; onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet login-sheet" role="dialog" aria-modal="true" aria-label={t("login.title")} onClick={(e) => e.stopPropagation()}>
        <button className="close corner" onClick={onClose} aria-label={t("app.close")}>
          ✕
        </button>
        <LoginForm initialMode={mode} />
      </div>
    </div>
  );
}

// Shown when someone who isn't logged in picks a grape or writes notes: it works, but only until they leave.
export function SavePrompt({ what, onLogin, onClose }: { what: TextKey; onLogin: () => void; onClose: () => void }) {
  const { t } = useLang();
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet save-prompt" role="alertdialog" aria-modal="true" aria-labelledby="save-title" onClick={(e) => e.stopPropagation()}>
        <p className="quiz-big" aria-hidden="true">
          🧺
        </p>
        <h2 id="save-title">{t("login.saveTitle")}</h2>
        <p className="muted">
          {t("login.saveText", { what: t(what) })}
        </p>
        <div className="hero-actions">
          <button className="primary" onClick={onLogin}>
            {t("login.saveBtn")}
          </button>
          <button className="secondary" onClick={onClose}>
            {t("login.notNow")}
          </button>
        </div>
      </div>
    </div>
  );
}
