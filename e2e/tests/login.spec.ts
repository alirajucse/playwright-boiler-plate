import { test } from "@playwright/test";
import { loginPage } from "../pages/login";
import { initializeTest } from "../helpers/utils";
import { appConfig } from "../../playwright.config";

test.describe("Home page", () => {
  let login: loginPage;
  test.beforeEach(async ({ page }) => {
    login = new loginPage(page);
    await initializeTest(page);
  });

  test("Click on login link", async () => {
    await login.clickLoginLink();
  });

  test("Enter credentials", async () => {
    login.inputUserName(appConfig.userName);
    login.inputPassword(appConfig.loginPassword);
  });

  test("Login verify", async () => {
    login.clickLoginButton();
    login.verifyLogin();
  });
});
