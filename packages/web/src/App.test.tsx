import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders MathQuest heading on home route", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /MathQuest/i })).toBeInTheDocument();
  });
});
