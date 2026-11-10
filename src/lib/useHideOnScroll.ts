import { useEffect, useState, type RefObject } from "react";

// Slides a bar away while the user scrolls down (past the first 80 px) and brings it back when they
// scroll up or `resetKey` changes (e.g. a new page). Returns the negative top margin to apply to the
// bar (0 when shown); the bar's height is measured at the moment it hides.
//
// Hiding the bar makes the scroll area taller, so near the bottom the browser pulls the scroll
// position back up by itself. That is not the user scrolling up, so it must not bring the bar back
// (or the bar flickers in and out forever): moves that end at the very bottom are ignored, and the
// bar only hides when the page still has room to scroll once it is gone.
export function useHideOnScroll(scrollRef: RefObject<HTMLElement | null>, barRef: RefObject<HTMLElement | null>, resetKey: unknown) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let last = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop;
      if (Math.abs(y - last) < 8) return; // ignore tiny jitters
      const barHeight = barRef.current?.offsetHeight ?? 60;
      const room = el.scrollHeight - el.clientHeight; // how far the page can scroll right now
      const atBottom = y >= room - 1;
      if (y > last) {
        if (y > 80 && room > barHeight + 80) setOffset(-barHeight);
      } else if (!atBottom) {
        setOffset(0);
      }
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
