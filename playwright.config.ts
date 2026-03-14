import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  globalSetup: require.resolve("./global-setup.ts"),
  testDir: "./tests",
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [["github"], ["list"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/results.xml" }]] : [["list"], ["html", { open: "on-failure" }]],

  use: {
    baseURL: process.env.BASE_URL || "",
    storageState: "playwright/.auth/storageState.json",
    screenshot: {
      mode: "only-on-failure",
    },
    trace: "retain-on-failure",
    video: "on-first-retry",
    launchOptions: {
      slowMo: isCI ? 0 : 100,
      args: ["--disable-extensions", "--disable-web-security"],
    },
  },

  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api",
      testDir: "./tests/api",
      fullyParallel: false,
      use: {
        extraHTTPHeaders: {
          "User-Agent": "Playwright-Automation",
          Accept: "application/json",
        },
      },
    },
  ],
});
