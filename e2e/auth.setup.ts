import { test as setup, expect } from "@playwright/test";

const authFile = "e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("textbox").fill(process.env.LOGIN_PASSWORD!);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/");
  await expect(page.getByText("My Trips")).toBeVisible();
  await page.context().storageState({ path: authFile });
});
