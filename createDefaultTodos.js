export const TODO_ITEMS = [
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

export default createDefaultTodos;
