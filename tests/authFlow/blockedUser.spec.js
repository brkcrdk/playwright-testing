import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});

test.describe("Test admin authentication flow", () => {
  test("When blocked user tries to login, should see blocked warning", async ({
    page,
  }) => {
    await page.goto(`${process.env.BASE_URL}/users/sign_in`);
    await page
      .locator('[data-qa-selector="login_field"]')
      .fill(process.env.BLOCKED_USER_USER_NAME);
    await page
      .locator('[data-qa-selector="password_field"]')
      .fill(process.env.BLOCKED_USER_PASSWORD);
    await page.locator('[data-qa-selector="sign_in_button"]').click();
    await expect(
      page.locator('[data-qa-selector="flash_container"]')
    ).toHaveText(
      "Your account has been blocked. Please contact your GitLab administrator if you think this is an error."
    );
  });

  // test("Should redirect me to warning page when blocked after logged in", async ({
  //   page,
  // }) => {
  //   // await expect(page).toHaveURL(/users\/sign_in/);
  //   // await expect(
  //   //   page.locator('[data-qa-selector="flash_container"]')
  //   // ).toHaveText(
  //   //   "Your account has been blocked. Please contact your GitLab administrator if you think this is an error."
  //   // );
  // });
});
