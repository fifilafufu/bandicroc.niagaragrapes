import { useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { GRAPES, supabase } from "../lib/supabase";

type Props = {
  user: User | null;
  favourite: string | null;
  ready: boolean;
  saveFavourite: (grape: string) => Promise<string | null>;
};

export default function Account({ user, favourite, ready, saveFavourite }: Props) {
  if (!supabase) {
    return (
      <section className="card">
        <h2>Login isn't set up yet</h2>
        <p>Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see README).</p>
      </section>
    );
  }
  if (!ready) return <p className="muted center">Loading…</p>;
  return user ? <Profile user={user} favourite={favourite} saveFavourite={saveFavourite} /> : <LoginForm />;
}

function LoginForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMsg(null);
    const { data, error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) setMsg(error.message);
    else if (mode === "up" && !data.session) setMsg("Check your email to confirm your account, then log in.");
  }

  return (
    <section className="card">
      <h2>{mode === "in" ? "Log in" : "Create an account"}</h2>
      <p className="muted">Your favourite grape follows you to every device you log in on.</p>
      <form className="form" onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Password (6+ characters)"
          autoComplete={mode === "in" ? "current-password" : "new-password"}
        />
        <button className="primary" disabled={busy}>
          {busy ? "…" : mode === "in" ? "Log in" : "Sign up"}
        </button>
      </form>
      {msg && <p className="notice">{msg}</p>}
      <button className="link" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "New here? Create an account" : "Already have an account? Log in"}
      </button>
    </section>
  );
}

// Password field with a show/hide button, so people can check what they typed.
function PasswordInput(props: { value: string; onChange: (v: string) => void; placeholder: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input
        type={visible ? "text" : "password"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required
        minLength={6}
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

// Passwords are stored scrambled (hashed), so nobody can read them back, not even the app.
// Forgot it? While still logged in on any device, just set a new one here.
function ChangePassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) setMsg({ ok: false, text: error.message });
    else {
      setMsg({ ok: true, text: "New password saved. Use it next time you log in." });
      setPassword("");
    }
  }

  return (
    <section className="card">
      <h2>Forgot your password?</h2>
      <p className="muted">
        Passwords are stored scrambled, so they can't be shown, not even to us. Set a new one while you're logged in.
      </p>
      <form className="form" onSubmit={submit}>
        <PasswordInput value={password} onChange={setPassword} placeholder="New password (6+ characters)" autoComplete="new-password" />
        <button className="secondary" disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
      {msg && <p className={msg.ok ? "success" : "notice"}>{msg.text}</p>}
    </section>
  );
}

function Profile({ user, favourite, saveFavourite }: { user: User; favourite: string | null; saveFavourite: Props["saveFavourite"] }) {
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function pick(grape: string) {
    setSaving(grape);
    setError(await saveFavourite(grape));
    setSaving(null);
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>Your favourite grape</h2>
        <p className="muted">
          Saved to your account. Change it here and your other devices update live.
        </p>
        <div className="grape-grid">
          {GRAPES.map((g) => (
            <button
              key={g}
              className={`grape ${favourite === g ? "selected" : ""}`}
              onClick={() => pick(g)}
              disabled={saving !== null}
              aria-pressed={favourite === g}
            >
              {saving === g ? "Saving…" : g}
            </button>
          ))}
        </div>
        {error && <p className="notice">{error}</p>}
      </section>

      <ChangePassword />

      <section className="card">
        <p className="muted">Logged in as {user.email}</p>
        <button className="secondary" onClick={() => supabase?.auth.signOut()}>
          Log out
        </button>
      </section>
    </div>
  );
}
