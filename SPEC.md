# SPEC.md: Grapes

## What the app is

**Grapes** is a free, installable web app about grapes and wine: where grapes grow, how they taste, how vines live, how wine is made, and a game for making your own wine. Every fact shown names its source.

- **Live:** https://bandicroc-niagaragrapes.pages.dev
- **Repo:** https://github.com/fifilafufu/bandicroc.niagaragrapes
- **Runs on:** Android, iPhone and Windows, in the browser or installed as an app (PWA). No app stores.

## Who it's for

| Who | What they get |
|---|---|
| **Newbies** (curious about grapes, never studied wine) | Plain-language explanations, diagrams, a "How grape varieties work" guide, easy quizzes, and Grape Bot to ask anything about grapes. |
| **Pros** (wine lovers, home growers, students) | Official data (OIV, VIVC, FAO), variety passports, the winemaking steps per OIV definitions, a simulator that follows real chemistry, harder quizzes, and sources for everything. |

## Screens

The bottom bar (top bar on wide screens) has **four tabs, never more**. New pages go inside a tab.

| Tab | Pages | Address |
|---|---|---|
| 🍇 **Grapes** | Overview · Statistics · Taste · Biology · Winemaking · Wine basics (Grow Your Grape is next) | `#/`, `#/learn/statistics`, `#/learn/taste`, `#/learn/biology`, `#/learn/winemaking`, `#/learn/wine-basics` |
| 🎮 **Games** | Quizzes · Make Your Wine | `#/games/quizzes`, `#/games/make-wine` |
| 💬 **Grape Bot** | AI chat about grapes (answers in the user's language) | `#/chat` |
| 🧺 **My Grapes** | Favourite grape, private notes, link to saved wines, grape links | `#/my-grapes` |

Also: **Settings** (account menu, top right: account, theme, install help, share, version) at `#/settings`; a **login sheet**; an **install sheet**.

Layout rules: the Grapes/Games button row stays pinned while scrolling; the title bar slides away while scrolling down. The phone's back button goes to the previous page (hash routing).

## Stored data

**In Supabase** (per user, row-level security: each user sees only their own rows; logged-out visitors get nothing):

| Table | What | Limit |
|---|---|---|
| `favourites` | favourite grape (by name) | 1 per user |
| `secret_messages` | private notes | 1000 characters |
| `chat_history` | Grape Bot chat | last 40 messages |
| `quiz_results` | quiz scores (level, score, total, time) | newest 200 |
| `saved_wines` | Make Your Wine settings + result + model version | newest 50 |

SQL for each table is in `supabase/*.sql` (run in the Supabase SQL Editor; safe to run again).

**On the device only** (localStorage): theme, dismissed tips, quiz questions already seen, jokes heard, and a guest's quiz scores and saved wines (moved to the account at login).

**In the repo** (curated, versioned, works offline):

| File | What |
|---|---|
| `shared/sources.ts` | every source: publisher, title, year, link, date checked |
| `shared/grapes.ts` | 27 grapes: names, keywords, checked facts (Grape Bot uses these) |
| `shared/varietyData.json` | VIVC passport data + credited Commons photo per grape (built by `scripts/build-varieties.mjs`) |
| `shared/grapeUses.ts` | OIV uses and production figures |
| `shared/aromas.ts`, `shared/growthCycle.ts`, `shared/winemaking.ts`, `shared/wineBasics.ts` | page content with sources |
| `shared/wine.ts`, `shared/wineSim.ts`, `shared/simGrapes.ts` | the wine model and simulator data |
| `src/data/worldMap.json` | FAO production per country (built by `scripts/build-map.mjs`) |

Live from the internet: Wikipedia summaries (Grape Bot and grape cards). Grape Bot runs on Cloudflare Workers AI, with OpenRouter free models as backup.

## Data standard

- Facts trace to a source: OIV, VIVC, FAO, AWRI, the EU, university extension services, then Wikipedia.
- Grape traits use OIV descriptors (skin colour: blanc, rose, gris, rouge, noir, as in VIVC).
- Wine numbers use OIV units: acidity in g/L as tartaric acid, sugar in g/L, alcohol in % vol, pressure in bar.
- Each value records its source and the date it was checked. Missing data stays empty or is marked **Estimate**; nothing is guessed silently.
- Photos are real (Wikimedia Commons) with author and licence shown, or diagrams drawn in code.

## Definition of done (MVP)

The MVP is done when all of these are true on the live site:

1. All four tabs and every page listed under Screens open on an Android phone, an iPhone and a Windows PC, in the browser and installed, with nothing wider than the screen.
2. Every number and fact on screen links to its source.
3. Make Your Wine follows the rules in `shared/wineSim.ts`, and `npm run test:wine` passes.
4. Grow Your Grape gives advice for each grape based on sources, or says plainly that data is missing.
5. Quizzes cover varieties, biology, statistics, growing, winemaking and wine basics, and scores sync to the account.
6. Grape Bot answers grape questions and shows source links that come from the app, not from the AI.
7. Logged-in data (favourite, notes, chat, scores, wines) syncs between devices, and no user can see another user's data.
8. The installed app updates itself when a new version is published.

## What we don't do

- **No paid services or APIs.** Free tiers only. If anything asks for a card, stop.
- **No AI-generated images**, anywhere. Real photos with credit, or diagrams drawn in code.
- **No unsourced facts.** If there's no source, say so or leave it out.
- **No em dashes** (—) in UI text or code comments.
- **No more than four tabs.** New pages go inside a tab.
- **No app stores** (Apple, Google Play, Microsoft Store). Installing is from the browser.
- **No scraping at scale or live fetching** of OIV, VIVC, FAO or extension sites from the app. Their data is curated into the repo by scripts or by hand.
- **No personal data beyond what the features need** (email for login, plus the tables above). No tracking or ads.
- **No docs in any language but English.** README.md, SPEC.md, PLAN.md and CLAUDE.md are English only. (The app's UI is English; Grape Bot replies in the user's language.)
