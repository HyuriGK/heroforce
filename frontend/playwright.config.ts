import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:5173",
    browserName: "chromium",
    headless: true,
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "local-edge",
      use: {
        launchOptions: process.env.E2E_BROWSER_EXECUTABLE
          ? { executablePath: process.env.E2E_BROWSER_EXECUTABLE }
          : undefined,
      },
    },
  ],
});
