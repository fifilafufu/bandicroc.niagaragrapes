# Niagara Grapes app: plan

**Deadline:** tomorrow (2026-11-10)
**Repo:** https://github.com/fifilafufu/bandicroc.niagragrapes
**Local folder:** `Desktop\.dev\bandicroc.grapes`
**Total cost:** $0, with no credit card anywhere
**Accounts used:** Cloudflare (you have it), Supabase (new, free), with OpenRouter (you have it) as the backup

## Purpose

This is a demo project that shows three things:

1. **An AI chatbot** added to a site.
2. **Multi-device:** it runs on Android, iPhone and Windows, in the browser and as an installed app.
3. **Login + row-level security:** a user's favourite grape is saved to their account, syncs to every device they sign in on, and no user can read anyone else's.

It also has a short Niagara grape page.

## Grape Bot: a real AI, free

**Main: Cloudflare Workers AI** (free daily allowance on the free plan).
- The site is hosted on Cloudflare too, so the chat function talks to the AI through a built-in **binding**. **There's no API key to create, copy or leak.**
- It uses a small, fast instruct model (e.g. a Llama 3.x 8B-class model), which is low effort and quick.
- **Limit:** a free daily allowance of compute ("neurons"). Short grape chats use very little, so it's plenty for a demo. If it's used up, Grape Bot says it's tired and to come back later. It never bills you on the free plan.

**Backup: OpenRouter free models** (models whose names end in `:free`).
- Uses your existing OpenRouter account. It needs an API key, stored only as a server secret.
- Rate-limited per day. Some free models' providers may log prompts, which is fine for a grape demo.
- Switching is one setting: `AI_PROVIDER=openrouter`.

**How it's wired:** app → our server function `/api/chat` (Cloudflare Pages Function) → Workers AI (or OpenRouter). The personality prompt and any keys stay on the server.

**Personality (system prompt):**
- Grape Bot loves Niagara grapes above everything.
- Asked its favourite grape → "I like Niagara grapes."
- Most questions get answered with grapes: it steers everything back to grapes.
- If the user says they don't like Niagara grapes → it gets **defensive** (dramatic, offended, but never rude or mean).
- If the user is logged in, the app tells the bot their saved favourite. So "what's my favourite grape?" gets "Yours is Concord… but I like Niagara grapes."
- Short replies (1–3 sentences), playful.

## How it works on each platform (all free)

We build one web app and make it a **PWA** (installable web app). There's one codebase for every platform.

| Platform | In the browser | As an installed app |
|---|---|---|
| Android | Chrome | Chrome menu → "Install app" |
| iPhone | Safari | Share → "Add to Home Screen" |
| Windows | Edge / Chrome | Address bar → "Install" |

App stores: **Apple** ($99/yr) and **Google Play** ($25) are **out**. The **Microsoft Store** is free for individual developers (confirm when signing up). It's optional, after the deadline.

## Tech stack (all free tiers)

| Piece | Choice |
|---|---|
| App | Vite + React + TypeScript, mobile-first |
| Installable app | `vite-plugin-pwa` (manifest, icons, offline shell) |
| Hosting | **Cloudflare Pages**, linked to the GitHub repo (auto-deploys on push, HTTPS, free `*.pages.dev` address) |
| Grape Bot | Cloudflare Pages Function + **Workers AI** binding (backup: OpenRouter `:free` model) |
| Login + sync | **Supabase**: email magic-link login + a `favourites` table with **row-level security** |
| Live sync | Supabase Realtime: change your favourite on your phone and the PC updates on its own |

Why Supabase and not Cloudflare for login: row-level security is a built-in Postgres feature, and Supabase gives us that plus ready-made login. Cloudflare's database (D1) has no row-level security.

## Row-level security

The `favourites` table holds one row per user (`user_id`, `grape`, `updated_at`). The database enforces these policies, not the app:

- A user can **select** only the row where `user_id = auth.uid()`.
- A user can **insert/update** only their own row.
- Not logged in: no access at all.

The demo proves it by signing in as two different users. Each one sees only their own favourite.

## Build order

1. **Setup:** project skeleton, push to GitHub, first deploy on Cloudflare Pages.
2. **Grape Bot:** the chat screen plus the `/api/chat` function (Workers AI + personality, OpenRouter switch).
3. **Login + favourite grape:** Supabase sign-in, a favourite picker, the RLS table, live sync. The saved favourite is passed to Grape Bot.
4. **PWA:** icons, manifest, install instructions, testing on Android, iPhone and Windows.
5. **Niagara page:** a short hero, a few facts, and a "Chat with Grape Bot" button.

## What you need to do

| # | What | Where | Notes |
|---|---|---|---|
| 1 | Connect the GitHub repo to Cloudflare Pages | Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git | I'll give exact build settings, and add the Workers AI binding (one click). |
| 2 | Create a Supabase project | supabase.com (free) | Send me the project URL and the "anon" key (it's safe to put in the app). I'll give you the SQL to paste in. |
| 3 | (Backup only) OpenRouter API key | openrouter.ai → Keys | Only if we switch. It goes into Cloudflare's secrets, never into chat or code. |

Groq, Gemini and Vercel are no longer needed. Free-tier terms can change, so if anything asks for a card, stop and tell me.
