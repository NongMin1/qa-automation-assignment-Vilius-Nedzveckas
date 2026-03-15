import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  globalSetup: require.resolve("./global-setup.ts"),
  testDir: "./tests",
  reporter: [["list"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/results.xml" }]],
  fullyParallel: true,
  retries: 1,

  use: {
    baseURL: process.env.BASE_URL || "",
    storageState: "playwright/.auth/storageState.json",
    screenshot: {
      mode: "only-on-failure",
    },
    trace: "retain-on-failure",
    video: "on-first-retry",
    launchOptions: {
      args: ["--disable-extensions", "--disable-web-security"],
    },
  },

  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      retries: 2,
      fullyParallel: true,
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
