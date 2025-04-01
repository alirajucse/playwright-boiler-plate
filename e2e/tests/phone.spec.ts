import { test } from "@playwright/test";
import { initializeTest, loginViaApi } from "../helpers/utils";
import { phonePage } from "../pages/phone";

test.describe("Phone products are present and user able to navigate next and previous", () => {
  let phone: phonePage;
  test.beforeEach(async ({ page }) => {
    phone = new phonePage(page);
    await initializeTest(page);
    await loginViaApi();
  });

  test("Go to phone page", async () => {
    await phone.clickOnPhoneCategory();
  });

  test("Phones products are presents", async () => {
    await phone.phoneTableIsPresent();
    await phone.productGalaxyS5IsPresent();
    await phone.productHtcOneM9IsPresent();
  });

  test("Next and previous button are present and working", async () => {
    phone.nextAndPreviousButtonIsPresent();
    phone.clickOnNextButton();
  });
});
