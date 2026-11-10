import { useState, type FormEvent } from "react";
import type { Secret } from "../../lib/useAuthAndFavourite";
import Counter from "../Counter";

const SECRET_MAX = 1000;

// "Notes about grapes": a private notebook only this account can read, synced live to every device.
// (Stored in the secret_messages table, its original name.)
export default function SecretMessage({ secret, missing, save, guest }: { secret: Secret | null; missing: boolean; save: (message: string) => Promise<string | null>; guest?: boolean }) {
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
      setMsg({ ok: true, text: !value.trim() ? "Cleared ✓" : guest ? "Kept for now ✓ Log in to save it for good." : "Saved ✓ Your other devices update live." });
    }
  }

  return (
    <section className="card">
      <h2>📝 Notes about grapes</h2>
      {missing ? (
        <p className="muted">Notes aren't available right now.</p>
      ) : (
        <>
          <p className="muted small">
            {guest
              ? "Your grape notebook: tastings, favourites to try, facts you learned. Not logged in, so it's kept only until you close the app."
              : "Your private grape notebook: tastings, favourites to try, facts you learned. Only you can read it, and it syncs to every device you're logged in on."}
          </p>
          <form onSubmit={submit}>
            <textarea
              className="secret-box"
              value={value}
              onChange={(e) => {
                setDraft(e.target.value);
                setMsg(null);
              }}
              placeholder="e.g. Tried Cotton Candy grapes today: really do taste like candy! Next: find Muscat…"
              maxLength={SECRET_MAX}
              aria-label="Notes about grapes"
            />
            <div className="secret-meta">
              <span className="muted small">
                {changed
                  ? "Unsaved changes"
                  : secret?.updatedAt
                    ? `${guest ? "Kept" : "Saved"} ${new Date(secret.updatedAt).toLocaleString()}`
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
