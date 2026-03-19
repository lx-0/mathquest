import { render, screen, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AudioProvider } from "../contexts/AudioContext";
import { MuteButton } from "./MuteButton";

function Wrapper({ children }: { children: React.ReactNode }) {
  return <AudioProvider>{children}</AudioProvider>;
}

describe("MuteButton", () => {
  it("renders a button with accessible label", () => {
    render(
      <Wrapper>
        <MuteButton />
      </Wrapper>
    );
    const btn = screen.getByRole("button", { name: "Mute audio" });
    expect(btn).toBeInTheDocument();
  });

  it("has aria-pressed=false when unmuted", () => {
    render(
      <Wrapper>
        <MuteButton />
      </Wrapper>
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles aria-pressed and label on click", async () => {
    render(
      <Wrapper>
        <MuteButton />
      </Wrapper>
    );

    const btn = screen.getByRole("button", { name: "Mute audio" });
    expect(btn).toHaveAttribute("aria-pressed", "false");

    await act(async () => {
      btn.click();
    });

    expect(btn).toHaveAttribute("aria-pressed", "true");
    expect(btn).toHaveAccessibleName("Unmute audio");

    await act(async () => {
      btn.click();
    });

    expect(btn).toHaveAttribute("aria-pressed", "false");
    expect(btn).toHaveAccessibleName("Mute audio");
  });

  it("meets minimum 44px tap target", () => {
    render(
      <Wrapper>
        <MuteButton />
      </Wrapper>
    );
    const btn = screen.getByRole("button");
    // Tailwind class min-h-[44px] min-w-[44px] should be present
    expect(btn.className).toMatch(/min-h-\[44px\]/);
    expect(btn.className).toMatch(/min-w-\[44px\]/);
  });

  it("has focus-visible ring styles for keyboard navigation", () => {
    render(
      <Wrapper>
        <MuteButton />
      </Wrapper>
    );
    const btn = screen.getByRole("button");
    expect(btn.className).toMatch(/focus-visible:ring-2/);
  });
});
