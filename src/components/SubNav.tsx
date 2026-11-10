import type { Page, SubNavItem } from "../lib/route";
import { useLang } from "../lib/lang";

// The row of buttons at the top of a tab that has several pages (Grapes, Games).
// Scrolls sideways on small phones.
export default function SubNav({ items, page, go, label }: { items: SubNavItem[]; page: Page; go: (p: Page) => void; label: string }) {
  const { t } = useLang();
  if (items.length < 2) return null; // a single page needs no row of buttons
  return (
    <nav className="learn-nav" aria-label={label}>
      {items.map((i) => (
        <button key={i.page} className={`chip ${page === i.page ? "on" : ""}`} onClick={() => go(i.page)} aria-current={page === i.page ? "page" : undefined}>
          {t(i.label)}
        </button>
      ))}
    </nav>
  );
}
