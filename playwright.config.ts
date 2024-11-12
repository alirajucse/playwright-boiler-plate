import { devices, defineConfig } from "@playwright/test";
import { env } from "process";
import * as path from "path";

// Load environment specific details
const appEnvConfig = require(path.join(process.cwd(), "appenv.json"));

// Choose the current environment applied. (dev, staging, prod etc)
const appEnv = (env.APPENV || appEnvConfig.default).trim();
console.log("Chosen FC environment:", appEnv);

// Get the environment configuration
const appconf = appEnvConfig[appEnv];

appconf.baseUrl = process.env.APP_BASE_URL || appconf.baseUrl;

// Export fcconf so it can be accessed in test files
export const appConfig = appconf;

// Define and export the Playwright configuration
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: "./e2e",

  // Each test is given 30 seconds.
  timeout: 30000,

  // Run all tests in parallel.
  fullyParallel: true,
  // The number of parallel worker use to run the tests
  workers: 2,

  // Retry on CI only.
  retries: process.env.CI ? 1 : 0,

  // Reporter to use
  reporter: "html",

  use: {
    // Capture screenshot after each test failure.
    screenshot: "only-on-failure",

    // Record trace only when retrying a test for the first time.
    trace: "on-first-retry",

    // Record video only when retrying a test for the first time.
    video: "on-first-retry",
  },

  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: "test-results",

  // Configure projects for major browsers.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
  testMatch: "/*.spec.ts",
});
