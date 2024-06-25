import { test, expect } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await createDefaultTodos(page);
});

test.describe("Mark as Completed", () => {
  test("should allow me to mark all items as completed", async ({ page }) => {
    // Complete all todos.
    // await page.getByLabel('Mark all as complete').check();
    await page.getByTestId("toggle-all").click();

    await expect(page.getByTestId("todo-item")).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
  });

  test("should allow me to clear all completed items", async ({ page }) => {
    // Complete all todos.
    // await page.getByLabel('Mark all as complete').check();
    await page.getByTestId("toggle-all").dblclick();

    await expect(page.getByTestId("todo-item")).toHaveClass(["", "", ""]);
  });
});
