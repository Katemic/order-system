import { test, expect } from "@playwright/test";
import { resetMockCustomizationData } from "../helpers/cleanup";

test.beforeEach(() => {
  resetMockCustomizationData();
});

test.afterAll(() => {
  resetMockCustomizationData();
});

test("Delete button is visible when a customization is expanded", async ({page}) => {
  await page.goto("/customizations");

  const firstCategory = page.locator("details").first();
  await firstCategory.locator("summary").click();

  const deleteBtn = firstCategory.getByRole("button", { name: "Slet" });
  await expect(deleteBtn).toBeVisible();
});

test("Clicking delete opens confirmation modal and you can close it again", async ({page}) => {
  await page.goto("/customizations");

  const firstCategory = page.locator("details").first();
  await firstCategory.locator("summary").click();

  await firstCategory.getByRole("button", { name: "Slet" }).click();

  await expect(
    page.getByText("Er du sikker på, at du vil slette?")
  ).toBeVisible();

  await page.getByRole("button", { name: "Annuller" }).click();

  await expect(
    page.getByText("Er du sikker på, at du vil slette?")
  ).not.toBeVisible();
});

test("Deleting customization removes it and shows success notification", async ({page}) => {
  await page.goto("/customizations");

  const first = page.locator("details").first();

  await first.locator("summary").click();

  await first.getByRole("button", { name: "Slet" }).click();

  await page.locator("form").getByRole("button", { name: "Slet" }).click();

  await expect(page).toHaveURL(/\/customizations\?deleted=true&name=Topping/);

  await expect(page.getByText(`Tilpasning "Topping" er slettet`)).toBeVisible();

  await expect(page.getByText("Topping▶")).not.toBeVisible();
});
