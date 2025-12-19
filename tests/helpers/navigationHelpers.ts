import { Page } from '@playwright/test';

export async function gotoProducts(page: Page) {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();
}

