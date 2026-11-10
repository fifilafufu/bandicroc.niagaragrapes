# Grapes 🍇

A small installable web app (PWA) about grapes in general. It runs on Android, iPhone and Windows, in the browser or installed. It has:

- **Grape Bot:** an AI chatbot (Cloudflare Workers AI, free tier) that loves Niagara grapes.
- **Login + favourite grape:** Supabase auth with a `favourites` table protected by **row-level security**. Your favourite syncs live to every device you're logged in on.

The plan and the reasons behind each choice are in [PLAN.md](PLAN.md).

## Project layout

| Path | What it is |
|---|---|
| `src/` | The React app (home page, chat, account) |
| `functions/api/chat.ts` | Grape Bot server function (Cloudflare Pages Function). Holds the personality prompt |
| `wrangler.toml` | Cloudflare config: Workers AI binding, model, AI provider switch |
| `supabase/schema.sql` | Table + row-level security policies + realtime |

## Setup (one time, all free)

### 1. Supabase (login + database)
1. Create a project at supabase.com.
2. **SQL Editor → New query**: paste `supabase/schema.sql` and press **Run**.
3. **Authentication → Sign In / Providers → Email**: turn **off** "Confirm email". This makes demo sign-ups instant. The free tier only sends a few emails per hour.
4. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

### 2. Cloudflare Pages (hosting + AI)
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick `bandicroc.niagaragrapes`.
2. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
3. No environment variables are needed. The public Supabase URL and key are in `src/lib/supabase.ts`, and `wrangler.toml` makes the dashboard's variables read-only anyway. Secrets, such as `OPENROUTER_API_KEY`, can still be added.
4. Deploy. The Workers AI binding comes from `wrangler.toml` automatically, so there's no AI key to set.
5. Back in Supabase → **Authentication → URL Configuration**: set **Site URL** to your `https://<name>.pages.dev` address.

Every push to `main` redeploys.

### Backup AI: OpenRouter
If the Workers AI free allowance runs out:
1. Create a key at openrouter.ai.
2. In Cloudflare Pages → Settings → Variables, add the **secret** `OPENROUTER_API_KEY`.
3. Set `AI_PROVIDER = "openrouter"` in `wrangler.toml` and push.

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the Supabase values. Then log in to Cloudflare once (local Grape Bot uses your account's Workers AI):

```bash
npx wrangler login
```

Terminal 1 (Grape Bot function on port 8788):

```bash
npm run dev:api
```

Terminal 2 (the app at http://localhost:5173):

```bash
npm run dev
```

## Installing the app

| Device | How |
|---|---|
| Android | Open the site in Chrome → menu ⋮ → **Install app** |
| iPhone | Open in Safari → **Share** → **Add to Home Screen** |
| Windows | Open in Edge/Chrome → install icon in the address bar |

## Demo: row-level security
1. Create two accounts (A on your phone, B on your PC).
2. Pick different favourites.
3. Each account only ever sees its own favourite, because the database refuses the other user's row.
4. Log in as A on a second device and change the favourite. The first device updates live.
