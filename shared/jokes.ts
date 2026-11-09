// Grape Bot's joke bank. The Polish jokes are written in Polish (their own wordplay), not translated,
// because translated puns stop making sense. Each device remembers which jokes it has heard, and the
// server picks one it hasn't, so people don't all get the same joke.

export type Joke = { id: string; text: string };

export const JOKES: { en: Joke[]; pl: Joke[] } = {
  en: [
    { id: "en2-elephant", text: "What did the grape say when the elephant stepped on it? Nothing. It just let out a little wine." },
    { id: "en2-date", text: "Why did the raisin go out with the prune? Because it couldn't find a date." },
    { id: "en2-gossip", text: "How do grapes share gossip? Through the grapevine, obviously." },
    { id: "en2-sorry", text: "How does a grape apologise? \"I'm berry, berry sorry.\" (Grapes really are berries!)" },
    { id: "en2-book", text: "What's a grape's favourite book? Grape Expectations." },
    { id: "en2-ape", text: "What's big, purple and swings through the jungle? A grape ape." },
    { id: "en2-wall", text: "What's purple and thousands of kilometres long? The Grape Wall of China." },
    { id: "en2-breathe", text: "What did the green grape say to the purple grape? \"BREATHE! Just breathe!\"" },
    { id: "en2-press", text: "Why do grapes get nervous at the vineyard? They've heard rumours about the press." },
    { id: "en2-whine", text: "What did the mum grape say to the crying baby grape? \"Stop wining.\"" },
    { id: "en2-splash", text: "Why are Niagara grapes so famous? They always make a big splash. 💦" },
    { id: "en2-juice", text: "Why did the grape stop halfway across the road? It ran out of juice." },
    { id: "en2-knock", text: "Knock knock. Who's there? Grape. Grape who? Grape to see you! 🍇" },
    { id: "en2-wrinkles", text: "A raisin looks in the mirror. \"Wrinkles? No. That's experience.\"" },
    { id: "en2-motto", text: "Grape Bot's life advice: life is short, eat the grapes, and never wine about it." },
  ],
  pl: [
    { id: "pl2-grono", text: "Dlaczego winogrona najlepiej bawią się na imprezach? Bo zawsze są we własnym gronie." },
    { id: "pl2-winny", text: "Sędzia pyta winogrono: „Czy oskarżony jest winny?”. Winogrono: „Wysoki Sądzie, jeszcze nie. Winny będę dopiero za pół roku, w beczce”." },
    { id: "pl2-pestka", text: "Dwa winogrona wychodzą ze sprawdzianu. Pierwsze: „Ale łatwizna, pestka!”. Drugie, bezpestkowe: „No, tobie to łatwo mówić…”." },
    { id: "pl2-poty", text: "Trener na WF-ie: „Dziś wycisnę z was siódme poty!”. Winogrono: „Proszę pana, ze mnie da się wycisnąć najwyżej sok”." },
    { id: "pl2-zielony", text: "Zielone winogrono pyta fioletowe: „Jak ty to robisz, że jesteś taki mądry?”. Fioletowe: „Też kiedyś byłem zielony. Potem dojrzałem”." },
    { id: "pl2-prasa", text: "Czego najbardziej boją się winogrona? Prasy. Nie, nie gazet. Tej w winnicy." },
    { id: "pl2-sernik", text: "Dlaczego rodzynki nie lubią świąt? Bo przy każdym serniku znajdzie się ktoś, kto wydłubuje je widelcem." },
    { id: "pl2-rodzynek", text: "Jedyny chłopak w klasie pełnej dziewczyn to rodzynek. A jedyne winogrono w misce truskawek? Też rodzynek, tylko jeszcze o tym nie wie." },
    { id: "pl2-lustro", text: "Rodzynek patrzy w lustro: „Zmarszczki? Jakie zmarszczki? To doświadczenie”." },
    { id: "pl2-lis", text: "Lis nie dosięgnął winogron i powiedział, że są kwaśne. Winogrona do dziś śmieją się z jego kwaśnej miny." },
    { id: "pl2-sylwester", text: "Hiszpania, Sylwester. „Zjadłeś dwanaście winogron o północy?”. „Zjadłem. Szczęście mam na cały rok, a czkawkę na pół”." },
    { id: "pl2-niagara", text: "Które winogrono najlepiej pływa? Niagara. W końcu wychowała się przy wodospadzie. 💦" },
  ],
};

// A joke this device hasn't heard yet; once it has heard them all, it starts again.
export function pickJoke(lang: "en" | "pl", seen: string[]): Joke {
  const all = JOKES[lang];
  const fresh = all.filter((j) => !seen.includes(j.id));
  const pool = fresh.length ? fresh : all;
  return pool[Math.floor(Math.random() * pool.length)];
}

const JOKE_WORDS = /\b(jokes?|funny|pun|puns|laugh|humou?r|make me smile)\b|żart|dowcip|kawał(?!ek|k)|śmieszn|rozśmiesz|zabawn|suchar/i;
export const wantsJoke = (text: string) => JOKE_WORDS.test(text);
