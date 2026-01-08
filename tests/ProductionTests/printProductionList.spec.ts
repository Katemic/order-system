import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockDataOrders();
});

test.afterAll(() => {
  resetMockDataOrders();
});


test("Shows print button in production header", async ({ page }) => {
  await page.goto("/production");

  await expect(
    page.getByRole("button", { name: /print viste produktionsliste/i })
  ).toBeVisible();
});

test("Opens print view in a new tab with correct URL", async ({page, context}) => {
  await page.goto("/production?date=2025-12-18");

  const [printPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /print viste produktionsliste/i }).click(),
  ]);

  await printPage.waitForLoadState();
  await expect(printPage).toHaveURL(/\/production\/print\?date=2025-12-18/);
});

test("Prints production list for a selected date range", async ({ page, context }) => {
  await page.goto("/production?from=2026-02-10&to=2026-02-13");

  const [printPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /print viste produktionsliste/i }).click(),
  ]);

  await printPage.waitForLoadState();

  await expect(printPage).toHaveURL(
    /from=2026-02-10&to=2026-02-13/
  );

  await expect(printPage.getByText("Chokoladekage")).toBeVisible();
  await expect(printPage.getByText("Hindbærtærte")).toBeVisible();
});


test("Print view shows correct header and production table", async ({ page, context }) => {
  await page.goto("/production?date=2026-02-11");

  const [printPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /print viste produktionsliste/i }).click(),
  ]);

  await printPage.waitForLoadState();

  await expect(
    printPage.getByRole("heading", { name: "Produktionsliste" })
  ).toBeVisible();

  await expect(printPage.getByText("Spandauer")).toBeVisible();
  await expect(printPage.getByText("Hindbærtærte")).toBeVisible();
});

test("Print view is a clean page without navigation", async ({ page, context }) => {
  await page.goto("/production");

  const [printPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("button", { name: /print viste produktionsliste/i }).click(),
  ]);

  await printPage.waitForLoadState();

  // No sidebar or navigation visible
  await expect(
    printPage.getByText("Filtrer produktion")
  ).not.toBeVisible();

   await expect(
    printPage.getByText("opret bestilling")
  ).not.toBeVisible();
});
