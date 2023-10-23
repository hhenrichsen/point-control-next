import { expect, test } from "@playwright/test";

test("should navigate the 404 page when clicking my invalid link", async ({
  page,
}) => {
  page.on("console", (msg) => {
    // eslint-disable-next-line no-console -- Need for test error capture
    console.log("PAGE LOG:", msg.text());
  });

  await page.goto("/");
  await page.waitForSelector("button");
  await expect(page).toHaveScreenshot("home.png");

  await page.locator("a[href='/games'] button").click();
  await expect(page).toHaveURL("/games");

  await page.waitForLoadState();
  await expect(page.locator("h1")).toContainText("404");
  await expect(page).toHaveScreenshot("404.png");
});
