import { useState } from "react";
import { useAuthAndFavourite } from "./lib/useAuthAndFavourite";
import Home from "./components/Home";
import Chat from "./components/Chat";
import Account from "./components/Account";

type Tab = "home" | "chat" | "account";

export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const auth = useAuthAndFavourite();

  return (
    <div className="app">
      <header className="topbar">
        <img src="/favicon.svg" alt="" width={28} height={28} />
        <span className="brand">Niagara Grapes</span>
        {auth.favourite && <span className="fav-pill">♥ {auth.favourite}</span>}
      </header>

      <main className="content">
        {tab === "home" && <Home onChat={() => setTab("chat")} />}
        {tab === "chat" && <Chat favourite={auth.favourite} loggedIn={!!auth.user} />}
        {tab === "account" && <Account {...auth} />}
      </main>

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
