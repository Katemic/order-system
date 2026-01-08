import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockDataOrders();
});

test.afterAll(() => {
  resetMockDataOrders();
});

test("Shows today's production by default", async ({ page }) => {
  await page.goto("/production");

  const now = new Date();
  if (now.getHours() >= 18) {
    now.setDate(now.getDate() + 1);
  }
  const today = now.toISOString().slice(0, 10);
  await expect(page).toHaveURL(new RegExp(`date=${today}`));
});

test("Allows selecting a single date", async ({ page }) => {
  await page.goto("/production");

  await page.getByRole('textbox').first().fill('2026-02-11');
  await page.getByRole('textbox').first().press('Enter');

  await expect(page).toHaveURL(/date=2026-02-11/);
  await expect(page.getByText("Spandauer")).toBeVisible();
  await expect(page.getByText("Hindbærtærte")).toBeVisible();
});

test("Allows selecting a date range", async ({ page }) => {
  await page.goto("/production");

  await page.getByRole("textbox").nth(1).fill("2026-02-10");
  await page.getByRole("textbox").nth(2).fill("2026-02-13");
  await page.getByRole("textbox").nth(2).press("Enter");

  await expect(page.getByText("Chokoladekage")).toBeVisible();
  await expect(page.getByText("Hindbærtærte")).toBeVisible();
  await expect(page.getByText("Spandauer")).toBeVisible();
  await expect(page.getByText("Surdejsbrød").first()).toBeVisible();
  await expect(page.getByText("Hvedebrød").first()).toBeVisible();
});

test("Groups products without customizations into a single row", async ({ page }) => {
  await page.goto("/production?from=2026-02-11&to=2026-02-13");

  const hindbaer = page.getByText("Hindbærtærte");
  await expect(hindbaer).toHaveCount(1);
});

test("Displays products with customizations as separate rows", async ({ page }) => {
  await page.goto("/production?from=2025-12-11&to=2026-02-13");

  const surdejsbrød = page.getByText("Surdejsbrød");
  await expect(surdejsbrød).toHaveCount(2);
  await expect(page.getByText("Friske hindbær")).toBeVisible();
});

test("Allows filtering by production category", async ({ page }) => {
  await page.goto("/production?from=2025-12-11&to=2026-02-13");

  await page.getByRole('combobox').selectOption('Konditor');

  await expect(page.getByText("Hindbærtærte")).toBeVisible();
    await expect(page.getByText("Spandauer")).not.toBeVisible();
});

test("Highlights products that must be ready at or before 07:00", async ({ page }) => {
  await page.goto("/production?from=2025-12-11&to=2026-02-13");

  const early = page.getByText(/kl 06/);
  await expect(early).toHaveClass(/text-amber-700/);
});