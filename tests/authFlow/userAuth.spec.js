import { test, expect } from "@playwright/test";

test.use({ storageState: "playwright/.auth/user.json" });

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});

test.describe("Test user authentication flow", () => {
  test("page is authenticated as user", async ({ page }) => {
    await expect(page.locator('[data-qa-selector="user_menu"]')).toBeVisible();
    await expect(page.getByTestId("admin-icon")).not.toBeVisible();
  });
});
