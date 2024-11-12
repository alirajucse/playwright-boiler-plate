import { test, expect } from "@playwright/test";
import { homePage } from "../pages/home";
import { initializeTest, loginViaApi } from "../helpers/utils";

test.describe("Home page", () => {
  let home: homePage;
  test.beforeEach(async ({ page }) => {
    home = new homePage(page);
    await initializeTest(page);
    await loginViaApi();
  });

  test("Verify homepage title", async () => {
    await home.verifyTitle();
  });

  test("Verify menu links", async () => {
    await home.verifyHomeMenuLink();
    await home.loginMenuLink();
  });
});
