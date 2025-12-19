import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";

test.describe.configure({ mode: "serial" });

test.beforeAll(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test('can archive Hvedebrød and it disappears from the list, and it appears in the archived list', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  
  // Go to /products
  await page.getByRole('link', { name: 'Produkter' }).click();

  // Open the product Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();

  // Archive (first show “Are you sure?” modal → then confirm)
  await page.getByRole('button', { name: 'Arkiver' }).click(); // opens confirm
  await page.getByRole('button', { name: 'Arkiver' }).click(); // confirm

  // Check that Hvedebrød NO LONGER exists in the list
  await expect(
    page.getByRole('button', { name: 'Hvedebrød Hvedebrød' })
  ).toHaveCount(0);

  // Go to /archived
  await page.getByRole('link', { name: 'Arkiverede' }).click();
  // Check that Hvedebrød NOW EXISTS in the archived list
  await expect(page.getByRole('button', { name: 'Hvedebrød Hvedebrød' })).toBeVisible();
});

test("archived product can be unarchived and it reappears in the main product list", async ({ page }) => {
  // Go to products page
  await page.goto("http://localhost:3000/products");

  // Go to Archived via sidebar
  await page.getByRole("link", { name: "Arkiverede" }).click();

  // Wait explicitly for Hvedebrød to be in the archived list
  const archivedBreadButton = page.getByRole("button", {
    name: "Hvedebrød Hvedebrød",
  });
  await expect(archivedBreadButton).toBeVisible();

  // Open the product
  await archivedBreadButton.click();

  // Unarchive (first "Are you sure?" then confirm)
  await page.getByRole("button", { name: "Genaktiver" }).click(); // opens confirm
  await page.getByRole("button", { name: "Genaktiver" }).click(); // confirm

  // Check that Hvedebrød no longer exists in Archived
  await expect(
    page.getByRole("button", { name: "Hvedebrød Hvedebrød" })
  ).toHaveCount(0);

  // Go to main product list (e.g. Alle)
  await page.getByRole("link", { name: "Alle" }).click();

  // Check that Hvedebrød now exists again in the list
  await expect(
    page.getByRole("button", { name: "Hvedebrød Hvedebrød" })
  ).toBeVisible();
});


