import { useEffect, useMemo, useState } from "react";
import { detect, guideFor, useInstall } from "../lib/install";
import { useLang } from "../lib/lang";

export default function InstallSheet({ onClose }: { onClose: () => void }) {
  const { canPrompt, installed, prompt } = useInstall();
  const { os, browser } = useMemo(detect, []);
  const guide = guideFor(os, browser);
  const [copied, setCopied] = useState(false);
  const link = window.location.origin;
  const { t } = useLang();

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
      window.prompt(t("install.copyPrompt"), link);
    }
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <img src="/pwa-64x64.png" alt="" width={44} height={44} />
          <div>
            <h2 id="sheet-title">{t("install.title")}</h2>
            <p className="muted small">{t("install.sub")}</p>
          </div>
          <button className="close" onClick={onClose} aria-label={t("app.close")}>
            ✕
          </button>
        </div>

        {installed ? (
          <p className="success">{t("install.done")}</p>
        ) : canPrompt ? (
          <>
            <button className="primary big" onClick={async () => (await prompt()) && onClose()}>
              {t("install.install")}
            </button>
            <p className="muted small center">{t("install.oneTap")}</p>
          </>
        ) : guide.supported ? (
          <>
            <p className="small">
              {t("install.stepsFor")} <b>{guide.label}</b>
            </p>
            <ol className="steps">
              {guide.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {guide.instead && (
              <button className="secondary" onClick={copy}>
                {copied ? t("share.copied") : t("share.copy")}
              </button>
            )}
          </>
        ) : (
          <>
            <p>
              <b>{guide.label}</b> {t("install.cantPrefix")}
            </p>
            <ol className="steps">
              <li>{t("install.step1")}</li>
              <li>
                {t("install.step2a")} <b>{guide.instead}</b> {t("install.step2b")}
              </li>
              <li>{t("install.step3")}</li>
            </ol>
            <button className="primary big" onClick={copy}>
              {copied ? t("share.copied") : t("share.copy")}
            </button>
            <p className="muted small center">{t("install.stillHere")}</p>
          </>
        )}
      </div>
    </div>
  );
}
