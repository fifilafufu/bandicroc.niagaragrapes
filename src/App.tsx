import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useAuthAndFavourite } from "./lib/useAuthAndFavourite";
import { detect, dismissTip, tipDismissed, useInstall } from "./lib/install";
import { useOnline, useTheme } from "./lib/prefs";
import { useChatHistory } from "./lib/useChatHistory";
import { GREETING, type Msg } from "./lib/chatMessages";
import { GAME_ITEMS, isGamePage, isLearnPage, LEARN_ITEMS, useRoute, type Page } from "./lib/route";
import SubNav from "./components/SubNav";
import { accountsAvailable } from "./lib/account";
import Home from "./components/Home";
import { NO_GUEST, useGuestMerge, type Guest } from "./lib/useGuestMerge";
import { useHideOnScroll } from "./lib/useHideOnScroll";
import InstallSheet from "./components/InstallSheet";
import AccountMenu from "./components/AccountMenu";
import { LoginSheet, SavePrompt } from "./components/LoginSheet";
import LangSwitch from "./components/LangSwitch";
import { useLang } from "./lib/lang";
import type { TextKey } from "../shared/i18n";

// Sections other than the home page load only when first opened, so the app starts faster.
const Chat = lazy(() => import("./components/Chat"));
const MyGrapes = lazy(() => import("./components/MyGrapes"));
const Settings = lazy(() => import("./components/Settings"));
const QuizzesPage = lazy(() => import("./components/QuizzesPage"));
const MakeWinePage = lazy(() => import("./components/wine/MakeWinePage"));
const StatsPage = lazy(() => import("./components/learn/StatsPage"));
const TastePage = lazy(() => import("./components/learn/TastePage"));
const BiologyPage = lazy(() => import("./components/learn/BiologyPage"));
const WinemakingPage = lazy(() => import("./components/learn/WinemakingPage"));
const WineBasicsPage = lazy(() => import("./components/learn/WineBasicsPage"));
const GrowPage = lazy(() => import("./components/learn/GrowPage"));

// The main sections, in tab order. Kept to four: new pages go inside a tab, not next to it.
const TABS: { page: Page; icon: string; label: TextKey }[] = [
  { page: "home", icon: "🍇", label: "tab.grapes" },
  { page: "quizzes", icon: "🎮", label: "tab.games" },
  { page: "chat", icon: "💬", label: "tab.bot" },
  { page: "mine", icon: "🧺", label: "tab.mine" },
];

const isPhone = () => ["ios", "android"].includes(detect().os);

export default function App() {
  const [page, go] = useRoute();
  const { t } = useLang();
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
  const [savePrompt, setSavePrompt] = useState<TextKey | null>(null);
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

  useGuestMerge(auth, guest, setGuest);

  // The title bar slides away while scrolling down and comes back when scrolling up (or at the top).
  const topbarRef = useRef<HTMLElement>(null);
  const barOffset = useHideOnScroll(contentRef, topbarRef, page);

  // A new section starts at the top.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [page]);

  // A tab stays lit on every page inside it.
  const active = (tab: Page) => page === tab || (tab === "home" && isLearnPage(page)) || (tab === "quizzes" && isGamePage(page));
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
      <header
        className="topbar"
        ref={topbarRef}
        style={barOffset ? { marginTop: barOffset } : undefined}
        aria-hidden={barOffset ? true : undefined}
      >
        <button className="brand-btn" onClick={() => go("home")} aria-label={t("app.home")}>
          <img src="/favicon.svg" alt="" width={28} height={28} />
          <span className="brand">Grapes</span>
        </button>
        {auth.favourite && (
          <button className="fav-pill" onClick={() => go("mine")} aria-label={t("app.favourite", { name: auth.favourite })}>
            ♥ {auth.favourite}
          </button>
        )}
        <LangSwitch />
        <AccountMenu
          user={auth.user}
          onLogin={setLogin}
          onSettings={() => go("settings")}
          onMyGrapes={() => go("mine")}
          onLoggedOut={() => go("mine")}
        />
      </header>

      {/* Phones: a tab bar at the bottom (easy to reach with a thumb). Wide screens: the same tabs under the top bar. */}
      <nav className="tabbar" aria-label={t("app.mainNav")}>
        {TABS.map((tab) => (
          <button
            key={tab.page}
            className={`tab ${active(tab.page) ? "active" : ""}`}
            onClick={() => go(tab.page)}
            aria-current={active(tab.page) ? "page" : undefined}
          >
            <span className="icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span>{t(tab.label)}</span>
          </button>
        ))}
      </nav>

      {!online && (
        <div className="offline" role="status">
          {t("app.offline")}
        </div>
      )}

      <main ref={contentRef} className={`content ${page === "chat" ? "flush" : ""}`}>
        <Suspense fallback={<p className="muted center loading">{t("app.loading")}</p>}>
          {isLearnPage(page) && <SubNav items={LEARN_ITEMS} page={page} go={go} label={t("nav.learn")} />}
          {isGamePage(page) && <SubNav items={GAME_ITEMS} page={page} go={go} label={t("nav.games")} />}
          {page === "home" && <Home onChat={() => go("chat")} onMyGrapes={() => go("mine")} onAsk={ask} go={go} />}
          {page === "stats" && <StatsPage />}
          {page === "taste" && <TastePage onAsk={ask} />}
          {page === "biology" && <BiologyPage />}
          {page === "winemaking" && <WinemakingPage />}
          {page === "basics" && <WineBasicsPage />}
          {page === "grow" && <GrowPage favourite={auth.favourite} />}
          {page === "quizzes" && <QuizzesPage user={auth.user} onLogin={() => setLogin("in")} />}
          {page === "wine" && <MakeWinePage user={auth.user} favourite={auth.favourite} onLogin={() => setLogin("in")} />}
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
              onGuestSaved={(what) => accountsAvailable && !promptOff.current && setSavePrompt(what)}
              onWines={() => go("wine")}
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
          <span>{t("app.tipInstall")}</span>
          <button className="primary small-btn" onClick={openSheet}>
            {t("app.tipHow")}
          </button>
          <button className="close" onClick={hideTip} aria-label={t("app.dismiss")}>
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
