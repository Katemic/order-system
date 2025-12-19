import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Mobile view shows burger-menu on orders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/orders');

    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
});

test('Desktop view shows fixed sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/orders');

    await expect(page.locator('aside')).toBeVisible();
});

test('Mobile sidebar closes when selecting a date', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/orders');

  // Open mobile sidebar
  await page.getByRole('button', { name: 'Menu' }).click();

  const mobileSidebar = page.locator('div.w-64.bg-white.border-r');

  const dateInput = mobileSidebar.locator('input[type="date"]').first();

  await dateInput.fill("2025-12-12");

  // Sidebar should now be closed
  await expect(page.locator('div.w-64.bg-white.border-r')).not.toBeVisible();
});


test("filtering on a single date works", async ({ page }) => {
  await page.goto("/orders");

  const singleDate = page.locator('input[type="date"]').first();
  await expect(singleDate).toBeVisible();

  await page.locator('input[type="date"]').first().fill("2026-02-12");

  // Get all visible rows after filtering
  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(1);

  // Check the date
  const dateCell = rows.first().locator("td").nth(1); 
  await expect(dateCell).toHaveText("12.02.2026"); 
});

test("filtering on a date range works", async ({ page }) => {
    await page.goto("/orders");

    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs.nth(1)).toBeVisible(); // fromDate
    await expect(dateInputs.nth(2)).toBeVisible(); // toDate

    const inputs = page.getByRole('textbox');

    await inputs.nth(2).fill("2026-02-12"); // fromDate
    await sleep(1000); 
    await inputs.nth(3).fill("2026-02-13"); // toDate

    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(3); 

    // Check that all dates are within the range
    const dates = await rows.locator("td:nth-child(2)").allTextContents();

    for (const d of dates) {
        const [day, month, year] = d.split(".");
        const iso = `${year}-${month}-${day}`;
        expect(iso >= "2026-02-12" && iso <= "2026-02-13").toBeTruthy();
    }
});

test('"I dag" filters to only today\'s orders', async ({ page }) => {
  await page.goto("/orders");
  await expect(page.getByRole("button", { name: "I dag" })).toBeVisible();

  await page.getByRole("button", { name: "I dag" }).click();

  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(1);

  const today = new Date().toISOString().slice(0, 10);
  const [y, m, d] = today.split("-");
  const formatted = `${d}.${m}.${y}`;

  await expect(rows.first().locator("td").nth(1)).toHaveText(formatted);
});

test('"Alle bestillinger" resets filtering', async ({ page }) => {
    await page.goto("/orders");
    await expect(page.getByRole("button", { name: "Alle bestillinger" })).toBeVisible();
    const rows = page.locator("table tbody tr");

    // Filter first
    await page.locator('input[type="date"]').first().fill("2026-02-13");
    await expect(rows).toHaveCount(2);


    // Reset
    await page.getByRole("button", { name: "Alle bestillinger" }).click();

    // Now all mock orders should be visible again
    await expect(rows).toHaveCount(7);
});

const BASE_URL = "http://localhost:3000";

test("orders: 'Kun leveringer' filter only shows delivery orders and can be toggled", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}/orders?range=all`);

  const deliveryCheckbox = page.getByLabel("Kun leveringer");

  // Start: not checked
  await expect(deliveryCheckbox).not.toBeChecked();

  // First: both pickup and delivery visible
  await expect(page.getByText("Hans Jensen")).toBeVisible();    // pickup
  await expect(page.getByText("Maria Madsen")).toBeVisible();   // delivery
  await expect(page.getByText("Sofie Sørensen")).toBeVisible(); // delivery

  // Turn "Kun leveringer" on
  await deliveryCheckbox.click();

  // After navigation get a fresh locator and assert checked
  await expect(page.getByLabel("Kun leveringer")).toBeChecked();

  // Pickup orders should be gone
  await expect(page.getByText("Hans Jensen")).toHaveCount(0);
  await expect(page.getByText("Peter Larsen")).toHaveCount(0);
  await expect(page.getByText("Kasper Nielsen")).toHaveCount(0);
  await expect(page.getByText("Nina Kristensen")).toHaveCount(0);

  // Delivery orders should be there
  await expect(page.getByText("Maria Madsen")).toBeVisible();
  await expect(page.getByText("Frederikke Holm")).toBeVisible();
  await expect(page.getByText("Sofie Sørensen")).toBeVisible();

  // Turn the filter off again
  await page.getByLabel("Kun leveringer").click();
  await expect(page.getByLabel("Kun leveringer")).not.toBeChecked();

  // Pickup is back
  await expect(page.getByText("Hans Jensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toBeVisible();
});

test("orders: 'Kun leveringer' combined with date filter", async ({ page }) => {
  await page.goto(`${BASE_URL}/orders`);

  // Select date 2026-02-13 (Sofie = delivery, Nina = pickup)
  const dateInput = page.locator('input[type="date"]').first();
  await dateInput.fill("2026-02-13");

  await expect(page.getByText("Sofie Sørensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toBeVisible();

  // Turn "Kun leveringer" on
  await page.getByLabel("Kun leveringer").click();
  await expect(page.getByLabel("Kun leveringer")).toBeChecked();

  // Only Sofie (delivery) left
  await expect(page.getByText("Sofie Sørensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toHaveCount(0);
});

test("Click on 'Gamle bestillinger' resets search and dates and sets range=old", async ({ page }) => {
  await page.goto("/orders");

  const searchInput = page.getByRole("textbox", { name: "Søg bestillinger…" });
  const dateInputs = page.locator('input[type="date"]');
  const singleDate = dateInputs.nth(0);
  const fromDate = dateInputs.nth(1);
  const toDate = dateInputs.nth(2);

  // Set search and dates first
  await searchInput.fill("Hans");
  await singleDate.fill("2025-12-12");
  await fromDate.fill("2025-12-12");
  await toDate.fill("2025-12-13");

  // Click Search to put search in URL
  await page.getByRole("button", { name: "Søg" }).click();
  await page.waitForURL((url) => url.searchParams.get("search") === "Hans");

  // Click "Gamle bestillinger"
  await page.getByRole("button", { name: "Gamle bestillinger" }).click();

  // URL: has range=old and no search
  await page.waitForURL((url) => url.searchParams.get("range") === "old");
  await page.waitForURL((url) => !url.searchParams.has("search"));

  // UI: search field is cleared
  const newSearchInput = page.getByRole("textbox", { name: "Søg bestillinger…" });
  await expect(newSearchInput).toHaveValue("");

  // UI: date fields are reset
  const newDateInputs = page.locator('input[type="date"]');
  await expect(newDateInputs.nth(0)).toHaveValue("");
  await expect(newDateInputs.nth(1)).toHaveValue("");
  await expect(newDateInputs.nth(2)).toHaveValue("");
});

test("Click on 'Nye bestillinger' resets search and dates and sets range=new", async ({ page }) => {
  await page.goto("/orders");

  const searchInput = page.getByRole("textbox", { name: "Søg bestillinger…" });
  const dateInputs = page.locator('input[type="date"]');
  const singleDate = dateInputs.nth(0);
  const fromDate = dateInputs.nth(1);
  const toDate = dateInputs.nth(2);

  // Switch to old first, so we know range changes
  await page.getByRole("button", { name: "Gamle bestillinger" }).click();
  await page.waitForURL((url) => url.searchParams.get("range") === "old");

  // SSet search and dates
  await searchInput.fill("test");
  await singleDate.fill("2025-12-12");
  await fromDate.fill("2025-12-12");
  await toDate.fill("2025-12-13");

  // Click Search to put search in URL
  await page.getByRole("button", { name: "Søg" }).click();
  await page.waitForURL((url) => url.searchParams.get("search") === "test");

  // Click "Nye bestillinger"
  await page.getByRole("button", { name: "Fremtidige bestillinger" }).click();

  // URL: range=new and no search
  await page.waitForURL((url) => url.searchParams.get("range") === "new");
  await page.waitForURL((url) => !url.searchParams.has("search"));

  // UI reset
  const newSearchInput = page.getByRole("textbox", { name: "Søg bestillinger…" });
  await expect(newSearchInput).toHaveValue("");

  const newDateInputs = page.locator('input[type="date"]');
  await expect(newDateInputs.nth(0)).toHaveValue("");
  await expect(newDateInputs.nth(1)).toHaveValue("");
  await expect(newDateInputs.nth(2)).toHaveValue("");
});


