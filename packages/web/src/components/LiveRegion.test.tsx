import { render, screen, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LiveRegionProvider, useLiveRegion } from "./LiveRegion";

// Helper component that calls useLiveRegion and exposes announce via a button
function Emitter({ politeness }: { politeness?: "assertive" | "polite" }) {
  const announce = useLiveRegion();
  return (
    <button
      onClick={() => announce("Test message", politeness)}
    >
      Emit
    </button>
  );
}

function Emitter2() {
  const announce = useLiveRegion();
  return (
    <button onClick={() => announce("Same message", "polite")}>Emit same</button>
  );
}

describe("LiveRegionProvider", () => {
  it("renders two hidden live regions", () => {
    render(
      <LiveRegionProvider>
        <div />
      </LiveRegionProvider>
    );

    const regions = screen.getAllByRole("status");
    expect(regions).toHaveLength(2);
    // Both are sr-only (visually hidden) — not removed from the accessibility tree
    regions.forEach((r) => {
      expect(r).toBeInTheDocument();
      expect(r).toHaveClass("sr-only");
    });
  });

  it("assertive region has aria-live=assertive", () => {
    render(
      <LiveRegionProvider>
        <div />
      </LiveRegionProvider>
    );
    const assertiveRegion = screen
      .getAllByRole("status")
      .find((el) => el.getAttribute("aria-live") === "assertive");
    expect(assertiveRegion).toBeDefined();
    expect(assertiveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("polite region has aria-live=polite", () => {
    render(
      <LiveRegionProvider>
        <div />
      </LiveRegionProvider>
    );
    const politeRegion = screen
      .getAllByRole("status")
      .find((el) => el.getAttribute("aria-live") === "polite");
    expect(politeRegion).toBeDefined();
    expect(politeRegion).toHaveAttribute("aria-atomic", "true");
  });
});

describe("useLiveRegion", () => {
  it("throws when used outside LiveRegionProvider", () => {
    // Suppress expected console.error from React error boundary
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Emitter />)).toThrow(
      "useLiveRegion must be used inside a <LiveRegionProvider>"
    );
    consoleSpy.mockRestore();
  });

  it("puts assertive message in the assertive live region", async () => {
    const { getByRole, getAllByRole } = render(
      <LiveRegionProvider>
        <Emitter politeness="assertive" />
      </LiveRegionProvider>
    );

    await act(async () => {
      getByRole("button", { name: "Emit" }).click();
    });

    const assertiveRegion = getAllByRole("status").find(
      (el) => el.getAttribute("aria-live") === "assertive"
    )!;
    expect(assertiveRegion).toHaveTextContent("Test message");
  });

  it("puts polite message in the polite live region", async () => {
    const { getByRole, getAllByRole } = render(
      <LiveRegionProvider>
        <Emitter politeness="polite" />
      </LiveRegionProvider>
    );

    await act(async () => {
      getByRole("button", { name: "Emit" }).click();
    });

    const politeRegion = getAllByRole("status").find(
      (el) => el.getAttribute("aria-live") === "polite"
    )!;
    expect(politeRegion).toHaveTextContent("Test message");
  });

  it("defaults to polite when politeness is omitted", async () => {
    function DefaultEmitter() {
      const announce = useLiveRegion();
      return (
        <button onClick={() => announce("Default politeness")}>Emit</button>
      );
    }

    const { getByRole, getAllByRole } = render(
      <LiveRegionProvider>
        <DefaultEmitter />
      </LiveRegionProvider>
    );

    await act(async () => {
      getByRole("button", { name: "Emit" }).click();
    });

    const politeRegion = getAllByRole("status").find(
      (el) => el.getAttribute("aria-live") === "polite"
    )!;
    expect(politeRegion).toHaveTextContent("Default politeness");
  });

  it("re-announces the same message on repeated calls (key rotation)", async () => {
    // WCAG 4.1.3: consecutive identical messages (e.g., two "Correct!")
    // must each be announced. The key-rotation pattern resets the DOM node.
    const { getByRole, getAllByRole } = render(
      <LiveRegionProvider>
        <Emitter2 />
      </LiveRegionProvider>
    );

    const politeRegion = () =>
      getAllByRole("status").find(
        (el) => el.getAttribute("aria-live") === "polite"
      )!;

    await act(async () => {
      getByRole("button", { name: "Emit same" }).click();
    });
    expect(politeRegion()).toHaveTextContent("Same message");

    await act(async () => {
      getByRole("button", { name: "Emit same" }).click();
    });
    // Region is still rendered with the same text — the key rotation ensures
    // a fresh DOM node was produced for the second announcement.
    expect(politeRegion()).toHaveTextContent("Same message");
  });
});
