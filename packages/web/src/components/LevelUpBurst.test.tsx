import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LevelUpBurst } from "./LevelUpBurst";

describe("LevelUpBurst", () => {
  it("renders nothing when visible=false", () => {
    render(<LevelUpBurst level={3} visible={false} onDismiss={vi.fn()} />);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("renders overlay when visible=true", () => {
    render(<LevelUpBurst level={5} visible onDismiss={vi.fn()} />);
    expect(
      screen.getByRole("alertdialog", { name: "Level up! You reached level 5." })
    ).toBeInTheDocument();
  });

  it("displays the correct level number", () => {
    render(<LevelUpBurst level={7} visible onDismiss={vi.fn()} />);
    expect(screen.getByText("Level 7!")).toBeInTheDocument();
  });

  it("has aria-modal=true", () => {
    render(<LevelUpBurst level={2} visible onDismiss={vi.fn()} />);
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("calls onDismiss when Continue button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<LevelUpBurst level={4} visible onDismiss={onDismiss} />);

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("burst rings are marked aria-hidden", () => {
    render(<LevelUpBurst level={3} visible onDismiss={vi.fn()} />);
    // Burst rings are decorative — both should be aria-hidden
    const dialog = screen.getByRole("alertdialog");
    const hiddenElements = dialog.querySelectorAll('[aria-hidden="true"]');
    // At minimum the star icon and two burst rings
    expect(hiddenElements.length).toBeGreaterThanOrEqual(3);
  });

  it("Continue button meets 44px minimum tap target", () => {
    render(<LevelUpBurst level={1} visible onDismiss={vi.fn()} />);
    const button = screen.getByRole("button", { name: "Continue" });
    expect(button.className).toContain("min-h-[44px]");
  });
});
