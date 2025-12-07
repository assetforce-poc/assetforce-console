/**
 * Playwright E2E Configuration for AssetForce Console
 *
 * Uses @assetforce/playwright-config for shared configuration.
 *
 * Test Environment:
 * - assetforce-infra/tests/docker-compose-test.yml --profile e2e
 * - Services: postgres-test:5435, keycloak-test:8180, aac-service:8181
 */

const { createDevConfig } = require('@assetforce/playwright-config/web');

const isCI = !!process.env.CI;

module.exports = createDevConfig({
  testDir: './auth',
  // Only configure webServer in CI - locally, start the server manually
  ...(isCI && {
    webServer: {
      command: 'yarn workspace @assetforce/customer-portal dev',
      url: process.env.BASE_URL || 'http://localhost:3000',
      reuseExistingServer: false,
      timeout: 120000,
    },
  }),
});
