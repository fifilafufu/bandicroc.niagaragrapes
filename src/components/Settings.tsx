import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useInstall } from "../lib/install";
import type { Theme } from "../lib/prefs";
import { ChangePassword } from "./auth";

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

  return (
    <div className="stack">
      <section className="card">
        <h2>👤 Account</h2>
        {user ? <AccountSettings user={user} onLoggedOut={onLoggedOut} /> : (
          <>
            <p className="muted small">You're not logged in. Grape Bot and the grape pages work without an account.</p>
            <button className="secondary" onClick={goToLogin}>
              Log in or create an account
            </button>
          </>
        )}
      </section>

      <section className="card">
        <h2>📲 App</h2>
        {installed ? (
          <p className="success">✓ You're using the installed app.</p>
        ) : (
          <>
            <p className="muted small">Install it for full screen and a home-screen icon. Free, no app store.</p>
            <button className="primary" onClick={onGetApp}>
              Get the app
            </button>
          </>
        )}
      </section>

      <ShareCard />

      <section className="card">
        <h2>🎨 Appearance</h2>
        <div className="segmented" role="radiogroup" aria-label="Theme">
          {(["system", "light", "dark"] as Theme[]).map((t) => (
            <button key={t} role="radio" aria-checked={theme === t} className={theme === t ? "on" : ""} onClick={() => setTheme(t)}>
              {t === "system" ? "Auto" : t === "light" ? "☀️ Light" : "🌙 Dark"}
            </button>
          ))}
        </div>
      </section>

      <details className="card collapsible">
        <summary>
          <span>🔒 What we store</span>
        </summary>
        <ul className="ticks small">
          <li>Your email and a scrambled (hashed) password, kept by Supabase.</li>
          <li>Your favourite grape and your notes about grapes. Only your account can read them (row-level security).</li>
          <li>Logged in: your Grape Bot chat (last 40 messages), so it shows on all your devices. Only your account can read it. "Clear chat" deletes it.</li>
          <li>Logged out: chats aren't saved anywhere and disappear when you close the app.</li>
          <li>On this device only: your theme choice and dismissed tips.</li>
        </ul>
      </details>

      <p className="muted small center">
        Grapes v{__APP_VERSION__} · facts from OIV, VIVC, FAO and Wikipedia
      </p>
    </div>
  );
}

function AccountSettings({ user, onLoggedOut }: { user: User; onLoggedOut: () => void }) {
  const [busy, setBusy] = useState(false);

  async function logOut() {
    setBusy(true);
    // "local": only this device, so the user stays logged in on their other devices.
    await supabase?.auth.signOut({ scope: "local" });
    setBusy(false);
    onLoggedOut();
  }

  return (
    <div className="settings-body">
      <section>
        <p className="muted small">Logged in as</p>
        <p className="email">{user.email}</p>
      </section>
      <ChangePassword />
      <section>
        <h3>👋 Log out on this device</h3>
        <p className="muted small">Using someone else's phone? Log out when you're done. Your other devices stay logged in.</p>
        <button className="danger-btn" onClick={logOut} disabled={busy}>
          {busy ? "Logging out…" : "Log out"}
        </button>
      </section>
    </div>
  );
}

function ShareCard() {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";

  async function share() {
    try {
      if (canShare) {
        await navigator.share({ title: "Grapes", text: "Learn about grapes and chat with Grape Bot 🍇", url: SITE });
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
      <h2>🔗 Share the app</h2>
      <p className="muted small">Send the link, or let someone scan the code with their phone camera.</p>
      <div className="share-row">
        <img src="/qr.svg" alt={`QR code for ${SITE}`} width={132} height={132} />
        <div>
          <p className="link-text">{SITE.replace("https://", "")}</p>
          <button className="primary" onClick={share}>
            {canShare ? "Share link" : copied ? "✓ Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </section>
  );
}
