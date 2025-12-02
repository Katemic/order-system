import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Can delete product and it gets removed from the product list and notification is shown', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();

  // Open modal for Hvedebrød (product card in grid)
  const grid = page.locator('section.grid');
  const hvedebroedCard = grid.getByRole('button', { name: 'Hvedebrød Hvedebrød' });
  await expect(hvedebroedCard).toBeVisible();

  await hvedebroedCard.click();

  // Delete product
  await page.getByRole('button', { name: 'Slet produkt' }).click();
  await page.getByRole('button', { name: 'Slet', exact: true }).click();

  // Toast message
  await expect(
    page.getByText('Produkt "Hvedebrød" er slettet')
  ).toBeVisible();

  // Wait for the modal to disappear
  await expect(page.locator('div.fixed.inset-0')).toBeHidden();

  // Force a reload of the /products page to ensure we see the latest data
  await page.reload({ waitUntil: 'networkidle' });

  // Find grid again after reload
  const gridAfter = page.locator('section.grid');

  // Product card for Hvedebrød should now be gone from the grid
  const deletedCard = gridAfter.getByRole('button', { name: 'Hvedebrød Hvedebrød' });
  await expect(deletedCard).toHaveCount(0);
});

test('Delete button is shown and it activates a "are you sure" modal', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();
  await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();

  await expect(page.getByRole('button', { name: 'Slet produkt' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet produkt' }))
    .toHaveClass(/bg-red-600/);


  await page.getByRole('button', { name: 'Slet produkt' }).click();

  // Øverste heading
  await expect(page.getByRole('heading', { name: 'Er du sikker på, at du vil' })).toBeVisible();

  // Paragraffen med produktnavnet
  await expect(
    page.getByText(/Produkt(?:et)?\s+["“”]?Hvedebrød["“”]?\s+bliver\s+permanent\s+slettet/i)
  ).toBeVisible();

  // Begge knapper
  await expect(page.getByRole('button', { name: 'Annuller' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toHaveClass(/bg-red-600/);


});



