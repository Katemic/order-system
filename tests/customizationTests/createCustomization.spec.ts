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


test("Displays a 'Create customization' button on the customization list", async ({ page }) => {
    await page.goto("/customizations");

    // Verify the button exists and is visible
    await expect(page.getByRole("link", { name: "Opret ny tilpasning" }))
        .toBeVisible();

    await page.getByRole("link", { name: "Opret ny tilpasning" }).click();

    await expect(page).toHaveURL("/createCustomization");
});


test("Create page shows title input and empty options input", async ({ page }) => {
    await page.goto("/createCustomization");

    // Title input should be visible
    await expect(page.getByLabel(/Titel/i)).toBeVisible();

    // Options input should be visible
    await expect(page.getByPlaceholder("Skriv en mulighed…")).toBeVisible();
});

test("User can add options and they appear in the list", async ({ page }) => {
    await page.goto("/createCustomization");

    const input = page.getByPlaceholder("Skriv en mulighed…");
    const addBtn = page.getByRole("button", { name: "Tilføj" });


    await input.fill("Chokolade");
    await addBtn.click();


    await input.fill("Vanilje");
    await addBtn.click();

    // Assert both appear in list
    await expect(page.getByText("Chokolade")).toBeVisible();
    await expect(page.getByText("Vanilje")).toBeVisible();

    // Assert input field resets after adding
    await expect(input).toHaveValue("");
});


test("Options list shows delete buttons and removing works", async ({ page }) => {
    await page.goto("/createCustomization");

    const input = page.getByPlaceholder("Skriv en mulighed…");
    const addBtn = page.getByRole("button", { name: "Tilføj" });

    await input.fill("TestOption");
    await addBtn.click();

    // Delete button (✕)
    const deleteBtn = page.getByRole("button", { name: "Slet mulighed" });
    await deleteBtn.click();

    // Option should be removed
    await expect(page.getByText("TestOption")).not.toBeVisible();
});

test("Back buttons navigates back to /customizations", async ({ page }) => {
    await page.goto("/createCustomization");

    await page.getByRole("button", { name: "Tilbage til tilpasninger" }).click();
    await expect(page).toHaveURL("/customizations");

    await page.getByRole('link', { name: 'Opret ny tilpasning' }).click();
    await page.getByRole('button', { name: 'Annuller' }).click();
    await expect(page).toHaveURL('/customizations');
});

test("Submitting the form returns to /customizations and shows success notification", async ({ page }) => {
    await page.goto("/createCustomization");


    await page.locator('input[name="title"]').fill('Ny kategori');


    await page.getByPlaceholder("Skriv en mulighed…").fill("TestValg");
    await page.getByRole("button", { name: "Tilføj" }).click();


    await page.getByRole("button", { name: "Opret" }).click();


    await expect(page).toHaveURL(/\/customizations/);


    await expect(
        page.getByText(/Tilpasning oprettet/i)
    ).toBeVisible();

    await expect(page.getByText("Ny kategori")).toBeVisible();


    const summary = page.getByRole("button", { name: /Ny kategori/i }).or(
        page.getByText("Ny kategori")
    );
    await summary.click();

    await expect(page.getByText("TestValg")).toBeVisible();
});

test("Shows validation errors when required fields are missing", async ({ page }) => {
  await page.goto("/createCustomization");

  // Try to submit without title and without options
  await page.getByRole("button", { name: "Opret" }).click();

  // Expect validation error for title
  await expect(page.getByText(/Titel/i).locator("..").getByText(/Titel er påkrævet/i))
    .toBeVisible();

  // Because no options were added:
  await expect(page.getByText(/Du skal tilføje mindst én mulighed/i)).toBeVisible();

  //general error
  await expect(page.getByText(/Udfyld venligst alle krævede felter./i)).toBeVisible();

  // The form must NOT navigate away
  await expect(page).toHaveURL("/createCustomization");
});