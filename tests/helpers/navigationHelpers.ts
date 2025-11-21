import { Page } from '@playwright/test';

// small navigation helpers used across tests
export async function gotoProducts(page: Page) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();
}

