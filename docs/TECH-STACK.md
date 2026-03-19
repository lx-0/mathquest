# Tech Stack — MathQuest

## Chosen Stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Language | TypeScript | 5.x | Full-stack; type safety across frontend and backend |
| Frontend framework | React | 18.x | Component model; strong ecosystem; large hiring pool |
| Build tool | Vite | 5.x | Fast dev server + optimized production builds |
| Styling | Tailwind CSS | 3.x | Utility-first; responsive-first out of the box (375px+) |
| Routing | React Router | 6.x | Client-side routing; nested routes for game screens |
| Math rendering | KaTeX | 0.16.x | Fast, accessible (ARIA output mode), small bundle |
| State management | Zustand | 4.x | Lightweight global state; no boilerplate |
| Backend runtime | Node.js | 20.x LTS | Stable; matches frontend language |
| Backend framework | Fastify | 4.x | Low overhead; TypeScript-native; OpenAPI support |
| Database | PostgreSQL | 15.x | Relational; suited for user/progress/leaderboard data |
| ORM | Prisma | 5.x | Type-safe queries; schema migrations; good DX |
| Authentication | JWT + bcrypt | — | Username/password for Phase 1–5; SSO deferred to Phase 6 |
| Hosting (frontend) | Vercel | — | Zero-config deploys; CDN-backed; free tier sufficient |
| Hosting (backend) | Railway | — | Managed containers + PostgreSQL; simple ops |
| CI/CD | GitHub Actions | — | Lint + test + deploy on every PR |
| Testing (unit) | Vitest + RTL | Latest | Fast; Vite-native; React Testing Library for components |
| Testing (E2E) | Playwright | Latest | Cross-browser; mobile viewport testing |

---

## Responsive-First Engineering Standard

**Finding F6 from USER-TESTING.md elevated this to a Phase 1 requirement.** 6th graders overwhelmingly access content on mobile devices. Retrofitting responsive layout at Phase 5 would require rework of every screen. All UI must be built mobile-first from the first sprint.

### Minimum Supported Viewport

**375px width** (iPhone SE, small Android). All layouts, components, and interactions must work correctly at this width and scale up gracefully.

### Rules (enforced at code review)

| Rule | Requirement |
|------|-------------|
| Default viewport | Write base CSS for 375px; add `sm:` / `md:` / `lg:` Tailwind modifiers for wider screens |
| Viewport meta | Every HTML shell includes `<meta name="viewport" content="width=device-width, initial-scale=1">` |
| Tap targets | All interactive elements (buttons, links, inputs) must be **≥ 44×44 px** (WCAG 2.5.5) |
| No horizontal scroll | Content must not overflow horizontally at any supported viewport. `overflow-x: hidden` on body is a mask, not a fix — find and fix the offending element |
| Images and media | Use `max-width: 100%` / Tailwind `w-full` on all media; never use fixed pixel widths on content images |
| Flex/Grid | Prefer `flex-col` at base, `sm:flex-row` for wider layouts. Avoid fixed-width columns in base styles |
| Typography | Base font size ≥ 16px to prevent iOS auto-zoom on inputs; use relative units (rem/em) not px for font sizes |
| Testing | Every new component reviewed at 375px in dev tools before merge. Playwright E2E suite includes a `375×812` mobile viewport configuration |

### Tailwind Breakpoint Reference

| Prefix | Min-width | Target |
|--------|-----------|--------|
| *(none)* | 0 px | Mobile (375px+) — **write here first** |
| `sm:` | 640 px | Large phones / small tablets |
| `md:` | 768 px | Tablets |
| `lg:` | 1024 px | Laptops / desktops |

### Playwright Mobile Config

Add to `playwright.config.ts` from project initialization:

```ts
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },   // 393×851
  { name: 'mobile-safari', use: { ...devices['iPhone SE'] } }, // 375×667
],
```

All E2E tests must pass on `mobile-safari` (375px) before a PR can merge to `main`.

---

## Rationale

### TypeScript everywhere
A consistent language across frontend and backend reduces context switching and allows shared types (e.g., question payloads, user profile shapes). For an educational product with multiple game mechanics, type safety catches integration bugs early.

### React + Vite
React's component model fits the game UI pattern: question cards, score panels, badge modals, and leaderboard rows are all self-contained components. Vite replaces Create React App for significantly faster hot reload and build times. The ecosystem (hooks, animation libraries, accessibility tooling) is the most mature of the SPA options.

### Tailwind CSS
Responsive-first design is a Phase 1 requirement (USER-TESTING.md F6). Tailwind's `sm:`, `md:` breakpoint utilities and mobile-first defaults make it the lowest-friction path to a 375px-ready layout. No CSS Modules or Sass files to maintain.

### KaTeX for math rendering
KaTeX was chosen over MathJax for three reasons:
1. **Performance:** KaTeX renders synchronously; MathJax v3 is async and larger (~300 KB vs ~70 KB gzipped). Sub-2s TTI is a Phase 5 target — math rendering must not block.
2. **Accessibility:** KaTeX's `output: "htmlAndMathml"` mode emits MathML alongside HTML, which screen readers (VoiceOver, NVDA) can announce correctly. This directly addresses USER-TESTING.md Critical Finding F5.
3. **6th-grade scope:** MathQuest math (fractions, ratios, equations, basic geometry) is well within KaTeX's supported LaTeX subset. MathJax's broader macro support is unnecessary overhead.

MAT-18 documents this decision formally.

### Zustand
Redux and Context+Reducer are over-engineered for this scope. Zustand gives a simple store for session state (current question, XP, streak, timer) without the boilerplate. Stores can be tested independently and composed easily.

### Fastify over Express
Fastify is 2–3× faster than Express under load, has TypeScript support built-in, and generates OpenAPI schemas automatically. For a project with a student-facing API and eventual teacher dashboard, schema documentation is worth having early.

### PostgreSQL + Prisma
Game state (XP, levels, mastery, badges, daily streaks) is inherently relational. PostgreSQL handles complex leaderboard queries (weekly rank by XP, class-scoped) well. Prisma's migration workflow keeps the schema in version control and eliminates raw SQL for CRUD operations.

### JWT + bcrypt (Phase 1–5)
Google Classroom SSO is the right long-term auth for classroom adoption, but it requires OAuth app approval and adds Phase 1 complexity. Simple username/password with JWTs gets the game running for user testing. SSO is architected as a drop-in replacement in Phase 6 (the auth layer is abstracted behind a `createSession` service).

### Vercel + Railway
Vercel is zero-config for Vite/React static sites with PR preview deployments. Railway provides a managed PostgreSQL instance + Node container without Kubernetes overhead. Both have generous free tiers for a project at this stage. If traffic grows beyond free tiers, migrating to a cloud provider is straightforward.

---

## Trade-offs

### React over Svelte/Vue
Svelte produces smaller bundles and simpler component code. For a team of one or two, Svelte would ship faster. React is chosen for ecosystem depth (animation libraries, accessibility tooling, RTL maturity) and future hiring ease. Revisit if bundle size becomes a problem.

### KaTeX over MathJax
MathJax v3 covers a larger LaTeX subset and handles more complex notation (advanced integrals, commutative diagrams). For 6th-grade math, this is irrelevant. If the platform expands to higher grades, re-evaluate.

### Username/password over SSO
Google Classroom SSO would remove friction for teacher-managed classrooms (no student account creation). The tradeoff is OAuth app registration + approval + Phase 1 scope creep. This is the correct deferral — Phase 6 accounts include the teacher management model needed to make SSO useful anyway.

### Railway over AWS/GCP/Azure
Managed cloud (ECS, Cloud Run) offers more control and lower long-term cost at scale, but requires infrastructure code and devops overhead. At this stage, Railway's simplicity is worth the cost premium. Re-evaluate at 1,000+ DAU.

### No game engine (Phaser/Pixi.js)
MathQuest's UI is primarily form-based (question cards, buttons, progress bars) with light animation (XP counter, badge pop, level-up modal). A game engine would add 300–800 KB of bundle weight and a new API surface for what are mostly CSS transitions and a few canvas animations. The game feel comes from the loop design, not from sprite rendering.

---

## Key Dependencies

| Package | Purpose | License |
|---|---|---|
| `react` | UI component framework | MIT |
| `react-dom` | React DOM renderer | MIT |
| `react-router-dom` | Client-side routing | MIT |
| `zustand` | Global state management | MIT |
| `katex` | Math expression rendering | MIT |
| `tailwindcss` | Utility CSS framework | MIT |
| `vite` | Build tool + dev server | MIT |
| `fastify` | HTTP server framework | MIT |
| `@prisma/client` | ORM + database client | Apache-2.0 |
| `prisma` | Schema & migration CLI | Apache-2.0 |
| `jsonwebtoken` | JWT creation and verification | MIT |
| `bcrypt` | Password hashing | MIT |
| `pg` | PostgreSQL driver (Prisma peer dep) | MIT |
| `vitest` | Unit test runner | MIT |
| `@testing-library/react` | Component testing utilities | MIT |
| `playwright` | E2E browser testing | Apache-2.0 |
| `typescript` | Type checking + compilation | Apache-2.0 |

---

## Open Questions

1. **Math rendering edge cases:** Confirm KaTeX handles all planned problem formats (mixed numbers, coordinate plane notation, basic probability fractions) before Phase 2. Add a KaTeX smoke test to the Phase 2 milestone.
2. **Audio library:** Howler.js is the standard for web game audio. Evaluate at Phase 5 UI polish sprint; don't pull it in earlier.
3. **Accounts / SSO:** Google Classroom SSO (Phase 6) requires an OAuth app registration. Start that process in Phase 4 to avoid a blocking delay at Phase 6 launch.
4. **Content storage:** Problem bank (200+ questions) will live in the PostgreSQL `questions` table. Confirm the schema supports difficulty tags, topic domain, and multiple answer types (multiple-choice, numeric) before Phase 4.

---

*Last updated: 2026-03-19*
