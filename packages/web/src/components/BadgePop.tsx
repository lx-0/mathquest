interface BadgePopProps {
  /** Display name shown beneath the badge icon. */
  label: string;
  /** Emoji or text icon representing the badge. */
  icon: string;
  /**
   * When true the pop-in animation plays. Set to true on first mount when
   * a badge is newly unlocked; leave false for static display (e.g. badge
   * collection screen).
   */
  animate?: boolean;
}

/**
 * Badge unlock component with a pop-in entrance animation.
 *
 * Motion behaviour:
 *  - Default: bounce + scale-in keyframe via motion-safe:animate-bounce so
 *    the badge draws attention on unlock (motion-safe).
 *  - prefers-reduced-motion: motion-safe animation is skipped; the component
 *    simply appears. No movement, no flash. Satisfies WCAG 2.3.3 / finding A9.
 *
 * Accessibility:
 *  - role="img" + aria-label expose the badge name to screen readers.
 *  - The decorative icon is aria-hidden.
 *  - Pair with useLiveRegion().announce("Badge unlocked: {label}", "polite")
 *    at the call site to satisfy WCAG 4.1.3 / finding A15.
 */
export function BadgePop({ label, icon, animate = false }: BadgePopProps) {
  return (
    <div
      role="img"
      aria-label={`Badge: ${label}`}
      className={[
        "inline-flex flex-col items-center gap-2 rounded-2xl p-5",
        "bg-violet-50 text-violet-700",
        // Bounce animation only for users without reduced-motion preference.
        animate ? "motion-safe:animate-bounce" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="text-5xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-semibold text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
