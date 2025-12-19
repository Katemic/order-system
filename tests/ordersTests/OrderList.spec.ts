import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});

test('Can access "Orders" via the top bar', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('link', { name: 'Bestillinger' }).click();

    await expect(page).toHaveURL(/\/orders/);
    await expect(page.getByRole('heading', { name: 'Bestillinger' })).toBeVisible();
});

test('Shows today\'s orders on /orders', async ({ page }) => {
    await page.goto('/orders');

    const rows = await page.locator('table tbody tr').count();

    expect(rows).toBe(1); 
});


test("Orders are sorted by time per date", async ({ page }) => {
  await page.goto("/orders");

  const rows = page.locator("table tbody tr");
  const count = await rows.count();

  let lastDate = "";
  let lastTime = "";

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const date = await row.locator("td:nth-child(2)").innerText();
    const time = await row.locator("td:nth-child(3)").innerText();

    // When we change date, reset time comparison
    if (date !== lastDate) {
      lastDate = date;
      lastTime = time;
      continue;
    }

    // Same date, now the time must increase
    expect(time >= lastTime).toBeTruthy();

    lastTime = time;
  }
});


test('An order row contains all necessary fields', async ({ page }) => {
    await page.goto('/orders');

    const firstRow = page.locator('table tbody tr').first();

    await expect(firstRow.locator('td').nth(0)).not.toBeEmpty(); // Name
    await expect(firstRow.locator('td').nth(1)).not.toBeEmpty(); // Date
    await expect(firstRow.locator('td').nth(2)).not.toBeEmpty(); // Time
    await expect(firstRow.locator('td').nth(3)).not.toBeEmpty(); // Type (Delivery/Pickup)
    await expect(firstRow.locator('td').nth(4)).not.toBeEmpty(); // Number of products
    await expect(firstRow.locator('td').nth(5)).not.toBeEmpty(); // Price
});

test('Delivery orders are marked with red text', async ({ page }) => {
  await page.goto('/orders?range=new');

  const delivery = page
    .locator('tbody tr td:nth-child(4) span')
    .filter({ hasText: 'Levering' })
    .first();

  await expect(delivery).toBeVisible();
  await expect(delivery).toHaveClass(/text-red-600/);
});

//Order modal tests

test("modal opens with the correct order details and show customizations", async ({ page }) => {
  await page.goto("/orders");

  await page.getByText("Hans Jensen").click();

  // Modal should be visible
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // Order ID
  await expect(modal.getByText("Bestilling #1")).toBeVisible();

  // Served by
  await expect(modal.getByText(/Betjent af/i)).toBeVisible();

  // Customer name
  await expect(modal.getByText("Hans Jensen")).toBeVisible();

  // Phone
  await expect(modal.getByText("22223333")).toBeVisible();

  // Type (delivery/pickup)
  await expect(modal.getByText(/Levering:|Afhentning:/)).toBeVisible();

  // Times
  await expect(modal.getByText(/Tidspunkt:/)).toBeVisible();

  // Paid / not paid
  await expect(modal.getByText(/✔️|❌/)).toBeVisible();

  // Total price
  await expect(modal.getByText("I alt")).toBeVisible();

  // Products list container
  await expect(
    modal.getByRole("heading", { name: "Produkter" })
  ).toBeVisible();

  // Products from mock data
  await expect(modal.getByText("Surdejsbrød")).toBeVisible();
  await expect(modal.getByText("Hvedebrød")).toBeVisible();

  // Unit price + quantity (there are two lines in the mock with stk as unit)
  await expect(modal.getByText(/stk —/)).toHaveCount(2);

  // Notes
  await expect(modal.getByText(/mere brød/)).toBeVisible();     
  await expect(modal.getByText(/Skær i halve/)).toBeVisible();  

  // Check that the type is displayed
  await expect(modal.getByText(/Topping:/)).toBeVisible();

  // Check that both options are visible somewhere in the modal's product list
  await expect(modal.getByText(/Friske hindbær/)).toBeVisible();
  await expect(modal.getByText(/Hvid chokolade/)).toBeVisible();
});

test("modal can be closed via cross", async ({ page }) => {
  await page.goto("/orders");

  await page.getByText("Hans Jensen").click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  await page.getByLabel("Luk").click();

  await expect(modal).not.toBeVisible();
});

test("modal can be closed by clicking outside", async ({ page }) => {
  await page.goto("/orders");

  await page.getByText("Hans Jensen").click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // Click on backdrop
  await page.locator("div.bg-black\\/40").click({
    position: { x: 10, y: 10 },
  });

  await expect(modal).not.toBeVisible();
});
