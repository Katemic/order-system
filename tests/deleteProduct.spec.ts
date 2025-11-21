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
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('button', { name: 'Slet produkt' }).click();
    await page.getByRole('button', { name: 'Slet', exact: true }).click();

    await expect(page.getByText('Produkt "Hvedebrød" er slettet')).toBeVisible();
    sleep(1000);
    await expect(page.getByRole('button', { name: 'Hvedebrød Hvedebrød' })).not.toBeVisible();
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
  await expect(page.getByRole('heading', { name: 'Er du sikker?' })).toBeVisible();

  // Paragraffen med produktnavnet
  await expect(
    page.getByText(/Produktet “Hvedebrød” vil blive permanent fjernet\./)
  ).toBeVisible();

  // Begge knapper
  await expect(page.getByRole('button', { name: 'Annuller' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Slet', exact: true })).toHaveClass(/bg-red-600/);


});



