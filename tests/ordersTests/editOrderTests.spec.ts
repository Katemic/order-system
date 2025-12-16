import { test, expect } from "@playwright/test";
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockDataOrders();
});

test.afterAll(() => {
  resetMockDataOrders();
});

test("edit order: prefilled values, update, redirect and updated-banner", async ({ page }) => {
  await page.goto("http://localhost:3000/orders");

  const hansRow = page.getByRole("row", { name: /Hans Jensen/ });
  await hansRow.click();

  const modal = page.locator("div.fixed.inset-0");
  await expect(modal).toBeVisible();

  await modal.getByRole("link", { name: "Redigér kundeoplysninger" }).click();

  await expect(page).toHaveURL(/\/orders\/\d+\/editCustomerInfo/);

  await expect(
    page.getByRole("heading", {
      name: /Rediger kundeoplysninger|Kundeoplysninger/,
      level: 1,
    })
  ).toBeVisible();

  await expect(page.getByLabel("Navn på kunde")).toHaveValue("Hans Jensen");

  await page.getByLabel("Navn på kunde").fill("Hans Jensen (redigeret)");

  await page.getByRole("button", { name: /Gem ændringer/ }).click();

  await expect(page).toHaveURL(/\/orders(\?updated=true)?/);

  await expect(page.getByText("Bestilling er opdateret.")).toBeVisible();

  await expect(page.getByText("Hans Jensen (redigeret)")).toBeVisible();
});

test('Order detail modal shows "Redigér produkter" button', async ({ page }) => {
  await page.goto("/orders");
  await page.getByText("Hans Jensen").click();

  const editBtn = page.getByRole("link", { name: "Redigér produkter" });
  await expect(editBtn).toBeVisible();
});

test("Edit products page loads existing order items", async ({ page }) => {
  await page.goto("/orders");
  await page.getByText("Hans Jensen").click();
  await page.getByRole("link", { name: "Redigér produkter" }).click();

  await expect(page).toHaveURL(/\/orders\/1\/editProducts/);

  await expect(page.getByText(/3x Franskbrød/i).first()).toBeVisible();
  await expect(page.getByText(/1x Rundstykker/i).first()).toBeVisible();
  await expect(page.getByText(/mere brød/i).first()).toBeVisible();
});

test("Clicking an item opens edit modal with current quantity and note", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const item = page.getByText(/1x Rundstykker/i).first();
  await item.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  await expect(modal.getByLabel("Antal")).toHaveValue("1");
  await expect(modal.getByLabel("Note (valgfri)")).toHaveValue("mere brød");
});

test("Item can be removed from list", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const itemsBefore = await page.locator("aside div.border-b").count();

  await page.locator("button:text('✕')").first().click();

  const itemsAfter = await page.locator("aside div.border-b").count();

  expect(itemsAfter).toBe(itemsBefore - 1);
});

test("Edit products: can add customizations in modal and they show in OrderSummary", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  // Click Franskbrød
  const franskItem = page.getByText(/3x Franskbrød/i).first();
  await franskItem.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // Open "Customizations"
  const detailsSummary = modal.locator("summary", {
    hasText: "Tilpasninger (valgfrit)",
  });
  await expect(detailsSummary).toBeVisible();
  await detailsSummary.click();

  // Select a couple of specific options
  const hindbaer = modal.getByRole("checkbox", { name: /Friske hindbær/i });
  const hvidChoko = modal.getByRole("checkbox", { name: /Hvid chokolade/i });

  await hindbaer.check();
  await hvidChoko.check();

  // Save changes
  await modal.getByRole("button", { name: "Gem ændringer" }).click();

  // Now OrderSummary should show customizations under the Franskbrød line
  const summary = page.locator("aside", { hasText: "Bestilling" });
  await expect(summary).toBeVisible();

  const franskLine = summary.locator("div.border-b", { hasText: "3x Franskbrød" }).first();
  await expect(franskLine).toBeVisible();

  await expect(franskLine.getByText(/Topping:/)).toBeVisible();
  await expect(franskLine.getByText(/Friske hindbær/i)).toBeVisible();
  await expect(franskLine.getByText(/Hvid chokolade/i)).toBeVisible();
});

test("Edit products: saving persists customizations and shows them in order detail modal", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  // Open modal via Franskbrød
  await page.getByText(/3x Franskbrød/i).first().click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // Open customizations
  const detailsSummary = modal.locator("summary", {
    hasText: "Tilpasninger (valgfrit)",
  });
  await detailsSummary.click();

  // Choose an option
  const hindbaer = modal.getByRole("checkbox", { name: /Friske hindbær/i });
  await hindbaer.check();

  // Save changes
  await modal.getByRole("button", { name: "Gem ændringer" }).click();

  // Save entire order
  await page.getByRole("button", { name: "Gem ændringer" }).click();

  // Redirect to /orders?updated=true
  await expect(page).toHaveURL(/orders\?updated=true/);
  await expect(page.getByText("Bestilling er opdateret.")).toBeVisible();

  // Open order details again
  await page.getByText("Hans Jensen").click();
  const detailModal = page.locator("div.fixed.inset-0");
  await expect(detailModal).toBeVisible();

  // Here we expect the customization to be visible somewhere in the list of products
  await expect(detailModal.getByText(/Topping:/)).toBeVisible();
  await expect(detailModal.getByText(/Friske hindbær/i)).toBeVisible();
});

test("Saving edited order redirects and shows notification", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  const firstItem = page.getByText(/1x Rundstykker/).first();
  await firstItem.click();

  const modal = page.getByRole("dialog");
  await modal.getByLabel("Antal").fill("10");
  await modal.getByRole("button", { name: "Gem ændringer" }).click();

  await page.getByRole("button", { name: "Gem ændringer" }).click();

  await expect(page).toHaveURL(/orders\?updated=true/);
  await expect(page.getByText("Bestilling er opdateret.")).toBeVisible();

  await page.getByText("Hans Jensen").click();
  const detailModal = page.locator("div.fixed.inset-0");
  await expect(detailModal).toBeVisible();

  await expect(detailModal.getByText("Rundstykker10 stk — 100 kr.")).toBeVisible();
});

test("Back button returns to orders page", async ({ page }) => {
  await page.goto("/orders/1/editProducts");

  await page.getByRole("button", { name: /tilbage til bestillinger/i }).click();

  await expect(page).toHaveURL("/orders");
});
