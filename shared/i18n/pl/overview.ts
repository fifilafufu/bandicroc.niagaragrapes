// Polish Overview page content: the same facts, numbers and sources as shared/overview.ts, in the
// same order. Polish number style (8000, 77,7) with the same values. Terms checked on Polish
// Wikipedia: winorośl właściwa (Vitis vinifera), winorośl lisia (Vitis labrusca), rodzynki,
// antocyjany, Dionizos, jagoda. No Polish article: Twelve Grapes, Vinotherapy, Areni-1, sultana, currant.

import type { Section } from "../../overview";

export const DID_YOU_KNOW_PL = [
  "Winogrona pochodzą z Bliskiego Wschodu i zachodniej Azji, gdzie ludzie zaczęli je uprawiać 6000–8000 lat temu.",
  "„Białe” winogrona są tak naprawdę zielone: to fioletowe winogrona z wyłączonymi dwoma genami barwnika.",
  "Winogrona i rodzynki są toksyczne dla psów. Nigdy nie dawaj ich psu!",
  "Najwięcej winogron na świecie uprawiają Chiny: 17,0 z 77,7 mln ton zebranych w 2024 roku, czyli około 22% (OIV).",
  "Najstarsza znana winiarnia, Areni-1 w Armenii, ma około 6000 lat (ok. 4100 p.n.e.).",
  "W Hiszpanii o północy w sylwestra je się 12 winogron, po jednym na szczęście w każdym miesiącu.",
  "Jedno grono może mieć od 15 do 300 winogron.",
  "Dojrzałe winogrona mogą być karmazynowe, czarne, ciemnoniebieskie, żółte, zielone, pomarańczowe lub różowe.",
  "Vinotherapy to prawdziwy zabieg kosmetyczny, w którym używa się pestek i miąższu winogron pozostałych po produkcji wina.",
  "Odmianą o największej powierzchni winnic na świecie jest Kyoho, japońska odmiana deserowa uprawiana głównie w Chinach (OIV, dane z 2015 roku).",
  "Coraz mniej winogron trafia do produkcji wina: w 2024 roku 47% wytłoczono na wino i soki, a 46% zjedzono na świeżo (OIV).",
];

export const STATS_TITLE_PL = "🌍 Winogrona na świecie w liczbach";

// Same order as STATS in shared/overview.ts.
export const STATS_PL = [
  { value: "8000", label: "lat, odkąd ludzie zaczęli uprawiać winogrona (zachodnia Azja)" },
  { value: "77,7 mln", label: "ton winogron zebranych na całym świecie w 2024 roku (OIV)" },
  { value: "47%", label: "światowych winogron wytłoczonych na wino i soki (OIV 2024)" },
  { value: "15–300", label: "winogron w jednym gronie" },
];

// Keyed by the English section title. Source labels stay in English (they name English articles).
export const SECTIONS_PL: Record<string, Pick<Section, "title" | "body">> = {
  "What is a grape?": {
    title: "Czym jest winogrono?",
    body: [
      "Z botanicznego punktu widzenia winogrono to jagoda. Rośnie w gronach liczących od 15 do 300 owoców na zdrewniałych pnączach z rodzaju Vitis (winorośl).",
      "Większość winogron, które jemy i pijemy, pochodzi z jednego gatunku, winorośli właściwej (Vitis vinifera), pochodzącej z basenu Morza Śródziemnego i Azji Środkowej. Ameryka Północna ma własne dzikie gatunki, takie jak winorośl lisia (Vitis labrusca), z której rodziny wywodzą się Concord i Niagara.",
    ],
  },
  "Types & colours": {
    title: "Rodzaje i kolory",
    body: [
      "Nie tylko białe i czarne! Dojrzałe winogrona mogą być karmazynowe, czarne, ciemnoniebieskie, żółte, zielone, pomarańczowe lub różowe. „Białe” winogrona są naprawdę zielone: to fioletowe winogrona z wyłączonymi genami barwnika.",
      "Odmian są tysiące. Główny podział to winogrona deserowe (do jedzenia, często bezpestkowe) i winogrona przerobowe, na wino. Poznaj kilka z nich poniżej.",
    ],
  },
  "A very old fruit": {
    title: "Bardzo stary owoc",
    body: [
      "Ludzie uprawiają winogrona od około 8000 lat, a zaczęli na Bliskim Wschodzie.",
      "Najstarsze znane ślady wina pochodzą z okolic Tbilisi w Gruzji (ok. 6000 p.n.e.), a najstarsza znana winiarnia, Areni-1 w Armenii, z ok. 4100 p.n.e. Winogrona uprawiali starożytni Egipcjanie, Grecy, Fenicjanie i Rzymianie.",
    ],
  },
  "Where they grow": {
    title: "Gdzie rosną",
    body: [
      "W 2024 roku świat zebrał 77,7 mln ton winogron. Najwięcej Chiny (17,0 mln t, około 22%), a za nimi Włochy i USA.",
    ],
  },
  "What we use them for": {
    title: "Do czego ich używamy",
    body: [
      "W 2024 roku 47% światowych winogron wytłoczono na wino, moszcz i soki, 46% zjedzono na świeżo, a 7% wysuszono na rodzynki (w tym currants i sultanas).",
      "Z winogron powstają też soki, dżemy i galaretki, ocet oraz olej z pestek winogron.",
    ],
  },
  "Table grapes vs wine grapes": {
    title: "Winogrona deserowe a winogrona na wino",
    body: [
      "Winogrona deserowe hoduje się do jedzenia: zwykle są duże, bezpestkowe i mają cienką skórkę. Winogrona na wino zbiera się bardzo słodkie, przy około 24% cukru.",
      "Odmianą o największej powierzchni winnic jest Kyoho, odmiana deserowa, przed winną odmianą Cabernet Sauvignon i odmianą Sultana (Thompson Seedless), według przeglądu odmian OIV (dane z 2015 roku).",
    ],
  },
  "Meaning & traditions": {
    title: "Znaczenie i tradycje",
    body: [
      "W starożytnej Grecji Dionizos był bogiem winiarstwa, owoców, płodności i świętowania; Rzymianie nazywali go Bachusem.",
      "W Hiszpanii o północy w sylwestra je się dwanaście winogron, po jednym przy każdym uderzeniu dzwonu, na szczęście w każdym miesiącu nowego roku. Zwyczaj spopularyzowali w 1909 roku plantatorzy, którzy mieli do sprzedania ogromne zbiory.",
    ],
  },
  Nutrition: {
    title: "Wartości odżywcze",
    body: ["Surowe winogrona to w 81% woda i w 18% węglowodany. 100 g ma około 69 kcal i trochę witaminy K."],
  },
};
