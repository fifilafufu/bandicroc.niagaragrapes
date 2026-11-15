import { useLang } from "../lib/lang";

// "Grape juice left today: 72%": everyone's daily Grape Bot allowance (styles in src/styles/23-juice.css).
// --fill tells the bar how full it is, from 0 to 1.
export default function JuiceMeter({ left }: { left: number }) {
  const { t } = useLang();
  const label = t("chat.juice", { n: left });
  return (
    <div className={`juice ${left <= 10 ? "low" : ""}`} title={t("chat.juiceTip")}>
      <span aria-hidden="true">🧃</span>
      <span className="juice-bar" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={left} aria-label={label} style={{ "--fill": left / 100 } as React.CSSProperties} />
      <span className="juice-text">{label}</span>
    </div>
  );
}
