import { test, expect } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

interface Trip {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
}

const BASE_URL = "http://localhost:5173";

test.describe.serial("Itinerary", () => {
  let trip: Trip;
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "e2e/.auth/user.json",
    });
    apiContext = context.request;

    const res = await apiContext.post(`${BASE_URL}/api/trips`, {
      data: {
        name: "E2E Itinerary Trip",
        destination: "Berlin, Germany",
        start_date: "2026-03-10",
        end_date: "2026-03-12",
      },
    });
    expect(res.status()).toBe(201);
    trip = await res.json();
  });

  test.afterAll(async () => {
    if (trip?.id) {
      await apiContext.delete(`${BASE_URL}/api/trips/${trip.id}`);
    }
  });

  test("day tabs render correctly for a 3-day trip", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);

    // Wait for the trip name to confirm page loaded
    await expect(page.getByRole("heading", { name: "E2E Itinerary Trip" })).toBeVisible();

    // 3-day trip (Mar 10, 11, 12) should produce 3 tab buttons
    // Labels are like "Tue, Mar 10", "Wed, Mar 11", "Thu, Mar 12"
    const tabs = page.locator("button").filter({ hasText: /Mar\s+1[0-2]/ });
    await expect(tabs).toHaveCount(3);
  });

  test("add an activity to day 1", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Itinerary Trip" })).toBeVisible();

    // Click the "+ Add activity" button
    await page.getByRole("button", { name: "+ Add activity" }).click();

    // Fill the form
    await page.getByPlaceholder("Activity name").fill("Visit Brandenburg Gate");
    await page.locator('input[name="time"]').fill("10:00");
    await page.getByPlaceholder("Notes (optional)").fill("Arrive early to avoid crowds");

    // Submit
    await page.getByRole("button", { name: "Add" }).click();

    // Verify the activity appears
    await expect(page.getByText("Visit Brandenburg Gate")).toBeVisible();
    await expect(page.getByText("10:00")).toBeVisible();
    await expect(page.getByText("Arrive early to avoid crowds")).toBeVisible();
  });

  test("activity form validation - submit without title is prevented", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Itinerary Trip" })).toBeVisible();

    // Click "+ Add activity" to open the form
    await page.getByRole("button", { name: "+ Add activity" }).click();

    // Leave title empty and try to submit
    const addButton = page.getByRole("button", { name: "Add" });
    await addButton.click();

    // The title input has `required` attribute, so the browser should prevent submission.
    // The form should still be visible (not closed) since submission was blocked.
    await expect(page.getByPlaceholder("Activity name")).toBeVisible();
  });

  test("switch to day 2 tab - day 1 activity not visible", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Itinerary Trip" })).toBeVisible();

    // Verify day 1 activity is present first
    await expect(page.getByText("Visit Brandenburg Gate")).toBeVisible();

    // Click the day 2 tab (Mar 11)
    const day2Tab = page.locator("button").filter({ hasText: /Mar\s+11/ });
    await day2Tab.click();

    // Day 1 activity should not be visible
    await expect(page.getByText("Visit Brandenburg Gate")).not.toBeVisible();

    // Day 2 should show "No activities yet"
    await expect(page.getByText("No activities yet")).toBeVisible();
  });

  test("delete an activity using the delete button", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Itinerary Trip" })).toBeVisible();

    // Ensure the activity from the earlier test is visible
    await expect(page.getByText("Visit Brandenburg Gate")).toBeVisible();

    // Set up dialog handler before clicking delete
    page.on("dialog", (dialog) => dialog.accept());

    // Click the delete button (the "x" button next to the activity)
    // The delete button contains text content of a multiplication sign
    const activityRow = page.locator("div").filter({ hasText: "Visit Brandenburg Gate" }).first();
    await activityRow.getByRole("button", { name: /✕/ }).click();

    // Activity should disappear
    await expect(page.getByText("Visit Brandenburg Gate")).not.toBeVisible();

    // Should show "No activities yet" on day 1
    await expect(page.getByText("No activities yet")).toBeVisible();
  });
});
