// The two kinds of control Make Your Wine uses: a row of choices and a labelled slider.

export function Segmented<T extends string | number>({ value, options, onChange, label }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)} aria-pressed={value === o.v}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Range(props: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; show: string; hint?: string }) {
  return (
    <label className="slider">
      <span>
        {props.label} <b>{props.show}</b>
        {props.hint && <span className="muted small"> · {props.hint}</span>}
      </span>
      <input type="range" min={props.min} max={props.max} step={props.step ?? 1} value={props.value} onChange={(e) => props.onChange(+e.target.value)} />
    </label>
  );
}
