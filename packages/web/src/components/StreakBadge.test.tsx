import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StreakBadge } from "./StreakBadge";

describe("StreakBadge", () => {
  it("renders streak count with correct aria-label", () => {
    render(<StreakBadge count={5} />);
    expect(screen.getByRole("status", { name: "Streak: 5 in a row" })).toBeInTheDocument();
  });

  it("displays the count value", () => {
    render(<StreakBadge count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("applies pulse ring classes when isNew=true", () => {
    render(<StreakBadge count={4} isNew />);
    const badge = screen.getByRole("status");
    // ring-2 is the static indicator (visible under both motion modes)
    expect(badge.className).toContain("motion-safe:ring-2");
    expect(badge.className).toContain("motion-reduce:ring-2");
  });

  it("does not apply ring classes when isNew=false", () => {
    render(<StreakBadge count={4} isNew={false} />);
    const badge = screen.getByRole("status");
    expect(badge.className).not.toContain("motion-safe:ring-2");
  });

  it("does not apply ring classes by default (isNew omitted)", () => {
    render(<StreakBadge count={2} />);
    const badge = screen.getByRole("status");
    expect(badge.className).not.toContain("motion-safe:ring-2");
  });
});
