import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import { AppLayout } from "./AppLayout";

function renderLayout(ui?: React.ReactNode) {
  return render(
    <MemoryRouter>
      <AppLayout>{ui ?? <p>content</p>}</AppLayout>
    </MemoryRouter>
  );
}

describe("AppLayout", () => {
  it("renders a <header> landmark", () => {
    renderLayout();
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a <nav> landmark with accessible label", () => {
    renderLayout();
    expect(screen.getByRole("navigation", { name: /primary navigation/i })).toBeInTheDocument();
  });

  it("renders a <main> landmark with id='main-content'", () => {
    renderLayout();
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("renders a <footer> landmark", () => {
    renderLayout();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders a skip link pointing to #main-content (WCAG 2.4.1)", () => {
    renderLayout();
    const skip = screen.getByRole("link", { name: /skip to main content/i });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute("href", "#main-content");
  });

  it("renders children inside <main>", () => {
    renderLayout(<p>hello world</p>);
    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("hello world");
  });
});
