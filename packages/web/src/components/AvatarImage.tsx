interface AvatarImageProps {
  /** Absolute or relative URL of the avatar image. */
  src: string;
  /**
   * Descriptive alt text for the avatar — required, never empty.
   * Use the player's display name, e.g. "Player avatar for Alex".
   * Screen readers announce this as the image description (WCAG 1.1.1 / A21).
   */
  alt: string;
  /** Visual diameter in pixels. Defaults to 40. */
  size?: number;
  /** Additional Tailwind classes for the wrapping element. */
  className?: string;
}

/**
 * Accessible player avatar image.
 *
 * Accessibility:
 *  - `alt` is a required prop so every avatar always has descriptive text.
 *  - The native `<img alt>` attribute satisfies WCAG 1.1.1 (finding A21).
 *  - If the avatar is purely decorative (rare), pass `alt=""` explicitly;
 *    TypeScript still requires the prop to be present so the omission is
 *    intentional and visible in code review.
 */
export function AvatarImage({ src, alt, size = 40, className = "" }: AvatarImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={[
        "inline-block rounded-full object-cover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
