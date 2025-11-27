import { test, expect } from '@playwright/test';
import { resetMockData } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test('create-order page shows product cards with name and price', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to "Opret bestilling"
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Wait until we are on the page (the heading is a good indicator)
  await expect(
    page.getByRole('heading', { name: 'Opret bestilling' })
  ).toBeVisible();

  // Find the product grid
  const grid = page.locator('section.grid');
  await expect(grid).toBeVisible();

  // Find all product cards (buttons in the grid)
  const cards = grid.getByRole('button');

  // Wait for the first card to actually render
  await expect(cards.first()).toBeVisible();

  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  // Check each card
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    // 1) Name in <h3>
    const nameElement = card.locator('h3');
    await expect(nameElement).toBeVisible();
    const nameText = (await nameElement.innerText()).trim();
    expect(nameText.length).toBeGreaterThan(0); // not empty name

    // 2) Price in <p> (fx "28.5 kr.")
    const priceElement = card.locator('p');
    await expect(priceElement).toBeVisible();
    const priceText = (await priceElement.innerText()).trim();

    // Price must end with "kr."
    expect(priceText).toMatch(/kr\.$/);
  }
});

test("create-order: mobile shows 1 card per row", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });

  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Opret bestilling" }).click();

  const grid = page.locator("section.grid");

  const columnCount = await grid.evaluate((el) => {
    return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
  });

  expect(columnCount).toBe(1);
});

test("create-order: desktop shows 3 cards per row", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "Opret bestilling" }).click();

  const grid = page.locator("section.grid");

  const columnCount = await grid.evaluate((el) => {
    return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
  });

  expect(columnCount).toBe(3);
});

test('Navigating to /createOrder, only bread category is marked', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  const activeClass = /bg-neutral-200/;

  // Find "Brød"-link in sidebar
  const broedLink = page.getByRole('link', { name: 'Brød', exact: true });
  await expect(broedLink).toHaveClass(activeClass);

  // Find ALL category links in the navigation sidebar
  const allCategoryLinks = await page.getByRole('link').all();

  for (const link of allCategoryLinks) {
    const text = (await link.innerText()).trim();

    // Skip "Brød"
    if (text === 'Brød') continue;

    // All others must not have active class
    await expect(link).not.toHaveClass(activeClass);
  }
});

const ORDER_CATEGORIES = [
  'Brød',
  'Morgenbrød',
  'Wienerbrød',
  'Konditor',
  'Mejeri',
  'Cafe',
  'Sæsonkager og andet',
  'Specialiteter',
  'Glutenfri fryser',
  'Festkager',
  'Kørsel',
  'Alle',
  'Arkiverede'

];

test('sidebar on create-order shows all categories', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Find sidebar (nav with "Kategorier")
  const sidebar = page.locator('nav', { hasText: 'Kategorier' });
  await expect(sidebar).toBeVisible();

  // Check that all expected categories are present
  for (const category of ORDER_CATEGORIES) {
    await expect(
      sidebar.getByRole('link', { name: category, exact: true })
    ).toBeVisible();
  }
});

test('filtering on Konditor shows only Konditor products and marks the category as active', async ({ page }) => {
  await page.goto('http://localhost:3000/createOrder');

  const sidebar = page.locator('nav', { hasText: 'Kategorier' });

  // Click the "Konditor" link in the sidebar
  const konditorLink = sidebar.getByRole('link', { name: 'Konditor', exact: true });
  await konditorLink.click();

  // Check that Konditor is marked as active
  await expect(konditorLink).toHaveClass(/bg-neutral-200/);

  // Check that no other categories are active
  const allCategoryLinks = sidebar.getByRole('link');
  const linkCount = await allCategoryLinks.count();
  for (let i = 0; i < linkCount; i++) {
    const link = allCategoryLinks.nth(i);
    const text = (await link.innerText()).trim();
    if (text === 'Konditor') continue;
    await expect(link).not.toHaveClass(/bg-neutral-200/);
  }

  // Grid with filtered products
  const grid = page.locator('section.grid');
  const cards = grid.getByRole('button');

  // There MUST be exactly 2 Konditor products
  await expect(cards).toHaveCount(2);

  // The products that MUST be here
  const hindbaertaerte = grid.getByRole('button', { name: /Hindbærtærte/i });
  const chokoladekage = grid.getByRole('button', { name: /Chokoladekage/i });

  await expect(hindbaertaerte).toBeVisible();
  await expect(chokoladekage).toBeVisible();

  // Products that MUST NOT be here
  const hvedebroed = grid.getByRole('button', { name: /Hvedebrød/i });
  await expect(hvedebroed).toHaveCount(0);
});

test('You can add more products to the order and summary shows the correct info', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Create Order page
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Open modal for Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();

  // Find the modal (overlay)
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // Name and price in the modal
  await expect(modal.getByRole('heading', { name: 'Hvedebrød' })).toBeVisible();
  await expect(modal.getByText('28.5 kr.')).toBeVisible();

  // Quantity: default should be 1
  const qtyInput = modal.getByRole('spinbutton', { name: 'Antal' });
  await expect(qtyInput).toHaveValue('1');

  // SSet quantity to 2
  await qtyInput.fill('2');

  // Note
  const noteInput = modal.getByRole('textbox', { name: 'Note (valgfri)' });
  await noteInput.fill('Test');

  // Add to order
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  const summary = page.locator('aside', { hasText: 'Bestilling' });
  await expect(summary).toBeVisible();

  const hvedebroedItem = summary.locator('div.border-b', {hasText: '2x Hvedebrød',}).first();

// 2x Hvedebrød is shown
  await expect(hvedebroedItem.getByText('2x Hvedebrød')).toBeVisible();

  // Line price: 57.00 kr. (28.5 * 2)
  await expect(hvedebroedItem.getByText('57.00 kr.')).toBeVisible();

  // Note: Test
  await expect(hvedebroedItem.getByText('Note: Test')).toBeVisible();

  // Total line at the bottom
  const totalLine = summary.locator('div', { hasText: 'Total' }).first();
  await expect(totalLine).toBeVisible();
  await expect(totalLine.getByText('57.00 kr.')).toBeVisible();

  // Open modal for Surdejsbrød
  await page.getByRole('button', { name: 'Surdejsbrød 32.5 kr.' }).click();

  const modal2 = page.locator('div.fixed.inset-0');
  await expect(modal2).toBeVisible();

  // Name and price in the modal
  await expect(modal2.getByRole('heading', { name: 'Surdejsbrød' })).toBeVisible();
  await expect(modal2.getByText('32.5 kr.')).toBeVisible();

  // Quantity default = 1
  const qtyInput2 = modal2.getByRole('spinbutton', { name: 'Antal' });
  await expect(qtyInput2).toHaveValue('1');

  // (we keep 1, no note this time)
  await modal2.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Order summary should now have 2 lines
  // Hvedebrød should still be there
  await expect(summary.getByText('2x Hvedebrød')).toBeVisible();
  await expect(summary.getByText('57.00 kr.')).toBeVisible();

  // Surdejsbrød-line: 1x Surdejsbrød + 32.50 kr.
  await expect(summary.getByText('1x Surdejsbrød')).toBeVisible();
  await expect(summary.getByText('32.50 kr.')).toBeVisible();

  // Total should be the sum: 89.50 kr.
  await expect(summary.getByText('89.50 kr.')).toBeVisible();

  // "Videre" and "Nulstil" buttons must be visible
  await expect(summary.getByRole('button', { name: 'Videre' })).toBeVisible();
  await expect(summary.getByRole('button', { name: 'Nulstil' })).toBeVisible();

  // Reset the order
  await summary.getByRole('button', { name: 'Nulstil' }).click();

  // Summary should now be empty
  await expect(summary.getByText('Ingen produkter i bestillingen endnu.')).toBeVisible();
});

test('closing product modal by clicking outside the modal', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Create Order page
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Open modal for Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();

  // Find the modal (overlay)
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // Click outside the modal content to close it
  await modal.click({ position: { x: 10, y: 10 } });

  // Ensure the modal is closed
  await expect(modal).toHaveCount(0);
});

test('closing product modal by clicking the "Annuller" button', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Create Order page
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Open modal for Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();

  // Find the modal (overlay)
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // Click the "Annuller" button to close the modal
  await modal.getByRole('button', { name: 'Annuller' }).click();

  // Ensure the modal is closed
  await expect(modal).toHaveCount(0);
});


