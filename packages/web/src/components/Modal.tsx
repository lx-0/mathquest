import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Called when the modal requests to close (Escape key or backdrop click). */
  onClose: () => void;
  /** Title shown at the top of the modal and referenced by aria-labelledby. */
  title: string;
  /** Modal body content. */
  children: React.ReactNode;
  /** Additional Tailwind classes for the dialog panel. */
  className?: string;
}

/** CSS selector matching all natively focusable elements. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Accessible Modal base component.
 *
 * WCAG 2.1.2 — No Keyboard Trap (finding A15):
 *   Focus is trapped inside the dialog while it is open. Tab and Shift+Tab
 *   cycle only through focusable children. Focus is returned to the element
 *   that triggered the modal when it closes.
 *
 * WCAG 4.1.2 — Name, Role, Value (finding A17):
 *   role="dialog" + aria-modal="true" signal the dialog boundary to assistive
 *   technology. aria-labelledby points to the visible title element so screen
 *   readers announce "Heading text, dialog" on entry.
 *
 * Keyboard behaviour:
 *   - Escape  → calls onClose
 *   - Tab     → advance focus; wraps from last to first focusable child
 *   - Shift+Tab → reverse focus; wraps from first to last focusable child
 *
 * Backdrop:
 *   - Clicking outside the dialog panel calls onClose.
 *
 * Scroll:
 *   - Adds overflow-hidden to <body> while open to prevent background scroll.
 *
 * Usage:
 *   const [open, setOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *   ...
 *   <button ref={triggerRef} onClick={() => setOpen(true)}>Open</button>
 *   <Modal open={open} onClose={() => setOpen(false)} title="Level Up!">
 *     …content…
 *   </Modal>
 */
export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // Remember the element that was focused before the modal opened.
  const previousFocusRef = useRef<Element | null>(null);

  // Capture pre-open focus target and move focus into the dialog.
  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement;

    // Focus the panel itself (tabIndex=-1) so screen readers announce the dialog.
    requestAnimationFrame(() => {
      panelRef.current?.focus();
    });
  }, [open]);

  // Restore focus to the trigger element when the modal closes.
  useEffect(() => {
    if (open) return;
    const el = previousFocusRef.current;
    if (el && "focus" in el) {
      (el as HTMLElement).focus();
    }
  }, [open]);

  // Keyboard handlers: Escape close + focus trap.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;

        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => !el.closest("[inert]"));

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === panel) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || document.activeElement === panel) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={false}
    >
      {/* Semi-transparent backdrop — click closes the dialog */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={[
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl",
          "outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Title — referenced by aria-labelledby */}
        <h2 id={titleId} className="mb-4 text-xl font-bold text-gray-900">
          {title}
        </h2>

        {children}

        {/* Close button — always present so keyboard users can dismiss */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>
      </div>
    </div>,
    document.body,
  );
}
