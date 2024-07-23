import { test as setup, expect } from "@playwright/test";

const SIGNIN_URL = `${process.env.BASE_URL}/users/sign_in`;

const adminFile = "playwright/.auth/admin.json";

setup("authenticate as admin", async ({ page }) => {
  await page.goto(SIGNIN_URL);
  await page
    .locator('[data-qa-selector="login_field"]')
    .fill(process.env.ADMIN_USER_NAME);
  await page
    .locator('[data-qa-selector="password_field"]')
    .fill(process.env.ADMIN_PASSWORD);
  await page.locator('[data-qa-selector="sign_in_button"]').click();
  await expect(page.locator('[data-qa-selector="user_menu"]')).toBeVisible();
  await page.context().storageState({ path: adminFile });
});

const userFile = "playwright/.auth/user.json";

setup("authenticate as user", async ({ page }) => {
  await page.goto(SIGNIN_URL);
  await page
    .locator('[data-qa-selector="login_field"]')
    .fill(process.env.USER_USER_NAME);
  await page
    .locator('[data-qa-selector="password_field"]')
    .fill(process.env.USER_PASSWORD);
  await page.locator('[data-qa-selector="sign_in_button"]').click();
  await expect(page.locator('[data-qa-selector="user_menu"]')).toBeVisible();
  await page.context().storageState({ path: userFile });
});

const blockedUserFile = "playwright/.auth/blockedUser.json";

setup("authenticate as blocked user", async ({ page }) => {
  await page.goto(SIGNIN_URL);
  await page
    .locator('[data-qa-selector="login_field"]')
    .fill(process.env.BLOCKED_USER_USER_NAME);
  await page
    .locator('[data-qa-selector="password_field"]')
    .fill(process.env.BLOCKED_USER_PASSWORD);
  await page.locator('[data-qa-selector="sign_in_button"]').click();
  await expect(page.locator('[data-qa-selector="user_menu"]')).toBeVisible();
  await page.context().storageState({ path: blockedUserFile });
});
