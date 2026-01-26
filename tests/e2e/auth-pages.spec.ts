import { test, expect } from "@playwright/test";

test.describe("auth pages", () => {
  test("sign-in page renders and links to forgot password", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /sign in to your account/i })).toBeVisible();
    const forgotLink = page.getByRole("link", { name: /forgot password\?/i });
    await expect(forgotLink).toBeVisible();
    await forgotLink.click();
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(
      page.getByRole("heading", { name: /forgot your password\?/i })
    ).toBeVisible();
  });

  test("forgot password form validates email", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByRole("button", { name: /send reset link/i }).click();
    await expect(page.getByText(/enter a valid email address/i)).toBeVisible();
  });

  test("reset password shows missing token message", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByText(/reset token is missing/i)).toBeVisible();
  });
});
