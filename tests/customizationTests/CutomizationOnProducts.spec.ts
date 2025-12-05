import { test, expect } from '@playwright/test';
import { resetMockData } from "../helpers/cleanup";


test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test("Viser customization sektion for Surdejsbrød", async ({ page }) => {
  await page.goto("/products");

  // Åbn modal
  await page.getByText("Surdejsbrød").click();

  // Sektionstitel
  await expect(page.getByText("Mulige tilpasninger")).toBeVisible();
});

test("Viser customization titler for Surdejsbrød", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  const toppingSummary = page.locator("summary", { hasText: "Topping" });
  const sizeSummary = page.locator("summary", { hasText: "Størrelse" });
  await expect(toppingSummary).toBeVisible();
  await expect(sizeSummary).toBeVisible();
});


test("Åbner Topping og viser alle muligheder", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  await page.locator("summary", { hasText: "Topping" }).click();

  await expect(page.getByText("Friske hindbær")).toBeVisible();
  await expect(page.getByText("Hvid chokolade")).toBeVisible();
});

test("Topping og Størrelse kan være åbne samtidig", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  await page.locator("summary", { hasText: "Topping" }).click();
  await page.locator("summary", { hasText: "Størrelse" }).click();

  await expect(page.getByText("Friske hindbær")).toBeVisible();
  await expect(page.getByText("Stor")).toBeVisible();
});
