# login - 登录子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能 | 组件 | GraphQL | 优先级 |
|------|------|---------|--------|
| Email + Password 登录 | LoginForm | `login` mutation | P0 |
| Username + Password 登录 | LoginForm | `login` mutation | P1 |
| Google OAuth | OAuthButtons | Keycloak redirect | P1 |
| Azure AD OAuth | OAuthButtons | Keycloak redirect | P2 |
| Keycloak SSO | OAuthButtons | Keycloak redirect | P1 |
| Remember Me | LoginForm | Token TTL 延长 | P1 |
| 忘记密码入口 | LoginForm | 跳转链接 | P0 |

---

## 2. 数据流

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

---

## 3. 组件设计

### 3.1 LoginForm

```typescript
interface LoginFormProps {
  config: {
    enableEmailPassword: boolean;
    enableUsernamePassword: boolean;
    enableGoogle: boolean;
    enableAzureAd: boolean;
    enableKeycloakSSO: boolean;
    enableRememberMe: boolean;
  };
  onSuccess: (tokens: AuthTokens) => void;
  onMFARequired: (challenge: MFAChallenge) => void;
  onError?: (error: AuthError) => void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
}
```

### 3.2 OAuthButtons

```typescript
interface OAuthButtonsProps {
  providers: Array<'google' | 'azure-ad' | 'keycloak'>;
  onSuccess: (tokens: AuthTokens) => void;
  onError?: (error: AuthError) => void;
}
```

### 3.3 CredentialInput

```typescript
interface CredentialInputProps {
  type: 'email' | 'username';
  value: string;
  onChange: (value: string) => void;
  error?: string;
}
```

---

## 4. GraphQL

### 4.1 login.gql

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

---

## 5. 待确认事项

- [ ] OAuth 回调 URL 配置
- [ ] Remember Me 的 Token TTL 具体值
- [ ] 登录失败次数限制和锁定策略
