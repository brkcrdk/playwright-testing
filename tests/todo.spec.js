import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
});

const TODO_ITEMS = [
  "buy some cheese",
  "feed the cat",
  "book a doctors appointment",
];

async function createDefaultTodos(page) {
  const textInput = page.getByTestId("text-input");

  for (const item of TODO_ITEMS) {
    await textInput.fill(item);
    await textInput.press("Enter");
  }
}

test.describe("New Todo Test", () => {
  test("should allow me to add todo items", async ({ page }) => {
    // create a new todo locator
    const textInput = page.getByTestId("text-input");

    // Create 1st todo.
    await textInput.fill(TODO_ITEMS[0]);
    await textInput.press("Enter");

    // Make sure the list only has one todo item.
    await expect(page.getByTestId("todo-item-label")).toHaveText([
      TODO_ITEMS[0],
    ]);

    // // Create 2nd todo.
    await textInput.fill(TODO_ITEMS[1]);
    await textInput.press("Enter");

    // // Make sure the list now has two todo items.
    console.log(page.getByTestId("todo-item-label"));
    await expect(page.getByTestId("todo-item-label")).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1],
    ]);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    // create a new todo locator
    const textInput = page.getByTestId("text-input");

    // Create one todo item.
    await textInput.fill(TODO_ITEMS[0]);
    await textInput.press("Enter");

    // Check that input is empty.
    await expect(textInput).toBeEmpty();
  });

  test("should append new items to the bottom of the list", async ({
    page,
  }) => {
    // Create 3 items.
    await createDefaultTodos(page);

    // todo itemlarını bul
    const todoItems = page.getByTestId("todo-item");

    // todo itemlarını saymasını bekle
    const todoItemCount = await todoItems.count();

    // todo itemlerının sayısı TODO_ITEMS'a eşit olmasını bekle.
    expect(todoItemCount).toBe(TODO_ITEMS.length);
  });

  test("should not add todo if todo input length is less than 2", async ({
    page,
  }) => {
    const textInput = page.getByTestId("text-input");

    await textInput.fill("a");
    await textInput.press("Enter");

    const todoItems = page.getByTestId("todo-item");

    const itemTexts = await todoItems.allInnerTexts();

    expect(itemTexts).not.toContain("a");

    await textInput.fill("ab");
    await textInput.press("Enter");

    await expect(page.getByTestId("todo-item-label")).toHaveText("ab");
  });
});
