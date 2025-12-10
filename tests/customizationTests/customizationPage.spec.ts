import { test, expect } from "@playwright/test";

test("shows heading and either table or 'no customizations' text", async ({
    page,
}) => {
    await page.goto("/customizations");

    // Title
    await expect(
        page.getByRole("heading", { name: "Tilpasninger" })
    ).toBeVisible();

    const table = page.locator("table");

    // If there is NO table, expect empty text
    if ((await table.count()) === 0) {
        await expect(
            page.getByText("Der er ingen tilpasninger endnu.")
        ).toBeVisible();
        return;
    }

    // Otherwise, work with the table
    await expect(table).toBeVisible();

    // Find thead, but only test the header if thead actually exists
    const header = table.locator("thead tr th").first();

    if ((await header.count()) > 0) {
        const headerText = (await header.innerText()).trim().toLowerCase();
        expect(headerText).toContain("kategori");
    }

    // Test that the table has at least 1 row, if not, there is nothing to show
    const rows = table.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
});

test("Can open a type and see its options in a bulleted list (if there are types)", async ({
    page,
}) => {
    await page.goto("/customizations");

    const table = page.locator("table");
    if ((await table.count()) === 0) {
        // Nothing to test, no types
        return;
    }

    const rows = table.locator("tbody tr");
    const rowCount = await rows.count();
    if (rowCount === 0) {
        // Table without rows, so we stop
        return;
    }

    const firstRow = rows.first();
    const details = firstRow.locator("details");
    const summary = details.locator("summary");

    await expect(summary).toBeVisible();
    await summary.click();

    // Find ul directly under details
    const optionsList = details.locator("ul").first();
    await expect(optionsList).toBeVisible();

    const listItems = optionsList.locator("li");
    expect(await listItems.count()).toBeGreaterThan(0);

    // First option has some text
    const firstOptionText = (await listItems.first().innerText()).trim();
    expect(firstOptionText.length).toBeGreaterThan(0);
});

test("options are displayed in a grid (up to 4 columns) on desktop if the type has options", async ({
    page,
}) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/customizations");

    const table = page.locator("table");
    if ((await table.count()) === 0) {
        return;
    }

    const firstRow = table.locator("tbody tr").first();
    const details = firstRow.locator("details");
    const summary = details.locator("summary");
    await expect(summary).toBeVisible();
    await summary.click();

    const optionsList = details.locator("ul").first();
    if ((await optionsList.count()) === 0) {
        return;
    }

    await expect(optionsList).toBeVisible();

    const columnCount = await optionsList.evaluate((el) => {
        const style = window.getComputedStyle(el);
        const template = style.gridTemplateColumns || "";
        return template.split(" ").filter(Boolean).length;
    });

    // We expect at least 1 column, max 4, depending on breakpoint
    expect(columnCount).toBeGreaterThan(0);
    expect(columnCount).toBeLessThanOrEqual(4);
});
