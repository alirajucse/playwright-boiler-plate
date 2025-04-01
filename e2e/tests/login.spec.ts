import { test } from "@playwright/test";
import { loginPage } from "../pages/login";
import { initializeTest } from "../helpers/utils";
import { appConfig } from "../../playwright.config";

test.describe("Verify successful login", () => {
  let login: loginPage;

  test("Complete login process", async ({ page }) => {
    login = new loginPage(page);
    await initializeTest(page);
    
    await login.clickLoginLink();
    
    await login.inputUserName(appConfig.userName);
    await login.inputPassword(appConfig.loginPassword);
    
    await login.clickLoginButton();
    await login.verifyLogin();
  });
});