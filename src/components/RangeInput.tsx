import type { CSSProperties, InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "min" | "max"> & { value: number; min: number; max: number };

// A slider whose green fill ends exactly under the knob, and whose knob reaches both ends of the bar
// (styles in src/styles/22-range.css). --fill tells the bar how full it is, from 0 to 1.
export default function RangeInput({ value, min, max, style, ...rest }: Props) {
  const fill = max > min ? Math.min(1, Math.max(0, (value - min) / (max - min))) : 0;
  return <input type="range" value={value} min={min} max={max} style={{ ...style, "--fill": fill } as CSSProperties} {...rest} />;
}
