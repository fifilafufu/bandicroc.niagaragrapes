import { useState, type FormEvent } from "react";
import { accountsAvailable, changePassword, logIn, signUp } from "../lib/account";
import { looksLikeEmail } from "../lib/errors";

// Password field with a show/hide button, so people can check what they typed.
export function PasswordInput(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  label: string;
}) {
  const [visible, setVisible] = useState(false);
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
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function LoginForm({ initialMode = "in" }: { initialMode?: "in" | "up" } = {}) {
  const [mode, setMode] = useState<"in" | "up">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!accountsAvailable || busy) return;
    // Our own checks first, so empty or odd input gets a clear message.
    if (!email.trim()) return setMsg({ ok: false, text: "Type your email address." });
    if (!looksLikeEmail(email)) return setMsg({ ok: false, text: "That doesn't look like an email address." });
    if (!password) return setMsg({ ok: false, text: "Type your password." });
    if (mode === "up" && password.length < 6) return setMsg({ ok: false, text: "Your password needs at least 6 characters." });

    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const error = await logIn(email, password);
      if (error) setMsg({ ok: false, text: error });
    } else {
      const { error, needsConfirmation } = await signUp(email, password);
      if (error) setMsg({ ok: false, text: error });
      else if (needsConfirmation) setMsg({ ok: true, text: "Check your email to confirm your account, then log in." });
    }
    setBusy(false);
  }

  const switchMode = () => {
    setMode(mode === "in" ? "up" : "in");
    setMsg(null);
  };

  return (
    <section className="card">
      <h2>{mode === "in" ? "Log in" : "Create an account"}</h2>
      <form className="form" onSubmit={submit} noValidate>
        <input
          type="email"
          inputMode="email"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          autoComplete="email"
        />
        <PasswordInput
          value={password}
          onChange={setPassword}
          label="Password"
          placeholder={mode === "up" ? "Password (6+ characters)" : "Password"}
          autoComplete={mode === "in" ? "current-password" : "new-password"}
        />
        <button className="primary" disabled={busy}>
          {busy ? "Please wait…" : mode === "in" ? "Log in" : "Create account"}
        </button>
      </form>
      {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
      <button className="link" onClick={switchMode}>
        {mode === "in" ? "New here? Create an account" : "Already have an account? Log in"}
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

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!accountsAvailable || busy) return;
    if (password.length < 6) return setMsg({ ok: false, text: "Your new password needs at least 6 characters." });
    setBusy(true);
    const error = await changePassword(password);
    if (error) setMsg({ ok: false, text: error });
    else {
      setMsg({ ok: true, text: "Saved ✓ Use the new password next time you log in." });
      setPassword("");
    }
    setBusy(false);
  }

  return (
    <section>
      <h3>🔑 Change or reset password</h3>
      <p className="muted small">
        Forgot it? Passwords are stored scrambled, so they can't be shown, not even to us. Set a new one while you're logged in.
      </p>
      <form className="form" onSubmit={submit} noValidate>
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            setMsg(null);
          }}
          label="New password"
          placeholder="New password (6+ characters)"
          autoComplete="new-password"
        />
        <button className="secondary" disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
      {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
    </section>
  );
}
