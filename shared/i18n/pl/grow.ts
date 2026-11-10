// Polish text for Grow Your Grape: the same facts and sources as shared/grow.ts and diseases.ts.
// Grape names are not translated; traits describe the variety ("odmiana"), so they are feminine.
// Checked terms (Polish Wikipedia): mączniak rzekomy, mączniak prawdziwy (Mączniakowce), gronowiec
// szary (Botrytis cinerea), chloroza, skoczkowate (Leafhopper), roztocze (Mite), fitoplazmy, niedobór
// magnezu, trejaż (Trellis), strefy mrozoodporności (Hardiness zone), szczepienie, podkładka,
// filoksera winiec, wino lodowe. No Polish article, kept in English: esca, eutypa, excoriose,
// coulure, millerandage, anthracnose, black rot, Pierce's disease, VSP, spur and cane (pruning).

import type { DiseaseKey } from "../../diseases";

type GrowTextPL = { cold?: string; vigour?: string; diseases?: string; frostRisk?: string; pruning?: string; training?: string; climateSoil?: string; rootstock?: string };

// Keyed by grape name, same fields as GROW in shared/grow.ts.
export const GROW_PL: Record<string, GrowTextPL> = {
  "Cabernet Sauvignon": {
    diseases: "Szczególnie podatna na choroby pnia winorośli (esca, eutypa, excoriose) i na mączniaka prawdziwego.",
  },
  Merlot: {
    vigour: "Normalna siła wzrostu, pokrój zwisający.",
    diseases: "Wrażliwa na mączniaka rzekomego i prawdziwego, gronowca szarego (botrytis), skoczki i suszę; skłonna do słabego zawiązywania owoców (coulure).",
    frostRisk: "Wcześnie wypuszcza pąki i kwitnie, więc wiosenny przymrozek może uszkodzić młode pędy.",
    pruning: "Nadaje się do krótkiego cięcia.",
    climateSoil: "W ciepłym klimacie łatwo przejrzewa; wrażliwa na suszę.",
  },
  "Pinot Noir": {
    cold: "Bardzo odporna na zimowe mrozy.",
    diseases: "Podatna na mączniaka rzekomego, gronowca szarego (botrytis) i skoczki.",
    frostRisk: "Przez wczesne pękanie pąków jest wrażliwa na wczesnowiosenne przymrozki.",
    climateSoil: "W ciepłym klimacie szybko dojrzewa. Chłodna, wilgotna pogoda w czasie kwitnienia psuje zawiązywanie owoców, więc nie nadaje się na gleby gliniaste i wilgotne.",
  },
  Syrah: {
    vigour: "Bardzo silny wzrost, niska płodność.",
    diseases: "Wyjątkowo podatna na chlorozę (żółknięcie liści); mniej na roztocza i gronowca szarego.",
    pruning: "Lepiej znosi długie cięcie (cane); krótkie cięcie też może dać dobre wino w ciepłych regionach na południu.",
  },
  Grenache: {
    cold: "Wrażliwa na jesienne przymrozki i słabo przygotowuje się do zimy: prawdziwe wyzwanie w chłodnych miejscach.",
    vigour: "Bardzo silny wzrost, pokrój wzniesiony.",
    diseases: "Podatna na mączniaka rzekomego, excoriose, gronowca szarego, słabe zawiązywanie owoców (coulure) i niedobór magnezu.",
    climateSoil: "Niezwykle odporna na suszę i łatwo dostosowuje się do różnych gleb; do dojrzenia potrzebuje gorących, suchych warunków.",
  },
  Tempranillo: {
    vigour: "Bardzo silny wzrost, pokrój wzniesiony.",
    diseases: "Podatna na excoriose i mączniaka prawdziwego; wrażliwa na skrajną suszę i wiatr.",
    pruning: "Nadaje się do krótkiego cięcia.",
    climateSoil: "Szczególnie dobrze pasuje do warunków na południu; krótki okres wegetacji.",
  },
  Chardonnay: {
    vigour: "Silny wzrost.",
    diseases: "Podatna na mączniaka prawdziwego, fitoplazmy i gronowca szarego.",
    frostRisk: "OIV zauważa, że przez termin pękania pąków jest wrażliwa na wiosenne przymrozki.",
    pruning: "Krótkie cięcie daje plony od niskich do średnich.",
  },
  "Sauvignon Blanc": {
    vigour: "Bardzo silny wzrost, niska płodność; małe grona skłonne do słabego zawiązywania owoców.",
    diseases: "Wyjątkowo podatna na mączniaka prawdziwego i black rot; mniej na mączniaka rzekomego i gronowca szarego. Także choroby pnia.",
  },
  "Thompson Seedless": {
    vigour: "Bardzo silny wzrost, obniżona płodność.",
    diseases: "Podatna na mączniaka prawdziwego i rzekomego, anthracnose, excoriose, gronowca szarego, nierówne jagody (millerandage) i pękanie jagód.",
    pruning: "Potrzebuje trejażu i długiego cięcia (cane).",
    training: "Uprawiana na trejażach.",
  },
  "Red Globe": {
    vigour: "Bardzo silny wzrost, duże grona i jagody.",
  },
  Kyoho: {
    diseases: "Umiarkowana odporność na choroby.",
  },
  Marquette: {
    cold: "Mrozoodporna: w pełnym spoczynku przetrwa około −37 °C. Rośnie bardzo dobrze w strefie USDA 4 i dobrze w strefie 3.",
    diseases: "Dobra odporność na mączniaka rzekomego, mączniaka prawdziwego i black rot.",
    climateSoil: "Wyhodowana w Minnesocie z myślą o zimnym klimacie. Zbiór jest tam od połowy do końca września.",
  },
  Regent: {
    diseases: "Szeroka odporność na główne choroby grzybowe, takie jak mączniak rzekomy. Słaby punkt: jeśli kwiaty zmokną w czasie kwitnienia, są bardzo podatne na gronowca szarego, co może zatrzymać zawiązywanie owoców.",
    pruning: "Długie pędy przywiązane do niskiego drutu owocującego.",
    training: "Pokrój wzniesiony; można ją prowadzić w systemie VSP (pionowe ustawienie pędów).",
  },
  Solaris: {
    cold: "Wytrzymała, z dobrą odpornością na mróz: uprawiana w północnej Europie (Belgia, Holandia, Anglia, Dania, Szwecja, Norwegia).",
    diseases: "Dobra odporność na choroby grzybowe.",
  },
  "Vidal Blanc": {
    cold: "Bardzo mrozoodporna; uprawiana głównie w Kanadzie (Ontario, Kolumbia Brytyjska, Quebec, Nowa Szkocja).",
    diseases: "Dość odporna na mączniaka rzekomego, ale bardzo podatna na mączniaka prawdziwego i słabe zawiązywanie owoców (coulure).",
    climateSoil: "W zimnym klimacie osiąga dużo cukru przy umiarkowanej lub wysokiej kwasowości; często zostawia się ją na krzewie do zimy na wino lodowe.",
  },
  "Seyval Blanc": {
    climateSoil: "Dojrzewa wcześnie, dobrze plonuje i pasuje do dość chłodnego klimatu.",
  },
  Catawba: {
    cold: "Wytrzymały krzew, który znosi mroźne zimy kontynentalne i gorące, wilgotne lata.",
    diseases: "Bardziej podatna na mączniaka rzekomego i prawdziwego niż typowe odmiany amerykańskie.",
    climateSoil: "Dojrzewa tydzień lub dwa po Concord i Delaware, więc potrzebuje dość długiego sezonu.",
  },
  Delaware: {
    diseases: "Podatna na mączniaka rzekomego.",
    rootstock: "Wymaga szczepienia na podkładce odpornej na filokserę (prawdopodobnie z powodu europejskich przodków); po zaszczepieniu rośnie silnie.",
    climateSoil: "Uprawiana na północnym wschodzie i na Środkowym Zachodzie USA; dojrzewa wcześniej niż Concord.",
  },
  Scuppernong: {
    cold: "Uszkodzenia zimowe lub przemarznięcie tam, gdzie temperatura spada poniżej około −18 °C (0 °F).",
    diseases: "Muscadines dobrze znoszą choroby i szkodniki.",
    climateSoil: "Przystosowana do ciepłego, wilgotnego południowego wschodu USA.",
  },
  "Shine Muscat": {
    cold: "Dość odporna na zimno; zachowuje kolor nawet w bardzo gorące lata.",
    vigour: "Silny wzrost; pierwszy zbiór około trzech lat po posadzeniu.",
  },
  "Pinot Gris": {
    climateSoil: "Najlepiej rośnie w chłodniejszym klimacie (Alzacja, północno-wschodnie Włochy, Oregon); suche jesienie pozwalają długo zostawiać winogrona na krzewie.",
  },
  Riesling: {
    climateSoil: "Szczególnie dobrze pasuje do gleb łupkowych i piaszczysto-gliniastych.",
  },
};

// Same cases as rootstockAdvice() in shared/grow.ts.
export const ROOTSTOCK_PL = {
  vinifera: "Korzenie europejskiej Vitis vinifera atakuje filoksera: tam, gdzie występuje, szczep krzew na odpornej na nią amerykańskiej podkładce.",
  muscadine: "Nie znaleźliśmy źródła o podkładkach dla muscadines.",
  american: "Ma amerykańskich przodków, co pomaga przeciw filokserze; nie znaleźliśmy porad o podkładkach dla tej konkretnej odmiany.",
};

// Same order as GENERAL_CALENDAR, GENERAL_PRUNING and GENERAL_DISEASE (University of Minnesota Extension).
export const CALENDAR_PL = [
  "Przytnij istniejące krzewy, zanim ruszy wzrost.",
  "Sadź krzewy z gołym korzeniem, gdy tylko da się uprawiać glebę.",
  "Usuwaj pędy, które zaczynają wyrastać nisko na pniu.",
  "Przywiązuj nowe przyrosty do trejażu.",
  "Sprawdzaj, czy na krzewach nie ma chorób i owadów.",
  "Sadź krzewy z doniczek, gdy minie ryzyko przymrozków.",
  "Gdy owoce dojrzewają, uważaj na ptaki; w razie potrzeby okryj krzewy siatką.",
  "Zbieraj winogrona, kierując się kolorem i smakiem.",
  "Sprzątnij opadłe liście, owoce i ścięte pędy, bo zimują w nich choroby.",
];

export const PRUNING_PL = [
  "Przycinaj co roku zimą lub wczesną wiosną, gdy winorośl jest w spoczynku. Usuwa się 80–90% zeszłorocznego przyrostu, bo owoce rosną na nowych pędach z zeszłorocznego drewna.",
  "Zostaw 1–2 pnie i 2–4 ramiona (zdrewniałe kordony), z krótkimi odcinkami pędów (spur) o jednym lub dwóch pąkach.",
  "Po cięciu: odmiany deserowe i na sok 40–60 pąków na krzew, odmiany winne 20–30. Mocne cięcie daje najlepsze owoce; słabe cięcie daje dużo owoców kiepskiej jakości.",
];

export const DISEASE_TIPS_PL = [
  "Sadź w pełnym słońcu, w przewiewnym miejscu, i przycinaj tak, by krzew był przewiewny.",
  "Każdej jesieni zgrabiaj liście i opadłe owoce; zimują w nich choroby.",
  "Podlewaj korzenie, nie liście: mokre liście sprzyjają chorobom.",
  "Black rot: winogrona są podatne od kwitnienia do około 6 tygodni później.",
  "Trzymaj z daleka środki na chwasty w trawniku z 2,4-D lub dikambą: winorośl jest na nie bardzo wrażliwa.",
];

export const DISEASE_NAMES_PL: Record<DiseaseKey, string> = {
  downy: "Mączniak rzekomy",
  powdery: "Mączniak prawdziwy",
  blackRot: "Black rot",
  botrytis: "Gronowiec szary (botrytis)",
  anthracnose: "Anthracnose",
  phomopsis: "Phomopsis (excoriose)",
  pierces: "Pierce's disease",
};
