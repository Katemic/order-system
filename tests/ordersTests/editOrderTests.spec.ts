import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockDataOrders();
});

test.afterAll(() => {
  resetMockDataOrders();
});

test('edit order: prefilled values, update, redirect and updated-banner', async ({ page }) => {
  // 1) Go to orders overview
  await page.goto('http://localhost:3000/orders');

  // 2) Find an existing order for "Hans Jensen"
  // Click on the row or button that opens the detail modal
  const hansRow = page.getByRole('row', { name: /Hans Jensen/ });
  await hansRow.click();

  // 3) OrderDetailModal should now be visible
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // 4) Click on "Edit customer info" (Link in the modal)
  await modal.getByRole('link', { name: 'Redigér kundeoplysninger' }).click();

  // 5) We are now on /orders/[id]/editCustomerInfo
  await expect(page).toHaveURL(/\/orders\/\d+\/editCustomerInfo/);

  // H1 / header on the page
  await expect(
    page.getByRole('heading', { name: /Rediger kundeoplysninger|Kundeoplysninger/, level: 1 })
  ).toBeVisible();

  // 6) The form should be prefilled with existing data
  await expect(page.getByLabel('Navn på kunde')).toHaveValue('Hans Jensen');

  // Date from mock might be in the past relative to the test, so we set it to a safe future date
  //await page.getByLabel('Dato').fill('2099-01-01');

  // 7) Edit the customer name
  await page.getByLabel('Navn på kunde').fill('Hans Jensen (redigeret)');

  // 8) Submit the form
  await page
    .getByRole('button', { name: /Gennemfør bestilling/ })
    .click();

  // 9) After successful update → redirect to /orders?updated=true
  await expect(page).toHaveURL(/\/orders(\?updated=true)?/);

  // 10) Notification banner shows that the order is updated
  await expect(
    page.getByText('Bestilling er opdateret.')
  ).toBeVisible();

  // 11) The updated customer should now be visible in the order list UI
  await expect(
    page.getByText('Hans Jensen (redigeret)')
  ).toBeVisible();
});


test('Order detail modal shows "Redigér produkter" button', async ({ page }) => {
  await page.goto("/orders");
  await page.getByText("Hans Jensen").click();
  const editBtn = page.getByRole("link", { name: "Redigér produkter" });

  await expect(editBtn).toBeVisible();
});

test("Edit products page loads existing order items", async ({ page }) => {
  await page.goto("/orders");
  await page.getByText("Hans Jensen").click();
  await page.getByRole("link", { name: "Redigér produkter" }).click();

  await expect(page).toHaveURL(/\/orders\/1\/editProducts/);

  // Bekræft at produkter er vist i OrderSummary
  const firstItem = page.getByText(/3x Franskbrød/i).first();
  await expect(firstItem).toBeVisible();
  const secondItem = page.getByText(/1x Rundstykker/i).first();
  await expect(secondItem).toBeVisible();
  const note = page.getByText(/mere brød/i).first();
  await expect(note).toBeVisible();
});

test("Clicking an item opens edit modal with current quantity and note", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const firstItem = page.getByText(/1x Rundstykker/).first();
  await firstItem.click();

  const modal = page.getByRole("dialog");

  await expect(modal).toBeVisible();
  await expect(modal.getByLabel("Antal")).toHaveValue("1"); // fx ordre har quantity 2
  await expect(modal.getByLabel("Note (valgfri)")).toHaveValue("mere brød");
});

test("Item can be removed from list", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const itemsBefore = await page.locator("aside div.border-b").count();

  // Tryk på ✕ på første produkt
  await page.locator("button:text('✕')").first().click();

  const itemsAfter = await page.locator("aside div.border-b").count();

  expect(itemsAfter).toBe(itemsBefore - 1);
});

test("Saving edited order redirects and shows notification", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const firstItem = page.getByText(/1x Rundstykker/).first();
  await firstItem.click();
  const modal = page.getByRole("dialog");
  await modal.getByLabel("Antal").fill("10");
  await modal.getByRole("button", { name: "Gem ændringer" }).click();

  // Tryk videre
  await page.getByRole("button", { name: "Videre" }).click();

  // Redirect til /orders
  await expect(page).toHaveURL(/orders\?updated=true/);

  // Banner skal vises
  await expect(page.getByText("Bestilling er opdateret.")).toBeVisible();

  // Bekræft at ændring er gemt ved at åbne detaljer for ordren
  await page.getByText("Hans Jensen").click();
  const detailModal = page.locator('div.fixed.inset-0');
  await expect(detailModal).toBeVisible();
  await expect(detailModal.getByText('Rundstykker10 stk — 100 kr.')).toBeVisible();
});

test("Back button returns to orders page", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  await page.getByRole("button", { name: /tilbage til bestillinger/i }).click();

  await expect(page).toHaveURL("/orders");
});

