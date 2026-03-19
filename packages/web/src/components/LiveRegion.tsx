import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export type Politeness = "assertive" | "polite";

type Announce = (message: string, politeness?: Politeness) => void;

const LiveRegionContext = createContext<Announce | null>(null);

type RegionState = { message: string; key: number };

/**
 * LiveRegionProvider renders two visually-hidden ARIA live regions at the
 * app root — one assertive (for time-sensitive feedback like correct/incorrect)
 * and one polite (for ambient updates like XP gains and streak changes).
 *
 * WCAG 4.1.3 — Status Messages: non-focused status updates (answer feedback,
 * XP counter changes, streak updates, timer warnings) must be surfaced to
 * screen readers without moving focus. Live regions satisfy this requirement.
 *
 * Usage:
 *   1. Wrap your app with <LiveRegionProvider> (once, near the root).
 *   2. Call useLiveRegion() in any child component to get `announce`.
 *   3. announce("Correct! +20 XP", "assertive")
 *      announce("Streak: 3 in a row!", "polite")
 *
 * Implementation notes:
 *   - Both regions are always mounted (screen readers watch them from page load).
 *   - The `key` counter forces React to clear and re-set the text node, which
 *     makes screen readers re-announce even when the message text is identical
 *     (e.g., two consecutive "Correct!" announcements).
 *   - Visually hidden via an sr-only pattern (not display:none / visibility:hidden,
 *     which would silence the live region).
 */
export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [assertive, setAssertive] = useState<RegionState>({ message: "", key: 0 });
  const [polite, setPolite] = useState<RegionState>({ message: "", key: 0 });

  // Refs so the announce callback is stable across renders (no stale closure).
  const assertiveRef = useRef(assertive);
  assertiveRef.current = assertive;
  const politeRef = useRef(polite);
  politeRef.current = polite;

  const announce = useCallback<Announce>((message, politeness = "polite") => {
    if (politeness === "assertive") {
      setAssertive((prev) => ({ message, key: prev.key + 1 }));
    } else {
      setPolite((prev) => ({ message, key: prev.key + 1 }));
    }
  }, []);

  return (
    <LiveRegionContext.Provider value={announce}>
      {children}
      {/* aria-atomic="true" ensures the full message is read, not just the diff.
          Prefix keys so assertive and polite never share the same key value,
          which would cause React to treat them as the same element. */}
      <div
        key={"a" + assertive.key}
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {assertive.message}
      </div>
      <div
        key={"p" + polite.key}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {polite.message}
      </div>
    </LiveRegionContext.Provider>
  );
}

/**
 * Returns an `announce(message, politeness?)` function that sends a message
 * to the nearest LiveRegionProvider's ARIA live region.
 *
 * Must be called inside a <LiveRegionProvider> tree.
 *
 * @example
 *   const announce = useLiveRegion();
 *   // After grading an answer:
 *   announce("Correct! You earned 20 XP.", "assertive");
 *   // After updating streak:
 *   announce("Streak: 4 in a row!", "polite");
 */
export function useLiveRegion(): Announce {
  const announce = useContext(LiveRegionContext);
  if (announce === null) {
    throw new Error("useLiveRegion must be used inside a <LiveRegionProvider>");
  }
  return announce;
}
