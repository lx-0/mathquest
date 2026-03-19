import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContinueButton } from "./ContinueButton";

describe("ContinueButton", () => {
  describe("WCAG 2.2.1 — Timing Adjustable", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("renders the continue button", () => {
      render(<ContinueButton onContinue={vi.fn()} />);
      expect(screen.getByRole("button", { name: /continue to next question/i })).toBeInTheDocument();
    });

    it("auto-advances after default 2000 ms when no keyboard focus is active", () => {
      // Ensure document.activeElement is body (no keyboard focus)
      document.body.focus();

      const onContinue = vi.fn();
      render(<ContinueButton onContinue={onContinue} />);

      expect(onContinue).not.toHaveBeenCalled();

      vi.advanceTimersByTime(2000);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it("auto-advances after custom autoAdvanceMs", () => {
      document.body.focus();

      const onContinue = vi.fn();
      render(<ContinueButton onContinue={onContinue} autoAdvanceMs={3000} />);

      vi.advanceTimersByTime(2999);
      expect(onContinue).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it("cancels auto-advance when keyboard focus is detected via focusin event", () => {
      document.body.focus();

      const onContinue = vi.fn();
      render(<ContinueButton onContinue={onContinue} />);

      // Simulate a focusin event (keyboard user tabbing to the button)
      fireEvent.focusIn(document);

      vi.advanceTimersByTime(2000);

      // Auto-advance must NOT have fired
      expect(onContinue).not.toHaveBeenCalled();
    });

    it("cancels auto-advance immediately when an element already has focus on mount", () => {
      // Simulate existing keyboard focus before component mounts
      const input = document.createElement("input");
      document.body.appendChild(input);
      input.focus();

      const onContinue = vi.fn();
      render(<ContinueButton onContinue={onContinue} />);

      vi.advanceTimersByTime(2000);

      expect(onContinue).not.toHaveBeenCalled();

      // Clean up
      document.body.removeChild(input);
    });

    it("updates aria-label to remove countdown hint when timer is cancelled", () => {
      document.body.focus();

      render(<ContinueButton onContinue={vi.fn()} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute(
        "aria-label",
        "Continue to next question (advancing automatically in 2 seconds)",
      );

      fireEvent.focusIn(document);

      expect(button).toHaveAttribute("aria-label", "Continue to next question");
    });

    it("still calls onContinue when button is clicked manually", () => {
      document.body.focus();

      const onContinue = vi.fn();
      render(<ContinueButton onContinue={onContinue} />);

      const button = screen.getByRole("button", { name: /continue to next question/i });
      fireEvent.click(button);

      expect(onContinue).toHaveBeenCalledTimes(1);
    });

    it("cleans up the timer on unmount", () => {
      document.body.focus();

      const onContinue = vi.fn();
      const { unmount } = render(<ContinueButton onContinue={onContinue} />);

      unmount();

      vi.advanceTimersByTime(2000);

      expect(onContinue).not.toHaveBeenCalled();
    });

    it("always shows the button regardless of keyboard focus state", () => {
      document.body.focus();

      render(<ContinueButton onContinue={vi.fn()} />);

      fireEvent.focusIn(document);

      expect(screen.getByRole("button", { name: /continue to next question/i })).toBeInTheDocument();
    });
  });
});
