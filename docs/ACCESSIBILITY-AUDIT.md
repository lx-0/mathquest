# Accessibility Audit — MathQuest

**Audit date:** 2026-03-19
**Auditor:** Engineer
**Product stage:** Phase 1 (Foundation) — no live code; audit is design-spec and planned-architecture review
**Standard:** WCAG 2.2 Level AA (minimum target per skill guidelines)
**Source documents:** GDD.md, TECH-STACK.md, USER-TESTING.md, ROADMAP.md

---

## Executive Summary

MathQuest has made several strong accessibility decisions early (KaTeX with MathML output, responsive-first at 375px, keyboard nav in the GDD controls spec). However, the planned color palette has **widespread contrast failures** across all six semantic colors, auto-advance creates a **timing violation**, and several game-state events (XP updates, level-up, feedback) lack specified screen-reader announcements. These must be addressed at implementation time — retrofitting color and live-region architecture is significantly more expensive in later phases.

**Finding counts:** 3 Critical · 5 Major · 4 Minor

---

## 1. Semantic HTML

### Status: At Risk (no code yet — risks identified for implementation)

| Sub-area | Assessment | Severity |
|---|---|---|
| Landmark regions | Not yet defined in design spec — must include `<header>`, `<main>`, `<nav>`, `<footer>` on every screen | Major |
| Heading hierarchy | Not specified — risk of flat `<h1>` + `<div>` structure in component code | Major |
| Problem card markup | Must use `<fieldset>` + `<legend>` for multiple-choice groups; `<label>` for numeric input | Critical |
| Session score screen | Score percentage, XP earned, and streak peak must be in semantic content, not CSS-only display | Minor |
| Avatar selection | Radio button group — requires `<fieldset>` + `<legend>` "Choose your avatar" | Major |

**Recommendations:**
- Define HTML landmark structure in a layout component before any screens are built.
- The `QuestionCard` component must use `<fieldset>`/`<legend>` for multiple-choice options. Screen readers announce the question as part of each answer option this way, which is essential for math questions.
- Enforce heading hierarchy in a shared `Typography` component (e.g., `<h1>` = screen title, `<h2>` = section, `<h3>` = card title).

---

## 2. Keyboard Navigation

### Status: Partially Addressed — gaps remain

The GDD controls spec explicitly requires full keyboard navigation and maps keys 1–4 for multiple-choice and Enter for submit. That's a good foundation.

| Sub-area | Assessment | Severity |
|---|---|---|
| Multiple-choice (keys 1–4) | Specified in GDD — implement with radio buttons (native keyboard support) | ✅ Planned |
| Numeric input | Tab to field, Enter to submit — covered by native `<input type="number">` behavior | ✅ Planned |
| Auto-advance (2 s) | **WCAG 2.2.1 violation** — users must be able to pause, extend, or disable timed transitions. 2-second auto-advance with no pause mechanism fails AA. | **Critical** |
| Focus management on question transitions | Not specified — when a new question loads, focus must move to the question/problem card, not reset to `<body>` | **Critical** |
| Keyboard shortcut hints | GDD: "show on hover (desktop only), hidden on touch" — hover-only is inaccessible; use `focus` in addition to `hover` | Major |
| Focus visibility | Not specified — must have visible `:focus-visible` indicator; Tailwind's default `outline-none` utility must not be applied to interactive elements | Major |
| Leaderboard navigation | Table must be keyboard-navigable; sortable columns (if any) must be operable via keyboard | Minor |
| Badge/achievement modals | Modal must trap focus while open; Escape must close; focus must return to trigger on close | Major |

**Recommendations:**
- Replace auto-advance with a "Continue" button that auto-activates after 2 s *unless* the user has keyboard focus on the page (use `document.activeElement` check) OR add a visible "Pause" control per WCAG 2.2.1.
- On question transition, call `element.focus()` on the question container (with `tabIndex="-1"`) after render.
- Add `:focus-visible` ring styles to the Tailwind base layer — do not use `outline-none` without a replacement.

---

## 3. Color and Contrast

### Status: **Critical — full palette fails WCAG AA**

The GDD defines six semantic colors. All six fail WCAG 2.2 SC 1.4.3 (4.5:1 for normal text on white) and several fail 3:1 for large text.

| Color | Hex | Use | Contrast on #fff | WCAG AA (4.5:1) | WCAG AA Large (3:1) |
|---|---|---|---|---|---|
| Green | `#22c55e` | Correct answer, success | **2.24:1** | ❌ Fail | ❌ Fail |
| Red | `#ef4444` | Incorrect answer, streak break | **3.68:1** | ❌ Fail | ✅ Pass (large only) |
| Amber | `#f59e0b` | Streak active, warning | **2.10:1** | ❌ Fail | ❌ Fail |
| Blue | `#3b82f6` | Primary UI, navigation | **3.42:1** | ❌ Fail | ✅ Pass (large only) |
| Purple | `#8b5cf6` | Level up, achievement | **4.06:1** | ❌ Fail | ✅ Pass (large only) |
| Light gray | `#f3f4f6` (est.) | Background | N/A | — | — |

*Contrast ratios calculated against white (`#ffffff`) background using WCAG relative luminance formula.*

**Additional issue:** Correct/incorrect feedback uses color alone (green flash vs. red flash). WCAG 1.4.1 requires that information conveyed by color also be available through another means (text, icon, pattern).

**Recommendations (all Critical):**
- Darken semantic colors to pass 4.5:1 on white backgrounds. Suggested WCAG-passing replacements:
  - Green: `#16a34a` (Tailwind `green-700`) → ~4.56:1 ✅
  - Red: `#dc2626` (Tailwind `red-600`) → ~4.51:1 ✅
  - Amber: Use text on amber background, or `#92400e` (Tailwind `amber-800`) for text → ~7.05:1 ✅
  - Blue: `#1d4ed8` (Tailwind `blue-700`) → ~5.90:1 ✅
  - Purple: `#6d28d9` (Tailwind `violet-700`) → ~5.15:1 ✅
- For correct/incorrect feedback: pair the color flash with an icon (✓ / ✗) AND text ("Correct!" / "Not quite"). Both icon and text must have accessible labels.
- Define a `semantic-colors.css` (or Tailwind `extend.colors`) token file before any UI work begins so all components draw from the accessible palette.

---

## 4. ARIA Usage

### Status: Partially Addressed — live regions unspecified

KaTeX with `output: "htmlAndMathml"` mode was chosen specifically for accessibility (USER-TESTING.md F5, TECH-STACK.md rationale). This is the correct decision and directly addresses the Critical finding from user testing.

| Sub-area | Assessment | Severity |
|---|---|---|
| KaTeX MathML output | `htmlAndMathml` mode specified in TECH-STACK.md — emits MathML for VoiceOver/NVDA | ✅ Addressed |
| XP counter animation | Animated XP increment (step 4 of moment-to-moment loop) — no `aria-live` region specified; screen readers will not announce the change | **Critical** |
| Level-up event | Level-up modal must include `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title | Major |
| Badge unlock | Same as level-up — modal pattern needed | Major |
| Feedback after answer | Correct/incorrect feedback must be announced; use `aria-live="assertive"` region that updates on answer submission | **Critical** |
| Streak counter | Streak number changes — specify `aria-live="polite"` for this region | Minor |
| Progress bars (mastery, XP) | Must have `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and a visible/accessible label | Major |
| Session score screen | Score should be announced on screen load; use `aria-live` or `autoFocus` on score heading | Minor |
| Leaderboard table | Standard `<table>` with `<caption>` and `<th scope="col">` headers required | Minor |
| Timer (teacher-set) | If a countdown timer is shown, it must have an `aria-live="polite"` region that announces at intervals (e.g., "1 minute remaining") | Major |

**Recommendations:**
- Create a shared `<LiveRegion>` React component with `aria-live="polite"` for non-urgent updates (XP, streak) and `aria-live="assertive"` for critical feedback (correct/incorrect, timer warnings). All game state event emitters should write through this component.
- Define a `<Modal>` base component with correct ARIA pattern (dialog, focus trap, Escape handler) before building level-up, badge, and settings modals.
- Add `aria-label` to KaTeX render wrapper so the math expression context is announced: e.g., `<span aria-label="Math expression: three-fifths plus one-third equals what">`.

---

## 5. Images and Media

### Status: At Risk — not yet specified in detail

| Sub-area | Assessment | Severity |
|---|---|---|
| Player avatars | Avatars used in profile and leaderboard — must have `alt` text describing the avatar | Major |
| Badge icons | 30+ badges — each must have descriptive `alt` text (e.g., `alt="5-Day Streak badge"`) | Major |
| Background music | Auto-playing background music — WCAG 1.4.2 requires an audio control to stop/mute within 3 seconds | **Critical** |
| Victory fanfare | Short audio events (3–5s) on level-up — acceptable per WCAG 1.4.2 (under 3s), but mute toggle must remain accessible | Minor |
| Mute toggle | GDD specifies mute toggle on every screen — correct decision; must be keyboard-accessible and have visible label | ✅ Planned |
| UI icons (decorative) | Any purely decorative icons must use `aria-hidden="true"` | Minor |
| Streak flame / XP icons | Convey game state — must have `aria-label` or accompanying visible text | Minor |

**Recommendations:**
- Background music must not auto-play on page load per WCAG 1.4.2. Require user interaction to start (click/tap "Start Session") and expose a persistent mute button in the header from the first screen.
- Create an `AvatarImage` component that enforces `alt` prop.
- Create a `BadgeIcon` component that takes a `name` prop and generates consistent `alt` text.

---

## 6. Forms

### Status: At Risk — implementation-time risk

| Sub-area | Assessment | Severity |
|---|---|---|
| Multiple-choice answers | Must use `<fieldset>` + `<legend>` (question text) + `<input type="radio">` with `<label>` for each option | **Critical** |
| Numeric answer input | Must have a visible `<label>` (e.g., "Your answer") and `aria-describedby` linking to question context | **Critical** |
| Submit button | Must be a `<button type="submit">` or `<input type="submit">` — not a `<div onClick>` | Major |
| Required field indicators | Asterisks must include accessible text (e.g., `<span aria-hidden="true">*</span><span class="sr-only"> (required)</span>`) | Minor |
| Error messages | Input validation errors (non-numeric entry, blank submit) must be associated with `aria-describedby` | Major |
| Account creation form | Username, password fields must have `<label>` and meeting WCAG 1.3.5 (Identify Input Purpose) | Major |

---

## 7. Responsive Design and Zoom

### Status: Strongly Addressed

The responsive-first engineering standard (TECH-STACK.md) directly addresses WCAG 1.4.4 (Resize Text) and 1.4.10 (Reflow):

| Sub-area | Assessment | Severity |
|---|---|---|
| Minimum viewport (375px) | Established as a Phase 1 standard — ✅ | ✅ Addressed |
| Base font size ≥ 16px | Specified in TECH-STACK.md (prevents iOS auto-zoom) — ✅ | ✅ Addressed |
| Tap targets ≥ 44×44px | Specified in TECH-STACK.md (WCAG 2.5.5) — ✅ | ✅ Addressed |
| No horizontal scroll at 320px | Not explicitly tested at 320px (only 375px) — WCAG 1.4.10 requires reflow at 320px CSS width | Minor |
| Viewport meta tag | Specified in TECH-STACK.md — ✅ | ✅ Addressed |
| Relative font units | Specified (rem/em) — ✅ | ✅ Addressed |
| 200% zoom | Not addressed — content must remain functional at 200% browser zoom | Minor |
| `prefers-reduced-motion` | Not addressed — level-up animations, XP counter animation, badge pop must respect this media query | **Critical** |

**Recommendations:**
- Add `@media (prefers-reduced-motion: reduce)` handling to all CSS animations. Use Tailwind's `motion-safe:` and `motion-reduce:` variants. This is especially important for the level-up particle burst.
- Extend Playwright viewport config to include 320px to validate WCAG 1.4.10 reflow.
- Test at 200% zoom in Playwright config (`deviceScaleFactor: 2`).

---

## 8. Game-Specific Accessibility Concerns

These concerns are specific to the MathQuest game loop and do not map directly to a single WCAG criterion.

### 8.1 Cognitive Accessibility (Age-Appropriate)

Target audience is 11–12 year olds, including students with learning disabilities (dyslexia, ADHD, dyscalculia):

| Concern | Recommendation | Severity |
|---|---|---|
| Dense math notation | KaTeX MathML helps screen readers; also use plain-language question phrasing alongside notation where possible | Minor |
| Time pressure (teacher timer) | Timer countdown must be visually prominent AND announced via `aria-live`; option to disable timer should be easy to find | Major |
| Error messaging tone | Confirmed by USER-TESTING.md F3 — use encouraging copy, never penalizing | ✅ Addressed (F3 recommendation accepted) |
| Session length | 10-question sessions (5–10 min) are reasonable for attention spans; no changes needed | ✅ OK |

### 8.2 Leaderboard Privacy (Emotional Safety)

The hybrid opt-in leaderboard model (GDD, Leaderboard Privacy section) is the correct accessibility-adjacent decision. Students with anxiety or learning difficulties should not be exposed to discouraging rank visibility by default. This is already addressed in the GDD.

---

## Findings Summary

| ID | Area | Finding | Severity | WCAG Criterion |
|---|---|---|---|---|
| A1 | Color | All 5 semantic colors fail 4.5:1 contrast on white | **Critical** | 1.4.3 |
| A2 | Forms | Multiple-choice must use `fieldset`/`legend`/`radio` pattern | **Critical** | 1.3.1, 4.1.2 |
| A3 | Forms | Numeric answer input must have associated `<label>` | **Critical** | 1.3.1, 4.1.2 |
| A4 | Keyboard | 2-second auto-advance with no pause mechanism | **Critical** | 2.2.1 |
| A5 | Keyboard | Focus not managed on question transition | **Critical** | 2.4.3 |
| A6 | ARIA | Answer feedback not announced to screen readers | **Critical** | 4.1.3 |
| A7 | ARIA | XP counter animation not announced | **Critical** | 4.1.3 |
| A8 | Media | Background music auto-play violates WCAG 1.4.2 | **Critical** | 1.4.2 |
| A9 | Motion | `prefers-reduced-motion` not addressed for animations | **Critical** | 2.3.3 |
| A10 | Semantic HTML | Landmark regions not specified in layout design | Major | 1.3.1, 2.4.1 |
| A11 | Semantic HTML | Heading hierarchy not specified | Major | 1.3.1 |
| A12 | Semantic HTML | Avatar selection requires `fieldset`/`legend` | Major | 1.3.1 |
| A13 | Keyboard | Focus indicators not specified (risk of `outline-none`) | Major | 2.4.7 |
| A14 | Keyboard | Keyboard shortcut hints hover-only | Major | 2.1.1 |
| A15 | Keyboard | Badge/level-up modals need focus trap + Escape handler | Major | 2.1.2 |
| A16 | Color | Correct/incorrect feedback conveyed by color alone | Major | 1.4.1 |
| A17 | ARIA | Level-up and badge modals lack `role="dialog"` pattern | Major | 4.1.2 |
| A18 | ARIA | `aria-live` regions not specified for streak/XP | Major | 4.1.3 |
| A19 | ARIA | Progress bars missing ARIA roles and values | Major | 4.1.2 |
| A20 | ARIA | Teacher timer not announced via `aria-live` | Major | 2.2.1, 4.1.3 |
| A21 | Images | Avatar `alt` text not specified | Major | 1.1.1 |
| A22 | Images | Badge `alt` text not specified | Major | 1.1.1 |
| A23 | Forms | Submit must be `<button>` not `<div onClick>` | Major | 4.1.2 |
| A24 | Forms | Account creation form inputs need `<label>` and autocomplete | Major | 1.3.5 |
| A25 | Responsive | 320px reflow not tested | Minor | 1.4.10 |
| A26 | Responsive | 200% zoom not tested | Minor | 1.4.4 |
| A27 | Cognitive | Dense math notation — consider plain-language phrasing | Minor | 3.1.5 |
| A28 | ARIA | Leaderboard table needs `<caption>` and `<th scope>` | Minor | 1.3.1 |
| A29 | ARIA | Streak counter needs `aria-live="polite"` | Minor | 4.1.3 |
| A30 | ARIA | Score screen should announce on load | Minor | 4.1.3 |
| A31 | Images | Decorative icons must use `aria-hidden="true"` | Minor | 1.1.1 |
| A32 | Images | Short audio events (badge, level-up) — mute toggle must remain accessible | Minor | 1.4.2 |

---

## Remediation Plan

### Before Phase 2 begins (Foundation blockers)

These must be resolved before any game UI is implemented. Fixing them later requires rewriting components.

1. **[A1] Fix color palette** — Replace the 5 semantic colors with WCAG-passing variants. Update the GDD color table and define a `tailwind.config.ts` `extend.colors` block with accessible tokens. All UI code must use these tokens.

2. **[A2, A3, A23] Define canonical form component patterns** — Document the `QuestionCard` HTML pattern (fieldset/legend/radio for multiple choice; labeled input for numeric). Enforce at code review. Do not allow `<div onClick>` submit buttons.

3. **[A4] Resolve auto-advance timing** — Remove the 2-second auto-advance or add an accessible pause/extend mechanism. Recommend: show "Continue →" button that auto-activates after 2 s unless the user has keyboard focus in the window (debounced `focusin` check).

4. **[A8] Remove audio auto-play** — Background music must start only after user interaction. The "Start Session" button tap/click triggers it. Implement with a React context that gates `Audio.play()` behind a user gesture.

5. **[A9] Add `prefers-reduced-motion` support** — Add Tailwind `motion-safe:` / `motion-reduce:` classes from the first animated component. Define this as a code review gate item in TECH-STACK.md.

### During Phase 2 (Core Game Loop)

1. **[A5, A13, A14] Focus management and keyboard polish** — Manage focus on question transitions; add `:focus-visible` ring styles to base layer; show keyboard shortcut hints on `focus` as well as `hover`.

2. **[A6, A7, A18, A20] Build `<LiveRegion>` component** — Single component that accepts `message`, `politeness`, and `key` props. All game events (XP, feedback, streak, timer) write through it.

3. **[A16] Pair color feedback with text and icon** — "Correct!" / "Not quite" text must appear alongside green/red flash. Both `<span aria-hidden="true">✓</span>` icon and visible copy required.

4. **[A10, A11] Implement semantic layout** — Build `AppLayout` component with correct landmark HTML structure. Establish heading hierarchy in the design system.

### During Phase 3 (Gamification Layer)

1. **[A15, A17] Accessible modal pattern** — Before building level-up, badge, and leaderboard modals, create a `<Modal>` base component with focus trap, `role="dialog"`, `aria-modal`, `aria-labelledby`, and Escape key close.

2. **[A19] Accessible progress bars** — `XPBar`, `MasteryBar` components must include `role="progressbar"` with correct ARIA value attributes.

3. **[A28] Accessible leaderboard table** — Use semantic `<table>` with `<caption>`, `<thead>`, `<th scope="col">`.

4. **[A21, A22, A31] Media accessibility sweep** — Define `AvatarImage` and `BadgeIcon` components with enforced `alt` patterns before they are used.

### During Phase 5 (Polish and Accessibility)

1. Full automated audit pass with `axe-core` (via `@axe-core/react` in dev mode and in Vitest component tests).
2. Manual keyboard-only test: navigate entire session without mouse.
3. VoiceOver (macOS/iOS) test: complete a 10-question session.
4. NVDA (Windows) test: complete a 10-question session.
5. 200% zoom test at 375px and 1280px viewports.
6. 320px reflow test.
7. `prefers-reduced-motion` test — disable all animations and verify session is completable.
8. Verify all Critical and Major findings from this audit are resolved before marking Phase 5 complete.

---

## Tools and Testing Approach

| Tool | Use | When |
|---|---|---|
| `@axe-core/react` | Dev overlay — catches violations during development | Phase 2 onward (dev build only) |
| `vitest` + `@testing-library/react` | Component-level ARIA tests (e.g., assert `role="radio"` on options) | Phase 2 onward |
| Playwright `accessibility` snapshot | CI accessibility regression — run against all page routes | Phase 2 onward |
| WebAIM Contrast Checker | Validate palette before any UI is built | Phase 1 (now) |
| VoiceOver (macOS) | Manual screen reader QA | Phase 5 |
| NVDA (Windows) | Manual screen reader QA | Phase 5 |
| Keyboard-only session | Manual keyboard QA | Phase 5 |

**Recommended CI gate:** Add `axe` rule violations (severity `critical` and `serious`) as a Playwright test failure. This prevents regressions from merging.

---

## Follow-up Issues Required

Per skill guidelines, follow-up issues must be created for all Critical and Major findings.

| Issue Title | Severity | Phase |
|---|---|---|
| Fix WCAG color palette — all 5 semantic colors fail contrast | Critical | Phase 1 |
| Define accessible QuestionCard HTML pattern (fieldset/legend/radio) | Critical | Phase 1 |
| Resolve auto-advance timing violation (WCAG 2.2.1) | Critical | Phase 1/2 |
| Remove background music auto-play (WCAG 1.4.2) | Critical | Phase 2 |
| Add prefers-reduced-motion support to all animations | Critical | Phase 2 |
| Build shared LiveRegion component for screen-reader announcements | Critical | Phase 2 |
| Implement focus management on question transitions | Critical | Phase 2 |
| Add semantic landmark HTML structure to AppLayout | Major | Phase 2 |
| Define focus indicator styles in Tailwind base layer | Major | Phase 2 |
| Build accessible Modal base component (dialog/focus trap) | Major | Phase 3 |
| Add ARIA roles/values to XPBar and MasteryBar progress bars | Major | Phase 3 |
| Define AvatarImage and BadgeIcon with enforced alt patterns | Major | Phase 3 |

---

*Audit methodology: heuristic analysis of GDD.md, TECH-STACK.md, USER-TESTING.md, and ROADMAP.md against WCAG 2.2 Level AA criteria. No live code was available at time of audit. Contrast ratios calculated using the WCAG relative luminance formula against a white (#ffffff) background. Re-run a full automated + manual audit at Phase 5 exit.*
