import { test, expect } from "@playwright/test";

// Do NOT use saved auth state — each test gets a fresh browser context.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Authentication", () => {
  test("unauthenticated user visiting / is redirected to /login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: "Travel Planner" }),
    ).toBeVisible();
  });

  test("wrong password shows error message", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Password").fill("wrong-password-123");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByText("Wrong password")).toBeVisible();
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder("Password").fill(process.env.LOGIN_PASSWORD!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("/");
    await expect(
      page.getByRole("heading", { name: "My Trips" }),
    ).toBeVisible();
  });

  test("logout clears session and redirects to /login", async ({ page }) => {
    // First log in
    await page.goto("/login");
    await page.getByPlaceholder("Password").fill(process.env.LOGIN_PASSWORD!);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("/");
    await expect(
      page.getByRole("heading", { name: "My Trips" }),
    ).toBeVisible();

    // Now log out
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: "Travel Planner" }),
    ).toBeVisible();

    // Verify session is cleared — visiting / should redirect back to /login
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });
});
