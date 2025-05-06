import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";
import type { ConfigOptions } from "@nuxt/test-utils/playwright";
import dotenv from "dotenv";
import path from "path";

import { isCI, isWindows } from "std-env";

const devicesToTest = [
  "Desktop Chrome",
  // Test against other common browser engines.
  // 'Desktop Firefox',
  // 'Desktop Safari',
  // Test against mobile viewports.
  // 'Pixel 5',
  // 'iPhone 12',
  // Test against branded browsers.
  // { ...devices['Desktop Edge'], channel: 'msedge' },
  // { ...devices['Desktop Chrome'], channel: 'chrome' },
] satisfies Array<string | (typeof devices)[string]>;

dotenv.config({
  path: path.resolve(fileURLToPath(new URL(".", import.meta.url)), ".env"),
});

// https://playwright.dev/docs/test-configuration
export default defineConfig<ConfigOptions>({
  /* Playwright configuration options */
  use: {
    /* Nuxt configuration options */
    nuxt: {
      rootDir: fileURLToPath(new URL(".", import.meta.url)),
      host: "http://localhost:3000", // Use this to run tests against the local server, and not need make a build
      browser: false,
      browserOptions: {
        type: "chromium",
        launch: {
          headless: false,
        },
      },
    },
    trace: "on-first-retry", // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
  },
  testDir: "./tests",
  outputDir: "test-results",
  fullyParallel: true, // Run tests in parallel
  forbidOnly: !!isCI, // Fail the build on CI if you accidentally left test.only in the source code.
  retries: isCI ? 2 : 0, // Retry on CI only
  workers: isCI ? 1 : undefined, // Opt out of parallel tests on CI.
  timeout: isWindows ? 60000 : undefined,
  reporter: "html", // Reporter to use. See https://playwright.dev/docs/test-reporters
  projects: devicesToTest.map((p) =>
    typeof p === "string" ? { name: p, use: devices[p] } : p
  ), // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  webServer: {
    command: "yarn dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
