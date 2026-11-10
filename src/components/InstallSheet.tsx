import { useEffect, useMemo, useState } from "react";
import { detect, guideFor, useInstall } from "../lib/install";

export default function InstallSheet({ onClose }: { onClose: () => void }) {
  const { canPrompt, installed, prompt } = useInstall();
  const { os, browser } = useMemo(detect, []);
  const guide = guideFor(os, browser);
  const [copied, setCopied] = useState(false);
  const link = window.location.origin;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", link);
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <img src="/pwa-64x64.png" alt="" width={44} height={44} />
          <div>
            <h2 id="sheet-title">Get the Grapes app</h2>
            <p className="muted small">Free. Opens full screen, with its own icon.</p>
          </div>
          <button className="close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {installed ? (
          <p className="success">✓ You're using the installed app. You're all set!</p>
        ) : canPrompt ? (
          <>
            <button className="primary big" onClick={async () => (await prompt()) && onClose()}>
              Install
            </button>
            <p className="muted small center">One tap: your browser will ask you to confirm.</p>
          </>
        ) : guide.supported ? (
          <>
            <p className="small">
              Steps for <b>{guide.label}</b>:
            </p>
            <ol className="steps">
              {guide.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {guide.instead && (
              <button className="secondary" onClick={copy}>
                {copied ? "✓ Link copied" : "Copy link"}
              </button>
            )}
          </>
        ) : (
          <>
            <p>
              <b>{guide.label}</b> can't install this as a real full-screen app. At most it makes a shortcut that opens
              the browser.
            </p>
            <ol className="steps">
              <li>Tap “Copy link” below.</li>
              <li>
                Open <b>{guide.instead}</b> and paste the link into the address bar.
              </li>
              <li>Tap “Get app” there and follow the steps.</li>
            </ol>
            <button className="primary big" onClick={copy}>
              {copied ? "✓ Link copied" : "Copy link"}
            </button>
            <p className="muted small center">You can still use the app right here in this browser.</p>
          </>
        )}
      </div>
    </div>
  );
}
