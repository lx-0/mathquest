interface MasteryBarProps {
  /** Mastery percentage 0–100. Values outside this range are clamped. */
  value: number;
  /** Topic or skill name, e.g. "Fractions". Used in the accessible label. */
  topic: string;
  /** Additional Tailwind classes for the outer container. */
  className?: string;
}

/**
 * Mastery progress bar for a specific math topic/skill.
 *
 * Accessibility:
 *  - role="progressbar" with aria-valuenow, aria-valuemin=0, aria-valuemax=100
 *    satisfies WCAG 4.1.2 / finding A19.
 *  - aria-label is derived from `topic` so screen readers announce
 *    "Fractions mastery" (or similar) rather than a generic label.
 */
export function MasteryBar({ value, topic, className = "" }: MasteryBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const label = `${topic} mastery`;

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-3 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
