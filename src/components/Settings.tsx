import { useState } from "react";
import { logOut as logOutHere, type User } from "../lib/account";
import { useInstall } from "../lib/install";
import type { Theme } from "../lib/prefs";
import { ChangePassword } from "./auth";
import { useLang } from "../lib/lang";
import LangSwitch from "./LangSwitch";

const SITE = "https://bandicroc-niagaragrapes.pages.dev";

type Props = {
  user: User | null;
  onGetApp: () => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  onLoggedOut: () => void;
  goToLogin: () => void;
};

export default function Settings({ user, onGetApp, theme, setTheme, onLoggedOut, goToLogin }: Props) {
  const { installed } = useInstall();
  const { t } = useLang();

  return (
    <div className="stack">
      <section className="card">
        <h2>{t("settings.account")}</h2>
        {user ? <AccountSettings user={user} onLoggedOut={onLoggedOut} /> : (
          <>
            <p className="muted small">{t("settings.notLoggedIn")}</p>
            <button className="secondary" onClick={goToLogin}>
              {t("settings.logInOrCreate")}
            </button>
          </>
        )}
      </section>

      <section className="card">
        <h2>{t("settings.app")}</h2>
        {installed ? (
          <p className="success">{t("settings.installed")}</p>
        ) : (
          <>
            <p className="muted small">{t("settings.installNote")}</p>
            <button className="primary" onClick={onGetApp}>
              {t("settings.getApp")}
            </button>
          </>
        )}
      </section>

      <ShareCard />

      <section className="card">
        <h2>{t("settings.language")}</h2>
        <LangSwitch />
        <p className="muted small">{t("settings.languageNote")}</p>
      </section>

      <section className="card">
        <h2>{t("settings.appearance")}</h2>
        <div className="segmented" role="radiogroup" aria-label={t("settings.theme")}>
          {(["system", "light", "dark"] as Theme[]).map((th) => (
            <button key={th} role="radio" aria-checked={theme === th} className={theme === th ? "on" : ""} onClick={() => setTheme(th)}>
              {th === "system" ? t("settings.auto") : th === "light" ? t("settings.light") : t("settings.dark")}
            </button>
          ))}
        </div>
      </section>

      <details className="card collapsible">
        <summary>
          <span>{t("settings.stored")}</span>
        </summary>
        <ul className="ticks small">
          <li>{t("settings.stored1")}</li>
          <li>{t("settings.stored2")}</li>
          <li>{t("settings.stored3")}</li>
          <li>{t("settings.stored4")}</li>
          <li>{t("settings.stored5")}</li>
        </ul>
      </details>

      <p className="muted small center">
        {t("settings.version", { v: __APP_VERSION__ })}
      </p>
    </div>
  );
}

function AccountSettings({ user, onLoggedOut }: { user: User; onLoggedOut: () => void }) {
  const [busy, setBusy] = useState(false);
  const { t } = useLang();

  async function logOut() {
    setBusy(true);
    await logOutHere();
    setBusy(false);
    onLoggedOut();
  }

  return (
    <div className="settings-body">
      <section>
        <p className="muted small">{t("settings.loggedInAs")}</p>
        <p className="email">{user.email}</p>
      </section>
      <ChangePassword />
      <section>
        <h3>{t("settings.logOutTitle")}</h3>
        <p className="muted small">{t("settings.logOutNote")}</p>
        <button className="danger-btn" onClick={logOut} disabled={busy}>
          {busy ? t("account.loggingOut") : t("settings.logOut")}
        </button>
      </section>
    </div>
  );
}

function ShareCard() {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";
  const { t } = useLang();

  async function share() {
    try {
      if (canShare) {
        await navigator.share({ title: "Grapes", text: t("share.text"), url: SITE });
      } else {
        await navigator.clipboard.writeText(SITE);
        setCopied(true);
      }
    } catch {
      /* the user closed the share sheet */
    }
  }

  return (
    <section className="card share">
      <h2>{t("share.title")}</h2>
      <p className="muted small">{t("share.note")}</p>
      <div className="share-row">
        <img src="/qr.svg" alt={t("share.qr", { site: SITE })} width={132} height={132} />
        <div>
          <p className="link-text">{SITE.replace("https://", "")}</p>
          <button className="primary" onClick={share}>
            {canShare ? t("share.share") : copied ? t("share.copied") : t("share.copy")}
          </button>
        </div>
      </div>
    </section>
  );
}
