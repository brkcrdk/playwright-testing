import { expect } from "@playwright/test";

async function signIn({ username, password, page, path }) {
  const SIGNIN_URL = `${process.env.BASE_URL}/users/sign_in`;
  await page.goto(SIGNIN_URL);
  await page.locator('[data-qa-selector="login_field"]').fill(username);
  await page.locator('[data-qa-selector="password_field"]').fill(password);
  await page.locator('[data-qa-selector="sign_in_button"]').click();
  await expect(page.locator('[data-qa-selector="user_menu"]')).toBeVisible();
  await page.context().storageState({ path });
}

export default signIn;
