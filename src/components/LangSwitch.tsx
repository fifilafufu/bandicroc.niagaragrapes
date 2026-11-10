import { LANGS } from "../../shared/i18n";
import { useLang } from "../lib/lang";

// The small EN / PL switch next to the Log in button.
export default function LangSwitch() {
  const { lang, t, setLang } = useLang();
  return (
    <div className="lang-switch" role="radiogroup" aria-label={t("lang.label")}>
      {LANGS.map((l) => (
        <button key={l} role="radio" aria-checked={lang === l} className={lang === l ? "on" : ""} onClick={() => setLang(l)} lang={l}>
          {t(l === "en" ? "lang.en" : "lang.pl")}
        </button>
      ))}
    </div>
  );
}
