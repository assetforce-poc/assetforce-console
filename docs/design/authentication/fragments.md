# GraphQL Fragments - 共享片段定义

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 概述

本文件定义 `@assetforce/authentication` 模块的共享 GraphQL Fragments。

位置：`packages/feature/authentication/fragments/authentication.fragments.gql`

---

## 2. Fragments 定义

### 2.1 AuthTokens

```graphql
fragment AuthTokens on TokenPair {
  accessToken
  refreshToken
  expiresIn
}
```

**使用场景**：
- login mutation
- completeMFA mutation
- refreshToken mutation
- activateAccount mutation

---

### 2.2 MFAChallenge

```graphql
fragment MFAChallenge on MFAChallengeResponse {
  challengeId
  method         # TOTP | SMS | EMAIL
  expiresAt
}
```

**使用场景**：
- login mutation (当返回 MFA Required 时)

---

### 2.3 MFASetup

```graphql
fragment MFASetup on MFASetupResponse {
  secret
  qrCodeUrl
  backupCodes
}
```

**使用场景**：
- enableMFA mutation

---

### 2.4 SessionInfo

```graphql
fragment SessionInfo on Session {
  sessionId
  deviceInfo {
    deviceType
    browser
    os
    ip
    location
  }
  createdAt
  lastActivityAt
  isCurrent
}
```

**使用场景**：
- myActiveSessions query

---

### 2.5 AuthProviderInfo

```graphql
fragment AuthProviderInfo on AuthProvider {
  providerId     # google | azure-ad | keycloak
  providerName
  email
  linkedAt
}
```

**使用场景**：
- myAuthProviders query
- linkAuthProvider mutation

---

## 3. 类型定义

对应的 TypeScript 类型由 codegen 自动生成，位于各子功能的 `generated/` 目录。

手动类型定义位于 `packages/feature/authentication/types/auth.types.ts`：

```typescript
// 密码强度级别
export type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

// MFA 方法
export type MFAMethod = 'TOTP' | 'SMS' | 'EMAIL';

// OAuth Provider
export type OAuthProviderId = 'google' | 'azure-ad' | 'keycloak';

// Auth Error
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}
```
