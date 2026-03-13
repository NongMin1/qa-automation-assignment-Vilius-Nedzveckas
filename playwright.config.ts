import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./global-setup.ts",
  reporter: [["list"], ["html", { open: "never" }], ["junit", { outputFile: "test-results/results.xml" }]],
  fullyParallel: true,
  retries: 1,
  use: {
    baseURL: process.env.BASE_URL,
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure",
    launchOptions: {
      args: ["--disable-extensions", "--disable-infobars"],
    },
  },
  projects: [
    {
      name: "ui",
      testDir: "./tests/ui",
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
