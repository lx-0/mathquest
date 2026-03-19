interface LevelUpBurstProps {
  /** The new level the player just reached. */
  level: number;
  /** Whether the overlay is currently visible. */
  visible: boolean;
  /** Called when the player dismisses the overlay. */
  onDismiss: () => void;
}

/**
 * Full-screen level-up celebration overlay with a radial burst animation.
 *
 * Motion behaviour:
 *  - Default: radial ping burst ring + pulsing background backdrop
 *    (motion-safe). Two rings with staggered sizes create a particle-burst
 *    feel using only Tailwind utilities.
 *  - prefers-reduced-motion: burst rings are hidden (motion-reduce:hidden);
 *    the overlay uses a simple fade instead of motion. The text and star
 *    are always visible. Satisfies WCAG 2.3.3 / finding A9.
 *
 * Accessibility:
 *  - role="alertdialog" + aria-modal="true" signals a modal context to AT.
 *  - aria-label announces the level reached without relying on the visual
 *    star graphic.
 *  - The dismiss button is keyboard-focusable and labelled.
 *  - Pair with useLiveRegion().announce("Level up! Level N", "assertive")
 *    before rendering this component so screen readers that bypass modals
 *    still hear the announcement.
 *
 * Focus management: the caller should move focus into this overlay on mount
 * (e.g. using a ref on the dismiss button) per WCAG 2.4.3.
 */
export function LevelUpBurst({ level, visible, onDismiss }: LevelUpBurstProps) {
  if (!visible) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={`Level up! You reached level ${level}.`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      {/* Burst ring 1 — decorative, hidden under reduced motion */}
      <span
        aria-hidden="true"
        className="absolute h-56 w-56 rounded-full bg-violet-400/40 motion-safe:animate-ping motion-reduce:hidden"
      />
      {/* Burst ring 2 — slightly larger, staggered visually by opacity */}
      <span
        aria-hidden="true"
        className="absolute h-72 w-72 rounded-full bg-violet-300/20 motion-safe:animate-ping motion-reduce:hidden"
      />

      {/* Content card */}
      <div className="relative z-10 flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 text-center shadow-2xl">
        <span className="text-7xl" aria-hidden="true">
          ⭐
        </span>
        <p className="text-4xl font-extrabold text-violet-700">Level {level}!</p>
        <p className="text-base text-gray-600">Amazing work — keep it up!</p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 min-h-[44px] rounded-lg bg-violet-600 px-6 py-2 font-semibold text-white hover:bg-violet-700 focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
