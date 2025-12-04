import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});


test('Can search on customers name', async ({ page }) => {
    await page.goto('/orders');
    await page.getByRole('textbox', { name: 'Søg bestillinger…' }).click();
    await page.getByRole('textbox', { name: 'Søg bestillinger…' }).fill('Hans');
    await page.getByRole('textbox', { name: 'Søg bestillinger…' }).press('Enter');
    await page.getByRole('button', { name: 'Søg' }).click();
    await page.waitForURL(/search=Hans/i);

    const rows = page.locator('tbody tr');

    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Hans');
});

test('You can search for products in an order', async ({ page }) => {
    await page.goto('/orders');
    await page.getByRole('textbox', { name: 'Søg bestillinger…' }).click();
    await page.getByRole('textbox', { name: 'Søg bestillinger…' }).fill('brød');
    await page.getByRole('button', { name: 'Søg' }).click();

    await page.waitForURL(/search=br%C3%B8d/i); // encoded "brød" → br%C3%B8d

    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(2);

});

test('Search resets when chosing all orders', async ({ page }) => {
    await page.goto('/orders');

    const rows = page.locator('tbody tr');

    // Sørg for at vi er i "Alle bestillinger"-tilstand,
    // så baseline 7 rækker giver mening
    await page.getByRole('button', { name: 'Alle bestillinger' }).click();

    // Vent til eventuel search er væk
    await page.waitForURL((url) => !url.searchParams.has("search"));

    await expect(rows).toHaveCount(7);

    const searchBox = page.getByRole('textbox', { name: 'Søg bestillinger…' });
    await searchBox.fill('brød');
    await page.getByRole('button', { name: 'Søg' }).click();

    await page.waitForURL(/search=br%C3%B8d/i);

    await expect(rows).toHaveCount(2);

    await page.getByRole('button', { name: 'Alle bestillinger' }).click();

    // Vent til URL IKKE længere indeholder search
    await page.waitForURL((url) => !url.searchParams.has("search"));
    
    await expect(rows).toHaveCount(7);
});

test("Search keeps range when searching in old orders", async ({ page }) => {
  await page.goto("/orders");

  // Change to 'Gamle bestillinger'
  await page.getByRole("button", { name: "Gamle bestillinger" }).click();

  // Wait for range=old in URL
  await page.waitForURL((url) => url.searchParams.get("range") === "old");

  const searchBox = page.getByRole("textbox", { name: "Søg bestillinger…" });
  await searchBox.fill("brød");

  await page.getByRole("button", { name: "Søg" }).click();

  // Now both search and range should be in the URL
  await page.waitForURL((url) => 
    url.searchParams.get("search") === "brød" &&
    url.searchParams.get("range") === "old"
  );

  // And when we then choose 'Alle bestillinger', search should be removed but range changes to all
  await page.getByRole("button", { name: "Alle bestillinger" }).click();

  await page.waitForURL((url) => 
    !url.searchParams.has("search") &&
    url.searchParams.get("range") === "all"
  );
});

