// Polish quiz category and level names, scoreboard lines and Grape Bot's verdicts (jokes only, no
// facts). Written so they work for anyone, without guessing the player's grammatical gender.

import type { BoardText } from "../../quiz/scoreboard";
import type { Category, Level } from "../../quiz/types";

export const CATEGORY_NAMES_PL: Record<Category, string> = {
  varieties: "Odmiany",
  biology: "Biologia",
  statistics: "Statystyki",
  growing: "Uprawa",
  winemaking: "Winiarstwo",
  basics: "Podstawy wina",
};

export const LEVELS_PL: Record<Level, { name: string; blurb: string }> = {
  newbie: { name: "Początkujący", blurb: "Najpierw łatwe pytania" },
  pro: { name: "Tryb Dionizosa", blurb: "Daty, gatunki i smaczki dla znawców" },
};

export const BOARD_PL: BoardText = {
  best: [
    "Zero?! Winogrona Ci wybaczają. Prawie.",
    "Jedno winogrono czystego geniuszu!",
    "Kiełkuje! Ledwo, ale kiełkuje!",
    "Rodzynka wie mniej niż Ty. Oficjalnie.",
    "Pół grona błyskotliwości!",
    "Winogrona szepczą Twoje imię",
    "Winnica plotkuje, że idzie Ci ŚWIETNIE",
    "Jedno winogrono od chwały! TAK BLISKO!",
    "KOMPLET! Winogrona składają Ci pokłon 👑",
  ],
  notPlayed: "Jeszcze nie spróbowane. Winogrona czekają…",
  headlines: [
    { min: 1, text: "IDEALNA TABLICA WYNIKÓW?! Dionizos prosi o autograf 👑🍷" },
    { min: 0.75, text: "Winogronowa magia z certyfikatem! Sommelierzy drżą na dźwięk Twojego imienia 🍷" },
    { min: 0.5, text: "Koniec z poziomem dla początkujących! Winorośle kłaniają się, gdy przechodzisz 🍇" },
    { min: 0.25, text: "Robi się soczyście! Winnica zaczyna o Tobie mówić 👀" },
    { min: 0, text: "Mały kiełek z WIELKIMI marzeniami! Każda legenda od czegoś się zaczyna 🌱" },
  ],
  empty: "Twoja tablica wyników jest pustsza niż winnica w styczniu. Wybierz quiz poniżej!",
  verdict: {
    zero: [
      "Chyba nikt tu nie czytał tych stron… :( Nic nie szkodzi, winogrona i tak Cię lubią.",
      "Zero?! Odpowiedzi z zamkniętymi oczami? Wierzę w Ciebie. Trochę poczytaj i spróbuj jeszcze raz 💚",
      "Hmm, ani jednej. Nawet rodzynka wie trochę więcej… ale rodzynki miały mnóstwo czasu na myślenie. Jeszcze raz?",
    ],
    low: [
      "Malutki kiełek wiedzy! Każda winnica zaczyna się od jednego nasionka. Jeszcze jedna próba?",
      "Jeszcze niedojrzałe. Zajrzyj na kartę Winogrona, a następnym razem będzie soczyściej.",
    ],
    half: ["W połowie drogi do winogronowej wielkości! Całkiem nieźle.", "Solidnie! Znasz winogrona lepiej niż większość ludzi w supermarkecie."],
    close: ["Tak blisko! Jedno czy dwa winogrona od ideału."],
    closePro: "Imponujące. Dionizos powoli kiwa do Ciebie głową.",
    closeNewbie: "Świetna robota! Może czas na tryb Dionizosa?",
    perfectPro: "Komplet w trybie Dionizosa?! Sam bóg wina wznosi za Ciebie toast (sokiem winogronowym). 🍷",
    perfectNewbie: "Komplet! To już nie jest poziom dla początkujących. Może teraz tryb Dionizosa?",
  },
};
