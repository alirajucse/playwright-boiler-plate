import { expect, type Locator, type Page } from "@playwright/test";
import { appConfig } from "../../playwright.config";

export class phonePage {
  readonly page: Page;
  readonly phoneCategory: Locator;
  readonly phoneTable: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly galaxyS5: Locator;
  readonly htcOneM9: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneCategory = page.locator("a", { hasText: "Phones" });
    this.phoneTable = page.locator("#tbodyid");
    this.previousButton = page.locator("#prev2");
    this.nextButton = page.locator("#next2");
    this.galaxyS5 = page.getByText("Samsung galaxy s6");
    this.htcOneM9 = page.getByText("HTC One M9");
  }

  async clickOnPhoneCategory() {
    await this.phoneCategory.click();
  }
  async phoneTableIsPresent() {
    await this.phoneTable.isVisible();
  }
  async productGalaxyS5IsPresent() {
    await this.galaxyS5.isVisible();
  }
  async productHtcOneM9IsPresent() {
    await this.htcOneM9.isVisible();
  }
  async nextAndPreviousButtonIsPresent() {
    await this.nextButton.isVisible();
    await this.previousButton.isVisible();
  }

  async clickOnNextButton() {
    await this.nextButton.click();
  }
}
