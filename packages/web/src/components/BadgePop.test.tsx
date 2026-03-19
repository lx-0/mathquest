import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BadgePop } from "./BadgePop";

describe("BadgePop", () => {
  it("renders with correct accessible label", () => {
    render(<BadgePop label="Speed Demon" icon="⚡" />);
    expect(screen.getByRole("img", { name: "Badge: Speed Demon" })).toBeInTheDocument();
  });

  it("renders the label text", () => {
    render(<BadgePop label="First Steps" icon="👣" />);
    expect(screen.getByText("First Steps")).toBeInTheDocument();
  });

  it("renders the icon as aria-hidden", () => {
    render(<BadgePop label="Hot Streak" icon="🔥" />);
    const icon = screen.getByText("🔥");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("applies motion-safe:animate-bounce when animate=true", () => {
    render(<BadgePop label="Winner" icon="🏆" animate />);
    const badge = screen.getByRole("img");
    expect(badge.className).toContain("motion-safe:animate-bounce");
  });

  it("does not apply bounce animation when animate=false", () => {
    render(<BadgePop label="Winner" icon="🏆" animate={false} />);
    const badge = screen.getByRole("img");
    expect(badge.className).not.toContain("animate-bounce");
  });

  it("does not apply bounce animation by default (animate omitted)", () => {
    render(<BadgePop label="Winner" icon="🏆" />);
    const badge = screen.getByRole("img");
    expect(badge.className).not.toContain("animate-bounce");
  });
});
