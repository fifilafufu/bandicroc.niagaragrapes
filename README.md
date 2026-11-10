# Grapes 🍇

A free, installable web app about grapes and wine, for newbies and pros. Learn where grapes grow, how they taste and live, how wine is made, play quizzes, make your own wine, and ask Grape Bot. Every fact names its source (OIV, VIVC, FAO, AWRI, EU rules, university extension services, Wikipedia).

**Live:** https://bandicroc-niagaragrapes.pages.dev · Runs on Android, iPhone and Windows, in the browser or installed.

## Features

**🍇 Grapes** (learn)
- **Overview:** what a grape is, history, traditions, nutrition, the five official skin colours (VIVC), "How grape varieties work" (species, crosses, hybrids, family trees, other names), and a gallery of 27 grapes with real, credited photos and filters (table, wine, hybrids).
- **Statistics:** FAO world map with the top 10 countries; OIV chart of what grapes are used for (2000 to 2025); top table-grape and raisin producers; exporters and importers (OIV 2024).
- **Taste:** why American grapes taste "foxy", why ripe grapes taste sweet, and an aroma finder.
- **Biology:** the four main species, inside a grape, the vine, and a growth-cycle wheel for both hemispheres with today marked.
- **Winemaking:** the steps for red, white, rosé and sparkling wine (tap a step), and a table comparing them.
- **Wine basics:** a diagram of acidity, sugar, alcohol, tannin, body and balance; a balance scale; a sugar-to-alcohol calculator with the EU label word.

**🎮 Games**
- **Quizzes:** three levels (Newbie, Intermediate, Pro); each answer links its source; best scores saved.
- **Make Your Wine:** pick one of 24 wine grapes and choose ripeness, skin contact, fermentation, malolactic fermentation, oak, bottle age and bubbles. See the wine's real colour in a glass drawn in code, bubbles, a tasting note, alcohol, sugar left and the label words. Save your wines.

**💬 Grape Bot:** an AI tutor that answers anything about grapes, in your language, from checked facts and Wikipedia, with source links.

**🧺 My Grapes:** your favourite grape, private notes, saved wines and grape links.

**Account and app:** log in with email to sync favourite, notes, chat, quiz scores and wines across devices (each user sees only their own data). Light, dark or system theme. Works offline for pages already opened. The installed app updates itself.

## Planned features

- **Grow Your Grape:** a care guide per grape (cold hardiness, diseases, pruning, yearly calendar) with vine diagrams.
- **More quizzes:** new topics and question types (name the grape from a photo, put steps in order, match words, tap a diagram).
- **Grape Bot sources:** answers from all the app's data, with source links for every answer.

## Screens

| Tab | Pages |
|---|---|
| 🍇 Grapes | Overview, Statistics, Taste, Biology, Winemaking, Wine basics |
| 🎮 Games | Quizzes, Make Your Wine |
| 💬 Grape Bot | Chat |
| 🧺 My Grapes | Favourite, notes, your wines |

Settings (account, theme, install help, share) is in the account menu, top right. On phones the tabs are at the bottom; on wide screens at the top.

## Keyboard shortcuts

| Key | Where | Does |
|---|---|---|
| Enter | Grape Bot message box | Send |
| Shift + Enter | Grape Bot message box | New line |
| Esc | Account menu, install sheet | Close |
| Enter or Space | Wine basics diagram (focused part) | Open that part |

## Install the app

| Device | How |
|---|---|
| Android | Open the site in Chrome → menu ⋮ → **Install app** |
| iPhone | Open in Safari → **Share** → **Add to Home Screen** |
| Windows | Open in Edge or Chrome → install icon in the address bar |

Settings → **Get the app** shows the steps for your exact browser.

## Stored data

| Where | What |
|---|---|
| Supabase (per user, row-level security) | favourite grape, notes (up to 1000 characters), Grape Bot chat (last 40 messages), quiz scores (newest 200), saved wines (newest 50) |
| This device | theme, dismissed tips, quiz questions seen, jokes heard; a guest's quiz scores and wines (moved to the account at login) |
| The repo | sources, grape data, VIVC passports, photo credits, statistics, the wine model |

## Requirements

All free, no credit card:
- **Node.js 24** (runs the build and the TypeScript test script)
- **Cloudflare** account (hosting on Pages, Workers AI for Grape Bot)
- **Supabase** project (login and database)
- Optional: **OpenRouter** key as a backup AI

## Setup

### 1. Supabase (login + database)
1. Create a project at supabase.com.
2. **SQL Editor → New query:** paste and **Run** each file in `supabase/`: `schema.sql`, `secret_messages.sql`, `chat_history.sql`, `quiz_results.sql`, `saved_wines.sql`. Each is safe to run again.
3. **Authentication → Sign In / Providers → Email:** turn **off** "Confirm email" for instant sign-ups.
4. **Project Settings → API:** copy the **Project URL** and the **anon public** key into `src/lib/supabase.ts` (or `.env`, see `.env.example`).

### 2. Cloudflare Pages (hosting + AI)
1. **Workers & Pages → Create → Pages → Connect to Git** → pick this repo.
2. Build command: `npm run build` · Output directory: `dist`.
3. The Workers AI binding comes from `wrangler.toml`, so no AI key is needed.
4. In Supabase → **Authentication → URL Configuration**, set **Site URL** to your `https://<name>.pages.dev` address.

Every push to `main` redeploys the live site.

### Backup AI: OpenRouter
If the Workers AI free allowance runs out: add the secret `OPENROUTER_API_KEY` in Cloudflare Pages → Settings → Variables, set `AI_PROVIDER = "openrouter"` in `wrangler.toml`, and push.

## Run locally

```bash
npm install
```

```bash
npx wrangler login
```

Terminal 1, Grape Bot function on port 8788:

```bash
npm run dev:api
```

Terminal 2, the app at http://localhost:5173:

```bash
npm run dev
```

## Scripts

| Command | Does |
|---|---|
| `npm run build` | Type-check and build to `dist/` |
| `npm run lint` | Lint with oxlint |
| `npm run test:wine` | Check the wine model and Make Your Wine against their sources (54 checks) |
| `npm run test:bot` | Ask Grape Bot a fixed set of tricky questions (needs `npm run dev:api`) |
| `node scripts/build-varieties.mjs` | Re-fetch VIVC passports and Commons photo credits into `shared/varietyData.json` |
| `node scripts/build-map.mjs` | Re-fetch FAO production per country into `src/data/worldMap.json` |

## Project files

| Path | What |
|---|---|
| `src/` | the React app (pages, charts, diagrams, account) |
| `shared/` | data and logic shared by the app and Grape Bot: sources, grapes, statistics, wine model |
| `functions/api/chat.ts` | Grape Bot (Cloudflare Pages Function) |
| `supabase/` | table SQL with row-level security |
| `scripts/` | data build scripts and tests |
| `SPEC.md`, `PLAN.md`, `CLAUDE.md` | what the app is, the build plan, rules for the AI assistant |
