import { useEffect, useRef, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { Secret } from "../lib/useAuthAndFavourite";
import { GRAPES, findGrape, wikiUrl } from "../../shared/grapes";
import GrapeCard from "./GrapeCard";
import Counter from "./Counter";

const SECRET_MAX = 1000;

export type Guest = { favourite: string | null; notes: string; notesAt: string | null };

type Props = {
  user: User | null;
  favourite: string | null;
  ready: boolean;
  saveFavourite: (grape: string) => Promise<string | null>;
  secret: Secret | null;
  secretMissing: boolean;
  saveSecret: (message: string) => Promise<string | null>;
  // Not logged in: picks and notes live only in memory until the app closes.
  guest: Guest;
  setGuest: React.Dispatch<React.SetStateAction<Guest>>;
  onLogin: (mode: "in" | "up") => void;
  // Tells the app a guest just saved something, so it can ask them to log in.
  onGuestSaved: (what: string) => void;
};

export default function MyGrapes(props: Props) {
  const { user, ready, guest, setGuest } = props;
  if (supabase && !ready) return <p className="muted center">Loading…</p>;

  if (user)
    return (
      <div className="stack">
        <Picks
          favourite={props.favourite}
          saveFavourite={props.saveFavourite}
          secret={props.secret}
          secretMissing={props.secretMissing}
          saveSecret={props.saveSecret}
        />
        <LearnList />
      </div>
    );

  // Guest mode: everything works, but nothing is saved.
  return (
    <div className="stack">
      <section className="card guest-banner" role="note">
        <span aria-hidden="true">⏳</span>
        <div>
          <b>You're not logged in</b>
          <p className="muted small">
            You can pick a favourite and write notes, but they disappear when you close the app.
            {supabase ? " Log in to keep them on all your devices." : " Saving isn't available right now."}
          </p>
          {supabase && (
            <div className="hero-actions left">
              <button className="primary small-btn" onClick={() => props.onLogin("in")}>
                🔑 Log in to save
              </button>
              <button className="link" onClick={() => props.onLogin("up")}>
                Create a free account
              </button>
            </div>
          )}
        </div>
      </section>
      <Picks
        guest
        favourite={guest.favourite}
        saveFavourite={async (grape) => {
          setGuest((g) => ({ ...g, favourite: grape }));
          props.onGuestSaved("Your favourite grape");
          return null;
        }}
        secret={{ message: guest.notes, updatedAt: guest.notesAt }}
        secretMissing={false}
        saveSecret={async (message) => {
          setGuest((g) => ({ ...g, notes: message, notesAt: new Date().toISOString() }));
          props.onGuestSaved("Your note");
          return null;
        }}
      />
      <LearnList />
    </div>
  );
}

type PicksProps = Pick<Props, "favourite" | "saveFavourite" | "secret" | "secretMissing" | "saveSecret"> & { guest?: boolean };

function Picks(props: PicksProps) {
  const { favourite, saveFavourite, guest } = props;
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
        open={!favourite || pickerOpen}
        onToggle={(e) => {
          const open = (e.currentTarget as HTMLDetailsElement).open;
          if (open !== pickerOpen) touched.current = true;
          setPickerOpen(open);
        }}
      >
        <summary
          onClick={(e) => {
            // Nothing picked yet: keep the choices visible.
            if (!favourite) e.preventDefault();
          }}
        >
          <span>🍇 Favourite grape</span>
          <span className={`fav-choice ${favourite ? "" : "none"}`}>{favourite ?? "Pick one below"}</span>
        </summary>
        <p className="muted small">
          {guest
            ? "Kept until you close the app. Log in to save it to your account."
            : "Saved to your account. Change it here and your other devices update live."}
        </p>
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

      <SecretMessage secret={props.secret} missing={props.secretMissing} save={props.saveSecret} guest={guest} />

      {findGrape(favourite) && <GrapeCard grape={findGrape(favourite)!} />}
    </>
  );
}

// "Notes about grapes": a private notebook only this account can read, synced live to every device.
// (Stored in the secret_messages table, its original name.)
function SecretMessage({ secret, missing, save, guest }: { secret: Secret | null; missing: boolean; save: Props["saveSecret"]; guest?: boolean }) {
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
