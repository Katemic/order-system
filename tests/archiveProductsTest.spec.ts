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
  // Gå til products-siden
  await page.goto("http://localhost:3000/products");

  // Gå til Arkiverede via sidebaren
  await page.getByRole("link", { name: "Arkiverede" }).click();

  // Vent eksplicit på at Hvedebrød er i arkiverede-listen
  const archivedBreadButton = page.getByRole("button", {
    name: "Hvedebrød Hvedebrød",
  });
  await expect(archivedBreadButton).toBeVisible();

  // Åbn produktet
  await archivedBreadButton.click();

  // Genaktiver (først "Er du sikker?" → så bekræftelse)
  await page.getByRole("button", { name: "Genaktiver" }).click(); // åbner confirm
  await page.getByRole("button", { name: "Genaktiver" }).click(); // bekræfter

  // Tjek at Hvedebrød IKKE længere findes i Arkiverede
  await expect(
    page.getByRole("button", { name: "Hvedebrød Hvedebrød" })
  ).toHaveCount(0);

  // Gå til hovedproduktlisten (fx Alle)
  await page.getByRole("link", { name: "Alle" }).click();

  // Tjek at Hvedebrød NU findes igen i listen
  await expect(
    page.getByRole("button", { name: "Hvedebrød Hvedebrød" })
  ).toBeVisible();
});


