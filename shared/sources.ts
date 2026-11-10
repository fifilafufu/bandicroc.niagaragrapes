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
} satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;
