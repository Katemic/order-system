import { test, expect } from "@playwright/test";
import { resetMockCustomizationData } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockCustomizationData();
});

test.afterAll(() => {
  resetMockCustomizationData();
});

test("An edit button is displayed when a customization is expanded", async ({page}) => {
  await page.goto("/customizations");

  await page.locator("summary").first().click();

  await expect(page.getByRole("link", { name: "Rediger" })).toBeVisible();
});

test("The edit button navigates to /customizations/ID/edit", async ({ page }) => {
  await page.goto("/customizations");

  await page.locator("summary").first().click();

  const editLink = page.getByRole("link", { name: "Rediger" });

  await editLink.click();

  await expect(page).toHaveURL(/\/customizations\/\d+\/edit/);
});

test("The edit page displays the same form as create with prefilled data", async ({page}) => {
  await page.goto("/customizations");
  await page.locator("summary").first().click();
  await page.getByRole("link", { name: "Rediger" }).click();


  const titleInput = page.locator('input[name="title"]');
  await expect(titleInput).toBeVisible();
  await expect(titleInput).not.toHaveValue("");

  await expect(
    page.getByRole("textbox", { name: "Skriv en mulighed…" })
  ).toBeVisible();
  await expect(page.getByText("Friske hindbær")).toBeVisible();


  await expect(
    page.getByRole("button", { name: "Tilbage til tilpasninger" })
  ).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Gem ændringer" })
  ).toBeVisible();
});

test("The user can edit the title and options and save the changes", async ({page}) => {
  await page.goto("/customizations");
  await page.locator("summary").first().click();
  await page.getByRole("link", { name: "Rediger" }).click();

  await page.locator('input[name="title"]').fill("Ny redigeret titel");

  await page
    .getByRole("textbox", { name: "Skriv en mulighed…" })
    .fill("Ny mulighed");
  await page.getByRole("button", { name: "Tilføj" }).click();


  await page.getByRole("button", { name: "Gem ændringer" }).click();

  await expect(page).toHaveURL(/\/customizations\?updated=true/);

  await expect(page.getByText("Ny redigeret titel")).toBeVisible();

  await page.getByText("Ny redigeret titel").click();

  await expect(page.getByText("Ny mulighed")).toBeVisible();
});
