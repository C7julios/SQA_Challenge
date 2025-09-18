import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 1,
  use: {
    headless: true,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    baseURL: "https://www.floristeriamundoflor.com/",
  },
  reporter: [["html", { open: "never" }], ["line"]],
});