# Game Design Document — MathQuest

## Concept

**Title:** MathQuest
**Genre:** Educational RPG / Gamified Quiz
**Platform:** Web (HTML5), mobile-responsive (375px+)
**Target Audience:** 6th graders (~11–12 years old), classroom and at-home use
**Pitch:** MathQuest is a browser-based math RPG where 6th graders answer curriculum-aligned math questions to earn XP, level up their character, unlock badges, and compete on class leaderboards. Every correct answer advances the player through a fantasy quest world; every session builds real math fluency. The game wraps Common Core 6th-grade math in a reward loop tight enough to make practicing fractions feel like playing a game — because it is.

---

## Core Mechanic

**Answer a math question, get instant feedback, earn XP.**

| Step | Detail |
| :--- | :----- |
| Input | Player selects a multiple-choice option or types a numeric answer |
| Action | Answer submitted; system validates against the correct answer |
| Feedback | Immediate visual/audio result: ✅ correct (green flash, coin sound) or ❌ incorrect (red flash, try-again tone) with brief explanation shown |
| Consequence | Correct → award XP + maintain/extend streak; Incorrect → deduct streak, show worked solution, unlock retry on next session |

Every other system (XP, levels, badges, adaptive difficulty) exists to motivate players to do this one thing more.

---

## Game Loop

### Moment-to-moment (~5–10 seconds)

1. Problem card appears (question + answer input/choices)
2. Player reads and selects/types answer
3. Submit — instant feedback with solution hint
4. XP counter animates up (or streak breaks)
5. Next problem loads

### Session Loop (~10–15 minutes)

1. **Start:** Player picks a Quest (topic/domain) or enters Daily Challenge
2. **Play:** 10 questions per session, drawn from selected domain + difficulty
3. **Streak system:** Consecutive correct answers multiply XP (×1 → ×2 → ×3)
4. **Session end:** Score screen — XP earned, accuracy %, streak peak, level progress bar
5. **Celebration:** Level-up animation or badge unlock if threshold reached
6. **CTA:** "Play again" / "Try Daily Challenge" / "View leaderboard"

### Meta Loop (multi-session)

| Driver | Mechanic |
| :----- | :------- |
| Progression | XP accumulates → level up → new character cosmetics unlocked |
| Streaks | Daily login streak → bonus XP multiplier; 5/7/30-day streak badges |
| Mastery | Per-topic mastery bars (0–100%) fill across sessions — stars awarded at 50%/75%/100% |
| Competition | Weekly class leaderboard by total XP; resets Monday. Class rank is **opt-in** — students appear anonymously by default. Personal improvement stats (weekly XP delta, accuracy trend) are always shown privately. |
| Collection | Badge cabinet — 30+ badges across accuracy, streaks, topics, and social goals |
| Challenge | Daily Challenge is the same for the whole class — sparks discussion |

---

## Mechanics

| Mechanic | Description | Introduced | Interacts with |
| :------- | :---------- | :--------- | :------------- |
| Math question | Core input loop — multiple choice or numeric entry | Phase 2 | All |
| XP award | Correct answer → base XP (10–30 depending on difficulty) | Phase 2 | Level, streak |
| Streak multiplier | N consecutive correct answers → ×2 (3 streak), ×3 (6 streak) | Phase 2 | XP, badges |
| Adaptive difficulty | After 3 correct/incorrect in a row, system shifts difficulty up/down | Phase 3 | Question pool |
| Leveling | XP thresholds → level 1–50; level displayed on profile and leaderboard | Phase 3 | Cosmetics |
| Badges | 30+ one-time achievements triggered by milestones | Phase 3 | Profile, meta loop |
| Daily Challenge | Shared 5-question set for the whole class, refreshes daily | Phase 3 | Leaderboard |
| Leaderboard | Weekly XP ranking scoped to class; resets Monday. Opt-in class rank display; anonymous by default. Always pairs rank with personal improvement context. | Phase 3 | Social loop |
| Topic mastery | Per-domain progress bar; persists across sessions | Phase 4 | Adaptive difficulty |
| Teacher progress view (read-only) | Per-student names, session counts, accuracy % — no assignment tools | Phase 5 | All |
| Teacher dashboard (full) | Assign content, set timers, review at-risk students | Phase 6 | All |

---

## Progression

### Difficulty tiers

| Tier | Label | Criteria |
| :--- | :---- | :------- |
| 1 | Easy | Single-step, whole numbers or simple fractions |
| 2 | Medium | Two-step, mixed numbers, ratios, basic expressions |
| 3 | Hard | Multi-step, word problems, geometric/statistical reasoning |

**Adaptive rule:** After 3 consecutive correct answers at the current tier, difficulty shifts up one tier. After 3 consecutive incorrect, shifts down. Floors at Tier 1; caps at Tier 3.

### XP thresholds (level up)

Level 1–10: 100 XP per level (1,000 XP total)
Level 11–25: 200 XP per level (3,000 XP total)
Level 26–50: 300 XP per level (7,500 XP total)

### Content gates

- All topics unlocked from the start (no content gating — reduces frustration for classroom use)
- Cosmetic unlocks at level milestones (avatars, profile frames)
- Badges serve as soft achievement milestones, not hard gates

---

## Win / Lose

### Session

- **Win state:** Complete all 10 questions — always possible, no fail-out. Score: 0–100%.
- **Streak break:** Incorrect answer resets streak multiplier; no XP deducted for wrong answers (penalty is lost bonus, not negative feedback).
- **Time limit:** None by default (reduces anxiety). Optional teacher-set timer per session.

### Overall

- No overall "game over" — MathQuest is an infinite progression game.
- Mastery goals: earn 3-star mastery on all 5 domains (implicit end goal for advanced students).
- Seasonal resets: leaderboard resets weekly; XP and levels are permanent.

---

## Leaderboard Privacy Model

**Decision:** Hybrid opt-in model. Rationale: public ranking without privacy controls demotivates bottom-quartile students (Finding F2, USER-TESTING.md). Personal improvement is always celebrated; class comparison is a choice, not a default.

### Core rules

1. **Personal improvement stats are always on** — every student sees their own weekly XP delta, accuracy trend, and personal best. These are private (visible only to the student).
2. **Class rank is opt-in** — students must actively enable "Show my rank on class leaderboard" in settings. Default is off.
3. **Anonymous participation** — students who have not opted in still contribute to class data but appear on the leaderboard as their avatar with a generic label (e.g., "Adventurer 🛡️"). No name, no rank number visible to peers.
4. **Rank is never shown alone** — even for opted-in students, class rank is always displayed alongside a positive improvement indicator:
   - `#4 in class · +340 XP this week`
   - Never: `#4 in class` without context.
5. **Opt-out is instant** — students can toggle off class rank display at any time from their profile settings. Takes effect immediately on the public leaderboard.
6. **Teacher visibility** — the teacher progress view (Phase 5) shows all students by name with accuracy/session data regardless of leaderboard opt-in. Privacy controls apply only to the student-facing leaderboard, not teacher reporting.

### UI spec (Phase 3)

| State | What the student sees on the leaderboard |
| :---- | :---------------------------------------- |
| Opted out (default) | Own card: personal improvement stats only, no rank number. Peers see: avatar + "Adventurer" label |
| Opted in | Own card: rank + name + XP + weekly delta. Peers see: rank + name + XP |
| First leaderboard visit | Prompt: "Want to show your rank to classmates? You can change this anytime." (Yes / Not now) |

### Rationale

- **Alex** (competitive) opts in immediately — gets the full competitive experience.
- **Maya** (reluctant) defaults to anonymous — sees her own progress, not a discouraging class rank.
- Improvement framing ("you're up +340 XP this week") applies to all students and is the primary motivational signal — rank is secondary.

---

## Controls

| Action | Mouse/Keyboard | Touch |
| :----- | :------------- | :---- |
| Select multiple choice | Click option or press 1–4 | Tap option |
| Enter numeric answer | Type in input field, press Enter | Tap field, use on-screen keypad |
| Submit answer | Enter / click Submit | Tap Submit |
| Next question | Auto-advance after 2 s, or click/tap | Same |
| Navigate menus | Click | Tap |
| Keyboard shortcut hints | Show on hover (desktop only) | Hidden on touch |

**Accessibility note:** Full keyboard navigation required. No time-based inputs that can't be paused.

---

## Art Direction

**Style:** Clean, friendly flat/vector art — not pixel art (screen reader compatibility, scalability). Think Duolingo meets a fantasy RPG map.
**Color language:**

| Color | Hex | WCAG 1.4.3 ratio | Meaning |
| :---- | :-- | :--------------- | :------ |
| Green | #16a34a | 4.56:1 ✅ | Correct answer, XP gain, success |
| Red | #dc2626 | 4.51:1 ✅ | Incorrect answer, streak break |
| Amber | #92400e | 7.05:1 ✅ | Streak active, warning (text token) |
| Blue | #1d4ed8 | 5.90:1 ✅ | Primary UI, navigation, neutral info |
| Purple | #6d28d9 | 5.15:1 ✅ | Level up, achievement unlocked |
| White/Light gray | Background, cards |

**Character:** A single player avatar — a small adventurer with a few cosmetic variants (unlocked via levels). No enemies, no combat — the "monsters" are math problems.
**References:** Duolingo (encouragement tone, streak mechanic visual), Khan Academy (clean problem card layout), Prodigy Math (fantasy RPG framing for math).

---

## Audio Direction

**Music:**
- Upbeat, looping background track during sessions (chiptune-lite style)
- Quieter ambient track on menu/profile screens
- Victory fanfare on level-up or badge unlock (3–5 seconds)

**SFX:**

| Event | Sound |
| :---- | :---- |
| Correct answer | Short positive chime (coin collect style) |
| Incorrect answer | Soft low tone (not harsh — minimize negative emotion) |
| Streak hit | Ascending sparkle sequence |
| Streak break | Single soft "whoosh" |
| Level up | 3-note fanfare |
| Badge unlock | 2-note chime + badge pop animation |
| Button click | Subtle click tick |

**Accessibility:** All audio is optional. UI responds fully without sound. Provide mute toggle on every screen.

---

## Tuning Parameters

### Player

| Parameter | Default | Range | Affects |
| :-------- | :------ | :---- | :------ |
| `XP_BASE_EASY` | 10 | 5–20 | XP per correct easy answer |
| `XP_BASE_MEDIUM` | 20 | 10–35 | XP per correct medium answer |
| `XP_BASE_HARD` | 30 | 15–50 | XP per correct hard answer |
| `STREAK_MULTIPLIER_2` | 1.5× | 1.25–2.0× | XP multiplier at streak ≥ 3 |
| `STREAK_MULTIPLIER_3` | 2.0× | 1.5–3.0× | XP multiplier at streak ≥ 6 |
| `SESSION_QUESTION_COUNT` | 10 | 5–20 | Questions per session |
| `DAILY_CHALLENGE_COUNT` | 5 | 3–10 | Questions in daily challenge |

### Adaptive Difficulty

| Parameter | Default | Range | Affects |
| :-------- | :------ | :---- | :------ |
| `ADAPT_UP_THRESHOLD` | 3 | 2–5 | Consecutive correct to shift difficulty up |
| `ADAPT_DOWN_THRESHOLD` | 3 | 2–5 | Consecutive incorrect to shift difficulty down |
| `DIFFICULTY_MIN` | 1 | 1 | Floor tier |
| `DIFFICULTY_MAX` | 3 | 3 | Ceiling tier |

### Leveling Economy

| Parameter | Default | Range | Affects |
| :-------- | :------ | :---- | :------ |
| `XP_PER_LEVEL_EARLY` | 100 | 50–200 | XP to level up, levels 1–10 |
| `XP_PER_LEVEL_MID` | 200 | 100–400 | XP to level up, levels 11–25 |
| `XP_PER_LEVEL_LATE` | 300 | 150–600 | XP to level up, levels 26–50 |
| `DAILY_STREAK_BONUS_XP` | 25 | 10–50 | Bonus XP for logging in consecutive days |
| `PERFECT_SESSION_BONUS_XP` | 50 | 25–100 | Bonus XP for 100% session accuracy |

---

## Math Curriculum Scope (6th Grade)

| Domain | Topics | Problem Count (target) |
| :----- | :------ | :-------------------- |
| Number Sense | Fractions, decimals, percentages, absolute value | 50 |
| Ratios & Proportional Relationships | Unit rates, percent change, scale | 40 |
| Expressions & Equations | One-variable expressions, simple equations | 40 |
| Geometry | Area/volume of standard shapes, coordinate plane | 40 |
| Statistics & Probability | Mean/median/mode, basic probability, data displays | 30 |

**Total target:** 200+ problems, difficulty-tagged, curriculum-mapped.

---

## Open Questions

1. **Math rendering:** MathJax vs KaTeX for equation display (tracked in MAT-18).
2. **Accounts:** Google Classroom SSO vs simple username/password (decision needed before Phase 6).
3. **Hosting:** Vercel (frontend) + Railway (backend) is the lean default; confirm before Phase 2.
4. **Content licensing:** Write problems in-house vs. integrate a math problem API.
5. **Teacher features:** Read-only progress view (student names, session counts, accuracy %) ships in Phase 5. Full assignment/content dashboard ships in Phase 6.

---

*Last updated: 2026-03-19 — Leaderboard privacy model defined (MAT-23)*
