import { test, expect } from "@playwright/test";
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockDataOrders();
});

test.afterAll(() => {
  resetMockDataOrders();
});

test("Print-button is visible, opens new tab, and print page shows the same orders as /orders", async ({ page }) => {
  // Use range=all so we don't hit the "today only" filter and get 0
  await page.goto("http://localhost:3000/orders?range=all");

  // 1) Print button is visible
  const printBtn = page.getByRole("button", { name: /print viste ordrer/i });
  await expect(printBtn).toBeVisible();

  // 2) Read the orders actually displayed in the table (customer names)
  const rows = page.locator("table tbody tr");
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);

  const customerNames: string[] = [];
  for (let i = 0; i < rowCount; i++) {
    const nameCell = rows.nth(i).locator("td").first();
    const text = (await nameCell.innerText()).trim();
    if (text) customerNames.push(text);
  }

  // 3) Click print button and wait for new tab
  const [popup] = await Promise.all([
    page.waitForEvent("popup"),
    printBtn.click(),
  ]);

  await popup.waitForLoadState("domcontentloaded");

  // 4) URL is /orders/print and has the same query params (range=all)
  await expect(popup).toHaveURL(/\/orders\/print(\?.*)?$/);
  await expect(popup).toHaveURL(/range=all/);

  // 5) Print page shows the same number of orders as in the table
  const printedOrders = popup.locator("h2", { hasText: /Bestilling\s+#/i });
  await expect(printedOrders).toHaveCount(rowCount);

  // 6) Print page contains the same customer names
  const toCheck = customerNames.slice(0, 5);
  for (const name of toCheck) {
    await expect(
  popup.getByRole("heading", { name: new RegExp(name) })
).toBeVisible();
  }
});
