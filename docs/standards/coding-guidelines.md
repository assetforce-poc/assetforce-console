# Coding Guidelines

**Version**: 1.0
**Created**: 2025-12-03

---

## 核心原则

### 1. Feature-based Co-location (功能内聚)

采用 Turborepo monorepo 结构，按功能模块组织代码，每个模块内部包含完整的 components/hooks/graphql：

```
packages/feature/
├── authentication/        # @assetforce/authentication - 认证模块
│   ├── login/             # 登录子功能
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── graphql/
│   │   └── index.ts
│   ├── mfa/               # MFA 子功能
│   ├── session/           # 会话管理子功能
│   └── index.ts           # 模块公开导出
├── authorization/         # @assetforce/authorization - 授权模块 (待接入 PME)
│   └── (待实现)
├── user/                  # @assetforce/user - 用户模块
│   ├── profile/
│   ├── password/
│   ├── admin/
│   └── index.ts
└── common/                # @assetforce/common - 公共模块
    ├── constants/
    ├── hooks/
    ├── env/
    └── graphql/client.ts
```

**模块边界规则**：

- 每个模块有清晰的 `index.ts` 导出
- 模块间通过公开接口通信，禁止直接引用内部文件
- 模块内部实现可自由重构，不影响外部使用

```typescript
// ✅ 正确：通过模块导出引用
import { LoginForm, useLoginMutation } from '@assetforce/authentication';

// ❌ 错误：直接引用内部文件
import { LoginForm } from '@assetforce/authentication/login/components/LoginForm/LoginForm';
```

---

### 2. 可配置化 (Configuration-Driven)

所有可变参数必须通过配置注入，禁止散落在代码中。

#### 2.1 配置层级

```
环境变量 (.env)
    ↓
packages/config/
    ↓
App-level config (apps/*/config/)
    ↓
Feature-level config (传入组件)
```

#### 2.2 配置文件结构

```typescript
// packages/config/src/auth.config.ts
export interface AuthConfig {
  providers: {
    emailPassword: { enabled: boolean };
    google: { enabled: boolean; clientId: string };
    azureAd: { enabled: boolean; tenantId: string; clientId: string };
    keycloak: { enabled: boolean; realm: string };
  };
  mfa: {
    totp: { enabled: boolean };
    sms: { enabled: boolean };
    email: { enabled: boolean };
  };
  session: {
    defaultTimeout: number; // seconds
    rememberMeTimeout: number; // seconds
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireNumber: boolean;
    requireSpecial: boolean;
  };
}

export const defaultAuthConfig: AuthConfig = {
  providers: {
    emailPassword: { enabled: true },
    google: { enabled: false, clientId: '' },
    azureAd: { enabled: false, tenantId: '', clientId: '' },
    keycloak: { enabled: false, realm: '' },
  },
  mfa: {
    totp: { enabled: true },
    sms: { enabled: false },
    email: { enabled: true },
  },
  session: {
    defaultTimeout: 3600, // 1 hour
    rememberMeTimeout: 604800, // 7 days
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireNumber: true,
    requireSpecial: false,
  },
};
```

#### 2.3 环境变量命名规范

```bash
# .env.example

# === Backend URLs ===
NEXT_PUBLIC_AAC_URL=http://localhost:8081
NEXT_PUBLIC_IMC_URL=http://localhost:8082
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080

# === OAuth Providers ===
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_AZURE_AD_TENANT_ID=
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=

# === Feature Flags ===
NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN=false
NEXT_PUBLIC_ENABLE_AZURE_AD_LOGIN=false
NEXT_PUBLIC_ENABLE_MFA_SMS=false
```

---

### 3. 禁止硬编码 (No Hardcoding)

#### 3.1 禁止列表

| 类型   | 禁止                             | 应该                                             |
| ------ | -------------------------------- | ------------------------------------------------ |
| URL    | `fetch('http://localhost:8081')` | `fetch(config.aacUrl)`                           |
| 文本   | `<Button>Login</Button>`         | `<Button>{t('auth.login')}</Button>`             |
| 颜色   | `color: '#1976d2'`               | `color: theme.palette.primary.main`              |
| 尺寸   | `width: 400`                     | `width: theme.spacing(50)`                       |
| 时间   | `setTimeout(..., 3600000)`       | `setTimeout(..., config.session.timeout * 1000)` |
| 错误码 | `if (code === 'AUTH_001')`       | `if (code === ErrorCodes.INVALID_CREDENTIALS)`   |

#### 3.2 常量定义位置

```typescript
// packages/config/src/constants/error-codes.ts
export const ErrorCodes = {
  // Authentication
  INVALID_CREDENTIALS: 'AUTH_001',
  MFA_REQUIRED: 'AUTH_002',
  MFA_INVALID: 'AUTH_003',
  SESSION_EXPIRED: 'AUTH_004',
  ACCOUNT_LOCKED: 'AUTH_005',
  ACCOUNT_SUSPENDED: 'AUTH_006',

  // Account
  EMAIL_ALREADY_EXISTS: 'ACC_001',
  USERNAME_ALREADY_EXISTS: 'ACC_002',
  PROVIDER_ALREADY_LINKED: 'ACC_003',
} as const;

// packages/config/src/constants/routes.ts
export const Routes = {
  LOGIN: '/login',
  LOGIN_MFA: '/login/mfa',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/',
  PROFILE: '/profile',
  PROFILE_SECURITY: '/profile/security',
  PROFILE_SESSIONS: '/profile/sessions',
} as const;
```

---

## 组件开发规范

### 4. 组件结构

```
packages/feature/authentication/login/components/LoginForm/
├── LoginForm.tsx           # 主组件
├── LoginForm.types.ts      # 类型定义
├── LoginForm.styles.ts     # 样式 (如果需要)
├── LoginForm.test.tsx      # 测试
└── index.ts                # 导出

# Hook 放在子功能的 hooks/ 目录
packages/feature/authentication/login/hooks/
└── useLoginForm.ts
```

### 5. 组件 Props 设计

```typescript
// LoginForm.types.ts
export interface LoginFormProps {
  /** 配置：启用的登录方式 */
  config: {
    enableEmailPassword: boolean;
    enableGoogle: boolean;
    enableAzureAd: boolean;
  };
  /** 回调：登录成功 */
  onSuccess: (tokens: AuthTokens) => void;
  /** 回调：需要 MFA */
  onMFARequired: (challenge: MFAChallenge) => void;
  /** 回调：登录失败 */
  onError?: (error: AuthError) => void;
  /** 可选：自定义样式 */
  sx?: SxProps<Theme>;
}
```

### 6. 国际化 (i18n)

所有用户可见文本必须使用 i18n：

```typescript
// ✅ 正确
import { useTranslation } from 'react-i18next';

function LoginForm() {
  const { t } = useTranslation('auth');
  return (
    <Button type="submit">{t('login.submit')}</Button>
  );
}

// ❌ 错误
function LoginForm() {
  return (
    <Button type="submit">Sign In</Button>
  );
}
```

**翻译文件结构**：

```
packages/config/src/i18n/
├── locales/
│   ├── en/
│   │   ├── auth.json
│   │   ├── user.json
│   │   └── common.json
│   ├── ja/
│   └── zh/
└── index.ts
```

---

## GraphQL 规范

### 7. 文件结构 (Feature-based Co-location)

按照 `packages/feature/[模块]/[子功能]/` 组织，每个子功能内部包含完整的 components/hooks/graphql：

```
packages/
├── feature/                                    # 功能模块根目录
│   ├── authentication/                         # 认证功能模块
│   │   ├── login/                              # 登录子功能
│   │   │   ├── components/
│   │   │   │   ├── LoginForm/
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   ├── LoginForm.types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── OAuthButtons/
│   │   │   ├── hooks/
│   │   │   │   └── useLoginForm.ts
│   │   │   ├── graphql/
│   │   │   │   ├── login.gql
│   │   │   │   └── generated/                  # codegen 自动生成
│   │   │   └── index.ts
│   │   │
│   │   ├── mfa/                                # MFA 子功能
│   │   │   ├── components/
│   │   │   │   ├── MFAVerification/
│   │   │   │   └── TOTPSetup/
│   │   │   ├── hooks/
│   │   │   ├── graphql/
│   │   │   │   ├── completeMFA.gql
│   │   │   │   ├── enableMFA.gql
│   │   │   │   └── generated/
│   │   │   └── index.ts
│   │   │
│   │   ├── session/                            # 会话管理子功能
│   │   │   ├── components/
│   │   │   │   └── SessionList/
│   │   │   ├── graphql/
│   │   │   │   ├── myActiveSessions.gql
│   │   │   │   ├── logout.gql
│   │   │   │   └── generated/
│   │   │   └── index.ts
│   │   │
│   │   ├── types/                              # 模块级共享类型
│   │   ├── constants/                          # 模块级常量
│   │   ├── fragments/                          # 模块级共享 fragments
│   │   │   └── authentication.fragments.gql
│   │   ├── codegen.ts                          # 模块级 codegen 配置
│   │   ├── package.json
│   │   └── index.ts                            # 模块公开导出
│   │
│   ├── authorization/                          # 授权功能模块 (待接入 PME)
│   │   └── (待实现)
│   │
│   ├── user/                                   # 用户功能模块
│   │   ├── profile/                            # 用户资料子功能
│   │   │   ├── components/
│   │   │   │   └── UserProfile/
│   │   │   ├── graphql/
│   │   │   │   ├── me.gql
│   │   │   │   ├── updateProfile.gql
│   │   │   │   └── generated/
│   │   │   └── index.ts
│   │   │
│   │   ├── password/                           # 密码管理子功能
│   │   │   ├── components/
│   │   │   │   └── ChangePasswordForm/
│   │   │   ├── graphql/
│   │   │   │   ├── changePassword.gql
│   │   │   │   └── generated/
│   │   │   └── index.ts
│   │   │
│   │   ├── admin/                              # 管理功能（Admin Console）
│   │   │   ├── components/
│   │   │   │   ├── UserList/
│   │   │   │   └── UserForm/
│   │   │   ├── graphql/
│   │   │   │   ├── users.gql
│   │   │   │   ├── createUser.gql
│   │   │   │   └── generated/
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   ├── constants/
│   │   ├── fragments/
│   │   │   └── user.fragments.gql
│   │   ├── codegen.ts
│   │   └── index.ts
│   │
│   └── common/                                 # 共通功能
│       ├── constants/                          # 全局常量
│       ├── hooks/                              # 全局 hooks
│       ├── env/                                # 环境变量
│       └── graphql/
│           └── client.ts                       # Apollo Client 配置
│
├── material/                                   # 设计系统（无业务逻辑）
│   ├── core/                                   # MUI 重导出
│   ├── atoms/                                  # 原子组件
│   ├── molecules/                              # 分子组件
│   └── organisms/                              # 有机组件
│
├── types/                                      # 通用类型定义
├── hooks/                                      # 通用 Hooks
└── typescript-configs/                         # TS 配置
```

### 8. .gql 文件示例

```graphql
# packages/feature/authentication/login/graphql/login.gql

#import "../../fragments/auth.fragments.gql"

mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    tokens {
      ...AuthTokens
    }
    mfaRequired
    mfaChallenge {
      ...MFAChallenge
    }
    error {
      code
      message
    }
  }
}
```

```graphql
# packages/feature/authentication/fragments/auth.fragments.gql

fragment AuthTokens on TokenPair {
  accessToken
  refreshToken
  expiresIn
}

fragment MFAChallenge on MFAChallengeResponse {
  challengeId
  method
  expiresAt
}
```

### 9. 模块级 GraphQL Code Generator 配置

```typescript
// packages/feature/authentication/codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_AAC_URL + '/graphql',
  documents: [
    '**/graphql/*.gql', // 所有子功能的 .gql 文件
    'fragments/**/*.gql', // 模块级共享 fragments
  ],
  generates: {
    // 为每个子功能生成到对应目录
    'login/graphql/generated/index.ts': {
      documents: ['login/graphql/*.gql'],
      plugins: ['typescript', 'typescript-operations'],
      // 只生成类型，不生成 React Apollo Hooks
    },
    'mfa/graphql/generated/index.ts': {
      documents: ['mfa/graphql/*.gql'],
      plugins: ['typescript', 'typescript-operations'],
    },
    'session/graphql/generated/index.ts': {
      documents: ['session/graphql/*.gql'],
      plugins: ['typescript', 'typescript-operations'],
    },
  },
};

export default config;
```

**生成内容（仅类型，不含 Hook）**：

- `LoginDocument` - GraphQL 文档常量
- `LoginMutation` - 返回类型
- `LoginMutationVariables` - 变量类型

**Hook 由开发者手动编写**（放在 `hooks/` 目录）。

### 10. 模块导出

```typescript
// packages/feature/authentication/login/index.ts
export { LoginForm } from './components/LoginForm';
export { OAuthButtons } from './components/OAuthButtons';
export { useLoginForm } from './hooks/useLoginForm';
export * from './graphql/generated';

// packages/feature/authentication/index.ts (模块入口)
// 子功能导出
export * from './login';
export * from './mfa';
export * from './session';

// 模块级共享
export * from './types';
export * from './constants';
```

### 11. 使用方式

```typescript
// apps/customer-portal 使用
import { LoginForm, useLoginMutation } from '@assetforce/authentication';
import { UserProfile, useMeQuery } from '@assetforce/user';

function LoginPage() {
  const [login, { loading }] = useLoginMutation();
  return <LoginForm onSubmit={login} loading={loading} />;
}
```

### 12. 根目录 codegen 脚本

```json
// package.json (root)
{
  "scripts": {
    "codegen": "turbo run codegen",
    "codegen:authentication": "yarn workspace @assetforce/authentication codegen",
    "codegen:user": "yarn workspace @assetforce/user codegen"
  }
}
```

**开发流程**：

1. 在子功能目录下创建 `graphql/*.gql` 文件（如 `packages/feature/authentication/login/graphql/login.gql`）
2. 运行 `yarn codegen:authentication` 生成该模块所有子功能的类型和 hooks
3. 从模块导入使用：`import { LoginForm, useLoginMutation } from '@assetforce/authentication'`

---

## 目录结构总览

```
assetforce-console/
├── apps/
│   ├── customer-portal/                       # Customer Portal 应用
│   │   ├── app/                               # Next.js App Router
│   │   │   ├── (auth)/                        # 认证路由组
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── login/mfa/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   └── layout.tsx
│   │   │   ├── (dashboard)/                   # 主应用路由组
│   │   │   │   ├── profile/
│   │   │   │   ├── profile/security/
│   │   │   │   ├── profile/sessions/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx
│   │   ├── config/                            # App 级配置
│   │   └── package.json
│   │
│   └── admin-console/                         # Admin Console 应用
│       ├── app/
│       │   ├── users/
│       │   ├── roles/
│       │   ├── tenants/
│       │   └── audit-logs/
│       └── package.json
│
├── packages/
│   ├── feature/                               # 功能模块 (Feature Packages)
│   │   ├── authentication/                    # @assetforce/authentication
│   │   │   ├── login/                         # 登录子功能
│   │   │   │   ├── components/
│   │   │   │   │   ├── LoginForm/
│   │   │   │   │   └── OAuthButtons/
│   │   │   │   ├── hooks/
│   │   │   │   ├── graphql/
│   │   │   │   │   ├── login.gql
│   │   │   │   │   └── generated/
│   │   │   │   └── index.ts
│   │   │   ├── mfa/                           # MFA 子功能
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── graphql/
│   │   │   │   └── index.ts
│   │   │   ├── session/                       # 会话管理子功能
│   │   │   │   ├── components/
│   │   │   │   ├── graphql/
│   │   │   │   └── index.ts
│   │   │   ├── types/                         # 模块级共享类型
│   │   │   ├── constants/                     # 模块级常量
│   │   │   ├── fragments/                     # 模块级共享 fragments
│   │   │   ├── codegen.ts
│   │   │   ├── package.json
│   │   │   └── index.ts
│   │   │
│   │   ├── authorization/                     # @assetforce/authorization (待接入 PME)
│   │   │   └── (待实现)
│   │   │
│   │   ├── user/                              # @assetforce/user
│   │   │   ├── profile/                       # 用户资料子功能
│   │   │   ├── password/                      # 密码管理子功能
│   │   │   ├── admin/                         # 管理功能 (Admin Console)
│   │   │   ├── types/
│   │   │   ├── fragments/
│   │   │   ├── codegen.ts
│   │   │   ├── package.json
│   │   │   └── index.ts
│   │   │
│   │   └── common/                            # @assetforce/common
│   │       ├── constants/                     # 全局常量 (ErrorCodes, Routes)
│   │       ├── hooks/                         # 全局 hooks
│   │       ├── env/                           # 环境变量配置
│   │       ├── graphql/
│   │       │   └── client.ts                  # Apollo Client 配置
│   │       ├── i18n/                          # 国际化
│   │       │   └── locales/
│   │       ├── package.json
│   │       └── index.ts
│   │
│   ├── material/                              # 设计系统 (无业务逻辑)
│   │   ├── core/                              # MUI 重导出 + 主题配置
│   │   ├── atoms/                             # 原子组件 (Button, Input)
│   │   ├── molecules/                         # 分子组件 (FormField)
│   │   ├── organisms/                         # 有机组件 (DataTable)
│   │   ├── package.json
│   │   └── index.ts
│   │
│   ├── types/                                 # 通用类型定义
│   ├── hooks/                                 # 通用 Hooks
│   └── typescript-configs/                    # 共享 TypeScript 配置
│
├── docs/
│   ├── requirements/
│   └── standards/
│
├── turbo.json
└── package.json
```

---

## Checklist

开发新功能前，确认：

- [ ] 功能放在正确的 feature 模块下 (`packages/feature/authentication/`, `packages/feature/user/` 等)
- [ ] 子功能结构完整：`[子功能]/{components,hooks,graphql}/`
- [ ] `.gql` 文件放在子功能的 `graphql/` 目录
- [ ] 运行 `yarn codegen` 生成类型和 hooks
- [ ] 配置项定义在 `@assetforce/common`
- [ ] 常量已定义（ErrorCodes, Routes 等）
- [ ] 文本已添加到 i18n 翻译文件
- [ ] 组件通过 props 接收配置，无硬编码
- [ ] 子功能和模块都有清晰的 index.ts 导出
- [ ] UI 组件无业务逻辑（放在 `packages/material/`）
