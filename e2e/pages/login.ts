import { expect, type Locator, type Page } from "@playwright/test";
import { appConfig } from "../../playwright.config";

export class loginPage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly userName: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly nameOfUser: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator("a", { hasText: "Log in" });
    this.userName = page.locator("#loginusername");
    this.password = page.locator("#loginpassword");
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.nameOfUser = page.locator("#nameofuser");
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async inputUserName(username: string) {
    await this.userName.fill(username);
  }
  async inputPassword(userpasword: string) {
    await this.password.fill(userpasword);
  }
  async clickLoginButton() {
    await this.loginButton.click({ force: true });
  }

  async verifyLogin() {
    await expect(this.nameOfUser).toHaveText(`Welcome ${appConfig.userName}`);
  }
}
