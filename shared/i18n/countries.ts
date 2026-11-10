// Country names in the chosen language. The data files use English names; countryCodes.json maps
// each to its ISO code (built once with i18n-iso-countries), and the browser's own Intl names
// (Unicode CLDR) give the Polish name. Unknown names stay as they are.

import CODES from "./countryCodes.json";
import type { Lang } from "./index";

const codes = CODES as Record<string, string>;
const cache = new Map<Lang, Intl.DisplayNames>();

export function countryName(name: string, lang: Lang): string {
  if (lang === "en") return name === "United States of America" ? "United States" : name;
  const code = codes[name];
  if (!code) return name;
  let dn = cache.get(lang);
  if (!dn) cache.set(lang, (dn = new Intl.DisplayNames([lang], { type: "region" })));
  return dn.of(code) ?? name;
}

// Numbers written the way each language writes them (77.7 → 77,7 in Polish); the value never changes.
export const num = (n: number, lang: Lang) => n.toLocaleString(lang === "pl" ? "pl-PL" : "en", { maximumFractionDigits: 2 });
