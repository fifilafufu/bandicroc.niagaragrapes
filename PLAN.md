# Niagara Grapes app: plan

**Deadline:** tomorrow (2026-11-10)
**Repo:** https://github.com/fifilafufu/bandicroc.niagaragrapes
**Local folder:** `Desktop\.dev\bandicroc.niagaragrapes`
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

---

## Phase 2: educational Grape Bot (proposed 2026-11-09)

### New behaviour
- **Only grapes.** It answers real questions about grapes: varieties, growing, history, uses, nutrition, wine/juice/jelly. Off-topic questions get a polite one-line "I only know about grapes" and a grape suggestion. No more answering everything with "Grapes."
- **Facts come from live Wikipedia.** Each answer is based on the Wikipedia article(s) for the grape(s) the question is about. The answer ends with source links, e.g. "📖 Wikipedia: Concord grape".
- **Defensive only when the user says they dislike or hate Niagara grapes.** Otherwise it's a friendly, accurate tutor. It still mentions its love of Niagara grapes when asked its favourite.
- **Favourite-grape cards.** On the account page, each of the 12 grapes links to its Wikipedia article. The chosen favourite shows a short Wikipedia summary with a photo.

### Wikipedia articles (all checked, all exist)
Niagara (grape), Concord grape, Catawba (grape), Delaware (grape), Cotton Candy grapes, Sultana (grape) (= Thompson Seedless), Red Globe, Muscat (grape), Chardonnay, Riesling, Pinot noir, Cabernet Sauvignon. "Grape" is used for general questions.

### Keeping usage low (free daily allowance)
| Choice | Why it saves usage |
|---|---|
| Send only the **intro section** of 1–2 matching articles (capped at ~1,500 characters each), not whole articles | The bot reads ~300–800 words instead of thousands |
| Pick articles by simple name matching in our code (e.g. "concord" → Concord grape), not by asking the AI | No extra AI call per message |
| **Cache** each Wikipedia intro for 24 h on Cloudflare | Wikipedia is fetched once a day per grape, not on every message |
| Send only the **last 6 messages** of the chat | Long chats don't grow the cost |
| Cap answers at ~250 tokens (a short paragraph) | Output is the expensive part |
| Favourite cards load Wikipedia **directly in the browser** | Uses no AI allowance at all |

**Model:** move from the small Llama 3.1 8B (the "kinda stupid" one) to a mid-size model (Llama 4 Scout 17B on Workers AI). It's much smarter and still cheap. Rough estimate: **~250–350 chats per day** on the free allowance. The existing fallback list (70B, then 8B) stays as a backup, and OpenRouter remains the last resort.

### iPhone
Already supported and free. Testers open the site in **Safari** → **Share** → **Add to Home Screen**. Notes for iPhone testers:
- There's no "Install" button on iPhone (Apple doesn't allow one). The app shows these steps instead.
- The installed app has its own storage, separate from Safari, so testers log in once inside the installed app.
- Newer iOS versions also let Chrome and Edge add to the home screen, but Safari is the reliable route.

### Easier installing ("Get the app")
Today the install hint is a small card at the bottom of the home page, and it only knows three cases. Instead:

- **A "Get app" button that's always visible** in the top bar (hidden once installed). Tapping it opens an install sheet.
- **The sheet detects the device and browser**, then shows only the steps for that exact browser, with a picture-style hint of which button to tap (e.g. an arrow pointing to Safari's Share button at the bottom of the screen).
- **One-tap install where the browser allows it** (Chrome, Edge, Samsung Internet, Brave on Android; Chrome and Edge on Windows). The sheet shows a big **Install** button.
- **Honest answers where a browser can't install apps**, e.g. DuckDuckGo, Firefox on Windows, or the browsers built into Instagram and TikTok. The sheet says so plainly and gives **Copy link** plus "Open in Safari/Chrome" instructions, so the tester isn't stuck guessing.
- **A small one-time tip on phones** ("Add Niagara Grapes to your home screen") that can be dismissed and doesn't come back.
- **After installing**, the button disappears and the app opens full screen.

| Browser | What the sheet shows |
|---|---|
| iPhone Safari | Share ⬆️ (bottom bar) → Add to Home Screen → Add |
| iPhone Chrome / Edge / Brave | Share ⬆️ (address bar) → Add to Home Screen. If it's missing: Copy link → open in Safari |
| iPhone DuckDuckGo / Firefox / in-app browsers | "This browser can't add apps" → Copy link → open in Safari |
| Android Chrome / Edge / Samsung / Brave | **Install** button (one tap). If the browser hides it: menu ⋮ → Install app / Add to Home screen |
| Android Firefox | menu ⋮ → Install |
| Android DuckDuckGo | "Can't install apps" → Copy link → open in Chrome |
| Windows Edge / Chrome / Brave | **Install** button (one tap) |
| Windows Firefox | "Can't install apps" → open in Edge or Chrome |

I can test the sheet by imitating each browser in my browser pane. The real install on each phone still needs a tester to try it.
