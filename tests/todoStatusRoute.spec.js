import { test, expect } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";

// 3 todo ekleyecek
// içinden belli bir sayıda todo tamamlayacak
// active alanına basıldığında seçilmeyen totolar bu route da var mı kontrol edilcek
// tamamlanan todo route una gittiğinde eklenen todolardan seçilmiş olanlar kadar kadar az todo tamamlanmış routeunda var mı bakılacak

export const goRoute = async (page, route) => {
  await page.getByTestId("footer-navigation").getByText(route).click();
};

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await createDefaultTodos(page);
});

test.describe("checking todos is active or completed", () => {
  test("should add 3 new todos and is it active?", async ({ page }) => {
    await page.getByTestId("footer-navigation").getByText("Active").click();

    await expect(page.getByTestId("todo-item")).toHaveCount(3);
    await expect(page).toHaveURL(/active/);
  });
  test("completed todo is on currect route?", async ({ page }) => {
    const liElement = page.getByTestId("todo-item").filter({
      has: page.getByText("buy some cheese"),
    });
    await liElement.getByTestId("todo-item-toggle").click();

    await goRoute(page, "Completed");

    await expect(page.getByTestId("todo-item")).toHaveCount(1);
    await expect(liElement).toHaveText("buy some cheese");
    await expect(page).toHaveURL(/completed/);
  });
});
