import { test, expect, Page } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";
import { gotoProducts } from './helpers/navigationHelpers';

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
    });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));



test('check edit button is present on product modal and navigate back buttons are present and working', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await expect(page.getByRole('link', { name: 'Rediger produkt' })).toBeVisible();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();
    await expect(page).toHaveURL('http://localhost:3000/products/1/edit');
    await expect(page.getByRole('button', { name: 'Tilbage til produkter' })).toBeVisible();
    await page.getByRole('button', { name: 'Tilbage til produkter' }).click();
    await expect(page).toHaveURL('http://localhost:3000/products');
    await sleep(5000); // inserted 5s wait
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();
    await expect(page.getByRole('button', { name: 'Annuller' })).toBeVisible();
    await page.getByRole('button', { name: 'Annuller' }).click();
    await expect(page).toHaveURL('http://localhost:3000/products');
});


test('Category picker is available with all options and the products category is selected', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();

    // verify combobox options
    const combobox = page.getByRole('combobox').first();
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
    await expect(combobox).toHaveValue('Brød');

    const combobox2 = page.getByRole('combobox').nth(1);
    const options2 = combobox2.locator('option');

    // total count
    await expect(options2).toHaveCount(4);

    // texts in order
    const texts2 = await options2.allTextContents();
    expect(texts2).toEqual([
        'Vælg produktionskategori',
        'Bager',
        'Konditor',
        'Andet'
    ]);

    await expect(combobox2).toHaveValue('Bager');

});

test('All fields are present on edit product page', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();

    const container = page.getByText(
        'Rediger produktTilbage til produkterProduktnavn *Pris *krKategori *Vælg'
    );

    await expect(container.getByRole('heading', { name: 'Rediger produkt', level: 1 })).toBeVisible();

    await expect(container.getByRole('button', { name: 'Tilbage til produkter' })).toBeVisible();

    await expect(container.getByText('Produktnavn *')).toBeVisible();

    await expect(container.getByText('Pris *')).toBeVisible();
    await expect(container.getByText('kr')).toBeVisible();

    await expect(container.getByRole('combobox').first()).toBeVisible();

    await expect(container.getByText('Kategori *').first()).toBeVisible();

    await expect(container.getByRole('combobox').nth(1)).toBeVisible();
    await expect(container.getByText('Produktionskategori *')).toBeVisible()

    await expect(container.getByText('Ingredienser')).toBeVisible();

    await expect(container.getByRole('heading', { name: 'Næringsindhold pr. 100 g', level: 2 })).toBeVisible();

    const nutritionLabels = [
        'Energi (kcal)',
        'Energi (kJ)',
        'Fedt (g)',
        'Heraf mættede fedtsyrer (g)',
        'Kulhydrat (g)',
        'Heraf sukkerarter (g)',
        'Kostfibre (g)',
        'Protein (g)',
        'Salt (g)',
        'Vandindhold (g)'
    ];
    for (const label of nutritionLabels) {
        await expect(container.getByText(label)).toBeVisible();
    }

    await expect(container.getByText('Vælg billede')).toBeVisible();
    await expect(container.getByRole('button', { name: 'Annuller' })).toBeVisible();
    await expect(container.getByRole('button', { name: 'Gem ændringer' })).toBeVisible();

    // assert exactly 12 visible input elements and 1 visible text/textarea
    await expect(page.locator('input:visible')).toHaveCount(12);
    await expect(page.locator('textarea:visible, [role="textbox"]:visible')).toHaveCount(1);
    await expect(page.getByRole('combobox')).toHaveCount(2);

});


test('Editing a product updates its data correctly', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('Hvedebrød2');
    await page.locator('input[name="price"]').click();
    await page.locator('input[name="price"]').fill('30');
    await page.getByRole('combobox').first().selectOption('Morgenbrød');
    await page.getByRole('combobox').nth(1).selectOption('Konditor');
    await page.getByText('Hvedemel, vand, gær, salt').click();
    await page.getByText('Hvedemel, vand, gær, salt').fill('EDIT');
    await page.locator('input[name="Energy_kcal"]').fill('1');
    await page.locator('input[name="Energy_kJ"]').fill('2');
    await page.locator('input[name="Fat"]').fill('3');
    await page.locator('input[name="Saturated_fatty_acids"]').fill('4');
    await page.locator('input[name="Carbohydrates"]').fill('5');
    await page.locator('input[name="Sugars"]').fill('6');
    await page.locator('input[name="Dietary_fiber"]').fill('7');
    await page.locator('input[name="Protein"]').fill('8');
    await page.locator('input[name="Salt"]').fill('9');
    await page.locator('input[name="Water_content"]').fill('10');
    await page.getByRole('button', { name: 'Gem ændringer' }).click();
    await page.getByRole('link', { name: 'Morgenbrød' }).click();
    await sleep(4000); // give some time to visually see the filled form before submission
    await page.getByRole('button', { name: 'Hvedebrød2 Hvedebrød2' }).click();

    // NAME
    await expect(page.getByRole('main').getByText('Morgenbrød')).toBeVisible();

    // CATEGORY
    await expect(page.getByRole('main').getByText('Morgenbrød')).toBeVisible();

    await expect(page.getByRole('main').getByText('Konditor')).toBeVisible();

    // PRICE
    await expect(page.getByText("30 kr.")).toBeVisible();

    // INGREDIENTS
    await expect(page.getByText("EDIT")).toBeVisible();

    const nutritionModal = page.getByText("Næringsindhold pr. 100 g").locator("..");

    const expectedNutrition = {
        "Energi (kcal)": "1",
        "Energi (kJ)": "2",
        "Fedt (g)": "3",
        "Heraf mættede fedtsyrer (g)": "4",
        "Kulhydrat (g)": "5",
        "Heraf sukkerarter (g)": "6",
        "Kostfibre (g)": "7",
        "Protein (g)": "8",
        "Salt (g)": "9",
        "Vandindhold (g)": "10",
    };

    for (const [label, value] of Object.entries(expectedNutrition)) {
        const row = nutritionModal.locator("div", { hasText: label });
        await expect(row).toBeVisible();
        await expect(row.locator("dd")).toHaveText(value);
    }



})

test('The edit page shows the products current infomation', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();

    await expect(page.locator('input[name="name"]')).toHaveValue("Hvedebrød");
    await expect(page.locator('input[name="price"]')).toHaveValue("28.5");
    await expect(page.getByText('Hvedemel, vand, gær, salt')).toBeVisible();

    const nutritionSection = page.getByRole("heading", {
        name: "Næringsindhold pr. 100 g",
    }).locator("..");

    const fields = {
        "Energi (kcal)": "250",
        "Energi (kJ)": "1046",
        "Fedt (g)": "2",
        "Heraf mættede fedtsyrer (g)": "0.3",
        "Kulhydrat (g)": "48",
        "Heraf sukkerarter (g)": "2",
        "Kostfibre (g)": "3",
        "Protein (g)": "9",
        "Salt (g)": "1.2",
        "Vandindhold (g)": "36",
    };

    for (const [label, value] of Object.entries(fields)) {
        // match kun den individuelle div, ikke grid-containeren
        const fieldContainer = nutritionSection.locator('div:not(.grid)', {
            hasText: label,
        });

        await expect(fieldContainer).toBeVisible();

        const input = fieldContainer.locator("input");
        await expect(input).toHaveValue(value);
    }
})

//to be run manually due to image upload
test.skip('Can change photo and see preview', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await page.getByRole('link', { name: 'Rediger produkt' }).click();

    await expect(page.getByRole('img', { name: 'Preview' })).toBeVisible();
    await page.locator('label').filter({ hasText: 'Vælg billede' }).click();
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'assets', 'kage.webp');
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await expect(page.getByRole('img', { name: 'Preview' })).toBeVisible();

    await page.getByRole('button', { name: 'Gem ændringer' }).click();
    await page.getByRole('button', { name: 'Luk' }).click();
    await page.getByRole('button', { name: 'Hvedebrød Hvedebrød' }).click();
    await expect(page.getByRole('img', { name: 'Hvedebrød' }).nth(1)).toBeVisible();

});