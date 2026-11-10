// Every non-Wikipedia source the app quotes, in one place. Facts, charts and quiz answers point
// to these ids, so each number can be traced back to where it came from.
// "checked" is the date the figure was last compared with the source.

export type Source = {
  id: string;
  publisher: string; // short name shown in the app, e.g. "OIV"
  title: string;
  year: number; // year the source was published
  url: string;
  checked: string; // YYYY-MM-DD
};

export const SOURCES = {
  "oiv-2024": {
    id: "oiv-2024",
    publisher: "OIV",
    title: "Statistical Brief: Wine, Table Grapes & Dried Grapes in 2024",
    year: 2025,
    url: "https://www.oiv.int/sites/default/files/documents/OIV_Statistical_Brief-Wine_Table_Grapes_and_Dried_Grapes_in_2024_0.pdf",
    checked: "2026-11-10",
  },
  "oiv-2022": {
    id: "oiv-2022",
    publisher: "OIV",
    title: "Annual Assessment of the World Vine and Wine Sector in 2022",
    year: 2023,
    url: "https://www.oiv.int/sites/default/files/documents/OIV_Annual_Assessment-2023.pdf",
    checked: "2026-11-10",
  },
  "oiv-2021": {
    id: "oiv-2021",
    publisher: "OIV",
    title: "Annual Assessment of the World Vine and Wine Sector in 2021",
    year: 2022,
    url: "https://www.oiv.int/sites/default/files/documents/OIV_Annual_Assessment_of_the_World_Vine_and_Wine_Sector_in_2021.pdf",
    checked: "2026-11-10",
  },
  "oiv-2018": {
    id: "oiv-2018",
    publisher: "OIV",
    title: "2019 Statistical Report on World Vitiviniculture",
    year: 2019,
    url: "https://www.oiv.int/public/medias/6782/oiv-2019-statistical-report-on-world-vitiviniculture.pdf",
    checked: "2026-11-10",
  },
  "oiv-2025-provisional": {
    id: "oiv-2025-provisional",
    publisher: "OIV (provisional, via Vinetur)",
    title: "Table grapes accounted for 48% of global grape production in 2025",
    year: 2026,
    url: "https://www.vinetur.com/en/20261007108518/table-grapes-accounted-for-48-of-global-grape-production-in-2025-oiv-says.html",
    checked: "2026-11-10",
  },
  "oiv-varieties-2017": {
    id: "oiv-varieties-2017",
    publisher: "OIV",
    title: "Distribution of the World's Grapevine Varieties (Focus 2017, 2015 data)",
    year: 2017,
    url: "https://www.oiv.int/public/medias/5888/en-distribution-of-the-worlds-grapevine-varieties.pdf",
    checked: "2026-11-10",
  },
  "fao-owid": {
    id: "fao-owid",
    publisher: "FAO via Our World in Data",
    title: "Grape production by country",
    year: 2026,
    url: "https://ourworldindata.org/grapher/grapes-production",
    checked: "2026-11-10",
  },
  "vivc": {
    id: "vivc",
    publisher: "VIVC",
    title: "Vitis International Variety Catalogue (Julius Kühn Institute)",
    year: 2026,
    url: "https://www.vivc.de/",
    checked: "2026-11-10",
  },
  "oiv-code": {
    id: "oiv-code",
    publisher: "OIV",
    title: "International Code of Oenological Practices",
    year: 2025,
    url: "https://www.oiv.int/standards/international-code-of-oenological-practices",
    checked: "2026-11-10",
  },
  "oiv-sugar-alcohol": {
    id: "oiv-sugar-alcohol",
    publisher: "OIV",
    title: "Resolution OENO 466-2012: sugar (g/L) × 0.05943 = potential alcohol (% vol)",
    year: 2012,
    url: "https://www.oiv.int/node/3299/download/pdf",
    checked: "2026-11-10",
  },
  "eu-2019-33": {
    id: "eu-2019-33",
    publisher: "EU",
    title: "Regulation 2019/33, Annex III: sweetness terms for wine labels",
    year: 2019,
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019R0033",
    checked: "2026-11-10",
  },
  "awri-mlf-red": {
    id: "awri-mlf-red",
    publisher: "AWRI",
    title: "Fact sheet: malolactic fermentation in red wine",
    year: 2024,
    url: "https://www.awri.com.au/files/attachment/mlf-in-red-wine",
    checked: "2026-11-10",
  },
  "vt-balance": {
    id: "vt-balance",
    publisher: "Virginia Tech Enology",
    title: "Vintner's Corner: wine balance",
    year: 2002,
    url: "https://enology.fst.vt.edu/VC/Jan-Feb02.html",
    checked: "2026-11-10",
  },
  "gp-concord-2014": {
    id: "gp-concord-2014",
    publisher: "Growing Produce",
    title: "Big berries fuel 2014 Concord harvest (Concord at 16 to 17 °Brix)",
    year: 2014,
    url: "https://www.growingproduce.com/fruits/grapes/big-berries-fuel-2014-concord-harvest/",
    checked: "2026-11-10",
  },
  "umn-home-grapes": {
    id: "umn-home-grapes",
    publisher: "University of Minnesota Extension",
    title: "Growing grapes in the home garden (reviewed 2024)",
    year: 2024,
    url: "https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/growing-grapes-in-the-home-garden",
    checked: "2026-11-10",
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
