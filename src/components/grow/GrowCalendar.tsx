import { useState } from "react";
import { diseaseList, type DiseaseKey } from "../../../shared/diseases";
import { generalAdvice, type GrowInfo } from "../../../shared/grow";
import { MONTHS } from "../../../shared/growthCycle";
import { MONTHS_PL } from "../../../shared/i18n/pl/biology";
import { useLang } from "../../lib/lang";
import SourceLine from "../SourceLine";

// en: the same grape in English; the black rot and autumn frost checks read the source wording.
type Props = { name: string; g?: GrowInfo; en?: GrowInfo; weak: DiseaseKey[] };

// The yearly care calendar: general tasks plus this grape's own notes (only from its sourced traits).
export default function GrowCalendar({ name, g, en, weak }: Props) {
  const { lang, t } = useLang();
  const [south, setSouth] = useState(false);
  const months = lang === "pl" ? MONTHS_PL : MONTHS;
  const shift = (m: number) => months[(m - 1 + (south ? 6 : 0)) % 12];

  const own: { months: [number, number]; task: string }[] = [];
  if (g?.frostRisk) own.push({ months: [3, 5], task: t("grow.cFrost", { text: g.frostRisk }) });
  if (weak.length) own.push({ months: [4, 10], task: t("grow.cWeak", { list: diseaseList(weak, lang) }) });
  // Only when a source calls it susceptible (Marquette, for example, resists black rot).
  if (/susceptible[^.]*black rot/i.test(en?.diseases ?? "") || weak.includes("blackRot")) own.push({ months: [5, 7], task: t("grow.cBlackRot") });
  if (g?.diseases) own.push({ months: [4, 10], task: t("grow.cDisease", { text: g.diseases }) });
  if (g?.ripening === "early") own.push({ months: [8, 9], task: t("grow.cEarly") });
  if (g?.ripening === "late") own.push({ months: [10, 10], task: t("grow.cLate") });
  if (g?.cold && /autumn frost/i.test(en?.cold?.text ?? "")) own.push({ months: [10, 11], task: g.cold.text });

  const rows = [...own.map((o) => ({ ...o, own: true })), ...generalAdvice(lang).calendar.map((o) => ({ ...o, own: false }))].sort((a, b) => a.months[0] - b.months[0]);

  return (
    <section className="card">
      <h2>{t("grow.calendar")}</h2>
      <div className="chips-row" role="group" aria-label={t("grow.hemisphere")}>
        <button className={`chip ${!south ? "on" : ""}`} onClick={() => setSouth(false)} aria-pressed={!south}>
          {t("grow.north")}
        </button>
        <button className={`chip ${south ? "on" : ""}`} onClick={() => setSouth(true)} aria-pressed={south}>
          {t("grow.south")}
        </button>
      </div>
      <ol className="calendar">
        {rows.map((o) => (
          <li key={o.task} className={o.own ? "own" : ""}>
            <span className="cal-months">{o.months[0] === o.months[1] ? shift(o.months[0]) : t("grow.range", { a: shift(o.months[0]), b: shift(o.months[1]) })}</span>
            <span>
              {o.own && <b>{name}: </b>}
              {o.task}
            </span>
          </li>
        ))}
      </ol>
      <p className="muted small">{t("grow.calNote", { name })}</p>
      <SourceLine ids={["umn-home-grapes"]} wiki={[{ label: "Annual growth cycle of grapevines", title: "Annual growth cycle of grapevines" }]} />
    </section>
  );
}
