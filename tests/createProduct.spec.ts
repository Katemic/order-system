import { test, expect } from '@playwright/test';
import { resetMockData } from "./helpers/cleanup";
import { gotoProducts } from './helpers/navigationHelpers';

test.beforeEach(() => {
    resetMockData();
});

test.afterAll(() => {
    resetMockData();
});

test.describe.configure({ mode: "serial" });

test('checks all fields and buttons are present on create product page and the back buttons work', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await expect(page).toHaveURL('http://localhost:3000/createProduct');

    const container = page.getByText(
        'Opret produktTilbage til produkterProduktnavn *Pris *krKategori *Vælg'
    );

    await expect(container.getByRole('heading', { name: 'Opret produkt', level: 1 })).toBeVisible();
    await expect(container.getByRole('button', { name: 'Tilbage til produkter' })).toBeVisible();

    await expect(container.getByText('Produktnavn *')).toBeVisible();

    await expect(container.getByText('Pris *')).toBeVisible();
    await expect(container.getByText('kr')).toBeVisible();

    await expect(container.getByRole('combobox').first()).toBeVisible();

    await expect(container.getByText('Kategori *').first()).toBeVisible();

    await expect(container.getByRole('combobox').nth(1)).toBeVisible();

    await expect(container.getByText('Produktionskategori *')).toBeVisible();

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
    await expect(container.getByRole('button', { name: 'Opret' })).toBeVisible();

    // assert exactly 12 visible input elements and 1 visible text/textarea
    await expect(page.locator('input:visible')).toHaveCount(12);
    await expect(page.locator('textarea:visible, [role="textbox"]:visible')).toHaveCount(1);
    await expect(page.getByRole('combobox')).toHaveCount(2);


    //check that all back buttons work as expected
    await page.getByRole('button', { name: 'Tilbage til produkter' }).click();
    await expect(page).toHaveURL('http://localhost:3000/products');
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await page.getByRole('button', { name: 'Annuller' }).click();
    await expect(page).toHaveURL('http://localhost:3000/products');
});

test('Shows error messages when not all requred fields have been filled out', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('link', { name: '+ Opret produkt' }).click();

    //required fields have stars to indicate they are required
    await expect(page.getByText('Produktnavn *')).toContainText('*');
    await expect(page.getByText('Pris *')).toContainText('*');
    await expect(page.getByText('Kategori *').first()).toContainText('*');
    await expect(page.getByText('Produktionskategori *')).toContainText('*');
    await expect(page.getByText('*')).toHaveCount(4);

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
    await expect(page.getByRole('combobox').first()).toHaveClass(/border-red-500/);

    await expect(page.getByText('Vælg en produktionskategori')).toBeVisible();
    await expect(page.getByRole('combobox').nth(1)).toHaveClass(/border-red-500/);

    //general error message is shown
    await expect(page.getByText('Udfyld venligst alle påkrævede felter.')).toBeVisible();
});

test('All categories are available', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('link', { name: '+ Opret produkt' }).click();

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
    const first = options.first();
    await expect(first).toHaveText('Vælg kategori');

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

});

test("Creates a new product when all required fields are filled out", async ({ page }) => {
  await gotoProducts(page);

  await expect(page.getByRole("link", { name: "+ Opret produkt" })).toBeVisible();
  await page.getByRole("link", { name: "+ Opret produkt" }).click();

  await page.locator('input[name="name"]').fill("TestBrød");
  await page.locator('input[name="price"]').fill("50");
  await page.getByRole("combobox").first().selectOption("Brød");
  await page.getByRole("combobox").nth(1).selectOption("Bager");
  await page.locator('textarea[name="ingredients"]').fill("Meeeeeget sukker");

  await page.locator('input[name="Energy_kcal"]').fill("1");
  await page.locator('input[name="Energy_kJ"]').fill("2");
  await page.locator('input[name="Fat"]').fill("3");
  await page.locator('input[name="Saturated_fatty_acids"]').fill("4");
  await page.locator('input[name="Carbohydrates"]').fill("5");
  await page.locator('input[name="Sugars"]').fill("6");
  await page.locator('input[name="Dietary_fiber"]').fill("7");
  await page.locator('input[name="Protein"]').fill("8");
  await page.locator('input[name="Salt"]').fill("9");
  await page.locator('input[name="Water_content"]').fill("10");

  await expect(page.getByRole("button", { name: "Opret" })).toBeEnabled();
  await page.getByRole("button", { name: "Opret" }).click();
  await expect(page).toHaveURL(/\/products\?created=true/);

  const banner = page.getByRole("status");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Produkt er oprettet.");

  await expect(page).toHaveURL(/\/products$/);

  await page.getByRole("button", { name: /TestBrød/i }).first().click();

  await expect(page.locator("h2").filter({ hasText: "TestBrød" })).toBeVisible();
  await expect(page.getByText("Produktion: Bager")).toBeVisible();
  await expect(page.getByText("50 kr")).toBeVisible();
  await expect(page.getByText("Meeeeeget sukker")).toBeVisible();
  await expect(page.getByText("Energi (kcal)")).toBeVisible();
  await expect(page.getByText("Energi (kJ)")).toBeVisible();
  await expect(page.getByText("Fedt (g)")).toBeVisible();
  await expect(page.getByText("Heraf mættede fedtsyrer (g)")).toBeVisible();
  await expect(page.getByText("Kulhydrat (g)")).toBeVisible();
  await expect(page.getByText("Heraf sukkerarter (g)")).toBeVisible();
  await expect(page.getByText("Kostfibre (g)")).toBeVisible();
  await expect(page.getByText("Protein (g)")).toBeVisible();
  await expect(page.getByText("Salt (g)")).toBeVisible();
  await expect(page.getByText("Vandindhold (g)")).toBeVisible();

  await expect(page.getByRole("img", { name: "TestBrød" }).first()).toBeVisible();
});

test('Default values are shown when nonrequired fields arent shown', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await page.locator('input[name="name"]').fill('defaultTest');
    await page.locator('input[name="price"]').click();
    await page.locator('input[name="price"]').fill('10');
    await page.getByRole('combobox').first().selectOption('Brød');
    await page.getByRole('combobox').nth(1).selectOption('Bager');
    await page.getByRole('button', { name: 'Opret' }).click();

    await page.getByRole('button', { name: /defaultTest/i }).click();
    await expect(page.getByText('Energi (kcal)0')).toBeVisible();
    await expect(page.getByText('Energi (kJ)0')).toBeVisible();
    await expect(page.getByText('Fedt (g)0')).toBeVisible();
    await expect(page.getByText('Heraf mættede fedtsyrer (g)0')).toBeVisible();
    await expect(page.getByText('Kulhydrat (g)0')).toBeVisible();
    await expect(page.getByText('Heraf sukkerarter (g)0')).toBeVisible();
    await expect(page.getByText('Kostfibre (g)0')).toBeVisible();
    await expect(page.getByText('Protein (g)0')).toBeVisible();
    await expect(page.getByText('Salt (g)0')).toBeVisible();
    await expect(page.getByText('Vandindhold (g)0')).toBeVisible();
    await expect(page.getByRole('img', { name: 'defaultTest' }).nth(1)).toBeVisible();
});

//this test will only be run manually bc of file upload
test.skip('You can add your own photo and see a preview', async ({ page }) => {
    await gotoProducts(page);
    await page.getByRole('link', { name: '+ Opret produkt' }).click();
    await page.locator('input[name="name"]').click();
    await page.locator('input[name="name"]').fill('test');
    await page.locator('input[name="price"]').click();
    await page.locator('input[name="price"]').fill('10');
    await page.getByRole('combobox').selectOption('Brød');

    //add image and see preview
    await page.locator('label').filter({ hasText: 'Vælg billede' }).click();
    const path = require('path');
    const filePath = path.join(process.cwd(), 'public', 'assets', 'kage.webp');
    await page.locator('input[type="file"]').setInputFiles(filePath);
    await expect(page.getByRole('img', { name: 'Preview' })).toBeVisible();

    //create product and see image in product modal
    await page.getByRole('button', { name: 'Opret' }).click();
    await page.getByRole('button', { name: 'Luk' }).click();
    await page.getByRole('button', { name: 'test test' }).click();
    await expect(page.getByRole('img', { name: 'test' }).nth(1)).toBeVisible();
});



