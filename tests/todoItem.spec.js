import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await page.getByTestId("text-input").fill("content");
  await page.getByTestId("text-input").press("Enter");
});

test.describe("Todo Item works", async () => {
  test("should allow me check to mark as completed", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");

    await expect(page.getByTestId("todo-item")).toHaveClass("");

    await expect(page.getByTestId("todo-item-toggle")).toBeVisible();
    await page.getByTestId("todo-item-toggle").click();

    await expect(todoItem).toHaveClass("completed");
  });
});
