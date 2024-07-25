import { test as setup, expect } from "@playwright/test";
import signIn from "../signIn";

setup("authenticate as admin", async ({ page }) => {
  await signIn({
    username: process.env.ADMIN_USER_NAME,
    password: process.env.ADMIN_PASSWORD,
    page,
    path: "playwright/.auth/admin.json",
  });
});

setup("authenticate as user", async ({ page }) => {
  await signIn({
    username: process.env.USER_USER_NAME,
    password: process.env.USER_PASSWORD,
    page,
    path: "playwright/.auth/user.json",
  });
});

setup("authenticate as blocked user", async ({ page }) => {
  await signIn({
    username: process.env.BLOCKED_USER_USER_NAME,
    password: process.env.BLOCKED_USER_PASSWORD,
    page,
    path: "playwright/.auth/blockedUser.json",
  });
});
