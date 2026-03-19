# MathQuest

A gamified math learning platform for 6th graders.

MathQuest wraps 6th-grade Common Core math in a game loop: players earn XP, unlock badges, level up their character, and compete on class leaderboards — all while practicing fractions, ratios, equations, and geometry.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript 5.x |
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Math rendering | KaTeX 0.16 |
| State | Zustand 4 |
| Backend | Node.js 20 LTS + Fastify 4 |
| Database | PostgreSQL 15 + Prisma 5 |
| Auth | JWT + bcrypt |
| Hosting | Vercel (frontend) + Railway (backend + DB) |
| CI/CD | GitHub Actions |
| Testing | Vitest + RTL (unit), Playwright (E2E) |

All UI is built mobile-first. Minimum supported viewport: **375px**.

---

## Project Structure

```
mathquest/
├── docs/               # GDD, tech stack, user testing notes
├── ROADMAP.md          # Phase-by-phase milestones
└── README.md
```

> Application code will be added in Phase 1 scaffolding.

---

## Roadmap (phases)

| Phase | Focus | Status |
|---|---|---|
| 1 | Foundation — repo, CI, project scaffold | In progress |
| 2 | Core game loop — questions, answers, scoring | Planned |
| 3 | Gamification — XP, levels, badges, leaderboard | Planned |
| 4 | Adaptive difficulty + topic mastery | Planned |
| 5 | UI polish — animations, audio, accessibility | Planned |
| 6 | Teacher dashboard + Google Classroom SSO | Planned |

---

## Development

> Setup instructions will be added when the application is scaffolded in Phase 1.

---

## Docs

- [Game Design Document](docs/GDD.md)
- [Tech Stack](docs/TECH-STACK.md)
- [User Testing Notes](docs/USER-TESTING.md)
- [Roadmap](ROADMAP.md)
