import { useState } from "react";
import type { GrowInfo } from "../../../shared/grow";
import { useLang } from "../../lib/lang";

// "Will it survive my winter?": only judged against a temperature a source gives.
export default function GrowWinter({ name, g }: { name: string; g?: GrowInfo }) {
  const { t } = useLang();
  const [coldest, setColdest] = useState(-20);
  const deg = (n: number) => String(n).replace("-", "−");

  let tone: "good" | "warn" | "bad" | "none" = "none";
  let text: string;
  if (g?.cold?.minC !== undefined) {
    const margin = coldest - g.cold.minC;
    const vars = { name, t: deg(coldest), min: deg(g.cold.minC) };
    tone = margin >= 3 ? "good" : margin >= 0 ? "warn" : "bad";
    text = t(tone === "good" ? "grow.wGood" : tone === "warn" ? "grow.wWarn" : "grow.wBad", vars);
  } else text = g?.cold ? t("grow.wText", { text: g.cold.text }) : t("grow.wNone");

  return (
    <section className="card">
      <h2>{t("grow.winter")}</h2>
      <label className="slider">
        <span>
          {t("grow.coldest")} <b>{deg(coldest)} °C</b>
        </span>
        <input type="range" min={-45} max={5} value={coldest} onChange={(e) => setColdest(+e.target.value)} />
      </label>
      <p className={`verdict ${tone === "good" ? "good" : tone === "none" ? "" : "off"}`} aria-live="polite">
        {text}
      </p>
    </section>
  );
}
