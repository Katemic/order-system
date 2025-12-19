import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});

test("Can delete order and it gets removed from the table and notification is shown", async ({ page }) => {
  await page.goto("/orders");

  await page.getByRole('cell', { name: 'Hans Jensen' }).click();
  await page.getByRole('button', { name: 'Slet bestilling' }).click();
  await page.getByRole('button', { name: 'Slet', exact: true }).click();

  // Notification should appear
  await expect(
    page.getByText(/Bestilling #1 er slettet\./)
  ).toBeVisible();

  // The row with order 1 must no longer exist
  await expect(
    page.getByRole("row", { name: /Hans Jensen/i })
  ).toHaveCount(0);
});



test('Delete button is shown and it activates a "are you sure" modal', async ({ page }) => {
  await page.goto("/orders");

  await page.getByRole('cell', { name: 'Hans Jensen' }).click();

  await expect(page.getByRole('button', { name: 'Slet bestilling' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet bestilling' }))
    .toHaveClass(/bg-red-600/);


  await page.getByRole('button', { name: 'Slet bestilling' }).click();

  // Top heading
  await expect(page.getByRole('heading', { name: 'Er du sikker på, at du vil' })).toBeVisible();

  // Paragraph with product name
  await expect(
    page.getByText(/Bestilling #1 bliver permanent slettet\./)
  ).toBeVisible();

  // Both buttons
  await expect(page.getByRole('button', { name: 'Annuller' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toHaveClass(/bg-red-600/);
});

