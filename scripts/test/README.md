# E2E Testing Guide

Unified E2E testing entry point for AssetForce Console.

## Quick Start

```bash
# Run all E2E tests
yarn e2e

# Run all tests in UI mode
yarn e2e:ui

# Run specific module tests
./scripts/test/e2e.sh auth      # Customer Portal authentication tests
./scripts/test/e2e.sh admin     # Admin Console tests

# Run specific test file
./scripts/test/e2e.sh e2e/admin/accounts.spec.ts

# Pass Playwright options
./scripts/test/e2e.sh admin --headed           # Run in headed mode
./scripts/test/e2e.sh admin --debug            # Run in debug mode
./scripts/test/e2e.sh admin --project=firefox  # Run on Firefox
```

## Test Modules

### Customer Portal (`auth`)
- **Tests**: User registration, login, email verification
- **Config**: `e2e/playwright.config.cjs`
- **Location**: `e2e/auth/`
- **App**: http://localhost:3000

### Admin Console (`admin`)
- **Tests**: Account listing, user management
- **Config**: `playwright.admin.config.cjs`
- **Location**: `e2e/admin/`
- **App**: http://localhost:3001

## Prerequisites

1. **Start development environment**:
   ```bash
   cd /path/to/assetforce-infra
   ./scripts/dev.sh
   ```

2. **Services must be running**:
   - AAC Backend: http://localhost:8081
   - IMC Backend: http://localhost:8082
   - Keycloak: http://localhost:8080
   - Customer Portal Dev: http://localhost:3000
   - Admin Console Dev: http://localhost:3001

## Test Structure

```
assetforce-console/
├── e2e/
│   ├── auth/                    # Customer Portal tests
│   │   ├── fixtures.ts          # Auth test fixtures
│   │   └── register.spec.ts     # Registration flow tests
│   └── admin/                   # Admin Console tests
│       ├── fixtures.ts          # Admin test fixtures
│       └── accounts.spec.ts     # Account listing tests
│
├── scripts/test/
│   ├── e2e.sh                   # Unified test runner
│   └── README.md                # This file
│
├── e2e/playwright.config.cjs    # Customer Portal config
└── playwright.admin.config.cjs  # Admin Console config
```

## Adding New Tests

### For Customer Portal (Authentication)

1. Create test file: `e2e/auth/your-feature.spec.ts`
2. Import fixtures: `import { test, expect, urls } from './fixtures';`
3. Run: `./scripts/test/e2e.sh auth`

### For Admin Console

1. Create test file: `e2e/admin/your-feature.spec.ts`
2. Import fixtures: `import { test, expect, urls } from './fixtures';`
3. Run: `./scripts/test/e2e.sh admin`

### For New Applications

1. Create config: `playwright.{app-name}.config.cjs`
2. Create test directory: `e2e/{app-name}/`
3. Update `scripts/test/e2e.sh` to support new module
4. Add npm script (optional): `"e2e:{app-name}": "bash scripts/test/e2e.sh {app-name}"`

## Playwright Commands

```bash
# Generate tests with codegen
npx playwright codegen http://localhost:3001/accounts

# Show test report
npx playwright show-report

# Update snapshots
./scripts/test/e2e.sh admin --update-snapshots

# Run in headed mode (see browser)
./scripts/test/e2e.sh admin --headed

# Run in debug mode (step through)
./scripts/test/e2e.sh admin --debug

# Run specific browser
./scripts/test/e2e.sh admin --project=firefox
./scripts/test/e2e.sh admin --project=webkit
```

## CI/CD Integration

The test scripts automatically detect CI environments and configure `webServer` accordingly.

```yaml
# GitHub Actions example
- name: Run E2E tests
  run: yarn e2e
  env:
    CI: true
    BASE_URL: http://localhost:3000
```

## Troubleshooting

### Tests fail with "Connection refused"

- Ensure dev servers are running: `cd assetforce-infra && ./scripts/dev.sh`
- Check services: `docker-compose ps`

### Tests fail with GraphQL errors

- Restart backend: `docker-compose restart aac imc`
- Check backend logs: `docker logs aac`

### Tests fail with timeout

- Increase timeout in test: `{ timeout: 30000 }`
- Or globally in config: `timeout: 90000`

### Browser installation issues

```bash
npx playwright install
```

## Best Practices

1. **Use data-testid for stability**: `data-testid="account-list"` instead of CSS selectors
2. **Use exact match when needed**: `getByRole('button', { name: 'Submit', exact: true })`
3. **Wait for network idle**: `await page.waitForLoadState('networkidle')`
4. **Skip tests requiring specific data**: `test.skip('description', ...)`
5. **Group related tests**: Use `test.describe()` blocks
6. **Clean up test data**: Use fixtures or afterEach hooks
