// Polish text for the "guess the number" and "tap the diagram" questions in shared/quiz/numbers.ts,
// keyed by question id. Numbers are read from the same data files and written the Polish way.

import { BALANCE_2024, OIV_2024_MORE, USES_SERIES } from "../../grapeUses";
import { SUGAR_PER_ABV, YEAST_LIMIT_ABV, abvFromSugar } from "../../wine";
import { num } from "../countries";
import type { QuizPL } from "./quizBank";

const B = BALANCE_2024;
const fresh2000 = USES_SERIES.find((y) => y.year === 2000)!;
const n = (x: number) => num(Math.round(x * 10) / 10, "pl");

export const NUMBERS_PL: Record<string, QuizPL> = {
  // statistics
  "n-world": { q: `Ile milionów ton winogron wyprodukował świat w ${B.year} r.?`, unit: "mln ton", why: `${n(B.produced)} mln ton (OIV). Po zbiorze stracono ${n(B.lost)}, zostało ${n(B.available)}.` },
  "n-pressed": { q: `Jaką część winogron na świecie wytłoczono (głównie na wino) w ${B.year} r.?`, why: `${B.shares.pressed}% wytłoczono, ${B.shares.table}% zjedzono na świeżo, ${B.shares.dried}% wysuszono (OIV).` },
  "n-raisin-kg": { q: "Ile kilogramów świeżych winogron potrzeba na 1 kg rodzynek?", why: `Około 4 kg: w ${B.year} r. z ${n(B.driedFresh)} mln ton świeżych winogron powstało ${n(B.driedProduct)} mln ton suszonych (OIV).` },
  "n-china": { q: `Ile milionów ton winogron wyprodukowały Chiny w ${B.year} r.?`, unit: "mln ton", why: `${n(B.china)} mln ton, najwięcej ze wszystkich krajów, przed Włochami (${n(B.italy)}) i USA (${n(B.usa)}) (OIV).` },
  "n-vineyard": { q: `Ile milionów hektarów winnic było na świecie w ${B.year} r.?`, unit: "mln ha", why: `${n(OIV_2024_MORE.vineyardMha)} mln hektarów, na wszystkie zastosowania (OIV).` },
  "n-wine-hl": { q: `Ile milionów hektolitrów wina wyprodukował świat w ${B.year} r.?`, unit: "mln hl", why: `${n(B.wineHl)} mln hektolitrów, z ${n(B.wine)} mln ton winogron (OIV).` },
  "n-table-2000": { q: "Jaką część winogron na świecie zjedzono na świeżo w 2000 r.?", why: `Około ${fresh2000.table}%, wobec ${B.shares.table}% w ${B.year} r.: winogron deserowych jest coraz więcej (OIV).` },

  // biology
  "n-water": { q: "Ile procent surowego winogrona stanowi woda?", why: "Surowe winogrona to w 81% woda i w 18% węglowodany." },
  "n-fruitset": { q: "Jaka część kwiatów winorośli zmienia się średnio w jagody?", why: "Średnio około 30% kwiatów zmienia się w jagody; reszta opada. To wyznacza, jak duży może być zbiór." },

  // growing
  "n-prune": { q: "Jaką część zeszłorocznego przyrostu wycina się przy zimowym cięciu?", why: "80–90%, bo owoce rosną na nowych pędach z zeszłorocznego drewna." },
  "n-marquette": { q: "Marquette wyhodowano w Minnesocie z myślą o mroźnych zimach. Do jakiej temperatury przetrwa w pełnym spoczynku?", why: "Około −37 °C. Rośnie bardzo dobrze w strefie USDA 4 i dobrze w strefie 3." },

  // winemaking
  "n-lees": { q: "Ile co najmniej miesięcy szampan bez rocznika musi dojrzewać na osadzie (lees, martwe drożdże)?", unit: "mies.", why: "Co najmniej 15 miesięcy na osadzie, co dodaje smaku." },
  "n-pressure": { q: "Ile mniej więcej atmosfer ciśnienia ma w pełni musujące wino?", why: "Około 5–6 atmosfer: dwutlenek węgla z drugiej fermentacji nie może uciec z zamkniętej butelki." },

  // wine basics
  "n-abv-200": { q: "Moszcz ma 200 g/L cukru. Ile alkoholu da po pełnej fermentacji?", why: `200 × 0,05943 = ${n(abvFromSugar(200))}% vol (reguła OIV).` },
  "n-sugar-per-abv": { q: "Ile gramów cukru na litr daje 1% alkoholu?", why: `Około ${n(SUGAR_PER_ABV)} g/L (1 ÷ 0,05943, OIV).` },
  "n-yeast": { q: "Przy jakim mniej więcej poziomie alkoholu drożdże winiarskie zwykle przestają pracować?", why: `Zwykle między ${n(YEAST_LIMIT_ABV.low)} a ${n(YEAST_LIMIT_ABV.high)}%. Pozostały cukier sprawia, że wino jest słodkie.` },
  "n-sweet": { q: "Od ilu g/L cukru wino niemusujące może mieć na etykiecie w UE określenie „słodkie”?", why: "Słodkie od 45 g/L. Poniżej: półsłodkie, półwytrawne lub wytrawne." },

  // tap the berry
  "d-yeast": { q: "Dotknij części winogrona, na której żyją dzikie drożdże.", why: "Dzikie drożdże żyją na skórce. Miażdżenie pozwala im spotkać się z sokiem i zacząć fermentację." },
  "d-water": { q: "Dotknij części, która w 75–85% składa się z wody.", why: "Miąższ w 75–85% składa się z wody." },
  "d-oil": { q: "Dotknij części, z której tłoczy się olej z pestek winogron.", why: "Olej z pestek winogron pochodzi z pestek, często jako produkt uboczny winiarstwa." },
  "d-stem": { q: "Dotknij części, która łączy jagodę z gronem.", why: "Szypułka łączy każdą jagodę z gronem. Winiarze zwykle usuwają szypułki przy miażdżeniu." },
  "d-colour": { q: "Wino czerwone bierze barwę z jednej części winogrona. Dotknij jej.", why: "Barwa jest w skórce: maceracja (kontakt ze skórkami) przenosi do wina barwę i taniny." },
};
