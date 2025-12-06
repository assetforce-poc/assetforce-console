# Testing Architecture Design

## Overview

本文档定义 assetforce-console 项目的测试架构，包括单元测试、组件测试和 E2E 测试的配置和组织方式。

## Design Principles

### 1. 就近原则

测试文件与被测代码在同一位置，便于维护和查找。

```
packages/feature/authentication/
├── register/
│   ├── hooks/
│   │   └── useRegister.ts
│   └── components/
│       └── RegisterForm.tsx
└── __tests__/
    └── register/
        ├── useRegister.test.ts
        └── RegisterForm.test.tsx
```

### 2. 配置继承

使用 `@assetforce/*-config` 包作为基础配置，各包只需最小化配置。

```
@assetforce/jest-config (npm)
         ↓ extends
packages/feature/[name]/jest.config.js
```

### 3. 环境隔离

| 测试类型 | 环境 | Mock 策略 |
|----------|------|-----------|
| Unit Tests | jsdom | MSW mock GraphQL |
| Component Tests | jsdom | MSW mock GraphQL |
| E2E Tests | 真实浏览器 | Docker 真实后端 |

---

## Directory Structure

### Feature 包测试目录

```
packages/feature/[feature-name]/
├── __tests__/                    # 测试目录
│   ├── setup.ts                  # 测试设置 (MSW handlers)
│   ├── [subfeature]/
│   │   ├── [hook].test.ts        # Hook 单元测试
│   │   └── [Component].test.tsx  # 组件测试
│   └── __mocks__/                # 手动 mock (可选)
├── jest.config.js                # Jest 配置
└── package.json                  # 包含 test script
```

### E2E 测试目录

```
assetforce-console/
├── e2e/
│   ├── playwright.config.ts      # Playwright 配置
│   ├── auth/                     # 认证相关测试
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   └── verify-email.spec.ts
│   ├── fixtures/                 # 测试固件
│   │   ├── test-user.ts
│   │   └── auth.ts               # 认证固件
│   └── utils/                    # 测试工具
│       └── graphql.ts
└── package.json                  # e2e scripts
```

---

## Configuration Templates

### Jest Config (Feature Package)

```javascript
// packages/feature/[name]/jest.config.js
const { createReactConfig } = require('@assetforce/jest-config/react');

module.exports = createReactConfig({
  rootDir: __dirname,
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  moduleNameMapper: {
    // 处理 workspace 包引用
    '^@assetforce/(.*)$': '<rootDir>/../../$1/src',
  },
});
```

### Test Setup (MSW)

```typescript
// packages/feature/[name]/__tests__/setup.ts
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### GraphQL Mock Handlers

```typescript
// packages/feature/[name]/__tests__/handlers.ts
import { graphql, HttpResponse } from 'msw';

export const handlers = [
  // CheckEmailAvailability
  graphql.query('CheckEmailAvailability', ({ variables }) => {
    const { email } = variables;
    if (email === 'taken@example.com') {
      return HttpResponse.json({
        data: {
          checkEmailAvailability: {
            available: false,
            reason: 'EMAIL_ALREADY_EXISTS',
          },
        },
      });
    }
    return HttpResponse.json({
      data: {
        checkEmailAvailability: {
          available: true,
          reason: null,
        },
      },
    });
  }),

  // Register
  graphql.mutation('Register', ({ variables }) => {
    const { input } = variables;
    return HttpResponse.json({
      data: {
        register: {
          success: true,
          message: 'Registration successful',
          accountId: 'test-account-id',
        },
      },
    });
  }),
];
```

### Playwright Config

```typescript
// e2e/playwright.config.ts
import { defineConfig } from '@playwright/test';
import { baseConfig } from '@assetforce/playwright-config';

export default defineConfig({
  ...baseConfig,
  testDir: './',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
```

---

## Package.json Scripts

### Feature Package

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@assetforce/jest-config": "*",
    "@assetforce/test-utils": "*",
    "@testing-library/react": "~16.3.0",
    "@testing-library/jest-dom": "~6.6.3",
    "jest": "~29.7.0",
    "jest-environment-jsdom": "~29.7.0",
    "msw": "~2.7.0",
    "ts-jest": "~29.4.0"
  }
}
```

### Root Package (E2E)

```json
{
  "scripts": {
    "e2e": "playwright test",
    "e2e:auth": "playwright test e2e/auth/",
    "e2e:ui": "playwright test --ui",
    "e2e:report": "playwright show-report"
  },
  "devDependencies": {
    "@assetforce/playwright-config": "*",
    "@playwright/test": "~1.49.0"
  }
}
```

---

## Test Environment

### Docker Infrastructure

使用 `assetforce-infra/tests/docker-compose-test.yml`:

```bash
# 启动测试基础设施
cd assetforce-infra/tests
docker-compose -f docker-compose-test.yml --profile e2e up -d

# 服务端点
# Keycloak: http://localhost:8180
# AAC GraphQL: http://localhost:8181/graphql
# PostgreSQL: localhost:5435
```

### E2E 测试数据

Keycloak test realm 配置:
- Realm: `assetforce-test`
- 测试用户: 通过 `e2e/setup-keycloak-test-user.sh` 创建

---

## Test Coverage Targets

| 包 | Line | Branch | 说明 |
|----|------|--------|------|
| @assetforce/authentication | 80% | 70% | Hooks + Components |
| E2E (Critical Paths) | N/A | N/A | 100% 关键路径覆盖 |

---

## Implementation Checklist

### Phase 1: Authentication Package Jest Setup

- [ ] 创建 `jest.config.js`
- [ ] 创建 `__tests__/setup.ts`
- [ ] 创建 `__tests__/handlers.ts` (MSW)
- [ ] 更新 `package.json` devDependencies
- [ ] 添加 test scripts

### Phase 2: Register Unit Tests

- [ ] `useRegister.test.ts` - 注册 hook
- [ ] `useEmailAvailability.test.ts` - 邮箱检查 hook

### Phase 3: Register Component Tests

- [ ] `RegisterForm.test.tsx` - 表单组件

### Phase 4: E2E Setup

- [ ] 创建 `e2e/playwright.config.ts`
- [ ] 创建 `e2e/fixtures/auth.ts`
- [ ] 更新 root `package.json` scripts

### Phase 5: Register E2E Tests

- [ ] `e2e/auth/register.spec.ts` - 完整注册流程

---

## References

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)
- Task 037: Test Infrastructure Design
- Task 028: AssetForce Console Frontend
