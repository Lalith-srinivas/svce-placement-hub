# S V College of Engineering — Companies Research & Placement Analytics Portal

_a.k.a. the SVCE Placement Intelligence Hub_

A mobile-first placement research portal: a searchable grid of recruiting companies, a
22-section company "dossier" (identity, financials, culture, risk, compensation, and more),
and a skill-readiness map showing exactly what proficiency level each company's screening
bar sits at — down to a 10-level topic roadmap per skill.

## Phase 1 — UI only

This build is **intentionally data-layer-free**:

- There is no database, no Supabase project, no Lovable Cloud, and no `@supabase/supabase-js`
  dependency anywhere in this repo.
- Every screen renders from a single hardcoded seed file: `src/data/seedCompanies.ts`. It
  currently contains one real company record (Accenture) with the full field set the portal
  is designed around, so every page — the grid, all 22 intelligence sections, and all 12
  skill roadmaps — renders completely on first load with no configuration.
- `src/data/skillTopics.ts` supplies the 10-level topic ladder for each of the 12 seed
  skills, used by the expandable roadmaps on the Skill Intelligence page.

## Fully public — no login

There is no `/login` route, no `AuthContext`, no `ProtectedRoute`, and no Supabase Auth.
Every route (`/`, `/company/intelligence`, `/company/skills`) is reachable directly by any
visitor. Selecting a company just writes a small reference to `localStorage`
(`selected-company`) so the intelligence pages survive a browser refresh — that's the only
persistence in the app.

Never shown anywhere in the UI: CTC, stipend, or selection-ratio figures.

## College used for this build

`COLLEGE_NAME = S V College of Engineering`, `COLLEGE_SHORT = SVCE`. Both are used as plain
text in the hero and sidebar wordmark — there is no college logo asset anywhere in `public/`
or referenced in code. (Recruiting-company logos, via Logo.dev with a seed-URL and
initial-letter fallback chain, are unaffected by that restriction.)

## Project structure

```
src/
  components/
    company/        CompanyCard, CompanyLogo, FieldRow (renders url/video/rating/list/paragraph/auto)
    layout/          AppSidebar, AppLayout, sidebar-context
    ui/              Button, Badge, Skeleton primitives
  context/
    CompanyContext.tsx   localStorage-backed selected-company state
  data/
    seedCompanies.ts     the ONE hardcoded seed record (Accenture)
    skillTopics.ts        10-level roadmap per skill_set_id
    intelligenceData.tsx  22-section schema: icons, labels, field types, in fixed order
  lib/
    companyData.ts    pure normalizers: normalizeCompanySummary / normalizeCompanyProfile /
                       normalizeDashboardSkills, plus shared helpers (splitItems, isNullish,
                       scoreToDifficulty, proficiencyToBloom, scoreToCriticality)
  pages/
    Index.tsx                 company grid, search, category filter pills
    CompanyIntelligence.tsx   sticky info bar + 22-tab scroll-spy dossier
    SkillIntelligence.tsx     Bloom + criticality legends, expandable skill roadmaps
    NotFound.tsx               only route for genuinely invalid URLs
```

## Design system

- Fonts: **Outfit** (headings), **Inter** (body), **IBM Plex Mono** (section indices, tab
  labels, tier/skill codes) — loaded via Google Fonts in `index.html`.
- Colors are enforced as CSS variables in `src/index.css` and surfaced in
  `tailwind.config.ts`: navy neutrals, the four placement-tier colors (Super Dream, Dream,
  Standard, Regular), and the five Bloom-level colors (CU/AP/AS/EV/CR). No gradients
  anywhere; light mode is the default with a dark-mode variable block defined for later use.
- The signature device is the section index (`SEC. 01 / 22`) that runs through the dossier's
  sticky tab bar and each section card — the 22 sections are a genuine fixed sequence, so the
  numbering encodes real information rather than decorating the page.

## Data layer → Phase 2

Every normalizer in `src/lib/companyData.ts` takes the same `short_json` / `full_json` /
`skill_levels` shapes the future Supabase tables are expected to expose. Swapping the data
source is meant to be a one-file change:

1. Replace the `SEED_COMPANIES` import in `CompanyContext.tsx` (and `SkillIntelligence.tsx`)
   with a Supabase query that returns rows in the same shape.
2. Leave `companyData.ts`, `intelligenceData.tsx`, and every page/component untouched — they
   only ever consume the normalized `CompanySummary` / `CompanyProfile` / `DashboardSkill`
   types, never the raw seed directly.
3. Add `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` and the Supabase client only at that
   point — neither exists in this Phase 1 build.

## Environment variables

Only one, and it's optional:

```
VITE_LOGO_DEV_PUBLISHABLE_KEY=   # enables sharper recruiter logos via Logo.dev
```

If unset, `CompanyLogo` falls back to the seed's `logo_url`, then to an initial-letter badge
in the company's tier color. No `VITE_SUPABASE_*` variables exist in this phase.

## Running locally

```bash
npm install
npm run dev       # start the dev server
npm run build     # type-check + production build
npx vitest run     # smoke test
```

## Verified before handoff

- `/` loads the company grid with the Accenture card visible.
- Clicking the card saves `selected-company` to `localStorage`, updates `CompanyContext`,
  and navigates to `/company/intelligence` — selection survives a hard refresh.
- `/company` redirects to `/company/intelligence`.
- `/company/intelligence` renders all 22 sections, populated from Accenture's `full_json`.
- `/company/skills` renders all 12 skill cards with expandable 10-level roadmaps.
- No `/login`, `/dashboard`, or logout UI exists anywhere; `NotFound` only fires for
  genuinely unmatched URLs.
- `npm run build` and `npx vitest run` both pass.
