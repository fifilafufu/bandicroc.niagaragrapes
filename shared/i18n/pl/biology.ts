// Polish text for the Taste and Biology pages: aromas, species and the vine's year. Same facts and
// sources as shared/aromas.ts, species.ts and growthCycle.ts. Species and grape names are not
// translated. Checked terms (Polish Wikipedia): winorośl właściwa, winorośl lisia, winorośl pachnąca
// (Vitis riparia), podkładka, wąs czepny, liany, antranilan metylu, kwas jabłkowy.
// No Polish article, so kept in English: véraison, muscadine, Muscadinia.

import type { Stage } from "../../growthCycle";

// Keyed by the English aroma and family names in shared/aromas.ts.
export const AROMA_PL: Record<string, string> = {
  cherry: "wiśnia",
  raspberry: "malina",
  strawberry: "truskawka",
  blackcurrant: "czarna porzeczka",
  blackberry: "jeżyna",
  "black cherry": "czarna wiśnia",
  apple: "jabłko",
  pear: "gruszka",
  citrus: "cytrusy",
  peach: "brzoskwinia",
  "tropical fruit": "owoce tropikalne",
  lychee: "liczi",
  floral: "kwiaty",
  grass: "trawa",
  "green pepper": "zielona papryka",
  mint: "mięta",
  "black pepper": "czarny pieprz",
  "white pepper": "biały pieprz",
  licorice: "lukrecja",
  "musky (foxy)": "piżmowy (foxy)",
  "butter (from oak)": "masło (z dębu)",
  leather: "skóra",
  "cotton candy": "wata cukrowa",
};
export const FAMILY_PL: Record<string, string> = {
  "Red fruit": "Owoce czerwone",
  "Black fruit": "Owoce ciemne",
  "Orchard & citrus": "Owoce z sadu i cytrusy",
  Tropical: "Owoce tropikalne",
  Flowers: "Kwiaty",
  "Green & herbal": "Zielone i ziołowe",
  Spice: "Przyprawy",
  Other: "Inne",
};

// Keyed by species name.
export const SPECIES_TEXT_PL: Record<string, { nick: string; where: string; text: string; exampleNote?: string }> = {
  "Vitis vinifera": {
    nick: "winorośl właściwa",
    where: "basen Morza Śródziemnego, Europa Środkowa i Azja Południowo-Zachodnia",
    text: "Gatunek, od którego pochodzi większość winogron deserowych i na wino. Udomowiony około 4100–3000 p.n.e. Uprawne krzewy mają kwiaty jednocześnie męskie i żeńskie, więc owocują same; dzikie są albo męskie, albo żeńskie.",
  },
  "Vitis labrusca": {
    nick: "winorośl lisia",
    where: "Ameryka Północna",
    text: "Piżmowy smak „foxy” i jagody typu „slip-skin”, z których skórka zsuwa się w całości. Wąsy czepne wyrastają przy każdym węźle pędu. Należy do przodków odmian Concord, Niagara i innych amerykańskich winogron.",
    exampleNote: "głównie labrusca",
  },
  "Vitis riparia": {
    nick: "winorośl pachnąca",
    where: "Ameryka Północna",
    text: "Bardzo mrozoodporna i odporna na choroby grzybowe, więc hodowcy tworzą z niej odporne mieszańce, a plantatorzy szczepią europejskie krzewy na jej korzeniach (podkładka).",
  },
  "Vitis rotundifolia": {
    nick: "muscadine",
    where: "południowy wschód i południowa część środkowych USA",
    text: "Lubi ciepłą, wilgotną pogodę. Duże jagody, brązowawe, ciemnofioletowe lub czarne. Jest tak odmienna, że tworzy osobną podgrupę, Muscadinia; niektórzy botanicy uznają ją za odrębny rodzaj.",
  },
};

// Keyed by stage id, same facts as STAGES in shared/growthCycle.ts.
export const STAGES_PL: Record<string, Pick<Stage, "name" | "when" | "text">> = {
  budbreak: {
    name: "Pękanie pąków",
    when: "Około marca (we wrześniu na półkuli południowej), gdy dni przekraczają około 10 °C",
    text: "Pąki pęcznieją i pojawiają się pierwsze zielone pędy. Wcześniej przycięte krzewy „płaczą”: z ran po cięciu wycieka sok. Młode pędy łatwo niszczy przymrozek.",
  },
  flowering: {
    name: "Kwitnienie",
    when: "Około maja (w listopadzie na półkuli południowej), 40–80 dni po pękaniu pąków, przy 15–20 °C",
    text: "Otwierają się drobne kwiatostany. Większość uprawnych krzewów zapyla się sama; wiatr i owady pomagają tylko trochę.",
  },
  fruitset: {
    name: "Zawiązywanie owoców",
    when: "Zaraz po kwitnieniu, w maju (w listopadzie na półkuli południowej)",
    text: "Zapłodnione kwiaty zmieniają się w małe, twarde, zielone jagody, a pozostałe opadają. Średnio jagodami staje się około 30% kwiatów. To decyduje o tym, jak duże mogą być zbiory. Potem jagody rosną, zielone i kwaśne, aż do véraison.",
  },
  veraison: {
    name: "Véraison",
    when: "Koniec lipca i sierpień (koniec stycznia i luty na półkuli południowej), 40–50 dni po zawiązaniu owoców",
    text: "Zaczyna się dojrzewanie: jagody miękną i zmieniają kolor, na czerwony lub czarny u ciemnych odmian, na żółtozielony u białych.",
  },
  harvest: {
    name: "Zbiór",
    when: "Wrzesień i październik (od lutego do kwietnia na półkuli południowej)",
    text: "W miarę dojrzewania rośnie zawartość cukru i pH, a kwasów, takich jak kwas jabłkowy, ubywa. Plantatorzy zbierają winogrona, gdy te proporcje odpowiadają temu, co chcą z nich zrobić.",
  },
  dormancy: {
    name: "Opadanie liści i spoczynek",
    when: "Po pierwszym przymrozku, przez całą zimę",
    text: "Po zbiorze krzew gromadzi zapasy w korzeniach i pniu. Liście żółkną i opadają, a winorośl odpoczywa przez zimę aż do wiosny.",
  },
};

export const MONTHS_PL = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
