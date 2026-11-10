import { useLang } from "../../lib/lang";
import { countryName, num } from "../../../shared/i18n/countries";

// A simple ranked bar list: one colour (it shows size, not categories), each bar labelled with its value.
export default function HBarList({ items, unit, label }: { items: { name: string; value: number }[]; unit: string; label: string }) {
  const max = Math.max(...items.map((i) => i.value));
  const { lang } = useLang();
  return (
    <ol className="hbars" aria-label={label}>
      {items.map((i) => (
        <li key={i.name}>
          <span className="hbar-name">{countryName(i.name, lang)}</span>
          <span className="hbar-track" aria-hidden="true">
            <i style={{ width: `${(i.value / max) * 100}%` }} />
          </span>
          <b className="hbar-value">
            {num(i.value, lang)} {unit}
          </b>
        </li>
      ))}
    </ol>
  );
}
