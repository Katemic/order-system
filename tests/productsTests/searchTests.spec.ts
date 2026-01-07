import { test, expect } from '@playwright/test';

test('search results for "brød" contains only products with "brød"', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Write search text
  await page.getByRole('textbox', { name: 'Søg produkter…' }).fill('brød');

  // Click "Søg" and wait for the page to finish loading
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('button', { name: 'Søg' }).click(),
  ]);

  const grid = page.locator('section.grid');
  await expect(grid).toBeVisible();

  const cards = grid.getByRole('button');

  // Wait for at least one card to be visible (otherwise we will get count = 0)
  await expect(cards.first()).toBeVisible();

  const count = await cards.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const name = (await card.locator('h3').innerText()).toLowerCase();
    expect(name).toContain('brød');
  }
});

test('searching for an invalid word returns no results', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Search for something that doesn't exist
  await page.getByRole('textbox', { name: 'Søg produkter…' }).fill('dfjfdghdfjd');

  // Click "Søg" and wait for the page to finish loading
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('button', { name: 'Søg' }).click(),
  ]);

  const grid = page.locator('section.grid');
  await expect(grid).toBeVisible();

  // Wait for either cards or no-results message
  const noResults = grid.getByText('Ingen produkter fundet.');

  await expect(noResults).toBeVisible();

  // Cards must be 0
  const cards = grid.getByRole('button');
  await expect(cards).toHaveCount(0);
});





