import { useEffect, useRef, useState } from "react";
import { useAuthAndFavourite } from "./lib/useAuthAndFavourite";
import { detect, dismissTip, tipDismissed, useInstall } from "./lib/install";
import { useOnline, useTheme } from "./lib/prefs";
import { useChatHistory } from "./lib/useChatHistory";
import { supabase } from "./lib/supabase";
import Home from "./components/Home";
import Chat, { GREETING, type Msg } from "./components/Chat";
import MyGrapes, { type Guest } from "./components/MyGrapes";
import Settings from "./components/Settings";
import InstallSheet from "./components/InstallSheet";
import AccountMenu from "./components/AccountMenu";
import { LoginSheet, SavePrompt } from "./components/LoginSheet";

type Tab = "home" | "chat" | "mine" | "settings";

const isPhone = () => ["ios", "android"].includes(detect().os);
const NO_GUEST: Guest = { favourite: null, notes: "", notesAt: null };

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showTip, setShowTip] = useState(() => isPhone() && !tipDismissed());
  // Kept here so the conversation survives switching tabs; "Clear chat" and logging out reset it.
  const [chat, setChat] = useState<Msg[]>([GREETING]);
  // A question asked from elsewhere (e.g. tapping a grape in the gallery), sent when the chat opens.
  const [autoAsk, setAutoAsk] = useState<string | null>(null);
  // Not logged in: My Grapes still works, kept in memory only (gone when the app closes).
  const [guest, setGuest] = useState<Guest>(NO_GUEST);
  const [login, setLogin] = useState<"in" | "up" | null>(null);
  // "Log in to save" popup after a guest saves something; "Not now" stops it for this visit.
  const [savePrompt, setSavePrompt] = useState<string | null>(null);
  const promptOff = useRef(false);
  const auth = useAuthAndFavourite();
  const { installed } = useInstall();
  const [theme, setTheme] = useTheme();
  const online = useOnline();
  const contentRef = useRef<HTMLElement>(null);
  // Logged in: the chat is saved to the account and synced to the user's other devices.
  useChatHistory(auth.user, chat, setChat);

  // Logging out (on this device, or the session ending) clears this device's chat.
  const hadUser = useRef(false);
  useEffect(() => {
    if (hadUser.current && !auth.user) setChat([GREETING]);
    hadUser.current = !!auth.user;
    if (auth.user) setLogin(null); // logged in: close the login sheet
  }, [auth.user]);

  // Just logged in after trying things as a guest: save what they did to the account.
  const { user, secret, saveFavourite, saveSecret } = auth;
  useEffect(() => {
    if (!user) return;
    if (guest.favourite) {
      saveFavourite(guest.favourite);
      setGuest((g) => ({ ...g, favourite: null }));
    }
    // Notes wait until the account's own notes have loaded, then go underneath them (never replace them).
    const notes = guest.notes.trim();
    if (notes && secret) {
      const existing = secret.message.trim();
      if (!existing.includes(notes)) saveSecret((existing ? `${existing}\n\n${notes}` : notes).slice(0, 1000));
      setGuest((g) => ({ ...g, notes: "", notesAt: null }));
    }
  }, [user, secret, guest, saveFavourite, saveSecret]);

  // New tab starts at the top.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [tab]);

  const openSheet = () => {
    setSheetOpen(true);
    hideTip();
  };
  const hideTip = () => {
    setShowTip(false);
    dismissTip();
  };

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand-btn" onClick={() => setTab("home")} aria-label="Grapes home">
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <span className="brand">Grapes</span>
        </button>
        {auth.favourite && (
          <button className="fav-pill" onClick={() => setTab("mine")} aria-label={`Favourite grape: ${auth.favourite}`}>
            ♥ {auth.favourite}
          </button>
        )}
        <AccountMenu
          user={auth.user}
          onLogin={setLogin}
          onSettings={() => setTab("settings")}
          onMyGrapes={() => setTab("mine")}
          onLoggedOut={() => setTab("mine")}
        />
      </header>

      {!online && (
        <div className="offline" role="status">
          📡 You're offline. Pages you've opened still work; Grape Bot and saving need internet.
        </div>
      )}

      <main ref={contentRef} className={`content ${tab === "chat" ? "flush" : ""}`}>
        {tab === "home" && <Home
            onChat={() => setTab("chat")}
            onMyGrapes={() => setTab("mine")}
            onAsk={(q) => {
              setAutoAsk(q);
              setTab("chat");
            }}
          />}
        {tab === "chat" && <Chat
            favourite={auth.favourite}
            loggedIn={!!auth.user}
            messages={chat}
            setMessages={setChat}
            autoAsk={autoAsk}
            onAutoAsked={() => setAutoAsk(null)}
          />}
        {tab === "mine" && (
          <MyGrapes
            {...auth}
            guest={guest}
            setGuest={setGuest}
            onLogin={setLogin}
            onGuestSaved={(what) => supabase && !promptOff.current && setSavePrompt(what)}
          />
        )}
        {tab === "settings" && (
          <Settings
            user={auth.user}
            onGetApp={openSheet}
            theme={theme}
            setTheme={setTheme}
            onLoggedOut={() => setTab("mine")}
            goToLogin={() => setLogin("in")}
          />
        )}
      </main>

      {showTip && !installed && (
        <div className="tip" role="status">
          <span>📲 Add Grapes to your home screen</span>
          <button className="primary small-btn" onClick={openSheet}>
            How?
          </button>
          <button className="close" onClick={hideTip} aria-label="Dismiss">
            ✕
          </button>
        </div>
      )}

      <nav className="tabbar" aria-label="Main">
        <TabButton active={tab === "home"} onClick={() => setTab("home")} icon="🍇" label="Grapes" />
        <TabButton active={tab === "chat"} onClick={() => setTab("chat")} icon="💬" label="Grape Bot" />
        <TabButton active={tab === "mine"} onClick={() => setTab("mine")} icon="🧺" label="My Grapes" />
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon="⚙️" label="Settings" />
      </nav>

      {sheetOpen && <InstallSheet onClose={() => setSheetOpen(false)} />}
      {savePrompt && (
        <SavePrompt
          what={savePrompt}
          onLogin={() => {
            setSavePrompt(null);
            setLogin("in");
          }}
          onClose={() => {
            promptOff.current = true;
            setSavePrompt(null);
          }}
        />
      )}
      {login && <LoginSheet key={login} mode={login} onClose={() => setLogin(null)} />}
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button className={`tab ${props.active ? "active" : ""}`} onClick={props.onClick} aria-current={props.active ? "page" : undefined}>
      <span className="icon" aria-hidden="true">
        {props.icon}
      </span>
      <span>{props.label}</span>
    </button>
  );
}
