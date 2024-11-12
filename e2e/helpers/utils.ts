import { Page } from "@playwright/test";
import { request } from "@playwright/test";
import { appConfig } from "../../playwright.config";

export async function initializeTest(page: Page, path: string | null = null) {
  const baseUrl = appConfig.baseUrl || "";
  const visitUrl =
    baseUrl + (path && path.startsWith("/") ? "" : "/") + (path || "");
  await page.goto(visitUrl, { timeout: 30000 });
}

export async function loginViaApi() {
  const apiContext = await request.newContext();
  const response = await apiContext.post(`${appConfig.apiUrl}/login`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      "username": appConfig.userName,
      "password": appConfig.loginPassword,
    }
  });

  // Handle errors if login fails
  if (response.status() !== 200) {
    throw new Error(`Failed to login: ${response.status()} - ${response.statusText()}`);
  }

  // Save the authentication storage state
  const storageState = await apiContext.storageState();
  
  // Dispose of the API context after login
  await apiContext.dispose();

  // Return the storage state for use in tests
  return storageState;
}
