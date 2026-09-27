import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./src/tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],

    [
      "junit",
      {
        outputFile: "test-results/results.xml",
      },
    ],
  ],

  use: {},
});
