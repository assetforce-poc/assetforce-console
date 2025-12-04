# login - 登录子功能详细设计

- **Status**: 🔄 部分实现
- **Parent**: [authentication/README.md](./README.md)
- **Last Updated**: 2025-12-04

---

## 实现状态

| 项目 | 设计 | 实现 | 说明 |
|------|------|------|------|
| LoginForm | ✅ | ✅ | 基础版已实现 |
| useLogin | ✅ | ✅ | 已实现 |
| OAuthButtons | ✅ | 🔲 | 待实现 |
| CredentialInput | ✅ | 🔲 | 内联在 LoginForm，未单独抽取 |
| useOAuthLogin | ✅ | 🔲 | 待实现 |
| rememberMe | ✅ | 🔲 | 代码预留，待 AAC 支持 |
| GraphQL schema | ✅ | ⚠️ | 实现使用扁平结构，非 Union Type |

---

## 1. 功能清单

| 功能                     | 组件         | GraphQL           | 优先级 | AAC 状态        |
| ------------------------ | ------------ | ----------------- | ------ | --------------- |
| Email + Password 登录    | LoginForm    | `login` mutation  | P0     | ✅ 已实现       |
| Username + Password 登录 | LoginForm    | `login` mutation  | P1     | ✅ 已实现       |
| GitHub OAuth             | OAuthButtons | Keycloak redirect | P1     | 🔲 需实施 OAuth |
| Google OAuth (扩展)      | OAuthButtons | Keycloak redirect | P2     | 🔲 需实施 OAuth |
| Azure AD OAuth (扩展)    | OAuthButtons | Keycloak redirect | P2     | 🔲 需实施 OAuth |
| Keycloak SSO (扩展)      | OAuthButtons | Keycloak redirect | P2     | 🔲 需实施 OAuth |
| Remember Me              | LoginForm    | Token TTL 延长    | P1     | 🔲 需扩展       |
| 忘记密码入口             | LoginForm    | 跳转链接          | P0     | N/A             |

**实施说明**：

- **Phase 1 (立即开始)**: Email/Username + Password 登录
  - AAC `login` mutation 已支持 (Task 027)
  - Keycloak 支持 email 作为 username，前端可直接使用
- **Phase 7 (待 AAC 实施)**: GitHub OAuth 登录
  - AAC 需添加 OAuth Authorization Code 交换 API
  - 前端可先直接构造 Keycloak OAuth URL，回调后暂用 Keycloak token
  - 待 AAC OAuth API 完成后切换

---

## 2. 数据流

### 2.1 Email/Username + Password 登录

```
User Input → LoginForm → useLogin → login mutation → AAC
                                          ↓
                              ┌───────────┴───────────┐
                              │                       │
                        Success + Tokens         MFA Required
                              │                       │
                              ↓                       ↓
                        Store tokens           Navigate to MFA
                        Navigate to app
```

### 2.2 OAuth 登录流程

```
用户点击 OAuth 按钮 (GitHub/其他扩展 Provider)
        ↓
OAuthButtons → 生成 state (CSRF 防护)
        ↓
重定向到 Keycloak OAuth 授权页面
    (URL: {keycloak}/realms/{realm}/protocol/openid-connect/auth)
        ↓
用户在 Keycloak 登录并选择 GitHub 授权
        ↓
Keycloak 重定向回应用
    (callback URL: /auth/callback?code=xxx&state=xxx)
        ↓
useOAuthLogin → 验证 state
        ↓
┌───────┴───────┐
│               │
有效          无效 (CSRF 攻击)
│               │
↓               ↓
交换 code      显示错误
    ↓
login mutation (provider + code) → AAC
        ↓
┌───────┴───────┐
│               │
Success       MFA Required
│               │
↓               ↓
Store tokens  Navigate to MFA
Navigate to app
```

---

## 3. 组件设计

### 3.1 LoginForm

#### 设计接口 (完整版)

```typescript
// 设计目标 - 完整功能
interface LoginFormProps {
  config: {
    enableEmailPassword: boolean;
    enableUsernamePassword: boolean;
    enableGitHub: boolean; // GitHub OAuth (P1)
    enableGoogle: boolean; // 扩展 (P2)
    enableAzureAd: boolean; // 扩展 (P2)
    enableKeycloakSSO: boolean; // 扩展 (P2)
    enableRememberMe: boolean;
  };
  onSuccess: (tokens: AuthTokens) => void;
  onMFARequired: (challenge: MFAChallenge) => void;
  onError?: (error: AuthError) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}
```

#### 当前实现 (简化版) ✅

```typescript
// 实际实现 - login/components/LoginForm.tsx
interface LoginFormProps {
  onSuccess?: (result: Extract<LoginResult, { type: 'success' }>) => void;
  onMFARequired?: (result: Extract<LoginResult, { type: 'mfa_required' }>) => void;
  onError?: (message: string) => void;
}
```

**差异说明**：
- `config` 未实现 - 当前只支持 username/password
- `onForgotPassword` / `onCreateAccount` 未实现 - 待添加链接
- 回调参数类型不同 - 使用 LoginResult 联合类型

### 3.2 OAuthButtons 🔲 未实现

```typescript
interface OAuthButtonsProps {
  providers: Array<'github' | 'google' | 'azure-ad' | 'keycloak'>; // github 优先，其他为扩展
  onInitiate?: (provider: OAuthProviderId) => void; // OAuth 流程启动时调用
}
```

**说明**：

- OAuth 成功在回调页面 `/auth/callback` 处理，不需要 `onSuccess` 回调
- `onInitiate` 可选，用于通知父组件 OAuth 流程开始（如显示 loading）
- **GitHub 为主要 OAuth 方式 (P1)**，Google/Azure AD/Keycloak 为可扩展选项 (P2)

**实现状态**: 🔲 待实现 - 需要先完成 AAC OAuth Code Exchange API

### 3.3 CredentialInput 🔲 未单独实现

```typescript
interface CredentialInputProps {
  type: 'email' | 'username';
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

**实现状态**: 🔲 内联在 LoginForm 中，未单独抽取为组件

---

## 4. Hooks

### 4.1 useLogin

密码登录的核心 Hook。

```typescript
function useLogin(): {
  login: (input: {
    credential: string; // email 或 username
    password: string;
    rememberMe?: boolean;
  }) => Promise<LoginResult>;
  loading: boolean;
  error: AuthError | null;
};

type LoginResult = { type: 'success'; tokens: AuthTokens } | { type: 'mfa_required'; challenge: MFAChallenge };
```

**使用场景**：

- LoginForm 提交时调用
- 处理 MFA Required 响应
- 错误处理（密码错误、账户锁定等）

---

### 4.2 useOAuthLogin 🔲 未实现

OAuth 登录的核心 Hook。

```typescript
function useOAuthLogin(): {
  // 启动 OAuth 流程（同步，会立即重定向）
  initiateOAuth: (provider: OAuthProviderId) => void;

  // 处理 OAuth 回调
  handleOAuthCallback: (params: { code: string; state: string }) => Promise<LoginResult>;

  loading: boolean;
  error: AuthError | null;
};

type OAuthProviderId = 'github' | 'google' | 'azure-ad' | 'keycloak';
```

**内部实现说明**：

1. **initiateOAuth** (同步):

   ```typescript
   // 生成随机 state (CSRF token)
   const state = generateRandomString(32);

   // 保存到 sessionStorage
   sessionStorage.setItem('oauth_provider', provider);
   sessionStorage.setItem('oauth_state', state);

   // 构造 Keycloak 授权 URL
   const authUrl =
     `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/auth?` +
     `client_id=${CLIENT_ID}&` +
     `redirect_uri=${REDIRECT_URI}&` +
     `response_type=code&` +
     `scope=openid profile email&` +
     `state=${state}`;

   // 重定向
   window.location.href = authUrl;
   ```

2. **handleOAuthCallback** (异步):

   ```typescript
   // 从 sessionStorage 读取保存的数据
   const savedProvider = sessionStorage.getItem('oauth_provider');
   const savedState = sessionStorage.getItem('oauth_state');

   // 验证 state (防 CSRF)
   if (params.state !== savedState) {
     throw new Error('CSRF attack detected');
   }

   // 构造 OAuthLoginInput
   const input: OAuthLoginInput = {
     provider: savedProvider,
     code: params.code,
     state: params.state,
     method: 'oauth',
   };

   // 调用 login mutation
   const result = await loginMutation(input);

   // 清理 sessionStorage
   sessionStorage.removeItem('oauth_provider');
   sessionStorage.removeItem('oauth_state');

   return result;
   ```

---

## 5. GraphQL

### 5.1 login.gql

#### 设计方案 (Union Type)

```graphql
mutation login($input: LoginInput!) {
  login(input: $input) {
    ... on LoginSuccess {
      ...AuthTokens
    }
    ... on MFARequired {
      ...MFAChallenge
    }
    ... on LoginError {
      code
      message
    }
  }
}
```

#### 当前实现 (扁平结构) ✅

```graphql
# 实际实现 - login/graphql/login.gql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    accessToken
    refreshToken
    expiresIn
    tokenType
    error                    # 字符串，非结构化错误
    identityContext {
      zone
      realm
      subject {
        accountId
        userId
        username
        email
        displayName
      }
      groups
    }
  }
}
```

**差异说明**：
- 设计使用 Union Type 区分成功/MFA/错误
- 实现使用扁平结构，通过 `success` + `error` 字段判断
- MFA 判断：代码中检查 `error?.includes('MFA')` (临时方案)

### 5.2 Input 类型

#### LoginInput

密码登录的输入类型：

```typescript
interface LoginInput {
  // 凭证（email 或 username）
  credential: string;

  // 密码
  password: string;

  // 记住我（延长 token 有效期）
  rememberMe?: boolean;

  // 登录方式
  method: 'password';
}
```

#### OAuthLoginInput

OAuth 登录的输入类型：

```typescript
interface OAuthLoginInput {
  // OAuth Provider (github 优先，其他为扩展)
  provider: 'github' | 'google' | 'azure-ad' | 'keycloak';

  // 授权码
  code: string;

  // CSRF 防护 token
  state: string;

  // 登录方式
  method: 'oauth';
}
```

**注意**：

- AAC 需要根据 `method` 字段区分密码登录和 OAuth 登录
- `rememberMe` 会影响返回的 token TTL（具体值待确认）
- OAuth 的 `state` 必须与前端生成的一致

---

## 6. 配置说明

### 6.1 OAuth 配置

| 配置项           | 开发环境                              | 生产环境                                       | 状态                    |
| ---------------- | ------------------------------------- | ---------------------------------------------- | ----------------------- |
| **Keycloak URL** | `http://localhost:8080`               | `https://keycloak.assetforce.com`              | ✅ 确定                 |
| **Realm**        | `assetforce-test`                     | `assetforce-prod`                              | ✅ 确定 (来自 Task 027) |
| **Client ID**    | `assetforce-console`                  | `assetforce-console`                           | 🔲 待创建               |
| **回调 URL**     | `/auth/callback`                      | `/auth/callback`                               | ✅ 确定                 |
| **Redirect URI** | `http://localhost:3000/auth/callback` | `https://console.assetforce.com/auth/callback` | ✅ 确定                 |
| **Scope**        | `openid profile email`                | `openid profile email`                         | ✅ 确定                 |

**待办**：

- [ ] 在 Keycloak `assetforce-test` realm 创建 Client `assetforce-console`
- [ ] 配置 Redirect URI 白名单
- [ ] 配置 Client 为 public（前端应用）

---

### 6.2 Token 配置

| 配置项                          | 推荐值 | 可调整 | 说明           |
| ------------------------------- | ------ | ------ | -------------- |
| **默认 accessToken TTL**        | 2 小时 | ✅     | 行业标准       |
| **Remember Me accessToken TTL** | 7 天   | ✅     | 平衡安全和体验 |
| **refreshToken TTL**            | 30 天  | ✅     | 标准做法       |
| **refreshToken 启用**           | 是     | ❌     | 必需           |

**实现**：

- AAC 根据 `rememberMe` 字段返回不同 TTL 的 token
- Frontend 使用 `useRefreshToken` 自动刷新过期 token

---

### 6.3 安全策略

| 策略                 | 推荐值     | 参考标准 | 可调整 |
| -------------------- | ---------- | -------- | ------ |
| **登录失败次数限制** | 5 次       | OWASP    | ✅     |
| **账户锁定时间**     | 15 分钟    | OWASP    | ✅     |
| **验证码触发**       | 3 次失败后 | 行业标准 | ✅     |
| **IP 限制**          | Phase 2    | -        | -      |

**实现**：

- AAC 负责失败次数统计和账户锁定
- Frontend 在 3 次失败后显示 reCAPTCHA
- 锁定后返回 `ACCOUNT_LOCKED` 错误码
