import { useEffect, useRef, useState } from "react";
import { accountsAvailable, displayName, logOut as logOutHere, type User } from "../lib/account";

// Top-right account button: your name with an icon. Tap it for settings, switching account and logging out.
// Logged out it says "Log in".


type Props = {
  user: User | null;
  onLogin: (mode: "in" | "up") => void;
  onSettings: () => void;
  onMyGrapes: () => void;
  onLoggedOut: () => void;
};

export default function AccountMenu({ user, onLogin, onSettings, onMyGrapes, onLoggedOut }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on a tap outside or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  async function logOut(thenLogin: boolean) {
    setBusy(true);
    await logOutHere();
    setBusy(false);
    setOpen(false);
    onLoggedOut();
    if (thenLogin) onLogin("in");
  }

  const name = user ? displayName(user) : null;

  return (
    <div className="account" ref={ref}>
      <button
        className={`account-btn ${user ? "in" : "out"}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={user ? `Account: ${name}` : "Log in or account options"}
      >
        <span className="avatar" aria-hidden="true">
          {name ? name[0].toUpperCase() : "👤"}
        </span>
        <span className="account-name">{name ?? "Log in"}</span>
        <span className="caret-down" aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className="account-menu" role="menu">
          {user ? (
            <>
              <div className="account-who">
                <span className="avatar big-avatar" aria-hidden="true">
                  {name![0].toUpperCase()}
                </span>
                <div>
                  <b>{name}</b>
                  <span className="muted small">{user.email}</span>
                </div>
              </div>
              <button role="menuitem" onClick={go(onMyGrapes)}>
                🧺 My Grapes
              </button>
              <button role="menuitem" onClick={go(onSettings)}>
                ⚙️ Settings
              </button>
              <button role="menuitem" onClick={() => logOut(true)} disabled={busy}>
                🔄 Change account
              </button>
              <button role="menuitem" className="danger" onClick={() => logOut(false)} disabled={busy}>
                {busy ? "Logging out…" : "👋 Log out"}
              </button>
            </>
          ) : (
            <>
              <p className="muted small account-note">Log in to save your grapes and chats on all your devices.</p>
              {accountsAvailable && (
                <>
                  <button role="menuitem" className="strong" onClick={go(() => onLogin("in"))}>
                    🔑 Log in
                  </button>
                  <button role="menuitem" onClick={go(() => onLogin("up"))}>
                    ✨ Create a free account
                  </button>
                </>
              )}
              <button role="menuitem" onClick={go(onSettings)}>
                ⚙️ Settings
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
