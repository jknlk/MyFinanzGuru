# MyFinanzGuru

Independent financial advisory site for the German market. Fully static public
site (SSG), five client-side financial calculators, booking via Calendly, and
a password-protected admin panel that edits content by committing directly to
this repository through the GitHub Contents API (Git-as-CMS — **no
database**).

Stack: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
GSAP + ScrollTrigger · Lenis · Recharts.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build (what Vercel runs) |
| `npm run start` | Serve the production build locally |
| `npm test` | Run the calculator unit tests |
| `npm run lint` | ESLint |

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in real values (a working
`.env.local` with dev-only placeholders is already included for local admin
testing — **change `ADMIN_PASSWORD` before deploying anywhere real**).

```
NEXT_PUBLIC_CALENDLY_URL=   # public scheduling link, e.g. https://calendly.com/handle/30min
ADMIN_PASSWORD=             # admin panel login password
ADMIN_SESSION_SECRET=       # 32+ char random string, signs the session cookie
GITHUB_TOKEN=                # fine-grained PAT, Contents: Read and write, THIS REPO ONLY
GITHUB_REPO=                 # e.g. yourusername/myfinanzguru
GITHUB_BRANCH=main
```

**Never** put `GITHUB_TOKEN` or `ADMIN_PASSWORD` in a `NEXT_PUBLIC_*` variable
or reference them from a client component — they are only read inside server
route handlers (`src/app/api/admin/**`, `src/lib/session.ts`,
`src/lib/github.ts`). The Calendly integration uses only the public
scheduling URL; no Calendly API token is used anywhere in this project.

### Creating the GitHub token

1. GitHub → Settings → Developer settings → Personal access tokens →
   **Fine-grained tokens** → Generate new token.
2. Repository access: **Only select repositories** → this repo.
3. Permissions → Repository permissions → **Contents: Read and write**.
   Leave everything else at "No access".
4. Copy the token into `GITHUB_TOKEN` in your environment (locally in
   `.env.local`; in production as a Vercel project environment variable —
   never commit it).

## How the admin panel works

`/admin` is a login form (password from `ADMIN_PASSWORD`) that sets a signed,
http-only session cookie (iron-session, 24h). `src/proxy.ts` (Next.js 16's
renamed `middleware.ts` convention) protects every `/admin/**` and
`/api/admin/**` route and adds `X-Robots-Tag: noindex`. Login attempts are
rate-limited in-memory (5 / 15 min per IP — resets on cold start, which is a
known limitation of serverless functions; sufficient to slow down casual
brute-forcing of a single-admin panel).

Every save (seminars or guides) reads the current file + its Git `sha` from
GitHub, then commits an update back via `PUT /repos/{repo}/contents/{path}`.
If the file changed elsewhere since it was loaded, GitHub returns 409 and the
UI refetches the latest version instead of silently overwriting it. A commit
to `main` triggers Vercel's normal auto-deploy — expect the live site to
update roughly 1–2 minutes after a save.

- **Seminars** (`content/seminars.json`) — the whole array is rewritten on
  every add/edit/delete.
- **Guides** (`content/guides/*.mdx`) — each guide is its own file, edited
  with a frontmatter form + Markdown body + live preview.
- **Uploads** — cover images and PDFs (PNG/JPG/WEBP/PDF, max 4MB — the
  practical GitHub Contents API limit) are committed to **both**
  `content/uploads/` (source of truth per the Git-as-CMS design) and
  `public/uploads/` (because Next.js can only serve static files from
  `/public` at request time — `content/` alone isn't web-servable).

## Financial tools

All five tools (`src/lib/tools/*.ts`) run 100% client-side — no user input is
ever sent to a server. Every tool has unit tests (`*.test.ts` alongside the
logic, run with `npm test`). Year-specific constants (tax brackets, social
insurance ceilings, Grunderwerbsteuer rates, etc.) live in
`src/lib/constants-2026.ts`, each flagged `// CLIENT MUST VERIFY` — these are
placeholder/approximate 2026 figures and **must be checked against official
sources before launch**.

The Brutto-Netto calculator implements a simplified version of the official
§32a EStG formula and standard payroll deductions; it explicitly does not
cover special cases (mini/midi-jobs, civil servants, PKV members, Gleitzone —
see the in-app disclaimer).

## Before launch checklist

Every placeholder is grep-able:

```bash
grep -rn "{{.*}}\|CLIENT MUST VERIFY" src content
```

At minimum, replace/verify:

- [ ] `src/lib/constants-2026.ts` — every `CLIENT MUST VERIFY` tax/insurance figure
- [ ] `src/lib/team.ts` — real team member names, roles, bios, photos
- [ ] `src/components/home/Hero.tsx` — hero photo/video placeholder
- [ ] `src/components/home/AboutTeaser.tsx`, `StepPlan.tsx` — image placeholders
- [ ] `src/components/home/StatsBand.tsx` — real client/AUM/rating numbers
- [ ] `src/components/home/LogoMarquee.tsx` — real review platform links/ratings
- [ ] `src/components/layout/Footer.tsx` — real address, social links
- [ ] `src/app/impressum/page.tsx`, `src/app/datenschutz/page.tsx` — legal text (have a lawyer review; §34f/§34h GewO registration details are required)
- [ ] `src/app/book/page.tsx` — WhatsApp number, phone number
- [ ] `.env.local` / Vercel env vars — real `NEXT_PUBLIC_CALENDLY_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`
- [ ] Run a Lighthouse pass on Home, one tool page, and one guide article (target ≥ 90 all categories)

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Set all environment variables from `.env.local.example` in the Vercel
   project settings (Production + Preview).
4. Deploy. The admin panel writes to the branch set in `GITHUB_BRANCH`
   (default `main`), so pushing/merging to that branch — including admin
   saves — triggers a new deploy automatically.
