import { test, expect } from '@playwright/test';
import { resetMockData, resetMockCustomizationData } from "../helpers/cleanup";


test.beforeEach(() => {
    resetMockData();
    resetMockCustomizationData();
});

test.afterAll(() => {
    resetMockData();
    resetMockCustomizationData();
});



test('Customization section can be expanded', async ({ page }) => {
    await page.goto('/createProduct');
    const button = page.getByRole('button', { name: /tilpasninger/i });
    await expect(button).toBeVisible();
    await expect(page.getByText("Topping")).not.toBeVisible();
    await expect(page.getByText("Størrelse")).not.toBeVisible();

    await button.click();

    await expect(page.getByText("Topping")).toBeVisible();
    await expect(page.getByText("Størrelse")).toBeVisible();
});

test('All customization types and options can be checked', async ({ page }) => {
    await page.goto('/createProduct');
    await page.getByRole('button', { name: /Tilpasninger/i }).click();

    // check type
    await page.getByText("Topping").locator('..').locator('input[type=checkbox]').check();

    // check options
    for (const opt of ["Friske hindbær", "Hvid chokolade"]) {
        await page.getByText(opt).locator('..').locator('input[type=checkbox]').check();
    }

    // assertions: hidden inputs skal eksistere, ikke være synlige
    for (const opt of ["101", "102"]) {
        const hidden = page.locator(`input[name="customizationOptionIds"][value="${opt}"]`);

        await expect(hidden).toHaveCount(1);
    }
});


test('All customization types are displayed with a checkbox', async ({ page }) => {
    await page.goto('/createProduct');

    await page.getByRole('button', { name: /Tilpasninger/i }).click();

    const topping = page.getByText("Topping").locator('..').locator('input[type=checkbox]');
    const size = page.getByText("Størrelse").locator('..').locator('input[type=checkbox]');

    await expect(topping).toBeVisible();
    await expect(size).toBeVisible();
});


test('Checking a type opens its options', async ({ page }) => {
    await page.goto('/createProduct');
    await page.getByRole('button', { name: /Tilpasninger/i }).click();

    const toppingBox = page.getByText("Topping").locator('..').locator('input[type=checkbox]');
    await toppingBox.check();

    await expect(page.getByText("Friske hindbær")).toBeVisible();
    await expect(page.getByText("Hvid chokolade")).toBeVisible();

});


test('Preselected customization options are checked on edit', async ({ page }) => {
    await page.goto('/products/2/edit');

    await page.getByRole('button', { name: /Tilpasninger/i }).click();

    // Product 2 has: 101, 102, 103, 201, 203
    const checked = [101, 102, 103, 201, 203];

    for (const id of checked) {
        const locator = page.locator(`input[type=checkbox][checked]`).filter({
            has: page.locator(`[value="${id}"]`)
        });
        await expect(locator).toBeTruthy;
    }
});


test('Product saves customizations correctly', async ({ page }) => {
    await page.goto('/createProduct');
    await page.getByRole('button', { name: /Tilpasninger/i }).click();

    //pick types and options
    await page.getByText("Topping").locator('..').locator('input[type=checkbox]').check();
    await page.getByText("Friske hindbær").locator('..').locator('input[type=checkbox]').check();
    await page.getByText("Hvid chokolade").locator('..').locator('input[type=checkbox]').check();


    await page.locator('input[name="name"]').fill('Testkage');

    await page.locator('input[name="price"]').fill('50');
    await page.getByRole('combobox').selectOption('Brød');

    await page.getByRole('button', { name: /Opret/i }).click();

    await page.goto('/products');

    await page.getByRole('button', { name: 'Testkage Testkage' }).click();
    await page.getByText('Topping▶').click();

    await expect(page.getByText("Friske hindbær")).toBeVisible();
    await expect(page.getByText("Hvid chokolade")).toBeVisible();
    await expect(page.getByText("Andet, se note")).toBeVisible();
});

