import { test, expect } from '@playwright/test';
import { resetMockData } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test("Shows customization section for Surdejsbrød", async ({ page }) => {
  await page.goto("/products");

  await page.getByText("Surdejsbrød").click();

  await expect(page.getByText("Mulige tilpasninger")).toBeVisible();
});

test("Shows customization titles for Surdejsbrød", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  const toppingSummary = page.locator("summary", { hasText: "Topping" });
  const sizeSummary = page.locator("summary", { hasText: "Størrelse" });
  await expect(toppingSummary).toBeVisible();
  await expect(sizeSummary).toBeVisible();
});


test("Opens Topping and shows all options", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  await page.locator("summary", { hasText: "Topping" }).click();

  await expect(page.getByText("Friske hindbær")).toBeVisible();
  await expect(page.getByText("Hvid chokolade")).toBeVisible();
});

test("Topping and Størrelse can be open simultaneously", async ({ page }) => {
  await page.goto("/products");
  await page.getByText("Surdejsbrød").click();

  await page.locator("summary", { hasText: "Topping" }).click();
  await page.locator("summary", { hasText: "Størrelse" }).click();

  await expect(page.getByText("Friske hindbær")).toBeVisible();
  await expect(page.getByText("Lille")).toBeVisible();
});
