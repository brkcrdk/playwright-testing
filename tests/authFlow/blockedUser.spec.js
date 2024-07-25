import { test, expect } from "@playwright/test";
import signIn from "../../signIn";

test.beforeEach(async ({ page }) => {
  await page.goto(process.env.BASE_URL);
});

test.describe("Test blocked user authentication flow", () => {
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

    // Admin kullanıcıyı bloklar
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
    const confirmBlock = adminPage.getByRole("button", {
      name: "Block",
      exact: true,
    });
    await expect(confirmBlock).toBeVisible();
    await confirmBlock.click();
    await expect(
      adminPage.locator('[data-qa-selector="flash_container"]')
    ).toHaveText("Successfully blocked");

    // Bloklu kullanıcı sayfa yeniler ve logine yönlenir
    await blockedUserPage.reload();
    await expect(blockedUserPage).toHaveURL(/users\/sign_in/);
    await expect(
      blockedUserPage.locator('[data-qa-selector="flash_container"]')
    ).toHaveText(
      "Your account has been blocked. Please contact your GitLab administrator if you think this is an error."
    );

    // Kullanıcının bloğunu kaldırıyoruz
    const unblockButton = adminPage.getByRole("button", {
      name: "Unblock user",
    });
    await expect(unblockButton).toHaveClass(
      "btn gl-button btn-info js-confirm-modal-button"
    );
    await unblockButton.click();
    const confirmUnblock = adminPage.getByRole("button", {
      name: "Unblock",
      exact: true,
    });
    await expect(confirmUnblock).toBeVisible();
    await confirmUnblock.click();
    await expect(
      adminPage.locator('[data-qa-selector="flash_container"]')
    ).toHaveText("Successfully unblocked");

    // Bloklu kullanıcı tekrar normal şekilde giriş yapabilir
    await blockedUserPage.goto(`${process.env.BASE_URL}/users/sign_in`);
    await signIn({
      page: blockedUserPage,
      username: process.env.BLOCKED_USER_USER_NAME,
      password: process.env.BLOCKED_USER_PASSWORD,
      path: "playwright/.auth/blockedUser.json",
    });
  });
});
