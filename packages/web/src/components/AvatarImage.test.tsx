import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvatarImage } from "./AvatarImage";

describe("AvatarImage", () => {
  it("renders an img with the provided alt text", () => {
    render(<AvatarImage src="/avatars/alex.png" alt="Player avatar for Alex" />);
    expect(screen.getByRole("img", { name: "Player avatar for Alex" })).toBeInTheDocument();
  });

  it("renders with the provided src", () => {
    render(<AvatarImage src="/avatars/sam.png" alt="Player avatar for Sam" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/avatars/sam.png");
  });

  it("applies default size of 40", () => {
    render(<AvatarImage src="/avatars/alex.png" alt="Player avatar for Alex" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "40");
    expect(img).toHaveAttribute("height", "40");
  });

  it("applies custom size", () => {
    render(<AvatarImage src="/avatars/alex.png" alt="Player avatar for Alex" size={80} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "80");
    expect(img).toHaveAttribute("height", "80");
  });

  it("supports empty alt for decorative avatars", () => {
    render(<AvatarImage src="/avatars/decorative.png" alt="" />);
    const img = screen.getByRole("presentation");
    expect(img).toHaveAttribute("alt", "");
  });

  it("forwards extra className", () => {
    render(<AvatarImage src="/avatars/alex.png" alt="Player avatar for Alex" className="border-2" />);
    expect(screen.getByRole("img").className).toContain("border-2");
  });
});
