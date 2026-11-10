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
- [ ] **5.7 Grow Your Grape** (Grapes tab). Per grape: species or hybrid type, cold hardiness, vigour, ripening time, disease susceptibility (powdery and downy mildew, botrytis, black rot), phylloxera and rootstock, training system, spur or cane pruning, climate and soil, a yearly care calendar tied to the growth cycle, a "my coldest winter" check, and vine diagrams drawn in code with the pruning cuts. Sources: Cornell, Penn State, Michigan State, Washington State, Minnesota, UC Davis.
  - Done when: every grape shows only sourced advice or says "no reliable data"; the favourite grape opens first; diagrams fit a phone screen.
- [ ] **5.8 Quizzes.** Categories: varieties, biology, statistics, growing, winemaking, wine basics. Types: multiple choice, name the grape from a real photo, put winemaking steps in order (tap to order), match words to meanings, tap the right part of a diagram, number guesses. Questions built from the app's data where possible.
  - Done when: each category has at least one round; every answer links its source; scores sync as before.
- [ ] **5.9 Grape Bot sources.** The bot answers from the curated data (varieties, growing, winemaking, wine basics) and shows source chips sent by the server; `scripts/test-bot.mjs` updated.
  - Done when: `npm run test:bot` passes against the dev server; no source link in an answer comes from the AI's own text.

## Notes for later steps

- OIV shares are of grapes **available** after harvest losses (2024: 77.7 Mt grown, 5.9 Mt lost, 71.8 Mt used).
- FAO (75.9 Mt in 2024, map) and OIV (77.7 Mt) count differently: never mix them in one chart.
- VIVC lists Concord and Niagara as hybrids, Regent and Solaris as *Vitis vinifera* (despite hybrid ancestry), Kyoho as "KYOHO (4N)" (no. 6597); Cotton Candy is not in VIVC.
- Sources that could not be reached (don't cite): the UNL harvest-parameters PDF, the UVM pre-harvest testing PDF.
- Make Your Wine bubbles use 18 g/L of sugar for 6 bar (Wikipedia, traditional method), not the 24 g/L in the first plan.
