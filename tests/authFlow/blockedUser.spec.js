import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});

test.describe("Test blocked user authentication flow", () => {
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

  // Blocklanıcak kullanıcı başta normal giriş yapar
  // Admin bu kullanıcıyı bloklar
  // Kullanıcı sayfada herhangi bir işlem yaptığında login sayfasına yönlenir ve blocklandığına dair bir warning görür
  // Admin kullanıcıyı unblocklar
  // Kullanıcı tekrar normal şekilde giriş yapabilir
  test("Should redirect me to warning page when blocked after logged in", async ({
    browser,
  }) => {
    // userContext and all pages inside, including userPage, are signed in as "blocked user".
    const blockedUserContext = await browser.newContext({
      storageState: "playwright/.auth/blockedUser.json",
    });
    const blockedUserPage = await blockedUserContext.newPage();

    await blockedUserPage.goto(process.env.BASE_URL);
    await expect(
      blockedUserPage.locator('[data-qa-selector="user_menu"]')
    ).toBeVisible();

    // adminContext and all pages inside, including adminPage, are signed in as "admin".
    const adminContext = await browser.newContext({
      storageState: "playwright/.auth/admin.json",
    });
    const adminPage = await adminContext.newPage();

    await adminPage.goto(process.env.BASE_URL);
    await expect(adminPage.getByTestId("admin-icon")).toBeVisible();
    await adminPage.getByTestId("admin-icon").click();
    await expect(adminPage).toHaveURL(/admin/);
    await adminPage.locator('[data-qa-selector="users_overview_link"]').click();
    await expect(adminPage).toHaveURL(/users/);
    const searchInput = adminPage.locator(
      '[data-qa-selector="user_search_field"]'
    );
    await searchInput.fill(process.env.BLOCKED_USER_USER_NAME);
    await searchInput.press("Enter");
    const searchResult = adminPage.locator(
      `[data-username=${process.env.BLOCKED_USER_USER_NAME}]`
    );
    await expect(searchResult).toBeVisible();
    await searchResult
      .getByRole("link", { name: "Aysel", exact: true })
      .click();
    await expect(adminPage).toHaveURL(/users\/aysel/);
    await adminPage.getByRole("button", { name: "Block user" }).click();
  });
});
