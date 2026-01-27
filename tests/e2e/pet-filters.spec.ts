import { test, expect } from "@playwright/test";

test.describe("pet filters", () => {
  test("renders filter controls", async ({ page }) => {
    await page.goto("/pets");

    await expect(page.getByRole("button", { name: "Color filter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Breed filter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Size filter" })).toBeVisible();
  });
});
