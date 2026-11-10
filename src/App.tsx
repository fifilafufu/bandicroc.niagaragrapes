import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAuthAndFavourite } from "./lib/useAuthAndFavourite";
import { detect, dismissTip, tipDismissed, useInstall } from "./lib/install";
import { useOnline, useTheme } from "./lib/prefs";
import { useChatHistory } from "./lib/useChatHistory";
import { GREETING, type Msg } from "./lib/chatMessages";
import { isLearnPage, useRoute, type Page } from "./lib/route";
import LearnNav from "./components/LearnNav";
import { supabase } from "./lib/supabase";
import Home from "./components/Home";
import type { Guest } from "./components/MyGrapes";
import InstallSheet from "./components/InstallSheet";
import AccountMenu from "./components/AccountMenu";
import { LoginSheet, SavePrompt } from "./components/LoginSheet";

// Sections other than the home page load only when first opened, so the app starts faster.
const Chat = lazy(() => import("./components/Chat"));
const MyGrapes = lazy(() => import("./components/MyGrapes"));
const Settings = lazy(() => import("./components/Settings"));
const QuizzesPage = lazy(() => import("./components/QuizzesPage"));
const StatsPage = lazy(() => import("./components/learn/StatsPage"));
const TastePage = lazy(() => import("./components/learn/TastePage"));
const BiologyPage = lazy(() => import("./components/learn/BiologyPage"));
const WinemakingPage = lazy(() => import("./components/learn/WinemakingPage"));
const WineBasicsPage = lazy(() => import("./components/learn/WineBasicsPage"));

// The main sections, in tab order. "Make Your Wine" joins between Grapes and Quizzes when it's built.
const TABS: { page: Page; icon: string; label: string }[] = [
  { page: "home", icon: "🍇", label: "Grapes" },
  { page: "quizzes", icon: "🎯", label: "Quizzes" },
  { page: "chat", icon: "💬", label: "Grape Bot" },
  { page: "mine", icon: "🧺", label: "My Grapes" },
];

const isPhone = () => ["ios", "android"].includes(detect().os);
const NO_GUEST: Guest = { favourite: null, notes: "", notesAt: null };

export default function App() {
  const [page, go] = useRoute();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showTip, setShowTip] = useState(() => isPhone() && !tipDismissed());
  // Kept here so the conversation survives switching sections; "Clear chat" and logging out reset it.
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

  // A new section starts at the top.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [page]);

  // The Grapes tab stays lit on every Learn page.
  const active = (tab: Page) => page === tab || (tab === "home" && isLearnPage(page));
  const ask = (q: string) => {
    setAutoAsk(q);
    go("chat");
  };

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
        <button className="brand-btn" onClick={() => go("home")} aria-label="Grapes home">
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <span className="brand">Grapes</span>
        </button>
        {auth.favourite && (
          <button className="fav-pill" onClick={() => go("mine")} aria-label={`Favourite grape: ${auth.favourite}`}>
            ♥ {auth.favourite}
          </button>
        )}
        <AccountMenu
          user={auth.user}
          onLogin={setLogin}
          onSettings={() => go("settings")}
          onMyGrapes={() => go("mine")}
          onLoggedOut={() => go("mine")}
        />
      </header>

      {/* Phones: a tab bar at the bottom (easy to reach with a thumb). Wide screens: the same tabs under the top bar. */}
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <button
            key={t.page}
            className={`tab ${active(t.page) ? "active" : ""}`}
            onClick={() => go(t.page)}
            aria-current={active(t.page) ? "page" : undefined}
          >
            <span className="icon" aria-hidden="true">
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {!online && (
        <div className="offline" role="status">
          📡 You're offline. Pages you've opened still work; Grape Bot and saving need internet.
        </div>
      )}

      <main ref={contentRef} className={`content ${page === "chat" ? "flush" : ""}`}>
        <Suspense fallback={<p className="muted center loading">Loading…</p>}>
          {isLearnPage(page) && <LearnNav page={page} go={go} />}
          {page === "home" && <Home onChat={() => go("chat")} onMyGrapes={() => go("mine")} onAsk={ask} go={go} />}
          {page === "stats" && <StatsPage />}
          {page === "taste" && <TastePage onAsk={ask} />}
          {page === "biology" && <BiologyPage />}
          {page === "winemaking" && <WinemakingPage />}
          {page === "basics" && <WineBasicsPage />}
          {page === "quizzes" && <QuizzesPage user={auth.user} onLogin={() => setLogin("in")} />}
          {page === "chat" && (
            <Chat
              favourite={auth.favourite}
              loggedIn={!!auth.user}
              messages={chat}
              setMessages={setChat}
              autoAsk={autoAsk}
              onAutoAsked={() => setAutoAsk(null)}
              onQuiz={() => go("quizzes")}
            />
          )}
          {page === "mine" && (
            <MyGrapes
              {...auth}
              guest={guest}
              setGuest={setGuest}
              onLogin={setLogin}
              onGuestSaved={(what) => supabase && !promptOff.current && setSavePrompt(what)}
            />
          )}
          {page === "settings" && (
            <Settings
              user={auth.user}
              onGetApp={openSheet}
              theme={theme}
              setTheme={setTheme}
              onLoggedOut={() => go("mine")}
              goToLogin={() => setLogin("in")}
            />
          )}
        </Suspense>
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
