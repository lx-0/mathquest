import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MasteryBar } from "./MasteryBar";

describe("MasteryBar", () => {
  it("renders with role=progressbar", () => {
    render(<MasteryBar value={75} topic="Fractions" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has correct aria-valuenow, aria-valuemin, aria-valuemax", () => {
    render(<MasteryBar value={40} topic="Decimals" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("derives aria-label from topic", () => {
    render(<MasteryBar value={50} topic="Fractions" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Fractions mastery");
  });

  it("clamps value below 0 to 0", () => {
    render(<MasteryBar value={-5} topic="Geometry" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("clamps value above 100 to 100", () => {
    render(<MasteryBar value={110} topic="Algebra" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });
});
