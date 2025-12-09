/**
 * Playwright E2E Configuration for Admin Console
 *
 * Uses @assetforce/playwright-config for shared configuration.
 *
 * Test Environment:
 * - assetforce-infra/docker/docker-compose.yml (dev services)
 * - Services: aac:8081, imc:8082, keycloak:8080
 * - Admin Console Dev: http://localhost:3001
 */

const { createDevConfig } = require('@assetforce/playwright-config/web');

const isCI = !!process.env.CI;

module.exports = createDevConfig({
  testDir: './e2e/admin',
  // Increase timeout for Next.js Turbopack compilation in dev mode
  // Turbopack dev mode compiles on-demand, taking 8-10s per page
  timeout: 90000, // 90 seconds (default 30s)
  // Run tests sequentially to avoid concurrent compilation overhead
  workers: 1,
  // Use Admin Console port
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
  },
  // Only configure webServer in CI - locally, start the server manually
  ...(isCI && {
    webServer: {
      command: 'yarn workspace @assetforce/admin-console dev',
      url: process.env.BASE_URL || 'http://localhost:3001',
      reuseExistingServer: false,
      timeout: 120000,
    },
  }),
});
