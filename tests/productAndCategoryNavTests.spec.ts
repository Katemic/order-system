import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test('Navigating to /products, only bread category is marked', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('link', { name: 'Produkter' }).click();

  const activeClass = /bg-neutral-200/;

  // Find the Bread link
  const broedLink = page.getByRole('link', { name: 'Brød', exact: true });
  await expect(broedLink).toHaveClass(activeClass);

  // Find ALL category links (they are all inside the navigation menu)
  const allCategoryLinks = await page.getByRole('link').all();

  for (const link of allCategoryLinks) {
    const text = await link.innerText();

    // Skip "Bread"
    if (text.trim() === "Brød") continue;

    // Check that all others do NOT have active class
    await expect(link).not.toHaveClass(activeClass);
  }
});

test("mobil: 1 produkt-card per row", async ({ page }) => {
  // Mobil viewport
  await page.setViewportSize({ width: 375, height: 800 });

  await page.goto("http://localhost:3000/products");

  const grid = page.locator("section.grid");

  // Get actual number of columns from computed style
  const columnCount = await grid.evaluate((el) => {
    return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
  });

  expect(columnCount).toBe(1);
});

test("desktop: 3 produkt-cards per row", async ({ page }) => {
  // Desktop viewport
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto("http://localhost:3000/products");

  const grid = page.locator("section.grid");

  const columnCount = await grid.evaluate((el) => {
    return window.getComputedStyle(el).gridTemplateColumns.split(" ").length;
  });

  expect(columnCount).toBe(3);
});

test('product-card shows name "Hvedebrød" and image', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Find grid-section with product cards
  const grid = page.locator('section.grid');

  // Find product card specifically for Hvedebrød
  const card = grid.getByRole('button', { name: /Hvedebrød/i });

  // Check that the card exists and is visible
  await expect(card).toBeVisible();

  // Check that the name <h3> exists and has the correct text
  const nameElement = card.locator('h3');
  await expect(nameElement).toBeVisible();
  await expect(nameElement).toHaveText('Hvedebrød');

  // Check that the image is visible
  const image = card.locator('img');
  await expect(image).toBeVisible();
});


test('product-modal shows all data and buttons for Hvedebrød', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Click on the product card for Hvedebrød
  await page.getByRole('button', { name: /Hvedebrød/ }).click();

  // 1) Modal overlay
  const overlay = page.locator('div.fixed.inset-0');
  await expect(overlay).toBeVisible();

  // ========== BASIC DATA ==========

  // 2) Title
  const title = page.locator('.modal-title');
  await expect(title).toBeVisible();
  await expect(title).toHaveText('Hvedebrød');

  // 3) Category
  const category = page.locator('.modal-category');
  await expect(category).toBeVisible();
  await expect(category).toHaveText('Brød');

  // 4) Price
  const price = page.locator('.modal-price');
  await expect(price).toBeVisible();
  await expect(price).toHaveText('28.5 kr.');

  // 5) Ingredients
  const ingredientsTitle = page.locator('.modal-subtitle');
  await expect(ingredientsTitle).toHaveText('Ingredienser');

  const ingredientsText = page.locator('.modal-description');
  await expect(ingredientsText).toHaveText('Hvedemel, vand, gær, salt');

  // 6) Image
  const image = overlay.locator('.modal-image-wrapper img[alt="Hvedebrød"]');
  await expect(image).toBeVisible();


  // ========== NUTRITION DATA ==========
  const nutritionSectionTitle = page.locator('.modal-section-title');
  await expect(nutritionSectionTitle).toHaveText('Næringsindhold pr. 100 g');

  // helper for nutrition
  const nutritionValue = (label: string) =>
    page
      .locator('div.flex.justify-between.gap-2', {
        has: page.getByText(label),
      })
      .locator('.modal-value');

  await expect(nutritionValue('Energi (kcal)')).toHaveText('250');
  await expect(nutritionValue('Energi (kJ)')).toHaveText('1046');
  await expect(nutritionValue('Fedt (g)')).toHaveText('2');
  await expect(nutritionValue('Heraf mættede fedtsyrer (g)')).toHaveText('0.3');
  await expect(nutritionValue('Kulhydrat (g)')).toHaveText('48');
  await expect(nutritionValue('Heraf sukkerarter (g)')).toHaveText('2');
  await expect(nutritionValue('Kostfibre (g)')).toHaveText('3');
  await expect(nutritionValue('Protein (g)')).toHaveText('9');
  await expect(nutritionValue('Salt (g)')).toHaveText('1.2');
  await expect(nutritionValue('Vandindhold (g)')).toHaveText('36');

  // ========== BUTTONS ==========

  // "Rediger produkt" link
  const editButton = page.getByRole('link', { name: 'Rediger produkt' });
  await expect(editButton).toBeVisible();
  await expect(editButton).toHaveAttribute('href', '/products/1/edit');

  // Close button
  const closeButton = page.getByRole('button', { name: 'Luk' });
  await expect(closeButton).toBeVisible();

  // Close the modal
  await closeButton.click();
  await expect(overlay).toBeHidden();
});

const CATEGORIES = [
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
];

test('sidebar shows all categories', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Find the sidebar (nav containing "Categories")
  const sidebar = page.locator('nav', { hasText: 'Kategorier' });
  await expect(sidebar).toBeVisible();

  // Check that all category links exist
  for (const category of CATEGORIES) {
    await expect(
      sidebar.getByRole('link', { name: category, exact: true }),
    ).toBeVisible();
  }
});

test('default /products shows only products with category Bread', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  // Grid with the products
  const grid = page.locator('section.grid');
  const cards = grid.getByRole('button');
  const count = await cards.count();

  // If you expect at least 1 product:
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    // Click to open modal
    await card.click();

    // Check category in modal
    const categoryLabel = page.locator('.modal-category');
    await expect(categoryLabel).toBeVisible();
    await expect(categoryLabel).toHaveText('Brød');

    // Close modal again
    await page.getByRole('button', { name: 'Luk' }).click();
    await expect(page.locator('div.fixed.inset-0')).toBeHidden();
  }
});

test('filtering on Konditor shows only Konditor products and marks the category as active', async ({ page }) => {
  await page.goto('http://localhost:3000/products');

  const sidebar = page.locator('nav', { hasText: 'Kategorier' });

  // Click on "Konditor" in the sidebar
  const konditorLink = sidebar.getByRole('link', { name: 'Konditor', exact: true });
  await konditorLink.click();

  // Check that the Konditor link is marked as active (bg-neutral-200)
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
  const count = await cards.count();

  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);

    await card.click();

    const categoryLabel = page.locator('.modal-category');
    await expect(categoryLabel).toBeVisible();
    await expect(categoryLabel).toHaveText('Konditor');

    await page.getByRole('button', { name: 'Luk' }).click();
    await expect(page.locator('div.fixed.inset-0')).toBeHidden();
  }
});





