import { expect, type Locator, type Page } from "@playwright/test";

export class homePage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly home: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.locator("a", { hasText: "Log in" });
    this.home = page.locator(".active > .nav-link");
    this.title = page.locator("#nava");
  }

  async verifyTitle() {
    await expect(this.title).toContainText("PRODUCT STORE");
  }

  async verifyHomeMenuLink() {
    await expect(this.home).toBeVisible();
  }

  async loginMenuLink() {
    await expect(this.loginLink).toBeVisible();
  }
}
