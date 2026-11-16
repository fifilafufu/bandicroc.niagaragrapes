import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { Page } from "./route";

// Pages you have opened stay alive (just hidden) while you visit other sections, so a quiz round,
// the wine you're making or the sliders you moved are still there when you come back. Each page also
// gets back the scroll position you left it at (a page opened for the first time starts at the top).
export function useKeepPages(page: Page, scrollRef: RefObject<HTMLElement | null>): Page[] {
  const [opened, setOpened] = useState<Page[]>([page]);
  if (!opened.includes(page)) setOpened([...opened, page]);

  const positions = useRef<Partial<Record<Page, number>>>({});
  const current = useRef(page);
  // Remember where each page is scrolled to while it is on screen.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      positions.current[current.current] = el.scrollTop;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);
  // Switching pages: go back to where this page was left.
  useLayoutEffect(() => {
    current.current = page;
    scrollRef.current?.scrollTo({ top: positions.current[page] ?? 0 });
  }, [page, scrollRef]);

  return opened;
}
