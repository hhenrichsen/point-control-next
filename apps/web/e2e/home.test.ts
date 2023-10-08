import { expect, test } from "@playwright/test";

test("should navigate the 404 page when clicking my invalid link", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveScreenshot("home.png");
  await page.locator("Button").click();
  await expect(page).toHaveURL("/games");
  await expect(page.locator("h1")).toContainText("404");
  await expect(page).toHaveScreenshot("404.png");
});
