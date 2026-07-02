import { defineConfig, devices } from "@playwright/test";
import { url } from "@buddy-play/config";

const API_URL = url("api");
const POSTS_URL = url("posts");
const HOST_URL = url("host");

/**
 * Под тестом полный стек MFE: API Hono, remote `posts` и оболочка `host`.
 * Playwright запускает все три и переиспользует их локально между прогонами.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: HOST_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "api", testDir: "./e2e/api" },
    {
      name: "web",
      testDir: "./e2e/web",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "pnpm --filter @buddy-play/posts-api dev",
      url: `${API_URL}/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @buddy-play/posts dev",
      url: POSTS_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @buddy-play/host dev",
      url: HOST_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
