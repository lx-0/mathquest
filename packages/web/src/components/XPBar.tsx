interface XPBarProps {
  /** Current XP amount toward the next level. */
  value: number;
  /** XP required to reach the next level. */
  max: number;
  /** Human-readable label, e.g. "Level 3 progress". Defaults to "XP progress". */
  label?: string;
  /** Additional Tailwind classes for the outer container. */
  className?: string;
}

/**
 * XP progress bar.
 *
 * Accessibility:
 *  - role="progressbar" with aria-valuenow, aria-valuemin=0, aria-valuemax
 *    satisfies WCAG 4.1.2 / finding A19.
 *  - aria-label provides an accessible name so screen readers announce both
 *    the label and current progress fraction.
 */
export function XPBar({ value, max, label = "XP progress", className = "" }: XPBarProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const pct = max > 0 ? (clamped / max) * 100 : 0;

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
