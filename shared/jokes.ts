// Grape Bot's joke bank. The Polish jokes are written in Polish (their own wordplay), not translated,
// because translated puns stop making sense. Each device remembers which jokes it has heard, and the
// server picks one it hasn't, so people don't all get the same joke.

export type Joke = { id: string; text: string };

export const JOKES: { en: Joke[]; pl: Joke[] } = {
  en: [
    { id: "en-wine", text: "What did the grape say when it got stepped on? Nothing. It just let out a little wine." },
    { id: "en-juice", text: "Why did the grape stop in the middle of the road? It ran out of juice." },
    { id: "en-bunch", text: "Why are grapes never lonely? Because they always come in bunches." },
    { id: "en-sunscreen", text: "What do you call a grape that forgot its sunscreen? A raisin." },
    { id: "en-wall", text: "What's purple and thousands of kilometres long? The Grape Wall of China." },
    { id: "en-breathe", text: "What did the green grape say to the purple grape? \"Breathe! BREATHE!\"" },
    { id: "en-bar", text: "A grape walks into a bar. The bartender says, \"Sorry, we don't serve juice here.\" The grape says, \"No problem, I'll come back in a few months.\"" },
    { id: "en-bowl", text: "How many grapes can you put in an empty bowl? Just one. After that, it's not empty anymore." },
    { id: "en-niagara", text: "Why are Niagara grapes so confident? They know they're the sweetest in the bunch. (I'm completely unbiased. 💚)" },
    { id: "en-yoga", text: "How do grapes stay so flexible? Vine-yasa yoga." },
    { id: "en-grandpa", text: "What did the grape say to the raisin? \"Grandpa, tell me again about the summer you spent in the sun!\"" },
    { id: "en-hide", text: "Why don't grapes play hide and seek? They always get caught in a bunch." },
    { id: "en-raise", text: "How do raisins celebrate? They raisin the roof." },
    { id: "en-midnight", text: "Why do grapes in Spain get nervous on New Year's Eve? Twelve of them get eaten before midnight is over!" },
  ],
  pl: [
    { id: "pl-sad", text: "Winogrono stanęło przed sądem. Wyrok? Niewinne!" },
    { id: "pl-guilty", text: "Jak się nazywa winogrono, które coś przeskrobało? Winne." },
    { id: "pl-bar", text: "Winogrono wchodzi do baru. Barman: „Soków tu nie podajemy”. Winogrono: „Spokojnie, wrócę za kilka miesięcy jako wino”." },
    { id: "pl-dziadek", text: "Co mówi winogrono do rodzynka? „Dziadku, opowiedz, jak to było tamtego lata na słońcu!”" },
    { id: "pl-krem", text: "Rodzynek to po prostu winogrono, które zapomniało kremu z filtrem." },
    { id: "pl-miska", text: "Ile winogron zmieścisz do pustej miski? Jedno. Potem miska już nie jest pusta." },
    { id: "pl-biale", text: "Spotykają się dwa winogrona. „Czemu jesteś takie zielone?” „Bo jestem białe!” „Białe?” „No… ze stresu.”" },
    { id: "pl-chowany", text: "Dlaczego winogrona nie grają w chowanego? Bo zawsze wpadają całą kiścią." },
    { id: "pl-sylwester", text: "Dlaczego winogrona w Hiszpanii boją się Sylwestra? Bo o północy dwanaście z nich znika w dwanaście sekund!" },
    { id: "pl-niagara", text: "Dlaczego Niagara chodzi z podniesioną głową? Bo wie, że jest najsłodsza w całej kiści. (Mówię całkowicie bezstronnie 💚)" },
    { id: "pl-pestki", text: "Jaś zjadł całą kiść winogron. Mama: „Jasiu, czemu wszystkie?” Jaś: „Bo na opakowaniu było napisane »bez pestek«, a nie »bez umiaru«!”" },
    { id: "pl-kisc", text: "Czemu winogrona nigdy nie są samotne? Bo zawsze trzymają się swojej kiści." },
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
