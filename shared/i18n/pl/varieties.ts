// Polish text for the colour classes, the "How grape varieties work" guide and the gallery.
// Same facts and sources as shared/colourClasses.ts, varietiesGuide.ts and gallery.ts. Grape and
// species names are not translated. Checked terms (Polish Wikipedia): winorośl (Vitis), antocyjany,
// podkładka, wino lodowe. "Muscadines" has no Polish article and stays in English.

import type { Use } from "../../gallery";

// Keyed by the class name (Blanc, Rose, Gris, Rouge, Noir).
export const CLASSES_PL: Record<string, { meaning: string; note: string }> = {
  Blanc: { meaning: "biała", note: "naprawdę od zielonej do żółtej, nawet brązowawej" },
  Rose: { meaning: "różowa", note: "jasnoróżowa skórka" },
  Gris: { meaning: "szara", note: "od szarawo-różowej do brązowawej" },
  Rouge: { meaning: "czerwona", note: "od jasno- do ciemnoczerwonej" },
  Noir: { meaning: "czarna", note: "naprawdę od ciemnoniebieskiej do niebieskoczarnej" },
};

// Keyed by VIVC colour code.
export const COLOUR_MEANING_PL: Record<string, string> = {
  blanc: "biała (od zielonej do żółtej)",
  rose: "różowa",
  gris: "szaroróżowa",
  rouge: "czerwona",
  noir: "czarna (niebieskoczarna)",
};

// Keyed by the English label from speciesLabel().
export const SPECIES_PL: Record<string, string> = {
  "Hybrid (crossed species)": "Mieszaniec (krzyżówka gatunków)",
};

// Same order as LADDER in shared/varietiesGuide.ts.
export const LADDER_PL = [
  { step: "Rodzaj", name: "Vitis (winorośl)", text: "Wszystkie winorośle. Muscadines (np. Scuppernong) tworzą własną podgrupę, Muscadinia; niektórzy botanicy uznają ją za osobny rodzaj." },
  {
    step: "Gatunek",
    name: "Dzikie gatunki winorośli",
    text: "Vitis vinifera (Europa i zachodnia Azja: większość winogron na wino i deserowych), Vitis labrusca (Ameryka Północna: piżmowy smak „foxy”), Vitis riparia (Ameryka Północna: bardzo mrozoodporna, używana na podkładki i w hodowli).",
  },
  {
    step: "Odmiana",
    name: "Jedna nazwana roślina, kopiowana",
    text: "Każdy krzew Merlot to sadzonka z sadzonki pierwszej rośliny Merlot. Z nasiona wyrosłaby zupełnie nowa odmiana i właśnie tak hodowcy tworzą nowe.",
  },
  { step: "Mutacja / klon", name: "Drobne zmiany", text: "Czasem krzew zmienia się sam. Pinot Gris to mutacja barwna Pinot Noir." },
];

export const USE_LABEL_PL: Record<Use, string> = { eat: "do jedzenia", wine: "wino", juice: "soki i galaretki", raisin: "rodzynki" };

// Keyed by grape name, same facts as INFO in shared/gallery.ts.
export const TASTE_PL: Record<string, string> = {
  Niagara: "Słodki, piżmowy, „foxy”",
  Concord: "Słodki, piżmowy; cierpka skórka",
  Catawba: "Piżmowy, wyraźnie winogronowy, kwaskowaty",
  Delaware: "Soczysty, słodki, łagodny",
  "Cotton Candy": "Bardzo słodki, jak wata cukrowa",
  "Thompson Seedless": "Łagodny, słodki",
  "Red Globe": "Chrupiący, delikatnie słodki",
  Muscat: "Słodki, bardzo kwiatowy",
  Chardonnay: "Neutralny; wino przejmuje cechy dębu i klimatu",
  Riesling: "Kwiatowy, wysoka kwasowość",
  "Pinot Noir": "Wino: wiśnia i malina",
  "Cabernet Sauvignon": "Wino: czarna porzeczka, taniczne",
  "Shine Muscat": "Słodki, aromat muszkatowy; jadalna skórka",
  Scuppernong: "Duża jagoda, gruba i twarda skórka",
  Gewürztraminer: "Wino pachnie liczi",
  Kyoho: "Bardzo słodki, soczysty; je się go bez skórki",
  "Pinot Gris": "Wino: pełne i oleiste albo lekkie i rześkie",
  Merlot: "Wino: miękkie, mięsiste czerwone",
  "Sauvignon Blanc": "Wino: rześkie, od trawiastego po tropikalne",
  Syrah: "Wino: jeżyna, czarny pieprz",
  Tempranillo: "Wino: dość neutralne, często w kupażach",
  Grenache: "Wino: malina, biały pieprz",
  Solaris: "Wino białe; odporna na choroby grzybowe",
  Regent: "Wino czerwone; odporna na choroby grzybowe",
  Marquette: "Wino czerwone; przetrwa około −37 °C",
  "Seyval Blanc": "Wino białe; wcześnie dojrzewa",
  "Vidal Blanc": "Wino białe i wino lodowe",
};
