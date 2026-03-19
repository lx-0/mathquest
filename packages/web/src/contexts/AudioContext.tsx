import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * AudioContext — WCAG 1.4.2 Audio Control
 *
 * SC 1.4.2 prohibits audio that auto-plays for more than 3 seconds unless the
 * user can pause/stop it or control the volume independently of the system.
 *
 * This context enforces two rules:
 *   1. Gesture gate — Audio.play() is only called after a user interaction
 *      (pointerdown or keydown). Browsers also require a gesture for
 *      Web Audio / HTMLAudioElement.play(), so this aligns with platform policy.
 *   2. Mute toggle — `muted` state and `toggleMute` are available globally so
 *      any component can expose a keyboard-accessible mute control.
 *
 * Usage:
 *   1. Wrap your app with <AudioProvider> (once, near the root).
 *   2. Call useAudio() in any child component.
 *   3. Call play(ref) to start audio only after user interaction.
 *   4. Render <MuteButton /> on every screen.
 *
 * @example
 *   const { play, muted, toggleMute } = useAudio();
 *   // When the user clicks "Start Session":
 *   play(backgroundMusicRef);
 */

interface AudioContextValue {
  /** Whether the user has performed at least one pointer or keyboard interaction. */
  userHasInteracted: boolean;
  /** Whether all audio is muted by user choice. */
  muted: boolean;
  /** Toggle the global mute state. */
  toggleMute: () => void;
  /**
   * Play an HTMLAudioElement.
   * No-ops if the user has not yet interacted or if audio is muted.
   * Returns false if playback was suppressed, true if play() was called.
   */
  play: (audio: HTMLAudioElement | null) => boolean;
  /**
   * Pause an HTMLAudioElement.
   */
  pause: (audio: HTMLAudioElement | null) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [muted, setMuted] = useState(false);

  // Ref so the listener can read the latest value without re-registration.
  const interactedRef = useRef(userHasInteracted);
  interactedRef.current = userHasInteracted;

  useEffect(() => {
    if (userHasInteracted) return;

    function onInteraction() {
      if (!interactedRef.current) {
        setUserHasInteracted(true);
      }
    }

    window.addEventListener("pointerdown", onInteraction, { once: true });
    window.addEventListener("keydown", onInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", onInteraction);
      window.removeEventListener("keydown", onInteraction);
    };
  }, [userHasInteracted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const play = useCallback(
    (audio: HTMLAudioElement | null): boolean => {
      if (!audio) return false;
      if (!interactedRef.current) return false;
      if (muted) {
        audio.pause();
        return false;
      }
      audio.play().catch(() => {
        // play() can throw DOMException if a subsequent gesture check fails;
        // silently ignore — the gesture gate above prevents most cases.
      });
      return true;
    },
    [muted]
  );

  const pause = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio) return;
    audio.pause();
  }, []);

  return (
    <AudioCtx.Provider value={{ userHasInteracted, muted, toggleMute, play, pause }}>
      {children}
    </AudioCtx.Provider>
  );
}

/**
 * Returns the nearest AudioProvider's context value.
 * Must be called inside an <AudioProvider> tree.
 */
export function useAudio(): AudioContextValue {
  const value = useContext(AudioCtx);
  if (value === null) {
    throw new Error("useAudio must be used inside an <AudioProvider>");
  }
  return value;
}
