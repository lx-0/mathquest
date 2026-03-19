import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgeIcon } from "./BadgeIcon";

describe("BadgeIcon", () => {
  it("renders with role=img and aria-label set to name", () => {
    render(<BadgeIcon icon="⚡" name="Speed Demon" />);
    expect(screen.getByRole("img", { name: "Speed Demon" })).toBeInTheDocument();
  });

  it("renders the icon text", () => {
    render(<BadgeIcon icon="🏆" name="Champion" />);
    expect(screen.getByText("🏆")).toBeInTheDocument();
  });

  it("renders decorative icon with aria-hidden=true", () => {
    render(<BadgeIcon icon="✨" name="sparkle flourish" decorative />);
    const span = screen.getByText("✨");
    expect(span).toHaveAttribute("aria-hidden", "true");
  });

  it("does not expose decorative icon to accessible tree", () => {
    render(<BadgeIcon icon="✨" name="sparkle flourish" decorative />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders non-decorative icon without aria-hidden", () => {
    render(<BadgeIcon icon="🌟" name="Gold Star" />);
    const span = screen.getByRole("img", { name: "Gold Star" });
    expect(span).not.toHaveAttribute("aria-hidden");
  });

  it("forwards extra className", () => {
    render(<BadgeIcon icon="🔥" name="Hot Streak" className="text-amber-500" />);
    expect(screen.getByRole("img").className).toContain("text-amber-500");
  });
});
