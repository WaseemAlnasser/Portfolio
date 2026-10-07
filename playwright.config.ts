import { defineConfig } from "@playwright/test";

// Tests run against the static export in `out`, not the dev server.
export default defineConfig({
  testDir: "./e2e",
  reporter: "list",
  use: { baseURL: "http://localhost:4173" },
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
