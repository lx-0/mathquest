interface BadgeIconProps {
  /**
   * Emoji or text representing the badge icon.
   * The game has 30+ distinct badge icons so every one must carry a name.
   */
  icon: string;
  /**
   * Human-readable badge name announced to screen readers (WCAG 1.1.1 / A22).
   * Required — TypeScript enforces that callers always supply a label so no
   * badge icon can ever be rendered without accessible text.
   * Example: "Speed Demon", "First Steps", "Perfect Score".
   *
   * For intentionally decorative icons (e.g. a repeated visual flourish with
   * no semantic meaning), pass `name=""` and set `decorative={true}` so the
   * intent is explicit in code rather than silently omitted.
   */
  name: string;
  /**
   * When `true` the icon is considered decorative and rendered with
   * `aria-hidden="true"` — the `name` prop is still required so the decision
   * is always documented at the call site (WCAG 1.1.1 / A31).
   */
  decorative?: boolean;
  /** Additional Tailwind classes for the icon span. */
  className?: string;
}

/**
 * Single badge icon with enforced accessible name.
 *
 * Accessibility:
 *  - Non-decorative: wraps the icon in a `role="img"` span with `aria-label`
 *    set to `name`. Screen readers announce e.g. "Speed Demon, image".
 *  - Decorative (`decorative={true}`): renders `aria-hidden="true"` so the
 *    icon is invisible to assistive tech. The `name` prop is still required to
 *    document the intent and simplify future audits.
 *  - Satisfies WCAG 1.1.1 findings A22 and A31.
 */
export function BadgeIcon({ icon, name, decorative = false, className = "" }: BadgeIconProps) {
  const cls = ["text-3xl", className].filter(Boolean).join(" ");

  if (decorative) {
    return (
      <span aria-hidden="true" className={cls}>
        {icon}
      </span>
    );
  }

  return (
    <span role="img" aria-label={name} className={cls}>
      {icon}
    </span>
  );
}
