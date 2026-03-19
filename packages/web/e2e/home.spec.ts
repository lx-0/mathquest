import { test, expect } from "@playwright/test";

test("home page renders MathQuest heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /MathQuest/i })).toBeVisible();
});

test("404 route shows not found page with home link", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page.getByText("404")).toBeVisible();
  await expect(page.getByRole("link", { name: /Back to home/i })).toBeVisible();
});
