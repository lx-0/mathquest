import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { XPBar } from "./XPBar";

describe("XPBar", () => {
  it("renders with role=progressbar", () => {
    render(<XPBar value={50} max={100} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has correct aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(<XPBar value={60} max={200} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "60");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "200");
  });

  it("uses default label 'XP progress'", () => {
    render(<XPBar value={10} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "XP progress");
  });

  it("uses custom label when provided", () => {
    render(<XPBar value={10} max={100} label="Level 5 progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Level 5 progress");
  });

  it("clamps value below 0 to 0", () => {
    render(<XPBar value={-10} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("clamps value above max to max", () => {
    render(<XPBar value={150} max={100} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});
