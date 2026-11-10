import { useState, type FormEvent } from "react";
import { accountsAvailable, changePassword, logIn, signUp } from "../lib/account";
import { looksLikeEmail } from "../lib/errors";
import { useLang } from "../lib/lang";

// Password field with a show/hide button, so people can check what they typed.
export function PasswordInput(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useLang();
  return (
    <div className="password-field">
      <input
        type={visible ? "text" : "password"}
        placeholder={props.placeholder}
        aria-label={props.label}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        maxLength={72}
        autoComplete={props.autoComplete}
      />
      <button
        type="button"
        className="reveal"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("login.hidePassword") : t("login.showPassword")}
        aria-pressed={visible}
      >
        {visible ? t("login.hide") : t("login.show")}
      </button>
    </div>
  );
}

export function LoginForm({ initialMode = "in" }: { initialMode?: "in" | "up" } = {}) {
  const [mode, setMode] = useState<"in" | "up">(initialMode);
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!accountsAvailable || busy) return;
    // Our own checks first, so empty or odd input gets a clear message.
    if (!email.trim()) return setMsg({ ok: false, text: t("login.typeEmail") });
    if (!looksLikeEmail(email)) return setMsg({ ok: false, text: t("err.badEmail") });
    if (!password) return setMsg({ ok: false, text: t("login.typePassword") });
    if (mode === "up" && password.length < 6) return setMsg({ ok: false, text: t("err.short") });

    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const error = await logIn(email, password);
      if (error) setMsg({ ok: false, text: t(error) });
    } else {
      const { error, needsConfirmation } = await signUp(email, password);
      if (error) setMsg({ ok: false, text: t(error) });
      else if (needsConfirmation) setMsg({ ok: true, text: t("login.checkEmail") });
    }
    setBusy(false);
  }

  const switchMode = () => {
    setMode(mode === "in" ? "up" : "in");
    setMsg(null);
  };

  return (
    <section className="card">
      <h2>{mode === "in" ? t("login.title") : t("login.createTitle")}</h2>
      <form className="form" onSubmit={submit} noValidate>
        <input
          type="email"
          inputMode="email"
          placeholder={t("login.email")}
          aria-label={t("login.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          autoComplete="email"
        />
        <PasswordInput
          value={password}
          onChange={setPassword}
          label={t("login.password")}
          placeholder={mode === "up" ? t("login.passwordNew") : t("login.password")}
          autoComplete={mode === "in" ? "current-password" : "new-password"}
        />
        <button className="primary" disabled={busy}>
          {busy ? t("login.wait") : mode === "in" ? t("account.logIn") : t("login.create")}
        </button>
      </form>
      {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
      <button className="link" onClick={switchMode}>
        {mode === "in" ? t("login.toCreate") : t("login.toLogIn")}
      </button>
    </section>
  );
}

// Passwords are stored scrambled (hashed), so nobody can read them back, not even the app.
// Forgot it? While still logged in on any device, set a new one here.
export function ChangePassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const { t } = useLang();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!accountsAvailable || busy) return;
    if (password.length < 6) return setMsg({ ok: false, text: t("err.newShort") });
    setBusy(true);
    const error = await changePassword(password);
    if (error) setMsg({ ok: false, text: t(error) });
    else {
      setMsg({ ok: true, text: t("password.saved") });
      setPassword("");
    }
    setBusy(false);
  }

  return (
    <section>
      <h3>{t("password.title")}</h3>
      <p className="muted small">
        {t("password.note")}
      </p>
      <form className="form" onSubmit={submit} noValidate>
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setMsg(null);
          }}
          label={t("password.new")}
          placeholder={t("password.newPlaceholder")}
          autoComplete="new-password"
        />
        <button className="secondary" disabled={busy}>
          {busy ? t("password.saving") : t("password.save")}
        </button>
      </form>
      {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
    </section>
  );
}
