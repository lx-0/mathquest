# User Testing — MathQuest

**Evaluation date:** 2026-03-19
**Product stage:** Phase 1 (Foundation) — no live build; evaluation is heuristic + design-spec review
**Evaluator:** CEO / UX Review
**Source:** ROADMAP.md — planned feature set and user flows

---

## Test Objectives

- Validate that planned user flows serve 6th-grade students without friction or confusion.
- Identify risks in core game loop before any code is written.
- Assess accessibility and motivational design for the target age group (11–12 year olds).
- Surface design gaps that must be resolved before Phase 2 development begins.

---

## User Personas

### Persona 1 — Alex, The Active Gamer
- **Age:** 11, 6th grade
- **Tech level:** High — plays games daily, fast learner, used to instant feedback loops
- **Goals:** Earn top leaderboard rank, unlock all badges, finish sessions quickly
- **Risks:** Low patience for unclear UI; may game the system (guess fast); leaderboard-driven

### Persona 2 — Maya, The Reluctant Learner
- **Age:** 12, 6th grade
- **Tech level:** Medium — uses apps casually, but avoids anything that feels like school
- **Goals:** Get through required practice without feeling stupid; small wins matter
- **Risks:** Easily discouraged by visible failure; public leaderboards feel threatening; needs warmth in error messaging

### Persona 3 — Ms. Carter, The Teacher
- **Age:** 34, middle school math teacher
- **Tech level:** Medium — uses Google Classroom, but not a power user
- **Goals:** Assign practice, monitor student progress, identify struggling students
- **Risks:** No teacher dashboard until Phase 6 — major gap for classroom adoption; will evaluate the platform before assigning it

---

## Test Scenarios

| # | Scenario | Persona | Steps | Success Criteria | Result |
|---|----------|---------|-------|------------------|--------|
| 1 | First-time onboarding | Maya | Open app → create account → set username/avatar → enter first session | Completes setup in <2 min without help; feels welcomed, not overwhelmed | ⚠️ At Risk — no onboarding tutorial defined in roadmap |
| 2 | Complete a 10-question session | Alex | Start session → answer 10 questions (mix of correct/incorrect) → view score | All steps reachable; session completes; score visible at end | ✅ Planned — Phase 2 exit criteria covers this |
| 3 | Earn XP and level up | Alex | Complete session → receive XP → trigger level-up threshold | XP awarded visibly; level-up celebration fires; new level persists on profile | ⚠️ At Risk — XP visual celebration not detailed; could feel hollow |
| 4 | View leaderboard | Alex + Maya | Navigate to leaderboard → see class rank | Rank is visible; context is clear (weekly, class-scoped) | ⚠️ At Risk — no opt-out or privacy control for low-ranked students |
| 5 | Resume after wrong answers | Maya | Answer 3 questions incorrectly → receive feedback → continue session | Error feedback is encouraging, not punishing; student continues without quitting | ⚠️ At Risk — feedback tone not specified in roadmap |
| 6 | Teacher reviews student progress | Ms. Carter | Log in as teacher → view class dashboard → identify a struggling student | Can see per-student progress; can act on it | ❌ Not available until Phase 6 — blocks classroom adoption |
| 7 | Accessibility check — keyboard nav | Any | Navigate entire session using keyboard only (no mouse) | All interactive elements reachable via Tab; no focus traps | ⚠️ At Risk — accessibility audit deferred to Phase 5 |
| 8 | Accessibility check — screen reader | Any | Navigate app with VoiceOver/NVDA enabled | Questions and answers announced correctly; progress communicated | ⚠️ At Risk — math rendering (fractions, equations) is notoriously screen-reader hostile |
| 9 | Mobile session completion | Maya | Open on mobile (375px viewport) → complete 10-question session | No horizontal scroll; tap targets ≥44px; session completable without pinch-zoom | ⚠️ At Risk — mobile-responsive deferred to Phase 5 |
| 10 | Adaptive difficulty perception | Alex | Complete 10 easy questions → system increases difficulty → student notices | Difficulty shift feels natural; not jarring or unexplained | ⚠️ At Risk — transparency of adaptive logic not addressed |

---

## Findings

| # | Finding | Severity | Scenario | Evidence | Recommendation |
|---|---------|----------|----------|----------|----------------|
| F1 | No onboarding tutorial planned | Major | 1 | Roadmap Phase 2 jumps straight into session start with no mention of first-run experience | Add a brief (3-step) onboarding flow: welcome + avatar selection + one practice question before the real session |
| F2 | Leaderboard risks demotivating struggling students | Major | 4 | Maya persona: public rank visibility without opt-out creates anxiety for low performers; research shows this reduces engagement for bottom-quartile students | Make leaderboard opt-in, or show "personal best" prominently alongside class rank; never show absolute rank without relative improvement context |
| F3 | Wrong-answer feedback tone undefined | Major | 5 | Roadmap specifies "correct/incorrect tracking" but no guidance on UX copy or emotional tone for failure states | Define feedback copy guidelines: no "Wrong!" language; use "Not quite — try again" with optional explanation; preserve XP for participation (not just correctness) |
| F4 | Teacher dashboard blocked until Phase 6 | Major | 6 | Teachers are the primary B2B adoption vector; they will evaluate the tool before assigning it to students; no visibility until Phase 6 means classroom pilots cannot start until Week 13+ | Add a read-only teacher progress view (student names + session counts + accuracy %) to Phase 4 or Phase 5; full dashboard can wait |
| F5 | Math rendering accessibility risk | Critical | 8 | Fractions, ratios, and equations rendered as images or MathML are commonly inaccessible to screen readers; 6th-grade curriculum requires these | Choose a math rendering library with strong accessibility support (e.g., MathJax with ARIA, or KaTeX with accessible output mode) in Phase 1 tech stack decision |
| F6 | Mobile layout deferred too long | Major | 9 | 6th graders overwhelmingly use mobile devices; Phase 5 is week 11–12; if mobile is bolted on late, it requires extensive rework | Build responsive-first from day one; specify minimum viewport (375px) in engineering standards during Phase 1 |
| F7 | Adaptive difficulty opaque to students | Minor | 10 | Students may perceive harder questions as a penalty for doing well; no transparency mechanism defined | Show a subtle "Level Up" or "Challenge Mode" indicator when difficulty increases; frame it as a reward, not a ratchet |
| F8 | XP/level-up celebration undefined | Minor | 3 | Level-up moment is a key retention hook; if the animation/sound is weak, the emotional payoff is lost | Define minimum celebration spec in GDD: particle burst + sound + modal with badge display; confirm this works on low-end devices |
| F9 | No session recovery mechanism | Minor | 2 | If a student closes the app mid-session, what happens? Roadmap doesn't address this | Define session state: partial sessions should resume or be discardable from the profile; no silent progress loss |
| F10 | Avatar selection scope undefined | Minor | 1 | Avatars are listed in the roadmap but no variety or customization scope is defined | Minimum 8 diverse avatar options at launch; avoid gendered defaults; confirm avatars do not require additional art assets not budgeted |

---

## Recommendations

Prioritized by impact on the critical path:

1. **[Phase 1] Specify math rendering library with accessible output** — F5 is Critical; if the wrong library is chosen, Phase 5 accessibility audit will require a full re-render overhaul. Decide now.
2. **[Phase 1] Establish responsive-first engineering standard** — F6 affects every screen; retrofitting at Phase 5 is expensive. Set the standard before first line of UI code.
3. **[Phase 2] Define wrong-answer feedback copy guidelines** — F3 directly impacts Maya persona retention. Write 5 feedback variants and get them into the session flow design before Phase 2 sprint.
4. **[Phase 2] Add minimal onboarding flow to Phase 2 scope** — F1 is a first-impression problem. A 3-step onboarding doesn't need a sprint; it can be part of account creation.
5. **[Phase 4–5] Pull teacher progress view forward** — F4 blocks classroom adoption pilots. Even a basic read-only view by Phase 5 unblocks the Phase 6 beta.
6. **[Phase 3] Make leaderboard opt-in or show improvement context** — F2 is a product philosophy decision that affects the gamification layer design. Decide before Phase 3 sprint.
7. **[GDD] Define XP celebration spec** — F8 should be in the Game Design Document, not discovered in Phase 5 polish.

---

## Follow-up Issues

- [ ] **Choose accessible math rendering library** — Critical (F5) — block on Phase 1 tech stack decision
- [ ] **Set responsive-first UI engineering standard** — Major (F6) — Phase 1 foundation task
- [ ] **Write wrong-answer feedback copy guidelines** — Major (F3) — input to Phase 2 session flow design
- [ ] **Design minimal onboarding flow (3-step)** — Major (F1) — add to Phase 2 scope
- [ ] **Add read-only teacher progress view to Phase 4/5** — Major (F4) — roadmap amendment needed
- [ ] **Define leaderboard privacy controls / opt-in model** — Major (F2) — GDD + Phase 3 scope
- [ ] **Define session recovery behavior** — Minor (F9) — Phase 2 engineering spec

---

*Evaluation methodology: heuristic analysis + persona-driven task flow walkthrough based on ROADMAP.md. No live product available at time of writing. Re-run full usability test with 5+ real students when Phase 2 (Core Game Loop) is complete.*
