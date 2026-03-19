import { useEffect, useState } from "react";

/**
 * Returns true when the user has opted into prefers-reduced-motion.
 *
 * Subscribe to OS-level changes so components update immediately if the user
 * toggles the system setting while the app is open.
 *
 * WCAG 2.3.3 (AAA) — Animation from Interactions:
 * Motion triggered by interaction must be suppressible unless the animation
 * is essential to the functionality. All animated components should consume
 * this hook and branch on its return value.
 *
 * @example
 *   const reduced = usePrefersReducedMotion();
 *   // In render: className={reduced ? "opacity-100" : "animate-bounce"}
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
