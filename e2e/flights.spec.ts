import { test, expect } from "@playwright/test";
import type { APIRequestContext } from "@playwright/test";

interface Trip {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
}

const BASE_URL = "http://localhost:3000";

const MOCK_FLIGHTS = [
  {
    id: "1",
    airline: "LH",
    flightNumber: "LH400",
    origin: "JFK",
    destination: "FRA",
    departure: "2026-03-10T08:00:00",
    arrival: "2026-03-10T20:00:00",
    duration: "8h 00m",
    price: "450",
    currency: "USD",
    cabin: "ECONOMY",
    stops: 0,
  },
];

test.describe.serial("Flight Search", () => {
  let trip: Trip;
  let apiContext: APIRequestContext;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({
      storageState: "e2e/.auth/user.json",
    });
    apiContext = context.request;

    const res = await apiContext.post(`${BASE_URL}/api/trips`, {
      data: {
        name: "E2E Flight Trip",
        destination: "Frankfurt, Germany",
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

  test("open flight search modal from day column", async ({ page }) => {
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Flight Trip" })).toBeVisible();

    // Click the "Flights" button in the day column header
    await page.getByRole("button", { name: /Flights/ }).click();

    // Modal should open with "Search Flights" title
    await expect(page.getByRole("heading", { name: "Search Flights" })).toBeVisible();

    // Verify search form elements are present
    await expect(page.getByPlaceholder("From (IATA)")).toBeVisible();
    await expect(page.getByPlaceholder("To (IATA)")).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("fill search form and submit - verify mocked results appear", async ({ page }) => {
    // Mock the flight search API
    await page.route("**/api/flights/search", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_FLIGHTS),
      });
    });

    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Flight Trip" })).toBeVisible();

    // Open flight search modal
    await page.getByRole("button", { name: /Flights/ }).click();
    await expect(page.getByRole("heading", { name: "Search Flights" })).toBeVisible();

    // Fill form fields
    await page.getByPlaceholder("From (IATA)").fill("JFK");
    await page.getByPlaceholder("To (IATA)").fill("FRA");
    // Date field should be pre-filled with the day's date; leave it as is

    // Submit search
    await page.getByRole("button", { name: "Search" }).click();

    // Verify mocked flight result appears
    await expect(page.getByText("LH400")).toBeVisible();
    await expect(page.getByText("Nonstop")).toBeVisible();
    await expect(page.getByText("ECONOMY")).toBeVisible();
    await expect(page.getByText("$450")).toBeVisible();
    await expect(page.getByText("JFK → FRA")).toBeVisible();
  });

  test("click '+ Add' on a flight result - verify activity is created", async ({ page }) => {
    // Mock the flight search API
    await page.route("**/api/flights/search", (route) => {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_FLIGHTS),
      });
    });

    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Flight Trip" })).toBeVisible();

    // Open flight search, fill, and submit
    await page.getByRole("button", { name: /Flights/ }).click();
    await page.getByPlaceholder("From (IATA)").fill("JFK");
    await page.getByPlaceholder("To (IATA)").fill("FRA");
    await page.getByRole("button", { name: "Search" }).click();

    // Wait for results
    await expect(page.getByText("LH400")).toBeVisible();

    // Click "+ Add" button on the flight result
    await page.getByRole("button", { name: "+ Add" }).click();

    // Modal should close after adding
    await expect(page.getByRole("heading", { name: "Search Flights" })).not.toBeVisible();

    // The flight activity should now appear in the day column with flight formatting
    // The activity title is: "LH400: JFK -> FRA" (with airplane emoji prefix)
    await expect(page.getByText("LH400")).toBeVisible();
    await expect(page.getByText("JFK → FRA")).toBeVisible();
  });

  test("flight activity displays with special formatting", async ({ page }) => {
    // The previous test added a flight activity; navigate to the trip page
    await page.goto(`/trips/${trip.id}`);
    await expect(page.getByRole("heading", { name: "E2E Flight Trip" })).toBeVisible();

    // The flight card should display the flight number prominently
    await expect(page.getByText("LH400")).toBeVisible();

    // Check for formatted departure/arrival times
    // departure: "2026-03-10T08:00:00" -> "08:00"
    // arrival: "2026-03-10T20:00:00" -> "20:00"
    await expect(page.getByText(/08:00/)).toBeVisible();
    await expect(page.getByText(/20:00/)).toBeVisible();

    // Check for badges: "Nonstop" and "ECONOMY"
    await expect(page.getByText("Nonstop")).toBeVisible();
    await expect(page.getByText("ECONOMY")).toBeVisible();

    // Check for route and price info
    await expect(page.getByText(/JFK → FRA/)).toBeVisible();
    await expect(page.getByText(/\$450/)).toBeVisible();
    await expect(page.getByText(/8h 00m/)).toBeVisible();
  });
});
