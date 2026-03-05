import { test, expect } from "@playwright/test";

// These tests use the pre-authenticated state from the "chromium" project.

test.describe.serial("Trip CRUD", () => {
  const tripName = `E2E Trip ${Date.now()}`;
  const tripDestination = "Tokyo, Japan";
  const startDate = "2026-07-01";
  const endDate = "2026-07-10";

  test("empty state displays 'No trips yet' message", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // This test is conditional — only assert if there are no trips.
    const noTripsMessage = page.getByText("No trips yet.");
    const hasNoTrips = await noTripsMessage.isVisible().catch(() => false);
    if (hasNoTrips) {
      await expect(noTripsMessage).toBeVisible();
      await expect(
        page.getByText("Create your first trip to get started."),
      ).toBeVisible();
    } else {
      test.skip();
    }
  });

  test("create a trip via the modal form", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "My Trips" }),
    ).toBeVisible();

    // Open the new trip modal
    await page.getByRole("button", { name: "+ New Trip" }).click();

    // Fill in the form
    await page.getByLabel("Trip name").fill(tripName);
    await page.getByLabel("Destination").fill(tripDestination);
    await page.getByLabel("Start date").fill(startDate);
    await page.getByLabel("End date").fill(endDate);

    // Submit
    await page.getByRole("button", { name: "Create trip" }).click();

    // Verify the trip appears in the grid
    await expect(page.getByRole("link", { name: tripName })).toBeVisible();
  });

  test("date validation: end date before start date shows error", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "+ New Trip" }).click();

    await page.getByLabel("Trip name").fill("Invalid Date Trip");
    await page.getByLabel("Destination").fill("Nowhere");
    await page.getByLabel("Start date").fill("2026-08-15");
    await page.getByLabel("End date").fill("2026-08-01"); // before start

    await page.getByRole("button", { name: "Create trip" }).click();

    await expect(
      page.getByText("End date must be on or after start date."),
    ).toBeVisible();
  });

  test("delete a trip via confirm dialog", async ({ page }) => {
    await page.goto("/");

    // Wait for the trip we created to be visible
    await expect(page.getByText(tripName)).toBeVisible();

    // Set up dialog handler before triggering the confirm
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      expect(dialog.message()).toContain(tripName);
      await dialog.accept();
    });

    // Find the card's Delete button via the adjacent trip name link
    const tripLink = page.getByRole("link", { name: tripName });
    await tripLink.locator("..").getByRole("button", { name: "Delete" }).click();

    // Verify the trip is removed from the grid
    await expect(page.getByText(tripName)).not.toBeVisible();
  });

  test("click a trip card to navigate to /trips/:id", async ({ page }) => {
    // Create a trip to click on
    const clickTripName = `Nav Trip ${Date.now()}`;

    await page.goto("/");

    await page.getByRole("button", { name: "+ New Trip" }).click();
    await page.getByLabel("Trip name").fill(clickTripName);
    await page.getByLabel("Destination").fill("Paris, France");
    await page.getByLabel("Start date").fill("2026-09-01");
    await page.getByLabel("End date").fill("2026-09-05");
    await page.getByRole("button", { name: "Create trip" }).click();

    // Wait for the trip to appear
    await expect(page.getByText(clickTripName)).toBeVisible();

    // Click the trip name link
    await page.getByRole("link", { name: clickTripName }).click();

    // Verify navigation to /trips/:id
    await expect(page).toHaveURL(/\/trips\/\w+/);

    // Clean up: go back and delete this trip
    await page.goto("/");
    await expect(page.getByText(clickTripName)).toBeVisible();

    page.on("dialog", (dialog) => dialog.accept());
    const tripLink = page.getByRole("link", { name: clickTripName });
    await tripLink.locator("..").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText(clickTripName)).not.toBeVisible();
  });
});
