import { useEffect, useRef, useState } from "react";

// Types out a streamed answer at a steady pace. Grape Bot's server sends whole sentences in bursts
// (and holds back the start until it's checked), so showing the text as it lands looks jumpy.
// Returns how many characters of `text` to show. `id` names the answer: only an answer that was
// streaming while this screen was open is typed out; saved ones show in full straight away.

const MIN_SPEED = 30; // characters per second while more is still coming
const MAX_SPEED = 400;
const FINISH_SPEED = 150; // at least this fast once the whole answer is in
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useTypewriter(text: string, streaming: boolean, id: string | undefined): number {
  const [view, setView] = useState<{ id: string | undefined; n: number }>({ id: undefined, n: Infinity });
  const latest = useRef({ text, streaming });
  const loop = useRef<{ id: string | undefined; frame: number } | null>(null);

  useEffect(() => {
    latest.current = { text, streaming };
  });

  useEffect(() => {
    if (!streaming || loop.current?.id === id) return;
    if (loop.current) cancelAnimationFrame(loop.current.frame);
    let pos = 0;
    let shown = -1;
    let prev = performance.now();
    const tick = (now: number) => {
      // Background tabs get few frames: allow a bigger step so the text still catches up.
      const dt = Math.min((now - prev) / 1000, 0.5);
      prev = now;
      const { text: full, streaming: more } = latest.current;
      const backlog = full.length - pos;
      // Slow when little is waiting, faster when a big piece has just landed, so it rarely stalls.
      const speed = reducedMotion() ? Infinity : more ? Math.min(MAX_SPEED, Math.max(MIN_SPEED, backlog * 2)) : Math.max(FINISH_SPEED, backlog * 3);
      pos = Math.min(full.length, pos + speed * dt);
      if (!more && pos >= full.length) {
        loop.current = null;
        setView({ id, n: Infinity });
        return;
      }
      if (Math.floor(pos) !== shown) {
        shown = Math.floor(pos);
        setView({ id, n: shown });
      }
      loop.current = { id, frame: requestAnimationFrame(tick) };
    };
    loop.current = { id, frame: requestAnimationFrame(tick) };
  }, [streaming, id]);

  useEffect(
    () => () => {
      if (loop.current) cancelAnimationFrame(loop.current.frame);
      loop.current = null;
    },
    [],
  );

  if (view.id === id) return Math.min(view.n, text.length);
  return streaming ? 0 : text.length;
}
