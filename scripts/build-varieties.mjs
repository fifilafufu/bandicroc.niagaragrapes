// Builds shared/varietyData.json: for every grape in the app, its official VIVC passport data
// (prime name, number, berry colour, species, origin, pedigree) and a real Wikimedia Commons photo
// with its author and licence. Re-run any time to re-check: node scripts/build-varieties.mjs
//
// VIVC = Vitis International Variety Catalogue (Julius Kühn Institute), https://www.vivc.de
// Photos: the photo used on each grape's Wikipedia article, unless `photo` names a better file.
// Files in a Commons "AI-generated" category are refused.

import { writeFileSync } from "node:fs";

const UA = "bandicroc-grapes/1.5 (https://bandicroc-niagaragrapes.pages.dev; data build script)";

// name: as shown in the app. vivc: VIVC prime name(s) to try, in order. wiki: English Wikipedia title.
const VARIETIES = [
  { name: "Niagara", vivc: ["NIAGARA"], wiki: "Niagara (grape)" },
  { name: "Concord", vivc: ["CONCORD"], wiki: "Concord grape" },
  { name: "Catawba", vivc: ["CATAWBA"], wiki: "Catawba (grape)" },
  { name: "Delaware", vivc: ["DELAWARE"], wiki: "Delaware (grape)" },
  { name: "Cotton Candy", vivc: [], wiki: "Cotton Candy grapes" }, // a patented variety (2000s); not listed in VIVC
  { name: "Thompson Seedless", vivc: ["SULTANINA"], wiki: "Sultana (grape)" },
  { name: "Red Globe", vivc: ["RED GLOBE"], wiki: "Red Globe" },
  { name: "Muscat", vivc: [], wiki: "Muscat (grape)" }, // a family of varieties, not one VIVC entry
  { name: "Chardonnay", vivc: ["CHARDONNAY BLANC", "CHARDONNAY"], wiki: "Chardonnay" },
  { name: "Riesling", vivc: ["RIESLING WEISS", "RIESLING"], wiki: "Riesling" },
  { name: "Pinot Noir", vivc: ["PINOT NOIR"], wiki: "Pinot noir" },
  { name: "Cabernet Sauvignon", vivc: ["CABERNET SAUVIGNON"], wiki: "Cabernet Sauvignon" },
  { name: "Shine Muscat", vivc: ["SHINE MUSCAT"], wiki: "Shine Muscat" },
  { name: "Scuppernong", vivc: ["SCUPPERNONG"], wiki: "Scuppernong" },
  { name: "Gewürztraminer", vivc: ["GEWUERZTRAMINER"], wiki: "Gewürztraminer" },
  { name: "Kyoho", vivc: [], vivcId: 6597, wiki: "Kyoho (grape)" }, // found under its other names (KYOHO, KIOHO)
  // Added in Part 3
  { name: "Pinot Gris", vivc: ["PINOT GRIS"], wiki: "Pinot gris" },
  { name: "Merlot", vivc: ["MERLOT NOIR", "MERLOT"], wiki: "Merlot", photo: "Merlot grapes at Château Le Bon Pasteur, Pomerol.jpg" },
  { name: "Sauvignon Blanc", vivc: ["SAUVIGNON BLANC"], wiki: "Sauvignon blanc" },
  { name: "Syrah", vivc: ["SYRAH"], wiki: "Syrah", photo: "Shiraz Grapes.jpg" },
  { name: "Tempranillo", vivc: ["TEMPRANILLO TINTO", "TEMPRANILLO"], wiki: "Tempranillo" },
  { name: "Grenache", vivc: ["GARNACHA TINTA", "GRENACHE NOIR"], wiki: "Grenache" },
  { name: "Solaris", vivc: ["SOLARIS"], wiki: "Solaris (grape)" },
  { name: "Regent", vivc: ["REGENT"], wiki: "Regent (grape)" },
  { name: "Marquette", vivc: ["MARQUETTE"], wiki: "Marquette (grape)" },
  { name: "Seyval Blanc", vivc: ["SEYVAL BLANC", "SEYVAL"], wiki: "Seyval blanc" },
  { name: "Vidal Blanc", vivc: ["VIDAL BLANC", "VIDAL 256"], wiki: "Vidal blanc" },
];

const get = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
};
const text = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

// ---------- VIVC ----------

async function passportById(id) {
  const page = await (await get(`https://www.vivc.de/index.php?r=passport%2Fview&id=${id}`)).text();
  const rows = Object.fromEntries([...page.matchAll(/<th[^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => [text(m[1]), text(m[2])]));
  return {
    id,
    primeName: rows["Prime name"] || null,
    colour: (rows["Color of berry skin"] || "").toLowerCase() || null,
    species: rows["Species"] || null,
    origin: rows["Country or region of origin of the variety"] || null,
    pedigree: rows["Pedigree confirmed by markers"] || rows["Pedigree as given by breeder/bibliography"] || null,
    url: `https://www.vivc.de/index.php?r=passport%2Fview&id=${id}`,
  };
}

async function vivcPassport(primeNames) {
  for (const prime of primeNames) {
    const search = `https://www.vivc.de/index.php?r=cultivarname%2Findex&CultivarnameSearch%5Bcultivarnames%5D=leitname&CultivarnameSearch%5Btext%5D=${encodeURIComponent(prime)}`;
    const html = await (await get(search)).text();
    const hit = [...html.matchAll(/href="index\.php\?r=passport%2Fview&amp;id=(\d+)">([^<]+)</g)].find((m) => text(m[2]) === prime);
    if (!hit) continue;
    return passportById(+hit[1]);
  }
  return null;
}

// ---------- Wikimedia Commons photo ----------

async function leadImage(wikiTitle) {
  const api = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=name&redirects=1&format=json&titles=${encodeURIComponent(wikiTitle)}`;
  const data = await (await get(api)).json();
  return Object.values(data.query?.pages ?? {})[0]?.pageimage ?? null;
}

async function commonsPhoto(file) {
  const api =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo|categories&cllimit=max" +
    `&iiprop=url|mime|extmetadata&iiurlwidth=480&titles=${encodeURIComponent(`File:${file}`)}`;
  const data = await (await get(api)).json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata ?? {};
  const cats = (page.categories ?? []).map((c) => c.title);
  return {
    file,
    thumb: info.thumburl,
    page: info.descriptionurl,
    mime: info.mime,
    author: text(meta.Artist?.value ?? "") || "Unknown author",
    licence: meta.LicenseShortName?.value ?? "Unknown licence",
    licenceUrl: meta.LicenseUrl?.value ?? null,
    aiGenerated: cats.some((c) => /AI[- ]generated/i.test(c)),
  };
}

// ---------- build ----------

const out = {};
for (const v of VARIETIES) {
  const vivc = v.vivcId ? await passportById(v.vivcId) : v.vivc.length ? await vivcPassport(v.vivc).catch((e) => (console.error(v.name, e.message), null)) : null;
  const file = v.photo ?? (await leadImage(v.wiki));
  const photo = file ? await commonsPhoto(file).catch(() => null) : null;
  if (photo?.aiGenerated) console.error(`!! ${v.name}: ${file} is in an AI-generated category, refused`);
  out[v.name] = { wiki: v.wiki, vivc, photo: photo && !photo.aiGenerated ? photo : null };
  console.log(
    `${v.name.padEnd(18)} VIVC ${vivc ? `${vivc.id} ${vivc.primeName} ${vivc.colour}` : "-"}  |  ${photo ? `${photo.licence} · ${photo.author.slice(0, 30)} · ${file}` : "no photo"}`,
  );
}

const checked = new Date().toISOString().slice(0, 10);
writeFileSync(new URL("../shared/varietyData.json", import.meta.url), JSON.stringify({ checked, varieties: out }, null, 1) + "\n");
console.log(`\nWrote shared/varietyData.json (${Object.keys(out).length} varieties, checked ${checked})`);
