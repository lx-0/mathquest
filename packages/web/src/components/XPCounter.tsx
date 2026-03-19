import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface XPCounterProps {
  /** Current total XP value to display. */
  value: number;
  /** Duration of the count-up animation in ms. Ignored under reduced motion. */
  duration?: number;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animated XP counter that counts up from the previous value to the new value.
 *
 * Motion behaviour:
 *  - Default: smooth count-up animation over `duration` ms (motion-safe).
 *  - prefers-reduced-motion: shows the final value immediately, no step
 *    animation (motion-reduce). Satisfies WCAG 2.3.3 / finding A9.
 *
 * Accessibility:
 *  - aria-label always reflects the final value so screen readers announce
 *    the correct number regardless of animation state.
 *  - Pair with useLiveRegion().announce("+20 XP", "polite") at the call site
 *    to satisfy WCAG 4.1.3 / finding A7.
 */
export function XPCounter({ value, duration = 600 }: XPCounterProps) {
  const [displayed, setDisplayed] = useState(value);
  const prevValueRef = useRef(value);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const from = prevValueRef.current;
    prevValueRef.current = value;

    // Skip animation if user prefers reduced motion or value unchanged.
    if (reduced || from === value) {
      setDisplayed(value);
      return;
    }

    const STEPS = 20;
    const stepMs = duration / STEPS;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const progress = easeOut(step / STEPS);
      setDisplayed(Math.round(from + (value - from) * progress));
      if (step >= STEPS) clearInterval(timer);
    }, stepMs);

    return () => clearInterval(timer);
  }, [value, duration, reduced]);

  return (
    <span
      className="tabular-nums font-bold"
      aria-label={`${value} XP`}
      aria-live="off"
    >
      {displayed}
    </span>
  );
}
