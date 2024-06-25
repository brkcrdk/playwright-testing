import { test, expect } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await page.getByTestId("text-input").fill("content");
  await page.getByTestId("text-input").press("Enter");
});

test.describe("Todo Item works", async () => {
  test("should allow me check to mark as completed", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");

    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");

    await expect(page.getByTestId("todo-item-toggle")).toBeVisible();
    await page.getByTestId("todo-item-toggle").click();

    await expect(todoItem).toHaveClass("completed");
  });

  test("should allow me unmark checked item", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");

    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");

    await expect(page.getByTestId("todo-item-toggle")).toBeVisible();
    await page.getByTestId("todo-item-toggle").click();

    await expect(todoItem).toHaveClass("completed");

    await page.getByTestId("todo-item-toggle").click();
    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");
  });

  test("should allow me remove todo item", async ({ page }) => {
    await createDefaultTodos(page);

    const parent = page
      .getByTestId("todo-item")
      .filter({ has: page.getByText("buy some cheese") });

    await expect(parent).toHaveAttribute("data-testid", "todo-item");

    await parent.hover();
    const closeBtn = parent.getByTestId("todo-item-button");
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(parent).not.toBeVisible();
  });
});
