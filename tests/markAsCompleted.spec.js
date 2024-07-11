import { test, expect } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await createDefaultTodos(page);
});

test.describe("Mark as Completed", () => {

  test("should allow me to clear all completed items", async ({ page }) => {
    // Complete all todos.
    // await page.getByLabel('Mark all as complete').check();
    await page.getByTestId("toggle-all").dblclick();

    await expect(page.getByTestId("todo-item")).toHaveClass(["", "", ""]);
  });

  test('should clear all completed todos', async ({ page }) => { 
    const todoItem = page
      .getByTestId("todo-item");
    
    await todoItem.nth(1).getByTestId("todo-item-toggle").click();
    await todoItem.nth(2).getByTestId("todo-item-toggle").click();

    await page.getByText("Clear completed").click();
    
    await expect(todoItem).toHaveCount(1);

    await expect(todoItem).toHaveText('buy some cheese');
  })
});
