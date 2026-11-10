import { useCallback, useEffect, useState } from "react";

// A tiny hash router: each section has its own address (e.g. #/quizzes), so links can be shared
// and the phone's back button goes back to the previous section instead of closing the app.
// Hash addresses need no server setup, so they work on Cloudflare Pages and in the installed app.

export type Page = "home" | "stats" | "taste" | "biology" | "winemaking" | "basics" | "grow" | "quizzes" | "wine" | "chat" | "mine" | "settings";

// The Learn pages all live under the Grapes tab.
export const LEARN_PAGES = ["home", "stats", "taste", "biology", "winemaking", "basics", "grow"] as const satisfies readonly Page[];
export const isLearnPage = (p: Page) => (LEARN_PAGES as readonly Page[]).includes(p);

// The games all live under the Games tab.
export const GAME_PAGES = ["quizzes", "wine"] as const satisfies readonly Page[];
export const isGamePage = (p: Page) => (GAME_PAGES as readonly Page[]).includes(p);

// The buttons shown at the top of the Grapes and Games tabs.
export type SubNavItem = { page: Page; label: string };

export const LEARN_ITEMS: SubNavItem[] = [
  { page: "home", label: "🍇 Overview" },
  { page: "stats", label: "📊 Statistics" },
  { page: "taste", label: "👅 Taste" },
  { page: "biology", label: "🌱 Biology" },
  { page: "winemaking", label: "🍷 Winemaking" },
  { page: "basics", label: "🥂 Wine basics" },
  { page: "grow", label: "🌿 Grow" },
];

export const GAME_ITEMS: SubNavItem[] = [
  { page: "quizzes", label: "🎯 Quizzes" },
  { page: "wine", label: "🍷 Make Your Wine" },
];

const PATHS: Record<Page, string> = {
  home: "/",
  stats: "/learn/statistics",
  taste: "/learn/taste",
  biology: "/learn/biology",
  winemaking: "/learn/winemaking",
  basics: "/learn/wine-basics",
  grow: "/learn/grow",
  quizzes: "/games/quizzes",
  wine: "/games/make-wine",
  chat: "/chat",
  mine: "/my-grapes",
  settings: "/settings",
};

// Addresses used by older versions, so links people shared keep working.
const OLD_PATHS: Record<string, Page> = { "/quizzes": "quizzes", "/games": "quizzes" };

function pageFromHash(): Page {
  const path = location.hash.replace(/^#/, "").replace(/\/+$/, "") || "/";
  return (Object.keys(PATHS) as Page[]).find((p) => PATHS[p] === path) ?? OLD_PATHS[path] ?? "home";
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
