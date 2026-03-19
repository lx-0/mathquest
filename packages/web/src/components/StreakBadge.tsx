interface StreakBadgeProps {
  /** Current consecutive correct answer count. */
  count: number;
  /**
   * Set to true for one render cycle when the streak just increased to
   * trigger the pulse animation. Parent should reset to false after a tick.
   */
  isNew?: boolean;
}

/**
 * Displays the player's current streak with an animated pulse when the
 * streak count increases.
 *
 * Motion behaviour:
 *  - Default: animate-pulse on the badge ring when isNew=true (motion-safe).
 *  - prefers-reduced-motion: static outline replaces the pulse so the update
 *    is still visually distinct without movement (motion-reduce).
 *    Satisfies WCAG 2.3.3 / finding A9.
 *
 * Accessibility:
 *  - role="status" + aria-label expose the streak value to screen readers.
 *  - Pair with useLiveRegion().announce("Streak: N in a row!", "polite") at
 *    the call site to satisfy WCAG 4.1.3 / finding A18.
 */
export function StreakBadge({ count, isNew = false }: StreakBadgeProps) {
  return (
    <div
      role="status"
      aria-label={`Streak: ${count} in a row`}
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "bg-amber-50 text-amber-600 font-semibold text-sm",
        // Pulse ring when streak just increased — suppressed under reduced motion.
        // Outline used as a static alternative so the change is still perceivable.
        isNew
          ? "motion-safe:ring-2 motion-safe:ring-amber-400 motion-safe:animate-pulse motion-reduce:ring-2 motion-reduce:ring-amber-400"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span aria-hidden="true">🔥</span>
      <span>{count}</span>
    </div>
  );
}
