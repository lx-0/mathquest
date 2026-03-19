import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";
import { XPCounter } from "./XPCounter";

// Helper to mock the prefers-reduced-motion media query.
function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("XPCounter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders the XP value with correct aria-label", () => {
    mockReducedMotion(false);
    render(<XPCounter value={100} />);
    expect(screen.getByLabelText("100 XP")).toBeInTheDocument();
  });

  it("shows final value immediately under prefers-reduced-motion", () => {
    mockReducedMotion(true);
    render(<XPCounter value={200} />);
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("aria-label always reflects the target value, not the animated display value", () => {
    mockReducedMotion(false);
    render(<XPCounter value={50} duration={600} />);
    // Before animation completes the aria-label should already show 50
    expect(screen.getByLabelText("50 XP")).toBeInTheDocument();
  });

  it("reaches the final value after animation completes", async () => {
    mockReducedMotion(false);
    render(<XPCounter value={300} duration={200} />);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("300")).toBeInTheDocument();
  });

  it("updates to new value when prop changes", () => {
    mockReducedMotion(true);
    const { rerender } = render(<XPCounter value={100} />);
    expect(screen.getByText("100")).toBeInTheDocument();

    rerender(<XPCounter value={150} />);
    expect(screen.getByText("150")).toBeInTheDocument();
  });
});
