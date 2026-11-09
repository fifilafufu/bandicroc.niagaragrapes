import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Secret } from "../lib/useAuthAndFavourite";
import { GRAPES, findGrape, wikiUrl } from "../../shared/grapes";
import GrapeCard from "./GrapeCard";
import Counter from "./Counter";
import { LoginForm } from "./auth";

const SECRET_MAX = 1000;

type Props = {
  user: User | null;
  favourite: string | null;
  ready: boolean;
  saveFavourite: (grape: string) => Promise<string | null>;
  secret: Secret | null;
  secretMissing: boolean;
  saveSecret: (message: string) => Promise<string | null>;
};

export default function MyGrapes(props: Props) {
  const { user, ready } = props;
  if (!supabase) return <p className="notice">Saving isn't available right now.</p>;
  if (!ready) return <p className="muted center">Loading…</p>;

  return (
    <div className="stack">
      {user ? <SignedIn {...props} user={user} /> : <SignedOut />}
      <LearnList />
    </div>
  );
}

function SignedOut() {
  return (
    <>
      <section className="card intro">
        <h2>🧺 Your grapes, on every device</h2>
        <ul className="ticks">
          <li>Pick your favourite grape and read about it</li>
          <li>Keep a private 🤫 secret message</li>
          <li>Log in on your phone and computer: they stay in sync</li>
        </ul>
        <p className="muted small">Free. Just an email and a password. Grape Bot and the grape pages work without an account.</p>
      </section>
      <LoginForm />
    </>
  );
}

function SignedIn(props: Props & { user: User }) {
  const { favourite, saveFavourite } = props;
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Collapsed it only shows your pick; open it to choose another. Starts open if nothing is picked yet.
  const [pickerOpen, setPickerOpen] = useState(!favourite);
  // The favourite loads a moment after the page opens: collapse once it arrives, unless the user already toggled.
  const touched = useRef(false);
  useEffect(() => {
    if (favourite && !touched.current) setPickerOpen(false);
  }, [favourite]);

  async function pick(grape: string) {
    if (saving) return;
    setSaving(grape);
    const err = await saveFavourite(grape);
    setError(err);
    setSaving(null);
    if (!err) setPickerOpen(false);
  }

  return (
    <>
      <details
        className="card collapsible"
        open={pickerOpen}
        onToggle={(e) => {
          const open = (e.currentTarget as HTMLDetailsElement).open;
          if (open !== pickerOpen) touched.current = true;
          setPickerOpen(open);
        }}
      >
        <summary>
          <span>🍇 Favourite grape</span>
          <span className={`fav-choice ${favourite ? "" : "none"}`}>{favourite ?? "Tap to pick"}</span>
        </summary>
        <p className="muted small">Saved to your account. Change it here and your other devices update live.</p>
        <div className="grape-grid">
          {GRAPES.map(({ name }) => (
            <button
              key={name}
              className={`grape ${favourite === name ? "selected" : ""}`}
              onClick={() => pick(name)}
              disabled={saving !== null}
              aria-pressed={favourite === name}
            >
              {saving === name ? "Saving…" : name}
            </button>
          ))}
        </div>
        {error && <p className="notice" role="alert">{error}</p>}
      </details>

      <SecretMessage secret={props.secret} missing={props.secretMissing} save={props.saveSecret} />

      {findGrape(favourite) && <GrapeCard grape={findGrape(favourite)!} />}
    </>
  );
}

// A private note only this account can read, synced live to every device it's logged in on.
function SecretMessage({ secret, missing, save }: { secret: Secret | null; missing: boolean; save: Props["saveSecret"] }) {
  const saved = secret?.message ?? "";
  const [draft, setDraft] = useState<string | null>(null); // null = not editing, show the synced text
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const value = draft ?? saved;
  const changed = draft !== null && draft !== saved;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || !changed) return;
    setBusy(true);
    const error = await save(value);
    setBusy(false);
    if (error) setMsg({ ok: false, text: error });
    else {
      setDraft(null);
      setMsg({ ok: true, text: value.trim() ? "Saved ✓ Your other devices update live." : "Cleared ✓" });
    }
  }

  return (
    <section className="card">
      <h2>🤫 Secret message</h2>
      {missing ? (
        <p className="muted">The secret message isn't available right now.</p>
      ) : (
        <>
          <p className="muted small">Only you can read this. It syncs to every device you're logged in on.</p>
          <form onSubmit={submit}>
            <textarea
              className="secret-box"
              value={value}
              onChange={(e) => {
                setDraft(e.target.value);
                setMsg(null);
              }}
              placeholder="Write something only you will see…"
              maxLength={SECRET_MAX}
              aria-label="Secret message"
            />
            <div className="secret-meta">
              <span className="muted small">
                {changed
                  ? "Unsaved changes"
                  : secret?.updatedAt
                    ? `Saved ${new Date(secret.updatedAt).toLocaleString()}`
                    : "Nothing saved yet"}
              </span>
              <Counter length={value.length} max={SECRET_MAX} always />
              <button className="primary small-btn" disabled={busy || !changed}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
          {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
        </>
      )}
    </section>
  );
}

function LearnList() {
  return (
    <details className="card collapsible">
      <summary>
        <span>📖 Learn about each grape</span>
      </summary>
      <p className="muted small">Every grape here has a Wikipedia article. Grape Bot reads them too.</p>
      <ul className="wiki-list">
        {GRAPES.map((g) => (
          <li key={g.name}>
            <a href={wikiUrl(g.wiki)} target="_blank" rel="noreferrer">
              {g.name}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
