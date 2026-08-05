# Portfolio — Abdulaziz Alsuhaibani

Personal portfolio for a Full-Stack Developer, built as a developer console:
monospace chrome, blue-and-white palette, light and dark themes, and full
English / Arabic support with RTL mirroring.

Single page, no backend, static output.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, then build static output to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript only, no build |

## Editing your content

**All copy lives in [`src/data/content.ts`](src/data/content.ts).** No component
contains text, so updating your CV never means touching a component.

The file is split into two parts:

- **Locale-invariant data** at the top — `links`, `orgs`, `periods`, `tech`,
  `skillItems`. Declared once and referenced from both languages so English
  and Arabic can never drift apart.
- **`en` and `ar` objects** holding all prose. Both are typed as `Content`, so
  if you add a field to one language TypeScript will require it in the other.

A few notes:

- **Language proficiency levels are intentionally blank.** Your CV lists English
  and Arabic without levels, so none were invented. Add a `level` to either
  entry in `content.ts` and it will render automatically.
- **The Arabic translation was drafted for you and should be reviewed** —
  particularly organisation names, which may have official Arabic forms you
  prefer.

## Enabling the contact form

The form is fully built and validates input, but **ships with no endpoint**.
Submitting reports "not configured" rather than pretending to send, so no
message is ever silently lost.

It posts to [Web3Forms](https://web3forms.com), which needs no account — enter
your email on their site and a key is sent to you. Then:

```bash
cp .env.example .env   # then paste the key into VITE_CONTACT_ACCESS_KEY
```

Restart the dev server afterwards; Vite reads env files only at startup. For the
deployed site the same two values come from GitHub Actions settings instead —
see [Deployment](#deployment).

Messages arrive with the sender's address as `Reply-To`, so replying in your
mail client reaches them rather than you.

**The access key cannot be hidden from visitors.** A static site has nothing to
hide it behind, so Vite inlines it into the JS bundle whatever you do. Storing
it in `.env` (gitignored) and as an Actions secret keeps it out of the
repository and out of build logs, where scraping bots look — but not out of
devtools. The worst case is someone burning the monthly quota on mail addressed
to you.

Spam protection is a hidden `botcheck` honeypot plus Web3Forms' own filtering.
Their docs consider the honeypot weak on its own and suggest hCaptcha; that is
worth adding only if spam actually starts arriving.

To move to a self-hosted endpoint later, point `VITE_CONTACT_ENDPOINT` at it and
leave `VITE_CONTACT_ACCESS_KEY` empty — the key is only sent when set, and no
component changes.

## Features

- **⌘K / Ctrl K command palette** — jump to any section, toggle theme or
  language, download the CV, copy the email, open GitHub/LinkedIn. It is a
  convenience layer only: every command has an equivalent control on the page,
  so nothing is hidden behind it.
- **Theme and language persist** to `localStorage`, and an inline script in
  `index.html` applies both before React mounts so there is no flash.
- **Reduced motion** is respected globally — animation and smooth scrolling
  switch off for anyone whose OS asks for it.

## Structure

```
src/
  config.ts             contact endpoint + CV path
  data/content.ts       all content, EN + AR
  i18n/                 locale context, sets <html lang/dir>
  theme/                light/dark context
  hooks/                scroll-spy, reveal, media query, clipboard
  lib/                  fuzzy matcher, platform check
  components/
    sections/           the eight page sections
    ...                 rail, palette, cards, timeline, primitives
```

## Design tokens

The palette is defined once as CSS custom properties in `src/index.css`
(`:root` for light, `.dark` for dark) and surfaced to Tailwind in
`tailwind.config.js`. Change a colour there and it propagates everywhere.

## Deployment

Pushing to `main` builds and publishes the site to Cloudflare Pages, via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and
[`wrangler.jsonc`](wrangler.jsonc). Pull requests and pushes to other branches
run the same build as a check, without deploying.

One one-time setting is needed on GitHub — **Settings → Secrets and variables
→ Actions**, at the *repository* level:

| Name | Where | Value |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secrets | a Cloudflare API token with Pages edit permission |
| `CLOUDFLARE_ACCOUNT_ID` | Secrets | your Cloudflare account ID |
| `VITE_CONTACT_ENDPOINT` | Variables | `https://api.web3forms.com/submit` |
| `VITE_CONTACT_ACCESS_KEY` | Secrets | your Web3Forms key |

The Cloudflare Pages project (`my-portfolio`) is created automatically by the
first deploy if it doesn't already exist. The two `VITE_CONTACT_*` values are
optional — without them the site still deploys, and the contact form reports
"not configured" on submit. Adding them later needs only a re-run.

The site deploys to its default `*.pages.dev` URL until a custom domain is
attached. That's a Cloudflare dashboard step (Workers & Pages → the project →
Custom domains) done once a domain is chosen — no repo change, and unlike
GitHub Pages, no `CNAME` file in `public/`.
