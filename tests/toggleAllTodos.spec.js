import { expect, test } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";

const goRoute = async (page, route) => {
  await page.getByTestId("footer-navigation").getByText(route).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await createDefaultTodos(page);
});

test.describe("toggle all todos completed state", () => {
  test("should allow me to mark all items as completed", async ({ page }) => {
    // Complete all todos.
    // await page.getByLabel('Mark all as complete').check();
    const toggleAll = page.getByTestId("toggle-all");
    await toggleAll.click();
    
    // complete state
    await goRoute(page, "Completed");
    await expect(page.getByTestId("todo-item")).toHaveCount(3);
    await goRoute(page, "Active");
    await expect(page.getByTestId("todo-item")).toHaveCount(0);

    // active state
    await goRoute(page, "Completed");
    await toggleAll.click();
    await expect(page.getByTestId("todo-item")).toHaveCount(0);
    await goRoute(page, "Active");
    await expect(page.getByTestId("todo-item")).toHaveCount(3);
  });
});
