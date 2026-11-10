# CLAUDE.md

At the start of every session, read these two files before doing anything else:
- `SPEC.md`: what the app is, who it's for, screens, stored data, data standard, definition of done, what we don't do
- `PLAN.md`: the build steps and their "Done when" checks

Rules:
- Work through `PLAN.md` in order. When a step is finished and its "Done when" checks pass, tick its box (`- [x]`) in `PLAN.md`. Don't tick a step whose checks you couldn't verify; say what's left for the user to check instead.
- Never build anything listed under "What we don't do" in `SPEC.md`. If a request conflicts with that list, point it out and ask first.
- Every fact, number or photo added to the app needs a source in `shared/sources.ts` (or a Wikipedia link). Check it against the source itself before shipping; if no source exists, mark it "Estimate" or leave it out.
- If the plan changes, update `PLAN.md` in the same session. If the spec changes, update `SPEC.md` in the same session, so nothing is lost when the chat is cleared.
- Before committing app changes, run `npm run build` and `npm run lint`; if anything under `shared/wine*` or `shared/simGrapes.ts` changed, also run `npm run test:wine`. Check pages in the browser at phone size (375 px) and desktop size.
- Commit automatically: when a PLAN.md step is finished and its "Done when" checks pass, commit it as its own git commit ("Phase X.Y: name"). Other finished changes (docs, rules, fixes) get their own commit too. Only stage the files that belong to that commit.
- Push to `origin` (https://github.com/fifilafufu/bandicroc.niagaragrapes) only when the user says "push". Then push straight away, without asking again. Never push on your own. Pushing to `main` publishes the live site (Cloudflare Pages).
- New Supabase tables go in `supabase/<name>.sql` with row-level security. Tell the user to run the file in the Supabase SQL Editor, and make the app keep working (on the device) until they do.
- When a step or fix is done, end the message with what I should see and exactly how to test it, as numbered steps I can follow in the app.
- Questions for the user: always ask with the AskUserQuestion tool (multiple-choice popup), never as a list in text. One clear question per item, 2 options each; the user types their own answer in "Other" when needed.

## Code structure rules
Frontend, backend and data stay separate, and imports only flow one way: screens → `src/lib/` → `shared/`.
- **`functions/` is the backend** (Cloudflare Pages Functions: Grape Bot, secrets, AI calls). It may import `shared/`, never `src/`.
- **`src/` is the frontend.** Components only draw the screen and handle taps. They never call Supabase or `fetch` directly: every database or server call goes through a function or hook in `src/lib/`.
- **`shared/` is plain data and pure logic** used by both sides: no React, no DOM, no network calls.
- **Content is data, not code.** Facts, lists, numbers and their sources live in `shared/` data files, never typed inside a component.
- **No copy-paste.** When the same logic appears twice, make one helper and use it in both places.
- **Small, focused files.** One component per file; split any file that grows past about 250 lines. Styles are split by feature in `src/styles/`, not appended to one big file.
- **No dead code.** Remove unused files, exports and commented-out code in the same change.
- Check before committing: no file in `src/components/` imports `supabase` or calls `fetch`; nothing in `shared/` imports from `src/`.

## Documentation rules
- All project docs (README.md, SPEC.md, PLAN.md, CLAUDE.md) are in English only.
- Do not update README.md during a phase.
- When I say a phase is finished, update README.md in one pass so it matches the current code and SPEC.md: features, screens, stored data, install steps, requirements and keyboard shortcuts.
- Move features from "Planned features" to "Features" in README.md once they are built and working.
- After that update, tell me which parts of README.md you changed.
