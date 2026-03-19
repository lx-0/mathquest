import { useEffect, useRef, useState } from "react";

type Props = {
  onContinue: () => void;
  /**
   * Milliseconds before the button auto-activates when no keyboard focus
   * is detected. Defaults to 2000 ms (matches GDD auto-advance spec).
   */
  autoAdvanceMs?: number;
};

/**
 * ContinueButton satisfies WCAG 2.2.1 Timing Adjustable.
 *
 * After an answer is submitted the game needs to advance to the next
 * question. The GDD specifies a 2-second auto-advance, but that violates
 * WCAG 2.2.1 because users cannot pause, extend, or disable the transition.
 *
 * This component implements the recommended fix:
 *   - Mouse/touch users: button auto-activates after `autoAdvanceMs` so
 *     the session flows without an extra click.
 *   - Keyboard / screen-reader users: as soon as a focusin event fires
 *     anywhere in the document the timer is cancelled and the user has
 *     unlimited time to activate the button themselves.
 *
 * The `aria-label` updates when the timer is cancelled so assistive
 * technology announces the changed affordance.
 */
export function ContinueButton({ onContinue, autoAdvanceMs = 2000 }: Props) {
  const [timerCancelled, setTimerCancelled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Keep a stable ref so the setTimeout closure always calls the latest prop.
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  useEffect(() => {
    // If the page already has an active focused element (other than body)
    // when this button mounts, the keyboard user is already interacting —
    // skip the auto-advance timer immediately.
    const activeEl = document.activeElement;
    if (activeEl !== null && activeEl !== document.body) {
      setTimerCancelled(true);
      return;
    }

    // Start the auto-advance timer. If focusin fires first, cancelTimer()
    // will clear it before it executes.
    timerRef.current = setTimeout(() => {
      onContinueRef.current();
    }, autoAdvanceMs);

    const cancelTimer = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setTimerCancelled(true);
      }
    };

    document.addEventListener("focusin", cancelTimer);

    return () => {
      document.removeEventListener("focusin", cancelTimer);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const label = timerCancelled
    ? "Continue to next question"
    : `Continue to next question (advancing automatically in ${autoAdvanceMs / 1000} seconds)`;

  return (
    <button
      type="button"
      onClick={onContinue}
      aria-label={label}
      className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
    >
      Continue →
    </button>
  );
}
