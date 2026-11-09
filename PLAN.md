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

App stores: **none**. Apple ($99/yr) and Google Play ($25) are out, and the Microsoft Store was dropped (2026-11-09). Everyone installs from the browser.

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

---

## Phase 3: grapes in general, My Grapes, Settings, "ready for the world" (proposed 2026-11-09)

### New structure (4 tabs)

| Tab | What's in it |
|---|---|
| **🍇 Grapes** (home) | About grapes in general, not just Niagara: what a grape is, **history** (one of the oldest cultivated fruits), **where they're grown**, **what they're used for** (fresh, raisins, juice, jelly, wine, vinegar, grape-seed oil), **meaning & traditions** (abundance and harvest symbols, Dionysus/Bacchus, wine in religious rites, Spain's "12 grapes" at New Year), **table vs wine grapes**. Niagara keeps a small "Grape Bot's favourite" spotlight card. Every section has a 📖 Wikipedia link, and all facts are checked against Wikipedia while building. |
| **💬 Grape Bot** | Unchanged. |
| **🧺 My Grapes** | Your favourite grape (folded row) + its Wikipedia card, the big 🤫 secret message, and 📖 Learn about each grape. When logged out: a short "Log in to save your favourite and your secret message" card with the login form, not a bare form. |
| **⚙️ Settings** | The "ugly stuff": account (email, change password, log out), 📲 Get app / install help, theme (System / Light / Dark), a "What we store" privacy note, and the app version. |

The **📲 Get app** button leaves the top bar (less cramped on phones) and lives in Settings, plus the one-time tip on phones.

### Quality of life, checked against "works for me" vs "ready for the world"

**1. Opens from a public link**
- **Link previews:** title, description and grape image show up when the link is pasted into Messenger, WhatsApp or Discord (Open Graph tags).
- **Share app button** in Settings: uses the phone's share sheet, or copies the link on a computer.
- **QR code** in Settings so a tester can point their phone at your screen.

**2. Works in private mode and on someone else's phone**
- Everything except saving works **without logging in** (home page, Grape Bot, learning).
- Private mode: login lasts until the private window closes. Nothing breaks when the browser blocks storage; this is already handled.
- **Someone else's phone:** a clear **Log out on this device** button in Settings, and logging out also clears the chat on that device.
- **Offline banner:** "You're offline. Grape Bot needs internet" instead of a vague error.

**3. Handles an empty field and long text**
- **Friendly errors** instead of raw Supabase messages, e.g. "Invalid login credentials" becomes "Wrong email or password."
- **Clear field checks:** empty email, too-short password, and an email that's already registered each get their own plain message.
- **Character counters:** chat (500) and secret message (1000) show "432 / 1000" near the limit.
- **Long text never breaks the layout:** long words, emails and grape names wrap or shorten with "…". This will be tested with a 1,000-character message.
- **No double-saves:** buttons are disabled while saving, with clear "Saving…" then "Saved ✓".

**4. A stranger knows what to click, without instructions**
- **Welcome card** on first visit: 3 lines ("Learn about grapes · Ask Grape Bot · Save your favourite"), dismissible.
- **Clear tab names with icons** (Grapes · Grape Bot · My Grapes · Settings).
- **Empty states that say what to do**, e.g. "No favourite yet: tap to pick one."
- **Enter sends** a chat message, and the suggestion chips stay as examples.
- **Tap targets at least 44px** (Apple/Google guidance) and readable contrast in light and dark mode.

### Optional (say if you want it)
- **Polish UI:** an English / Polski switch for all app text. Grape Bot already answers in Polish when you write in Polish.

### Testing before calling it "ready for the world"
I'll go through a checklist on the live link: private window, logged out, empty submits, a 1,000-character secret, the "stranger" route through the tabs, and phone size. Testing on a real iPhone and Android still needs your testers.

---

## Phase 4: fixes from first tester feedback (proposed 2026-11-09)

### What testers said (2 people, first use, app in English)
- 👍 Easy to tap, easy to navigate, clear graphics, they liked the icons. "There's no app like this."
- 👍 Learned something: grapes come from (Western) Asia, and there are more kinds than "white, black and cotton candy".
- 👎 Grape Bot couldn't answer **"where are grapes from"**. ✅ *Fixed and live*: general questions now use checked facts (origin, history, where grown).
- 👎 Grape Bot couldn't answer **"can I take a bath in grape juice"**. Wanted more advanced chat.

### Re-test on the live bot (after the "where from" fix)
| Question | Result |
|---|---|
| can i take a bath in grape juice | Vague; doesn't really answer, misses that grape spa treatments (vinotherapy) exist |
| can dogs eat grapes | ❌ Refused ("I only know about grapes, not animals"). **Grapes are toxic to dogs**, so this must be answered |
| what colours do grapes come in | ✅ Good answer |

### Proposed fixes

**A. Grape Bot answers more (priority)**
1. **Wider "on-topic":** anything that involves grapes counts: pets, cooking, gardening, health, beauty/spa, silly "what if" questions. Silly ones get a playful but factual answer (e.g. bath: grape spa treatments exist, but a juice bath is sticky, sugary and stains). Truly unrelated questions are still politely declined.
2. **Safety facts:** grapes and raisins are toxic to dogs (Wikipedia "Grape toxicity in dogs"), always given to the bot when pets come up.
3. **More topic articles:** Vinotherapy, Grape toxicity in dogs, grape colours/types, grape-seed oil, vinegar.
4. **Tester question list:** a fixed set of ~20 tricky questions (the testers' ones plus likely ones in English and Polish), re-run after every Grape Bot change so old problems don't come back.

**B. Content testers enjoyed learning**
5. **"Types & colours" section on the home page:** green/white, red/pink, black/purple; table vs wine; seedless. Plus a small **grape gallery** of the 12 grapes with Wikipedia photos and colour tags.
6. **"Did you know?" card** on the home page with a rotating checked fact (e.g. "Grapes first come from Western Asia").

**C. Advanced chat features (pick any; all free)**
7. Follow-up question chips after each answer · grape photos in answers · copy/share an answer · 🎤 voice input.
8. Bigger: replies that appear word by word · chat history synced across devices · grape quiz mode.

**D. Language**
9. Testers were Polish using the English app. The Polish UI switch (postponed earlier) is worth reconsidering. Grape Bot already answers in Polish.
