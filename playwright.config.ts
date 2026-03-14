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
    storageState: "storageState.json",
    baseURL: process.env.BASE_URL,
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    launchOptions: {
      args: ["--disable-extensions", "--disable-infobars", "--disable-web-security", "--disable-features=IsolateOrigins,site-per-process"],
    },
  },
  projects: [
    {
      name: "e2e",
      testDir: "./tests/e2e",
      retries: 2,
    },
    {
      name: "api",
      testDir: "./tests/api",
      fullyParallel: false,
      use: {
        extraHTTPHeaders: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
    },
  ],
});
