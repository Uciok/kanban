import { expect, test, type Locator, type Page } from "@playwright/test";

const column = (page: Page, name: string) => page.getByRole("region", { name });
const titles = (col: Locator) => col.getByTestId("card").locator("h3").allTextContents();

async function drag(page: Page, from: Locator, to: Locator, yOffset = 0) {
  const a = (await from.boundingBox())!;
  const b = (await to.boundingBox())!;
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
  await page.mouse.down();
  await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2 + 10, { steps: 5 });
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2 + yOffset, { steps: 20 });
  await page.mouse.up();
}

let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
});

test.afterEach(() => expect(errors).toEqual([]));

test("loads with five columns and seed data", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Product Launch" })).toBeVisible();
  await expect(page.getByRole("region")).toHaveCount(5);
  await expect(page.getByTestId("card")).toHaveCount(10);
});

test("renames a column", async ({ page }) => {
  await page.getByRole("button", { name: "In Progress" }).click();
  await page.getByLabel("Column name").fill("Doing");
  await page.keyboard.press("Enter");
  await expect(column(page, "Doing")).toBeVisible();
});

test("adds and deletes a card", async ({ page }) => {
  const todo = column(page, "To Do");
  await todo.getByRole("button", { name: /add card/i }).click();
  await todo.getByLabel("Card title").fill("Write tests");
  await todo.getByLabel("Card details").fill("Playwright coverage");
  await todo.getByRole("button", { name: "Add card" }).click();
  await expect(todo.getByText("Write tests")).toBeVisible();

  const card = todo.getByTestId("card").filter({ hasText: "Write tests" });
  await card.hover();
  await card.getByRole("button", { name: "Delete Write tests" }).click();
  await expect(todo.getByText("Write tests")).toHaveCount(0);
});

test("drags a card within a column", async ({ page }) => {
  const backlog = column(page, "Backlog");
  const cards = backlog.getByTestId("card");
  await drag(page, cards.nth(0), cards.nth(2), 10);
  expect(await titles(backlog)).toEqual([
    "Draft Q1 roadmap",
    "Collect customer quotes",
    "Research competitor onboarding",
  ]);
});

test("drags a card to another column", async ({ page }) => {
  const card = page.getByTestId("card").filter({ hasText: "Design pricing page" });
  await drag(page, card, column(page, "Done").getByTestId("card").first(), -10);
  expect(await titles(column(page, "Done"))).toContain("Design pricing page");
  expect(await titles(column(page, "To Do"))).not.toContain("Design pricing page");
});

test("drags a card into an empty column", async ({ page }) => {
  const review = column(page, "Review");
  await review.getByTestId("card").hover();
  await review.getByRole("button", { name: /^Delete/ }).click();
  await expect(review.getByTestId("card")).toHaveCount(0);

  await drag(page, page.getByTestId("card").filter({ hasText: "Kickoff meeting" }), review);
  expect(await titles(review)).toEqual(["Kickoff meeting"]);
});
