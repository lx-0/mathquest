import { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout — WCAG 1.3.1, 2.4.1
 *
 * Provides the mandatory HTML landmark regions on every screen:
 *   - <header>  : app branding
 *   - <nav>     : primary navigation
 *   - <main>    : page-specific content (receives children)
 *   - <footer>  : site-wide footer
 *
 * A "Skip to main content" link satisfies WCAG 2.4.1 (Bypass Blocks).
 * The <main> carries id="main-content" so the skip link target resolves.
 * The <main> also carries tabIndex={-1} so programmatic focus calls work.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {/* WCAG 2.4.1 — skip link; visually hidden until focused */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          focus:fixed focus:left-4 focus:top-4 focus:z-50
          focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2
          focus:text-white focus:underline
        "
      >
        Skip to main content
      </a>

      <header className="border-b border-gray-200 bg-white px-4 py-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-primary no-underline"
          aria-label="MathQuest — go to home"
        >
          <span className="text-xl font-bold">MathQuest</span>
        </Link>
      </header>

      <nav aria-label="Primary navigation" className="border-b border-gray-100 bg-gray-50 px-4 py-2">
        <ul className="flex list-none gap-4 p-0 m-0">
          <li>
            <Link to="/" className="text-sm font-medium text-primary hover:underline">
              Home
            </Link>
          </li>
        </ul>
      </nav>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 flex-col outline-none"
      >
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-gray-50 px-4 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} MathQuest — Gamified math learning for 6th graders</p>
      </footer>
    </>
  );
}
