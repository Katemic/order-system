import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";

//lav tilføj billede test TODO

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});


test('Shows error messages when not all requred fields have been filled out', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Produkter' }).click();
    await page.getByRole('link', { name: '+ Opret produkt' }).click();

    //required fields have stars to indicate they are required
    await expect(page.getByText('Produktnavn *')).toContainText('*');
    await expect(page.getByText('Pris *')).toContainText('*');
    await expect(page.getByText('Kategori *')).toContainText('*');
    await expect(page.getByText('*')).toHaveCount(3);

    //click create without filling out any fields
    await page.getByRole('button', { name: 'Opret' }).click();

    //name
    await expect(page.getByText('Skal udfyldes').first()).toBeVisible();
    await expect(page.locator('input[name="name"]')).toHaveClass(/border-red-500/);

    //price
    await expect(page.getByText('Skal udfyldes').nth(1)).toBeVisible();
    await expect(page.locator('input[name="price"]')).toHaveClass(/border-red-500/);

    //category
    await expect(page.getByText('Vælg en kategori')).toBeVisible();
    await expect(page.getByRole('combobox')).toHaveClass(/border-red-500/);

    //general error message is shown
    await expect(page.getByText('Udfyld venligst alle påkrævede felter.')).toBeVisible();
});

test('All categories are available ', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Produkter' }).click();
    await page.getByRole('link', { name: '+ Opret produkt' }).click();

    // verify combobox options
    const combobox = page.getByRole('combobox');
    const options = combobox.locator('option');

    // total count
    await expect(options).toHaveCount(12);

    // texts in order
    const texts = await options.allTextContents();
    expect(texts).toEqual([
        'Vælg kategori',
        'Brød',
        'Morgenbrød',
        'Wienerbrød',
        'Konditor',
        'Mejeri',
        'Cafe',
        'Sæsonkager og andet',
        'Specialiteter',
        'Glutenfri fryser',
        'Festkager',
        'Kørsel'
    ]);

    // first option should be disabled and selected
    const first = options.first();
    await expect(first).toHaveText('Vælg kategori');

});

test('Creates a new product when all required fields are filled out', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: 'Produkter' }).click();
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await page.locator('input[name="name"]').fill('TestBrød');
    await page.locator('input[name="price"]').click();
    await page.locator('input[name="price"]').fill('50');
    await page.getByRole('combobox').selectOption('Brød');
    await page.getByRole('textbox', { name: 'Hvedemel, vand, surdej (hvede' }).click();
    await page.getByRole('textbox', { name: 'Hvedemel, vand, surdej (hvede' }).fill('Meeeeeget sukker');
    await page.locator('input[name="Energy_kcal"]').click();
    await page.locator('input[name="Energy_kcal"]').fill('1');
    await page.locator('input[name="Energy_kJ"]').click();
    await page.locator('input[name="Energy_kJ"]').fill('2');
    await page.locator('input[name="Fat"]').click();
    await page.locator('input[name="Fat"]').fill('3');
    await page.locator('input[name="Saturated_fatty_acids"]').click();
    await page.locator('input[name="Saturated_fatty_acids"]').fill('4');
    await page.locator('input[name="Carbohydrates"]').click();
    await page.locator('input[name="Carbohydrates"]').fill('5');
    await page.locator('input[name="Sugars"]').click();
    await page.locator('input[name="Sugars"]').fill('6');
    await page.locator('input[name="Dietary_fiber"]').click();
    await page.locator('input[name="Dietary_fiber"]').fill('7');
    await page.locator('input[name="Protein"]').click();
    await page.locator('input[name="Protein"]').fill('8');
    await page.locator('input[name="Salt"]').click();
    await page.locator('input[name="Salt"]').fill('9');
    await page.locator('input[name="Water_content"]').click();
    await page.locator('input[name="Water_content"]').fill('10');
    // await page.locator('label').filter({ hasText: 'Vælg billede' }).click();
    // const path = require('path');
    // const filePath = path.join(process.cwd(), 'public', 'assets', 'kage.webp');
    // await page.locator('input[type="file"]').setInputFiles(filePath);
    await page.getByRole('button', { name: 'Opret' }).click();
    await page.getByRole('button', { name: 'Luk' }).click();
    await page.getByRole('button', { name: 'TestBrød TestBrød' }).first().click();

    // verify that the modal shows the correct information
    await expect(page.locator('h2').filter({ hasText: 'TestBrød' })).toBeVisible();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Brød' })).toBeVisible();
    await expect(page.getByText('50 kr')).toBeVisible();
    await expect(page.getByText('Meeeeeget sukker')).toBeVisible();
    await expect(page.getByText('Energi (kcal)1')).toBeVisible();
    await expect(page.getByText('Energi (kJ)2')).toBeVisible();
    await expect(page.getByText('Fedt (g)3')).toBeVisible();
    await expect(page.getByText('Heraf mættede fedtsyrer (g)4')).toBeVisible();
    await expect(page.getByText('Kulhydrat (g)5')).toBeVisible();
    await expect(page.getByText('Heraf sukkerarter (g)6')).toBeVisible();
    await expect(page.getByText('Kostfibre (g)7')).toBeVisible();
    await expect(page.getByText('Protein (g)8')).toBeVisible();
    await expect(page.getByText('Salt (g)9')).toBeVisible();
    await expect(page.getByText('Vandindhold (%)10')).toBeVisible();
    await expect(page.getByRole('img', { name: 'TestBrød' }).nth(1)).toBeVisible();


})





