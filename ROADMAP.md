# MathQuest Roadmap

**Goal:** Build a gamified math learning platform for 6th graders.

MathQuest makes math engaging by wrapping 6th-grade curriculum content in a game loop: players earn XP, unlock badges, level up, and compete on leaderboards — all while practicing real math.

---

## Milestones

### Phase 1 — Foundation (Weeks 1–2)

Lay the groundwork. No code shipped without these done.

- [x] Game Design Document (GDD) written and approved
- [x] Technology stack evaluated and documented
- [x] Responsive-first engineering standard established (375px minimum viewport, mobile-first CSS, ≥44px tap targets) — see TECH-STACK.md
- [x] GitHub repository initialized with CI skeleton
- [x] Project structure scaffolded (monorepo: packages/web + packages/server)

**Exit criteria:** Engineers can clone, run, and see a blank canvas with routing.

---

### Phase 2 — Core Game Loop (Weeks 3–5)

The minimum thing a player can actually do: answer a math question and see a result.

- [ ] Math problem engine: generate 6th-grade problems (fractions, ratios, basic algebra, geometry)
- [ ] Answer validation: multiple-choice + numeric entry
- [ ] Session flow: start → question → answer → feedback → next question
- [ ] Basic scoring: correct/incorrect tracking per session
- [ ] Player profile: username, avatar, persistent progress store

**Exit criteria:** A student can complete a 10-question session and see their score.

---

### Phase 3 — Gamification Layer (Weeks 6–8)

Turn the game loop into something players want to return to.

- [ ] XP system: award XP per correct answer, streak bonuses
- [ ] Leveling: level up at XP thresholds with visual celebration
- [ ] Badge/achievement system: first correct answer, 5-day streak, perfect score, etc.
- [ ] Leaderboard: weekly top players by XP (class-scoped)
- [ ] Adaptive difficulty: tune question difficulty based on recent performance

**Exit criteria:** A returning player can see their level, badges, and rank.

---

### Phase 4 — Content & Curriculum (Weeks 9–10)

Breadth of content aligned to the 6th-grade math curriculum.

- [ ] Problem bank: 200+ problems across all 6th-grade domains
  - Number sense (fractions, decimals, percentages)
  - Ratios and proportional relationships
  - Basic expressions and equations
  - Geometry (area, volume, coordinate plane)
  - Statistics and probability
- [ ] Difficulty tagging on all problems (easy / medium / hard)
- [ ] Curriculum map: link problems to learning objectives

**Exit criteria:** A 4-week session can surface unique problems every day.

---

### Phase 5 — Polish & Accessibility (Weeks 11–12)

Make it good enough for real classrooms.

- [ ] UI/UX polish: animations, sound effects, visual feedback
- [ ] Accessibility audit and fixes (WCAG 2.1 AA target)
- [ ] Responsive layout audit (mobile-first standard in place since Phase 1; this sprint verifies all screens under real device testing)
- [ ] Usability testing with target-age students (at least 5 sessions)
- [ ] Performance profiling: time-to-interactive < 2s on mid-range device
- [ ] **Read-only teacher progress view** (pulled forward from Phase 6 — see Finding F4): teacher can log in and view per-student data — student names, total session count, and accuracy % per student. No assignment or content tools required; display-only.

**Exit criteria:** Passes accessibility audit; at least 3/5 usability testers can complete a session without help; teacher can view class progress without assistance.

---

### Phase 6 — Beta Launch (Week 13+)

Ship to real classrooms.

- [ ] Full teacher dashboard (assign content, review at-risk students, set timers) — read-only progress view already shipped in Phase 5
- [ ] Accounts: student login (SSO or simple username/password)
- [ ] Beta rollout to 1–2 pilot classrooms
- [ ] Feedback loop: in-app feedback widget + async interviews
- [ ] Iteration: ship weekly patches based on feedback

**Exit criteria:** At least one teacher runs MathQuest with their class for two weeks.

---

## Current Status

| Phase | Status |
|-------|--------|
| Phase 1 — Foundation | ✅ Done |
| Phase 2 — Core Game Loop | ⬜ Not Started |
| Phase 3 — Gamification | ⬜ Not Started |
| Phase 4 — Content | ⬜ Not Started |
| Phase 5 — Polish & Accessibility | ⬜ Not Started |
| Phase 6 — Beta Launch | ⬜ Not Started |

---

## Open Questions

1. **Accounts model**: SSO via Google Classroom, or simple username/password for students?
2. **Hosting**: Self-hosted or managed cloud (Vercel/Railway)?
3. **Teacher features scope**: How much teacher tooling is in v1 vs. post-launch?
4. **Content licensing**: Write problems from scratch or integrate an existing math problem API?

---

*Last updated: 2026-03-19*
