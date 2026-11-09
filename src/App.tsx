import { useState } from "react";
import { useAuthAndFavourite } from "./lib/useAuthAndFavourite";
import { detect, dismissTip, tipDismissed, useInstall } from "./lib/install";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Account from "./components/Account";
import InstallSheet from "./components/InstallSheet";

type Tab = "home" | "chat" | "account";

const isPhone = () => ["ios", "android"].includes(detect().os);

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showTip, setShowTip] = useState(() => isPhone() && !tipDismissed());
  const auth = useAuthAndFavourite();
  const { installed } = useInstall();

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
        <img src="/favicon.svg" alt="" width={28} height={28} />
        <span className="brand">Niagara Grapes</span>
        {auth.favourite && <span className="fav-pill">♥ {auth.favourite}</span>}
        {!installed && (
          <button className="get-app" onClick={openSheet}>
            📲 Get app
          </button>
        )}
      </header>

      <main className="content">
        {tab === "home" && <Home onChat={() => setTab("chat")} onGetApp={installed ? null : openSheet} />}
        {tab === "chat" && <Chat favourite={auth.favourite} loggedIn={!!auth.user} />}
        {tab === "account" && <Account {...auth} />}
      </main>

      {showTip && !installed && (
        <div className="tip" role="status">
          <span>📲 Add Niagara Grapes to your home screen</span>
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
        <TabButton
          active={tab === "account"}
          onClick={() => setTab("account")}
          icon="👤"
          label={auth.user ? "Account" : "Log in"}
        />
      </nav>

      {sheetOpen && <InstallSheet onClose={() => setSheetOpen(false)} />}
    </div>
  );
}

function TabButton(props: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button className={`tab ${props.active ? "active" : ""}`} onClick={props.onClick} aria-current={props.active}>
      <span aria-hidden="true">{props.icon}</span>
      <span>{props.label}</span>
    </button>
  );
}
