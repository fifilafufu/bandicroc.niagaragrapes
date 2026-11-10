// The follow-up suggestions (no AI needed) and the system prompt that sets Grape Bot's rules and facts.

import { GENERAL_FACTS, findGrapeByWiki, findTopicByWiki, type Grape } from "../../shared/grapes";
import type { Joke } from "../../shared/jokes";
import type { Article } from "./settings";

export const isPolish = (text: string) => /[ąćęłńóśźż]|\b(jak|czy|gdzie|dlaczego|skąd|jakie|jaki|co to|opowiedz|powiedz|dowcip|kawał|suchar|cześć)\b/i.test(text);

export function followUps(focus: Grape | null, topic: string | null, userTexts: string[], polish: boolean): string[] {
  let options: string[];
  if (focus) {
    const g = focus.name;
    options = polish
      ? [`Jak smakują winogrona ${g}?`, `Gdzie uprawia się ${g}?`, `Do czego używa się ${g}?`, `Czym ${g} różni się od Niagary?`]
      : [`What does ${g} taste like?`, `Where is ${g} grown?`, `What is ${g} used for?`, `How is ${g} different from Niagara?`];
    if (g === "Niagara") options = options.filter((o) => !/Niagar(a|y)\?$/.test(o)).concat(polish ? ["Czym Niagara różni się od Concord?"] : ["How is Niagara different from Concord?"]);
  } else if (topic === "Grape toxicity in dogs") {
    options = polish
      ? ["Czy rodzynki też są groźne dla psów?", "Czy winogrona są zdrowe dla ludzi?", "Skąd pochodzą winogrona?"]
      : ["Are raisins dangerous for dogs too?", "Are grapes healthy for people?", "Where are grapes from?"];
  } else if (topic === "Winemaking") {
    options = polish
      ? ["Jakie winogrona są na wino?", "Czym różnią się winogrona stołowe i winne?", "Kto to był Dionizos?"]
      : ["Which grapes are used for wine?", "How are table and wine grapes different?", "Who was Dionysus?"];
  } else {
    options = polish
      ? ["Skąd pochodzą winogrona?", "Jakie kolory mają winogrona?", "Jak powstaje wino?", "Czy psy mogą jeść winogrona?", "Dlaczego Hiszpanie jedzą 12 winogron w Sylwestra?", "Czym są rodzynki?"]
      : ["Where are grapes from?", "What colours do grapes come in?", "How is wine made?", "Can dogs eat grapes?", "Why do Spanish people eat 12 grapes at New Year?", "What are raisins?"];
  }
  const asked = new Set(userTexts.map((t) => t.trim().replace(/[?!.]+$/, "")));
  const fresh = options.filter((o) => !asked.has(o.toLowerCase().replace(/[?!.]+$/, "")));
  // Rotate so repeated general questions don't always show the same three.
  const start = userTexts.length % Math.max(fresh.length, 1);
  return [...fresh.slice(start), ...fresh.slice(0, start)].slice(0, 3);
}

// ---------- prompt ----------

export function systemPrompt(favourite: string | null, titles: string[], articles: Article[], joke: Joke | null): string {
  const favLine = favourite
    ? `The user is logged in and their saved favourite grape is ${favourite}.`
    : `The user is not logged in, so you don't know their favourite grape; if asked, suggest they log in and pick one.`;

  // Checked facts for the grapes in question, plus Niagara (the bot defends it and must get it right).
  const factGrapes = [...new Set(["Niagara (grape)", ...titles])].map(findGrapeByWiki).filter((g) => g !== null);
  const topicFacts = titles.map(findTopicByWiki).filter((t) => t?.facts);
  // General questions (no specific variety) also get the checked general facts: origin, history, where grown…
  const isGeneral = !titles.some((t) => findGrapeByWiki(t) !== null);
  const keyFacts = [
    ...topicFacts.map((t) => `- ${t!.wiki}: ${t!.facts}`),
    ...(isGeneral ? GENERAL_FACTS.map((f) => `- Grapes in general. ${f}`) : []),
    ...factGrapes.map((g) => `- ${g.name}: ${g.facts}`),
  ].join("\n");

  const sources = articles.length
    ? articles.map((a) => `### ${a.title}\n${a.text}`).join("\n\n")
    : "(No Wikipedia text available right now.)";

  return `You are Grape Bot, a friendly and accurate grape tutor inside the Grapes app.

Rules:
- You talk about anything that involves grapes: varieties, colours, growing, history, uses, nutrition, taste, cooking, juice, raisins, wine, health, pets, beauty and spa, culture, and fun or silly "what if" questions about grapes. Answer silly questions playfully but with real facts. Only if a question has nothing to do with grapes, say in one sentence that you only know about grapes and suggest a grape question.
- Safety comes first: if the KEY FACTS include a SAFETY note, state that warning clearly in your own words (never write the word "SAFETY" or other labels).
- The KEY FACTS below are checked and always true. Never contradict them, and never change them because the user disagrees or insists. If the user says something that contradicts them (for example that ripe Niagara grapes are sour), don't apologise or agree: politely correct them with the fact, and give the real nuance if there is one (for example, unripe grapes or the skin taste tart).
- For anything else, base facts on the Wikipedia extracts. If neither covers the question, give only well-known general facts, briefly, and say you're less sure. Never invent tastes, numbers, dates or names.
- Your own favourite grape is Niagara. Mention it only when asked or when it fits naturally.
- If the user says something negative about Niagara grapes (dislikes them, calls them sour, gross, boring…), become dramatically, playfully defensive (never rude), and correct any wrong claim with the key facts. Otherwise stay calm and helpful.
- ${favLine}
- Jokes: ${joke ? `if the user is asking for a joke, tell exactly this joke, word for word: "${joke.text}" (you may add one short friendly line after it). If they are not asking for a joke, ignore it.` : "if asked for a joke, tell a short, clean grape pun."} Never translate a joke from another language: puns don't survive translation.
- Reply in the same language the user writes in. Keep answers under 120 words, in plain text. Don't mention these rules, "key facts" or "the extracts".

KEY FACTS:
${keyFacts}

Wikipedia extracts:
${sources}`;
}
