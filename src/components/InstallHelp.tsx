import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

export default function InstallHelp() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  return (
    <section className="card install">
      <h2>Get the app</h2>
      {deferred ? (
        <button
          className="primary"
          onClick={async () => {
            await deferred.prompt();
            setDeferred(null);
          }}
        >
          Install Niagara Grapes
        </button>
      ) : isIOS() ? (
        <p>
          On iPhone: open this page in <b>Safari</b>, tap <b>Share</b> ⬆️, then <b>Add to Home Screen</b>.
        </p>
      ) : (
        <p>
          On Android: Chrome menu ⋮ → <b>Install app</b>. On Windows: the install icon in the Edge or Chrome address
          bar.
        </p>
      )}
    </section>
  );
}
