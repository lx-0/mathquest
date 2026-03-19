import { useAudio } from "../contexts/AudioContext";

/**
 * MuteButton — WCAG 1.4.2 Audio Control
 *
 * A keyboard-accessible toggle that mutes/unmutes all game audio.
 * Must be rendered on every screen so users always have a way to stop audio.
 *
 * Accessibility:
 *   - Uses a <button> element (inherently keyboard-focusable).
 *   - aria-pressed reflects the current mute state.
 *   - aria-label is always descriptive of the resulting action.
 *   - Focus-visible ring meets WCAG 2.4.7 (Focus Visible).
 *   - Meets 44×44 px minimum tap target (WCAG 2.5.5).
 *
 * @example
 *   <MuteButton />
 */
export function MuteButton() {
  const { muted, toggleMute } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-pressed={muted}
      aria-label={muted ? "Unmute audio" : "Mute audio"}
      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
    >
      {muted ? (
        <MutedIcon />
      ) : (
        <SpeakerIcon />
      )}
    </button>
  );
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
