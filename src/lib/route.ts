import { useCallback, useEffect, useState } from "react";

// A tiny hash router: each section has its own address (e.g. #/quizzes), so links can be shared
// and the phone's back button goes back to the previous section instead of closing the app.
// Hash addresses need no server setup, so they work on Cloudflare Pages and in the installed app.

export type Page = "home" | "stats" | "taste" | "biology" | "quizzes" | "chat" | "mine" | "settings";

// The Learn pages all live under the Grapes tab.
export const LEARN_PAGES = ["home", "stats", "taste", "biology"] as const satisfies readonly Page[];
export const isLearnPage = (p: Page) => (LEARN_PAGES as readonly Page[]).includes(p);

const PATHS: Record<Page, string> = {
  home: "/",
  stats: "/learn/statistics",
  taste: "/learn/taste",
  biology: "/learn/biology",
  quizzes: "/quizzes",
  chat: "/chat",
  mine: "/my-grapes",
  settings: "/settings",
};

function pageFromHash(): Page {
  const path = location.hash.replace(/^#/, "").replace(/\/+$/, "") || "/";
  return (Object.keys(PATHS) as Page[]).find((p) => PATHS[p] === path) ?? "home";
}

export function useRoute() {
  const [page, setPage] = useState<Page>(pageFromHash);

  useEffect(() => {
    const onChange = () => setPage(pageFromHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  // Going to a section adds a history entry, so "back" returns to where you were.
  const go = useCallback((next: Page) => {
    const hash = `#${PATHS[next]}`;
    if (location.hash !== hash) location.hash = hash;
    setPage(next);
  }, []);

  return [page, go] as const;
}
