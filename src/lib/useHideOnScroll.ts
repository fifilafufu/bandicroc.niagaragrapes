import { useEffect, useState, type RefObject } from "react";

// Slides a bar away while the user scrolls down (past the first 80 px) and brings it back when they
// scroll up or `resetKey` changes (e.g. a new page). Returns the negative top margin to apply to the
// bar (0 when shown); the bar's height is measured at the moment it hides.
export function useHideOnScroll(scrollRef: RefObject<HTMLElement | null>, barRef: RefObject<HTMLElement | null>, resetKey: unknown) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      if (Math.abs(y - last) < 8) return; // ignore tiny jitters
      setOffset(y > last && y > 80 ? -(barRef.current?.offsetHeight ?? 60) : 0);
      last = y;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, barRef]);
  // A new page starts with the bar shown.
  const [lastKey, setLastKey] = useState(resetKey);
  if (lastKey !== resetKey) {
    setLastKey(resetKey);
    setOffset(0);
  }
  return offset;
}
