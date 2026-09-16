# NelvinBenefit — repository notes

## Project shape

Vite + React SPA for an employee-benefits platform. Public landing page under
`src/components/nelvin/`, authenticated portals (subscriber / HR / partner) under
`src/pages/` and `src/components/{admin,business,corporate}/`.

`src/services/api/base44Client.js` is the single data adapter. It has three
backends, chosen at runtime:

1. Supabase, when configured in `.env`.
2. The Base44 SDK, when injected.
3. A local in-memory + localStorage fallback, so the UI renders without a backend.

When you see `[nelvin] No backend configured — using local in-memory data` in the
console, you are on backend 3. That fallback is a real credential store: salted,
iterated SHA-256 password hashes, random session tokens with a 7-day expiry.
It still is not an identity provider — the data lives in that browser only.

## Commands

```bash
npm run build                 # production build
npx vite preview --port 4173  # serve dist/

node scripts/smoke-db.mjs             # local db adapter API shape
node scripts/categories-check.mjs     # category images load and are distinct
node scripts/layout-lint.mjs          # no horizontal overflow at 3 breakpoints
node scripts/auth-redirect-check.mjs  # login routes to the account's real portal
```

The last three need a preview server on `:4173` first. Override with
`PREVIEW_URL=...`. `scripts/auth-redirect-check.mjs` needs `/usr/bin/chromium`.

## Things that have bitten us

**The local credential store lives in localStorage.** In browser tests, a fresh
incognito context gets an *empty* store, so an account registered in one context
does not exist in the next and every login returns 401. Use one shared context
and clear only `nv_auth_session` / `nv_auth_token` between phases to simulate
signing out. A per-phase context will make a working login look broken.

**A live session redirects `/login` to `/dashboard`.** Tests that need to reach
the login page must clear the session keys first, or assert against the
already-authenticated redirect instead.

**Post-auth routing follows the account's role, not the selected tab.** The role
tabs on the auth card are a sign-up affordance. Routing on the tab sent
subscribers to `/business` ("Business access required") while the session was
live, so going back to `/login` bounced them to `/dashboard` and login looked
broken. `destinationForRole()` in `src/components/auth/AuthForm.jsx` is the
single place that decides this. The OTP path is the one exception: there the tab
is authoritative, because `updateMe` has just written the role from it.

**Verify a visual claim by measuring pixels, not by eyeballing a screenshot.**
Two examples from this repo: a `brightness-0 invert` filter made all 23 partner
logos pure white on a `#F9F8F7` band (contrast ~1.02:1 — invisible), and the auth
panel overlay left white text at only ~2.1:1 over the brightest part of its
video. Both looked "fine-ish" in a thumbnail and only became obvious once the
actual luminance was sampled. Scripts that screenshot to `/tmp` and measure with
PIL caught both.

## Design system

`src/styles/index.css` holds the tokens: Nunito Sans, Tailwind base, and the gold
accent (`.text-gold-gradient`, `.text-brand-gold` = `#FFCC00`). The NelvinBenefit
wordmark renders in gold everywhere via `BrandWordmark` in
`src/components/nelvin/Brand.jsx`; keep `tone="inverse"` on dark surfaces.

Theme blue is `#1B4F9C` (HSL `217 70% 36%`), with `#123A78` for hover/active and
`#3A6FB8` as the light step. It was previously `#0866FF` (HSL `217 100% 51%`),
which read as too vivid. The HSL triple also lives in `tailwind.config.js` via
the `--primary` variable, so changing one without the other desyncs the palette.

## Convention

Keep changes focused and leave the existing routes, data and copy alone — this
codebase has had visual redesigns layered onto working functionality, and
rewriting a component wholesale tends to drop behaviour that the portals depend
on.