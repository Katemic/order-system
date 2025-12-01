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


test('Videre-button is disabled when there are no products in the order', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  const summary = page.locator('aside', { hasText: 'Bestilling' });
  await expect(summary).toBeVisible();

  // It should say that there are no products
  await expect(
    summary.getByText('Ingen produkter i bestillingen endnu.')
  ).toBeVisible();

  // Videre-button should be disabled
  const nextButton = summary.getByRole('button', { name: 'Videre' });
  await expect(nextButton).toBeDisabled();
});

test('Videre-button navigates to /createOrder/customerInfo and order-summary follows', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Open modal for Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();

  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // SSet quantity = 2 and note "Test"
  const qtyInput = modal.getByRole('spinbutton', { name: 'Antal' });
  await qtyInput.fill('2');

  const noteInput = modal.getByRole('textbox', { name: 'Note (valgfri)' });
  await noteInput.fill('Test');

  // Add to order
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Ensure it is in summary
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  await expect(summary.getByText('2x Hvedebrød')).toBeVisible();
  await expect(summary.getByText('57.00 kr.').first()).toBeVisible();

  // Videre-button should now be enabled
  const nextButton = summary.getByRole('button', { name: 'Videre' });
  await expect(nextButton).toBeEnabled();

  // Click Videre
  await nextButton.click();

  // We should now be on the customerInfo page
  await expect(
  page.getByRole('heading', { name: 'Kundeoplysninger', level: 2 })).toBeVisible();

  // And order-summary should still show the same items
  const customerSummary = page.locator('section', { hasText: 'Din bestilling' });
  await expect(customerSummary).toBeVisible();
  await expect(customerSummary.getByText('2x Hvedebrød')).toBeVisible();
  await expect(customerSummary.getByText('57.00 kr.').first()).toBeVisible();
});

test('Tilbage-button on customerInfo goes back to /createOrder and preserves order-summary', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Open modal for Hvedebrød
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();

  // Let default antal = 1, no note
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Click Videre
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  const nextButton = summary.getByRole('button', { name: 'Videre' });
  await nextButton.click();

  // We are on customerInfo
  await expect(
  page.getByRole('heading', { name: 'Kundeoplysninger', level: 2 })).toBeVisible();

  // Order-summary shows 1x Hvedebrød
  const customerSummary = page.locator('section', { hasText: 'Din bestilling' });
  await expect(customerSummary.getByText('1x Hvedebrød')).toBeVisible();

  // Click Tilbage-button
  await page.getByRole('link', { name: 'Tilbage' }).click();

  // Back on /createOrder
  await expect(
    page.getByRole('heading', { name: 'Opret bestilling' })
  ).toBeVisible();

  const summaryAgain = page.locator('aside', { hasText: 'Bestilling' });
  await expect(summaryAgain.getByText('1x Hvedebrød')).toBeVisible();
});

test('On /createOrder/customerInfo without products the "Gennemfør bestilling" button is disabled', async ({ page }) => {
  // Directly to customerInfo without localStorage content
  await page.goto('http://localhost:3000/createOrder/customerInfo');

  // Summary should show that there are no products
  await expect(
    page.getByText('Der er ingen produkter i bestillingen.')
  ).toBeVisible();

  // Submit-button should be disabled
  const submitButton = page.getByRole('button', { name: 'Gennemfør bestilling' });
  await expect(submitButton).toBeDisabled();
});

test('CustomerInfo shows validation errors when required fields are missing (pickup)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Add one product to the order
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Go to customerInfo
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  const nextButton = summary.getByRole('button', { name: 'Videre' });
  await nextButton.click();

  // We are on customerInfo
    await expect(
  page.getByRole('heading', { name: 'Kundeoplysninger', level: 2 })).toBeVisible();;

  // Default is Afhentning (pickup), so we click Gennemfør bestilling without filling forms
  const submitButton = page.getByRole('button', { name: 'Gennemfør bestilling' });
  await submitButton.click();

  // Error messages should be visible
  await expect(
    page.getByText('Der er fejl i formularen. Ret venligst de markerede felter.')
  ).toBeVisible();

  // Field errors – these strings come from submitOrderAction
  await expect(
    page.getByText('Dato for bestilling er påkrævet.')
  ).toBeVisible();

  await expect(
    page.getByText('Navn på kunde er påkrævet.')
  ).toBeVisible();

  await expect(
    page.getByText('Bestilt af er påkrævet.')
  ).toBeVisible();

  // Pickup expects afhentningstidspunkt
  await expect(
    page.getByText('Afhentningstidspunkt er påkrævet.')
  ).toBeVisible();
});

test('pickup/delivery toggle shows the right fields and updates fulfillmentType', async ({ page }) => {
  // Go directly to customer info page
  await page.goto('http://localhost:3000/createOrder/customerInfo');

  // Find toggle buttons
  const pickupButton = page.getByRole('button', { name: /Afhentning/ });
  const deliveryButton = page.getByRole('button', { name: /Levering/ });

  // Hidden field for fulfillmentType
  const fulfillmentHidden = page.locator('input[type="hidden"][name="fulfillmentType"]');

  // --- START: expect pickup as default ---
  await expect(pickupButton).toBeVisible();
  await expect(deliveryButton).toBeVisible();

  // hidden field should start with "pickup"
  await expect(fulfillmentHidden).toHaveValue('pickup');

  // Pickup fields should be visible
  await expect(page.getByLabel('Afhentningstidspunkt')).toBeVisible();

  // Delivery fields must NOT be there
  await expect(page.getByLabel('Adresse')).toHaveCount(0);
  await expect(page.getByLabel('Postnr')).toHaveCount(0);
  await expect(page.getByLabel('Leveringstidspunkt')).toHaveCount(0);

  // --- CHANGE TO DELIVERY ---
  await deliveryButton.click();

  // hidden field should now be "delivery"
  await expect(fulfillmentHidden).toHaveValue('delivery');

  // Pickup fields must NOT be there
  await expect(page.getByLabel('Afhentningstidspunkt')).toHaveCount(0);

  // Delivery fields MUST be there
  await expect(page.getByLabel('Adresse')).toBeVisible();
  await expect(page.getByLabel('Postnr')).toBeVisible();
  await expect(page.getByLabel('Leveringstidspunkt')).toBeVisible();

  // --- SHIFT BACK TO PICKUP ---
  await pickupButton.click();

  await expect(fulfillmentHidden).toHaveValue('pickup');
  await expect(page.getByLabel('Afhentningstidspunkt')).toBeVisible();
  await expect(page.getByLabel('Adresse')).toHaveCount(0);
  await expect(page.getByLabel('Postnr')).toHaveCount(0);
  await expect(page.getByLabel('Leveringstidspunkt')).toHaveCount(0);
});

test('pickup: invalid afhentningstidspunkt gives validation error', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Add product to order (Hvedebrød)
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Go to kundeinfo
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  const nextButton = summary.getByRole('button', { name: 'Videre' });
  await nextButton.click();

  // We are now on Kundeoplysninger
  await expect(
    page.getByRole('heading', { name: 'Kundeoplysninger', level: 2 })
  ).toBeVisible();

  // Fill required fields (pickup)
  await page.getByLabel('Dato').fill('2025-12-24');
  await page.getByLabel('Navn på kunde').fill('Test Kunde');
  await page.getByLabel('Bestilt af').fill('Test Ekspedient');

  // Invalid afhentningstid
  await page.getByLabel('Afhentningstidspunkt').fill('kl to');

  // Send formular
  await page.getByRole('button', { name: 'Gennemfør bestilling' }).click();

  // General error about form errors
  await expect(
    page.getByText('Der er fejl i formularen. Ret venligst de markerede felter.')
  ).toBeVisible();

  // Specific error for tidspunkt
  await expect(
    page.getByText(
      "Ugyldigt format. Brug fx: 14, kl 14, 14.00, 14-16."
    )
  ).toBeVisible();
});


test('pickup: valid afhentningstidspunkt is accepted (no time errors)', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Go to Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Add product to order (Hvedebrød)
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Go to kundeinfo
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  await summary.getByRole('button', { name: 'Videre' }).click();

  // Fill all required fields for pickup
  await page.getByLabel('Dato*').fill('2025-12-24');
  await page.getByLabel('Navn på kunde*').fill('Test Kunde');
  await page.getByLabel('Bestilt af*').fill('Test Ekspedient');
  await page.getByLabel('Afhentningstidspunkt*').fill('14-16');

  // Send formular
  await page.getByRole('button', { name: 'Gennemfør bestilling' }).click();

  // Here we expect that the order is valid and that we are redirected to /orders
  await page.waitForURL(/\/orders/);

  // Notifikation about created order is visible
  await expect(
    page.getByText('Bestilling er oprettet')
  ).toBeVisible();
});

test('success-flow: gennemfører bestilling, rydder orderItems og viser tom kurv efterfølgende', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Gå til Opret bestilling
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Tilføj et produkt (Hvedebrød)
  await page.getByRole('button', { name: 'Hvedebrød 28.5 kr.' }).click();
  const modal = page.locator('div.fixed.inset-0');
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: 'Tilføj til ordre' }).click();

  // Tjek at summary har produktet
  const summary = page.locator('aside', { hasText: 'Bestilling' });
  await expect(summary.getByText('1x Hvedebrød')).toBeVisible();

  // Videre til kundeinfo
  await summary.getByRole('button', { name: 'Videre' }).click();

  // Udfyld minimum for en gyldig pickup-bestilling
  await page.getByLabel('Dato*').fill('2025-12-24');
  await page.getByLabel('Navn på kunde*').fill('Kunde Test');
  await page.getByLabel('Bestilt af*').fill('Ekspedient Test');
  await page.getByLabel('Afhentningstidspunkt*').fill('14');

  // Gennemfør bestilling
  await page.getByRole('button', { name: 'Gennemfør bestilling' }).click();

  // Redirect til /orders
  await page.waitForURL(/\/orders/);

  // Notifikation om oprettet ordre
  await expect(
    page.getByText('Bestilling er oprettet')
  ).toBeVisible();

  // Gå tilbage til "Opret bestilling"
  await page.getByRole('link', { name: 'Opret bestilling' }).click();

  // Summary skal nu være tom, fordi localStorage er ryddet i success-flowet
  const newSummary = page.locator('aside', { hasText: 'Bestilling' });
  await expect(
    newSummary.getByText('Ingen produkter i bestillingen endnu.')
  ).toBeVisible();
});

