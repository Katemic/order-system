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
  await page.getByLabel('Dato').fill('2099-01-01');

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
