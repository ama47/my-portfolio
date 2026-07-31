# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # tsc --noEmit, then vite build -> dist/
npm run preview    # serve the production build
npm run typecheck  # TypeScript only
```

**There is no test framework and no linter installed.** `npm run build` is the
only automated gate — it typechecks before building, so a type error fails the
build. TypeScript runs with `strict`, `noUnusedLocals`, `noUnusedParameters`,
`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`; the last one means
optional props that can receive `undefined` must be declared
`prop?: T | undefined`, not just `prop?: T`.

Verifying UI behaviour requires a browser — there is no headless harness in the
repo.

## Architecture

A single-page static portfolio. Vite + React 18 + TypeScript + Tailwind 3.4.
No router, no backend, no state library.

### Content is centralised, components are empty of copy

**Every user-visible string lives in `src/data/content.ts`.** No component
contains text. When changing wording, edit that file and nothing else.

Its shape matters:

- Locale-invariant data (`links`, `orgs`, `periods`, `tech`, `skillItems`) is
  declared once at the top and referenced from both language objects, so
  English and Arabic cannot drift apart. Do not inline a URL, date or
  technology name into one locale only.
- `en` and `ar` are both typed as `Content`. Adding a field to one language
  makes the build fail until it exists in the other — this is intentional.

### Theme and locale are initialised in two places

An inline script in `index.html` reads `localStorage` and stamps `.dark` on
`<html>` plus `lang`/`dir` **before React mounts**, to avoid a flash of the
wrong theme or text direction. `ThemeProvider` and `LocaleProvider` then read
the same storage keys (`portfolio-theme`, `portfolio-locale`) and take over.

**If you change a storage key, a class name or the default, change it in both
places** or the page will flash and then correct itself.

`ThemeProvider` follows the OS colour scheme only while no explicit choice is
stored — checking `localStorage` inside the `matchMedia` listener is what makes
that work.

### Design tokens are CSS variables, consumed through Tailwind

`src/index.css` defines the palette under `:root` and `.dark` as
**space-separated RGB channels** (`--primary: 29 78 216`), not hex.
`tailwind.config.js` maps them with `rgb(var(--primary) / <alpha-value>)`, which
is what makes `bg-primary/10` and `text-ink/70` work.

Adding a colour means adding it in both files, in that format. Use the token
classes (`bg-surface`, `text-ink`, `border-rule`, `text-ink-muted`) rather than
raw Tailwind palette colours, so both themes stay in sync automatically. Reds
for form errors are the deliberate exception.

### RTL is structural, not a stylesheet override

Arabic flips `dir="rtl"` on `<html>`, and the layout mirrors because the CSS
uses **logical properties only**: `ms-*`, `me-*`, `ps-*`, `pe-*`, `border-s`,
`rounded-e-*`, `text-start`. Symmetric utilities (`px-*`, `mx-auto`) are fine.

**Never introduce `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*` or
`text-left`/`text-right`** — they will not mirror. The nav rail's tree line is a
logical inline-start border rather than box-drawing characters for this reason.

Conversely, content that must stay left-to-right in both locales carries an
explicit `dir="ltr"`: technology chips, dates, email, phone, shell prompts, key
hints. Keep that when adding similar content.

**Put `dir="ltr"` on the leaf element, never on its list container.** `dir` on a
container also controls flow and alignment, so a `dir="ltr"` chip list inside an
Arabic page renders hard against the left margin while the text around it is
right-aligned. `Chip` carries the `dir`; `ChipList` does not. Same rule for any
new group of Latin-script items.

### Section numbering is duplicated — keep it in sync

`SECTION_IDS` in `content.ts` defines section order, and `Nav` derives the
displayed number from `SECTION_IDS.indexOf(id)`. But each section component
passes a **hardcoded** `index` prop (`<Section id="skills" index="06" …>`).

Reordering or inserting a section means updating `SECTION_IDS` *and* the
hardcoded `index` on every affected section component, or the rail and the
headings will disagree.

Note also that `<Hero>` uses `id="top"`, not `id="profile"` — the `profile`
section is the separate prose block below it.

### Nav is split by breakpoint on purpose

`NavRail` (desktop, `lg:flex`) must be rendered as a direct flex sibling of
`<main>`; `NavBar` (mobile, `lg:hidden`) must be rendered full-bleed *outside*
that flex row. They were originally one component returning a fragment, which
made the mobile bar a flex child and rendered it as a narrow column beside the
content. Do not recombine them.

### Command palette is an optional layer

`CommandPalette` (⌘K / Ctrl K) exists as a convenience only. **Every command it
offers must also have a visible control on the page** — the design explicitly
rejects the terminal-portfolio pattern where navigation is hidden behind typed
commands. If you add a palette command, add or confirm its on-page equivalent.

Its fuzzy matcher is hand-rolled in `src/lib/fuzzy.ts` (subsequence match with
contiguity and word-boundary bonuses) rather than a dependency.

## Deliberate constraints

Several things look unfinished but are decisions:

- **`CONTACT_ENDPOINT` in `src/config.ts` is empty.** The form renders and
  validates, but submitting reports "not configured" instead of faking success,
  so no message is silently lost. Filling in a Formspree URL is the only change
  needed to enable it.
- **Language proficiency levels are blank.** The source CV lists English and
  Arabic without levels, and none were invented. `LanguageEntry.level` is
  optional and renders as soon as it is set.
- **The Arabic copy was drafted, not authored by the site owner** — especially
  organisation names, which may have official Arabic forms. Flag rather than
  silently rewrite.
- **No runtime dependencies beyond `react` and `react-dom`.** i18n, theming,
  fuzzy matching and the clipboard helper are all owned in-repo. Prefer adding
  a small module over a package.
- **No deployment configuration.** No `vercel.json`, no CI workflow, no `base`
  path. The build is plain static files; add host config when a host is chosen.
- **`tsconfig.json` is a single project with no references.** An earlier
  `tsc -b` + `tsconfig.node.json` setup failed with TS6310 (referenced projects
  may not disable emit). Do not reintroduce project references without also
  solving that.

## Source of truth for content

`src/data/content.ts` is the authoritative copy of the CV text. The PDF served
from `public/Abdulaziz_Alsuhaibani_FullStackDeveloper.pdf` uses a custom subset
font encoding that naive extractors read as garbage, so do not re-parse it —
edit `content.ts` and keep the PDF in step by hand.
