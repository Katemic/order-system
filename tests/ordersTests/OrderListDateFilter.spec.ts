import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test('Mobilview viser burger-menu på orders', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/orders');

    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
});

test('Desktop viser fast sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/orders');

    await expect(page.locator('aside')).toBeVisible();
});

test('Mobile sidebar lukker når man vælger dato', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/orders');

  // Åbn mobil-sidebar
  await page.getByRole('button', { name: 'Menu' }).click();

  const mobileSidebar = page.locator('div.w-64.bg-white.border-r');

  const dateInput = mobileSidebar.locator('input[type="date"]').first();

  await dateInput.fill("2025-12-12");

  // Sidebar skal nu lukkes
  await expect(page.locator('div.w-64.bg-white.border-r')).not.toBeVisible();
});


test("filtering på én dato virker", async ({ page }) => {
  await page.goto("/orders");

  const singleDate = page.locator('input[type="date"]').first();
  await expect(singleDate).toBeVisible();

  await page.locator('input[type="date"]').first().fill("2025-12-12");

  // Hent alle viste rækker efter filtrering
  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(1); // forvent 1 ordre fx

  // Tjek datoen
  const dateCell = rows.first().locator("td").nth(1); 
  await expect(dateCell).toHaveText("12.12.2025"); 
});

test("filtering på en periode virker", async ({ page }) => {
    await page.goto("/orders");

    const dateInputs = page.locator('input[type="date"]');
    await expect(dateInputs.nth(1)).toBeVisible(); // fromDate
    await expect(dateInputs.nth(2)).toBeVisible(); // toDate

    const inputs = page.getByRole('textbox');

    await inputs.nth(2).fill("2025-12-12"); // fromDate
    await sleep(1000); 
    await inputs.nth(3).fill("2025-12-13"); // toDate

    const rows = page.locator("table tbody tr");
    await expect(rows).toHaveCount(3); // alt efter din mockdata

    // Tjek at alle datoer ligger i intervallet
    const dates = await rows.locator("td:nth-child(2)").allTextContents();

    for (const d of dates) {
        const [day, month, year] = d.split(".");
        const iso = `${year}-${month}-${day}`;
        expect(iso >= "2025-12-12" && iso <= "2025-12-13").toBeTruthy();
    }
});

test('"I dag" filtrerer til kun dagens bestillinger', async ({ page }) => {
  await page.goto("/orders");
  await expect(page.getByRole("button", { name: "I dag" })).toBeVisible();

  await page.getByRole("button", { name: "I dag" }).click();

  const rows = page.locator("table tbody tr");
  await expect(rows).toHaveCount(1);

  const today = new Date().toISOString().slice(0, 10);
  const [y, m, d] = today.split("-");
  const formatted = `${d}.${m}.${y}`;

  await expect(rows.first().locator("td").nth(1)).toHaveText(formatted);
});

test('"Alle bestillinger" nulstiller filtrering', async ({ page }) => {
    await page.goto("/orders");
    await expect(page.getByRole("button", { name: "Alle bestillinger" })).toBeVisible();
    const rows = page.locator("table tbody tr");

    // Filtrer først
    await page.locator('input[type="date"]').first().fill("2025-12-13");
    await expect(rows).toHaveCount(2);


    // Nulstil
    await page.getByRole("button", { name: "Alle bestillinger" }).click();

    // Nu skal ALLE mock-ordrer vises igen
    await expect(rows).toHaveCount(7);
});


