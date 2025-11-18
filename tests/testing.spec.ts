import { test, expect } from "@playwright/test";
import { resetMockData } from "./helpers/cleanup";

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('Kaaaage');
    await page.locator('input[name="price"]').click();
    await page.locator('input[name="price"]').fill('45');
    await page.getByRole('combobox').selectOption('Konditor');
    await page.getByRole('button', { name: 'Opret' }).click();
    await page.getByRole('button', { name: 'Luk' }).click();
    await page.getByRole('link', { name: 'Konditor' }).click();
    await page.getByRole('button', { name: 'Kaaaage Kaaaage' }).click();
    expect(await page.locator('text=Kaaaage').nth(1).isVisible()).toBeTruthy();
});


