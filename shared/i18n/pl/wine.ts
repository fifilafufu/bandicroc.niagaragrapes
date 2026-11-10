// Polish text for Winemaking, Wine basics and Make Your Wine. Same facts, numbers and sources as
// shared/winemaking.ts, wineBasics.ts and wine.ts. Checked terms (Polish Wikipedia): winiarstwo,
// maceracja, moszcz, fermentacja jabłkowo-mlekowa, taniny, kwas winowy, kwas jabłkowy, kwas mlekowy,
// drożdże, etanol, barrique, wino musujące, wino różowe, szaptalizacja, dwutlenek węgla.
// Sweetness words: the Polish terms of EU Regulation 2019/33, Annex III.
// No Polish article, so kept in English: tirage, lees, riddling, disgorging, dosage, residual sugar, body.

import type { StepId, Style } from "../../winemaking";
import type { PartId } from "../../wineBasics";

export const STEPS_PL: Record<StepId, { name: string; what: string; why: string }> = {
  harvest: {
    name: "Zbiór winogron",
    what: "Dojrzałe winogrona zbiera się ręcznie albo maszynowo.",
    why: "Termin zbioru decyduje o winie: dojrzalsze winogrona mają więcej cukru (więcej możliwego alkoholu) i mniej kwasów.",
  },
  crush: {
    name: "Miażdżenie i odszypułkowanie",
    what: "Skórki jagód zostają przerwane, aby uwolnić sok (moszcz), a szypułki są usuwane, często przez maszynę z łopatkami.",
    why: "Sok może zetknąć się z drożdżami żyjącymi na skórkach, a smaki ze skórek mogą do niego przejść.",
  },
  maceration: {
    name: "Maceracja (kontakt ze skórkami)",
    what: "Sok i skórki zostają razem na pewien czas. Przy winie czerwonym dzieje się to w trakcie fermentacji.",
    why: "Wydobywa ze skórek barwę, taniny i smak. Krótki kontakt daje wino różowe, długi daje czerwone. Wina białe i różowe biorą ze skórek bardzo mało tanin.",
  },
  press: {
    name: "Tłoczenie",
    what: "Winogrona albo skórki są wyciskane, aby oddzielić płyn.",
    why: "Przy winie białym i różowym: uzyskać czysty sok przed fermentacją. Przy czerwonym: oddzielić młode wino od skórek po fermentacji.",
  },
  ferment: {
    name: "Fermentacja alkoholowa",
    what: "Drożdże zamieniają cukry z winogron w alkohol i dwutlenek węgla. Mogą to być dzikie drożdże ze skórek albo wybrane drożdże dodane przez winiarza.",
    why: "To ona robi wino. Około 16,8 g/L cukru daje 1% alkoholu; drożdże zwykle przestają pracować gdzieś między 14 a 18%, a pozostały cukier sprawia, że wino jest słodkie.",
  },
  mlf: {
    name: "Fermentacja jabłkowo-mlekowa",
    what: "Bakterie zamieniają ostry kwas jabłkowy (smak zielonych jabłek) w łagodniejszy kwas mlekowy.",
    why: "Wino staje się mniej kwaśne i bardziej stabilne. Może dodać maślaną nutę. Standard w większości win czerwonych, częsta też w niektórych białych, np. Chardonnay.",
  },
  age: {
    name: "Dojrzewanie (często w dębie)",
    what: "Wino odpoczywa przez pewien czas, na przykład w małych beczkach dębowych (barrique).",
    why: "Przez drewno przenika odrobina tlenu, która łagodzi taniny; dąb dodaje smak wanilii (wanilina) i własne taniny.",
  },
  clarify: {
    name: "Klarowanie",
    what: "Wino zostaje oczyszczone: zlane znad osadu, sklarowane środkami klarującymi, przefiltrowane i często schłodzone, aby wytrąciły się kryształki winianów.",
    why: "Usuwa zmętnienie i drożdże oraz stabilizuje wino, aby w butelce pozostało klarowne.",
  },
  bottle: {
    name: "Butelkowanie",
    what: "Gotowe, klarowne wino rozlewa się do butelek i zamyka.",
    why: "Wino zmienia się dalej podczas starzenia: w winie czerwonym barwniki łączą się z taninami, co zmienia kolor i zmniejsza cierpkość.",
  },
  tirage: {
    name: "Tirage",
    what: "Wino bazowe (niemusujące) rozlewa się do butelek z drożdżami i odrobiną cukru (liqueur de tirage) i zamyka kapslem.",
    why: "Z tego cukru powstaną bąbelki.",
  },
  second: {
    name: "Druga fermentacja w butelce",
    what: "Drożdże fermentują dodany cukier w zamkniętej butelce.",
    why: "Dwutlenek węgla nie może uciec, więc rozpuszcza się w winie: w pełni musujące wino ma ciśnienie około 5–6 atmosfer.",
  },
  lees: {
    name: "Dojrzewanie na osadzie (lees)",
    what: "Butelki leżą z martwymi drożdżami (lees) w środku.",
    why: "Dodaje to smaku. Szampan bez rocznika musi spędzić na osadzie co najmniej 15 miesięcy.",
  },
  riddle: {
    name: "Riddling",
    what: "Butelki obraca się i przechyla, krok po kroku, aż stoją do góry dnem; dziś robią to głównie maszyny.",
    why: "Osad drożdżowy zsuwa się do szyjki butelki.",
  },
  disgorge: {
    name: "Disgorging i dosage",
    what: "Szyjkę zamraża się, a korek lodu z drożdżami zostaje wystrzelony. Butelkę uzupełnia się winem z odrobiną cukru (dosage) i zamyka korkiem.",
    why: "Wino jest klarowne, a dosage decyduje, jak wytrawne lub słodkie jest w smaku, od brut nature do słodkiego.",
  },
};

export const STYLES_PL: Record<Style["id"], { name: string; blurb: string; notes: Partial<Record<StepId, string>> }> = {
  red: {
    name: "Czerwone",
    blurb: "Ciemne winogrona fermentują razem ze skórkami, więc barwa i taniny przechodzą do wina. Tłoczenie następuje po fermentacji.",
    notes: {
      maceration: "od kilku dni do tygodni, w tym samym czasie co fermentacja",
      ferment: "na skórkach",
      press: "po fermentacji",
      mlf: "standard w większości win czerwonych",
    },
  },
  white: {
    name: "Białe",
    blurb: "Winogrona tłoczy się najpierw i fermentuje tylko sok, więc ze skórek nie przechodzi prawie żadna barwa ani taniny.",
    notes: { press: "przed fermentacją", ferment: "tylko sok", mlf: "np. wiele win Chardonnay" },
  },
  rose: {
    name: "Różowe",
    blurb: "Ciemne winogrona, ale sok pozostaje na skórkach tylko tak długo, by nabrać różowej barwy, więc bierze bardzo mało tanin.",
    notes: { maceration: "krótka: tylko tyle, by wino zróżowiało", ferment: "tylko sok" },
  },
  sparkling: {
    name: "Musujące",
    blurb: "Metoda tradycyjna (jak w Szampanii): najpierw powstaje wino niemusujące, a potem druga fermentacja w zamkniętej butelce wytwarza bąbelki.",
    notes: { press: "aby zrobić niemusujące wino bazowe", ferment: "pierwsza fermentacja: niemusujące wino bazowe" },
  },
};

export const PARTS_PL: Record<PartId, { name: string; what: string; from: string; changes: string; numbers: string }> = {
  acidity: {
    name: "Kwasowość",
    what: "Świeża, cierpka strona wina, od której cieknie ślinka. Z winogron pochodzą trzy główne kwasy: winowy, jabłkowy i cytrynowy.",
    from: "Z winogron. W miarę dojrzewania kwasów ubywa, więc wcześniej zebrane winogrona dają bardziej rześkie wino. Fermentacja jabłkowo-mlekowa zmienia ostry kwas jabłkowy w łagodniejszy kwas mlekowy.",
    changes: "Świeżość. Kwas winowy utrzymuje chemiczną stabilność wina i pomaga zachować barwę, a kwasy chronią wino przed bakteriami. Kwasowość ocenia się po tym, jak równoważy słodycz i gorzkie składniki, takie jak taniny.",
    numbers: "Większość win ma pH od 2,9 do 3,9. Im niższe pH, tym bardziej kwaśne wino. Kwasowość ogólną podaje się w gramach na litr w przeliczeniu na kwas winowy.",
  },
  sugar: {
    name: "Cukier (słodycz)",
    what: "Cukier z winogron (glukoza i fruktoza), którego drożdże nie zamieniły w alkohol: cukier pozostały w winie (residual sugar).",
    from: "Z winogron. Zostaje w winie, gdy fermentacja kończy się wcześniej, z wyboru winiarza albo dlatego, że cukru było więcej, niż drożdże mogły zużyć.",
    changes: "Słodycz i pełniejsze odczucie. Równoważy ją kwasowość; bez dość kwasów słodkie wino jest mdłe.",
    numbers: "Etykiety w UE: wytrawne do 4 g/L (lub do 9 g/L, jeśli kwasowość jest najwyżej o 2 g/L niższa niż zawartość cukru), dalej półwytrawne, półsłodkie, a słodkie od 45 g/L.",
  },
  alcohol: {
    name: "Alkohol",
    what: "Etanol, który drożdże wytwarzają z cukru z winogron podczas fermentacji.",
    from: "Tylko z cukru: dojrzalsze winogrona to więcej możliwego alkoholu. Około 16,8 g/L cukru daje 1% alkoholu. Drożdże zwykle przestają pracować przy 14–18%.",
    changes: "Body i ciepło: dużo alkoholu sprawia, że wino wydaje się pełne i ciężkie; za dużo daje piekące, „alkoholowe” wrażenie.",
    numbers: "Cukier (g/L) × 0,05943 = alkohol (% vol). Zatem 200 g/L cukru, przefermentowane w całości, daje około 11,9%.",
  },
  tannin: {
    name: "Taniny",
    what: "Związki fenolowe, przez które w ustach robi się sucho i szorstko (cierpkość), jak po mocnej herbacie.",
    from: "Skórki, pestki i szypułki winogron, z których przechodzą do wina podczas maceracji, oraz dąb beczek. Dlatego wina czerwone mają taniny, a białe i różowe bardzo mało.",
    changes: "Struktura i chwyt. Gdy czerwone wino się starzeje, barwniki łączą się z taninami: barwa się zmienia, a wino staje się mniej cierpkie.",
    numbers: "Bez kontaktu ze skórkami i bez dębu prawie nie ma tanin.",
  },
  body: {
    name: "Body",
    what: "Jak ciężkie i pełne wydaje się wino w ustach: lekkie, średnie lub pełne.",
    from: "Głównie z alkoholu, razem z odczuciem wina w ustach.",
    changes: "Jak bogate wydaje się wino. Wino „tłuste” ma pełne body i jest niemal gęste; „ciężkie” ma za dużo alkoholu i body.",
    numbers: "Więcej alkoholu zwykle oznacza pełniejsze body.",
  },
  balance: {
    name: "Równowaga",
    what: "Gdy kwasowość, taniny, słodycz i alkohol do siebie pasują i żaden składnik się nie wyróżnia.",
    from: "Z winogron i z każdej decyzji winiarza.",
    changes: "Miękkość cukru i alkoholu musi pasować do twardości kwasowości i tanin. Im niższa kwasowość, tym więcej tanin wino może unieść.",
    numbers: "Wypróbuj poniżej: przesuwaj suwaki i obserwuj wagę.",
  },
};

// EU label words (Regulation 2019/33, Annex III, Polish version), keyed by the English word in shared/wine.ts.
export const SWEETNESS_PL: Record<string, string> = {
  dry: "wytrawne",
  "medium dry": "półwytrawne",
  "medium sweet": "półsłodkie",
  sweet: "słodkie",
  "brut nature": "brut nature",
  "extra brut": "extra brut",
  brut: "brut",
  "extra dry": "extra dry",
  "medium dry (demi-sec)": "półwytrawne (demi-sec)",
  "sweet (doux)": "słodkie (doux)",
};

// Keyed by the English note from balance() in shared/wine.ts.
export const BALANCE_NOTE_PL: Record<string, string> = {
  "Nothing sticks out: a balanced wine.": "Nic się nie wyróżnia: wino jest zrównoważone.",
  "Too sweet for its acidity: it tastes cloying.": "Za słodkie jak na swoją kwasowość: smakuje mdło.",
  "Alcohol and softness win: it tastes heavy and hot.": "Wygrywają alkohol i miękkość: wino jest ciężkie i piekące.",
  "Tannin wins: it feels harsh and drying.": "Wygrywają taniny: wino jest szorstkie i wysuszające.",
  "Acid wins: it tastes sharp and sour.": "Wygrywa kwasowość: wino jest ostre i kwaśne.",
};
