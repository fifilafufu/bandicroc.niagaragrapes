// "432 / 1000": shown once text gets near the limit (or always, if `always`).
export default function Counter({ length, max, always = false }: { length: number; max: number; always?: boolean }) {
  if (!always && length < max * 0.8) return null;
  return (
    <span className={`counter ${length >= max ? "full" : ""}`} aria-live="polite">
      {length} / {max}
    </span>
  );
}
