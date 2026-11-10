# PLAN.md: Grapes

Build steps in order. Tick a step (`- [x]`) only when its "Done when" checks pass. What the app is and what we never do: `SPEC.md`. Earlier phases (1 to 4: the first Niagara Grapes demo, Grape Bot, login, PWA, tester fixes) are in the git history.

## Phase 5: the big update (approved 2026-11-10)

- [x] **5.1 Real numbers and sources.** OIV 2024 uses (47% pressed, 46% table, 7% dried) replace the old "71% wine"; uses chart 2000 to 2025; source list (`shared/sources.ts`) and source links; OIV colour classes; app renamed "Grapes".
  - Done when: no "71%" or "72.5 Mt" left in app, bot or quiz; every figure on the home page has a source link; `npm run build` passes.
- [x] **5.2 Navigation.** Hash routing (back button works), four tabs, Quizzes moved out of the chat, `quiz_results` table with sync.
  - Done when: back button returns to the previous page; a finished quiz shows its best score; scores sync after `supabase/quiz_results.sql` is run.
- [x] **5.3 Variety data.** 27 grapes with VIVC passports and credited Commons photos (`scripts/build-varieties.mjs` → `shared/varietyData.json`), "How grape varieties work" explainer, gallery with filters.
  - Done when: every photo shows author and licence; every grape with a VIVC entry links to it; no AI-generated photo (checked by eye and by Commons category).
- [x] **5.4 Learn pages.** Statistics (FAO map, OIV uses, producers, trade), Taste (foxy vs vinifera, aroma finder), Biology (species, berry, growth-cycle wheel).
  - Done when: all three pages open from the Grapes tab button row; every chart names its source and year.
- [x] **5.5 Winemaking and Wine basics.** Steps per style with a comparison table; structure diagram, balance scale, sugar-to-alcohol calculator; shared model `shared/wine.ts`.
  - Done when: `npm run test:wine` passes; step wording matches the OIV code or the cited article.
- [x] **5.6 Make Your Wine** (Games tab). 24 wine grapes, all approved inputs, glass with realistic colour and rim, bubbles, tasting note, label words; saved wines (`supabase/saved_wines.sql`) and a card in My Grapes.
  - Done when: `npm run test:wine` passes (54 checks, including the approved colour cases); a saved wine reopens with the same settings.
- [x] **5.6a UI fixes.** Grape Bot no longer scrolls by itself; no empty space on phones in the browser; pinned button row; title bar hides on scroll down; Games tab holds Quizzes and Make Your Wine; installed app updates itself.
  - Done when: checked on a phone-size screen; the user confirms the empty-space fix on a real phone.
- [x] **5.7 Grow Your Grape** (Grapes tab). Per grape: species or hybrid type, cold hardiness, vigour, ripening time, disease susceptibility (powdery and downy mildew, botrytis, black rot), phylloxera and rootstock, training system, spur or cane pruning, climate and soil, a yearly care calendar tied to the growth cycle, a "my coldest winter" check, and vine diagrams drawn in code with the pruning cuts. Sources used: OIV Focus 2017 (11 grapes), each grape's Wikipedia article, University of Minnesota Extension (general care, calendar, Marquette). Disease resistance: VIVC resistance scores (OIV 1 to 9 scale, median of all studies) for 21 grapes, fetched by `scripts/build-varieties.mjs`. Cornell, Michigan State and Iowa State hardiness tables could not be reached, so most grapes have no winter temperature, only a description.
  - Done when: every grape shows only sourced advice or says "no reliable data"; the favourite grape opens first; diagrams fit a phone screen.
- [x] **5.8 Code cleanup** (no visible changes). Follow the code structure rules in `CLAUDE.md`:
  - one data layer: all Supabase and `/api` calls move from components into `src/lib/`;
  - content out of components: grape gallery info, home sections and facts, colour classes, species, explainer lists, game grape groups move into `shared/` data files;
  - one "save on device, sync to account" helper replaces the copies in quiz scores and saved wines;
  - `index.css` split into `src/styles/` by feature;
  - `Chat.tsx` split (screen vs. streaming client) and `App.tsx` slimmed (layout vs. login merge vs. scroll);
  - unused files and exports removed.
  - Done when: no file in `src/components/` imports `supabase` or calls `fetch`; no component holds content lists; no file over about 250 lines except data files; `npm run build`, `npm run lint` and `npm run test:wine` pass; every page looks and works the same at phone and desktop size.
- [x] **5.9 Quizzes.** Categories: varieties, biology, statistics, growing, winemaking, wine basics. Types: multiple choice, name the grape from a real photo, put winemaking steps in order (tap to order), match words to meanings, tap the right part of a diagram, number guesses. Questions built from the app's data where possible.
  - Done when: each category has at least one round; every answer links its source; scores sync as before.
  - Built: six categories with a Newbie / Pro switch (your level's questions come first), all six question types, 227 questions (about 140 built from `varietyData.json`, `grow.ts`, `winemaking.ts`, `wineBasics.ts`, `growthCycle.ts`, `species.ts`, `grapeUses.ts` and `wine.ts`). Scores are saved per category (`cat:varieties` …); old per-level scores stay in the table but are no longer shown. Score sync confirmed by the user on 2026-11-10.
- [x] **5.10 Grape Bot sources.** The bot answers from the curated data (varieties, growing, winemaking, wine basics) and shows source chips sent by the server; `scripts/test-bot.mjs` updated.
  - Done when: `npm run test:bot` passes against the dev server; no source link in an answer comes from the AI's own text.
  - Built: `server/grapeBot/knowledge.ts` picks VIVC passports and resistance scores, Grow Your Grape traits, the general Minnesota Extension care, winemaking steps and wine-basics parts that fit the question; the server builds every source chip from `shared/sources.ts`, VIVC or Wikipedia. Variety helpers moved to `shared/varieties.ts`. The test was run against the live site instead (local Workers AI needs a Cloudflare login): 32/32 passed on 2026-11-10, with no links in answer text and only known source links.

## Phase 6: Polish language (approved 2026-11-10)

Rules for every step: numbers, units and sources stay exactly as in English; grape, species and source names are not translated; wine and vine terms follow Polish Wikipedia, otherwise they stay in English. No em dashes in Polish text either.

- [ ] **6.1 Language switch.** A small, free text helper (no paid service), `shared/i18n/` with `en` and `pl` word lists, a `useLang` hook in `src/lib/`, and an EN / PL switch next to the Log in button, kept in device storage. Default: the phone's language if it is Polish, otherwise English.
  - Done when: the switch changes the tab bar, title bar, Settings and login sheet; the choice survives a reload; a missing Polish string falls back to English instead of showing a key.
- [ ] **6.2 Overview and Learn pages.** Home (facts, numbers, sections), Statistics, Taste, Biology.
  - Done when: these pages read fully in Polish; every number and source link matches the English page.
- [ ] **6.3 Varieties and Grow Your Grape.** Gallery, explainer, variety passports, care guides.
  - Done when: all 27 grapes show Polish text; names, VIVC links and photo credits are unchanged.
- [ ] **6.4 Winemaking, Wine basics and Make Your Wine.**
  - Done when: steps, diagrams, tasting notes and label words are in Polish; `npm run test:wine` passes.
- [ ] **6.5 Quizzes.** All 227 questions, answers, explanations and the scoreboard jokes.
  - Done when: every question has a Polish version with the same right answer and source; scores are shared between languages.
- [ ] **6.6 Grape Bot and final check.** Bot greeting, suggestions and error messages in Polish; the bot is told the chosen language.
  - Done when: a Polish speaker (the user or a tester) reads every page at phone size and finds no English left except names and sources.

## Notes for later steps

- OIV shares are of grapes **available** after harvest losses (2024: 77.7 Mt grown, 5.9 Mt lost, 71.8 Mt used).
- FAO (75.9 Mt in 2024, map) and OIV (77.7 Mt) count differently: never mix them in one chart.
- VIVC lists Concord and Niagara as hybrids, Regent and Solaris as *Vitis vinifera* (despite hybrid ancestry), Kyoho as "KYOHO (4N)" (no. 6597); Cotton Candy is not in VIVC.
- Sources that could not be reached (don't cite): the UNL harvest-parameters PDF, the UVM pre-harvest testing PDF.
- Make Your Wine bubbles use 18 g/L of sugar for 6 bar (Wikipedia, traditional method), not the 24 g/L in the first plan.
