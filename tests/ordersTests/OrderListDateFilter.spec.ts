import { test, expect } from '@playwright/test';
import { resetMockDataOrders } from "../helpers/cleanup";

test.beforeEach(() => {
    resetMockDataOrders();
});

test.afterAll(() => {
    resetMockDataOrders();
});


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

    const inputs = page.locator('input[type="date"]');

    await inputs.nth(1).fill("2025-12-12"); // fromDate
    await inputs.nth(2).fill("2025-12-13"); // toDate

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

const BASE_URL = "http://localhost:3000";

test("orders: 'Kun leveringer' filter viser kun leveringsordrer og kan toggles", async ({
  page,
}) => {
  await page.goto(`${BASE_URL}/orders`);

  const deliveryCheckbox = page.getByLabel("Kun leveringer");

  // Start: ikke checked
  await expect(deliveryCheckbox).not.toBeChecked();

  // Først: både pickup og delivery synlige
  await expect(page.getByText("Hans Jensen")).toBeVisible();    // pickup
  await expect(page.getByText("Maria Madsen")).toBeVisible();   // delivery
  await expect(page.getByText("Sofie Sørensen")).toBeVisible(); // delivery

  // 🔘 Slå "Kun leveringer" til (klik i stedet for .check())
  await deliveryCheckbox.click();

  // Efter navigation: hent en frisk locator og assert checked
  await expect(page.getByLabel("Kun leveringer")).toBeChecked();

  // Pickup-ordrer skal være væk
  await expect(page.getByText("Hans Jensen")).toHaveCount(0);
  await expect(page.getByText("Peter Larsen")).toHaveCount(0);
  await expect(page.getByText("Kasper Nielsen")).toHaveCount(0);
  await expect(page.getByText("Nina Kristensen")).toHaveCount(0);

  // Delivery-ordrer skal være der
  await expect(page.getByText("Maria Madsen")).toBeVisible();
  await expect(page.getByText("Frederikke Holm")).toBeVisible();
  await expect(page.getByText("Sofie Sørensen")).toBeVisible();

  // 🔘 Slå filter fra igen
  await page.getByLabel("Kun leveringer").click();
  await expect(page.getByLabel("Kun leveringer")).not.toBeChecked();

  // Pickup er tilbage
  await expect(page.getByText("Hans Jensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toBeVisible();
});

test("orders: 'Kun leveringer' kombineret med dato-filter", async ({ page }) => {
  await page.goto(`${BASE_URL}/orders`);

  // Vælg dato 2025-12-13 (Sofie = delivery, Nina = pickup)
  const dateInput = page.locator('input[type="date"]').first();
  await dateInput.fill("2025-12-13");

  await expect(page.getByText("Sofie Sørensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toBeVisible();

  // Slå "Kun leveringer" til
  await page.getByLabel("Kun leveringer").click();
  await expect(page.getByLabel("Kun leveringer")).toBeChecked();

  // Kun Sofie (delivery) tilbage
  await expect(page.getByText("Sofie Sørensen")).toBeVisible();
  await expect(page.getByText("Nina Kristensen")).toHaveCount(0);
});

