import type { Page } from "../lib/route";

// The row of buttons at the top of the Grapes tab: one per Learn page. Scrolls sideways on small phones.
const ITEMS: { page: Page; label: string }[] = [
  { page: "home", label: "🍇 Overview" },
  { page: "stats", label: "📊 Statistics" },
  { page: "taste", label: "👅 Taste" },
  { page: "biology", label: "🌱 Biology" },
];

export default function LearnNav({ page, go }: { page: Page; go: (p: Page) => void }) {
  return (
    <nav className="learn-nav" aria-label="Learn about grapes">
      {ITEMS.map((i) => (
        <button key={i.page} className={`chip ${page === i.page ? "on" : ""}`} onClick={() => go(i.page)} aria-current={page === i.page ? "page" : undefined}>
          {i.label}
        </button>
      ))}
    </nav>
  );
}
