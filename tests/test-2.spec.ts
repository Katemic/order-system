import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();
  await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
  await page.getByRole('button', { name: 'Arkiver' }).click();
  await page.getByRole('button', { name: 'Arkiver' }).click();
  await page.getByRole('link', { name: 'Arkiverede' }).click();
});