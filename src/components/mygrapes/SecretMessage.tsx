import { useState, type FormEvent } from "react";
import type { Secret } from "../../lib/useAuthAndFavourite";
import Counter from "../Counter";
import { useLang } from "../../lib/lang";
import type { TextKey } from "../../../shared/i18n";

const SECRET_MAX = 1000;

// "Notes about grapes": a private notebook only this account can read, synced live to every device.
// (Stored in the secret_messages table, its original name.)
export default function SecretMessage({ secret, missing, save, guest }: { secret: Secret | null; missing: boolean; save: (message: string) => Promise<string | null>; guest?: boolean }) {
  const saved = secret?.message ?? "";
  const [draft, setDraft] = useState<string | null>(null); // null = not editing, show the synced text
  const [busy, setBusy] = useState(false);
  const { t, lang } = useLang();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const value = draft ?? saved;
  const changed = draft !== null && draft !== saved;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy || !changed) return;
    setBusy(true);
    const error = await save(value);
    setBusy(false);
    if (error) setMsg({ ok: false, text: t(error as TextKey) });
    else {
      setDraft(null);
      setMsg({ ok: true, text: !value.trim() ? t("notes.cleared") : guest ? t("notes.keptGuest") : t("notes.saved") });
    }
  }

  return (
    <section className="card">
      <h2>{t("notes.title")}</h2>
      {missing ? (
        <p className="muted">{t("notes.missing")}</p>
      ) : (
        <>
          <p className="muted small">
            {guest
              ? t("notes.guest")
              : t("notes.user")}
          </p>
          <form onSubmit={submit}>
            <textarea
              className="secret-box"
              value={value}
              onChange={(e) => {
                setDraft(e.target.value);
                setMsg(null);
              }}
              placeholder={t("notes.placeholder")}
              maxLength={SECRET_MAX}
              aria-label={t("notes.label")}
            />
            <div className="secret-meta">
              <span className="muted small">
                {changed
                  ? t("notes.unsaved")
                  : secret?.updatedAt
                    ? t(guest ? "notes.keptAt" : "notes.savedAt", { when: new Date(secret.updatedAt).toLocaleString(lang) })
                    : t("notes.nothing")}
              </span>
              <Counter length={value.length} max={SECRET_MAX} always />
              <button className="primary small-btn" disabled={busy || !changed}>
                {busy ? t("mine.saving") : t("notes.save")}
              </button>
            </div>
          </form>
          {msg && <p className={msg.ok ? "success" : "notice"} role="alert">{msg.text}</p>}
        </>
      )}
    </section>
  );
}
