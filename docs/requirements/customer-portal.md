# Customer Portal Requirements

**Version**: 1.0
**Created**: 2025-12-03
**Based on**: Task 025 AAC Architecture Design

---

## Overview

Customer Portal 是面向终端用户的前端应用，提供用户认证、个人信息管理和权限状态查看功能。

**目标用户**: 企业员工、客户用户
**主要职责**: 用户自助服务（登录、个人设置、权限查看）

---

## 功能需求

### 1. 用户认证 (Authentication)

#### 1.1 登录方式

基于 AAC 的 **Firebase-style Multi-Provider** 架构，支持以下登录方式：

| 登录方式            | Provider ID         | 优先级 | 说明                           |
| ------------------- | ------------------- | ------ | ------------------------------ |
| Email + Password    | `email-password`    | P0     | 主要登录方式，B2B 必需         |
| Username + Password | `username-password` | P1     | 可选的用户名登录               |
| Google OAuth        | `google`            | P1     | Google Workspace 企业账号      |
| Azure AD            | `azure-ad`          | P2     | Microsoft 企业账号 (SAML/OIDC) |
| Keycloak SSO        | `keycloak`          | P2     | 内部 SSO 系统                  |

#### 1.2 登录页面功能

```
┌─────────────────────────────────────────────┐
│                   Login                      │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐   │
│  │ Email or Username                    │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ Password                             │   │
│  └─────────────────────────────────────┘   │
│  [ ] Remember me                            │
│  [       Sign In       ]                    │
│                                             │
│  ─────────── or ───────────                │
│                                             │
│  [🔵 Continue with Google    ]              │
│  [🔷 Continue with Microsoft ]              │
│                                             │
│  Forgot password?  |  Create account        │
└─────────────────────────────────────────────┘
```

**功能点**:

- [ ] Email/Username 输入框（自动检测是 email 还是 username）
- [ ] Password 输入框（支持显示/隐藏密码）
- [ ] Remember me 选项（延长 session 有效期）
- [ ] OAuth 登录按钮（Google, Microsoft）
- [ ] Forgot password 链接
- [ ] Create account 链接（如果开放注册）

#### 1.3 多因素认证 (MFA)

基于 AAC 的 MFA 设计，支持以下验证方式：

| MFA 类型 | 优先级 | 说明                        |
| -------- | ------ | --------------------------- |
| TOTP     | P0     | Google Authenticator, Authy |
| SMS      | P1     | 短信验证码                  |
| Email    | P1     | 邮箱验证码                  |
| Hardware | P2     | YubiKey 等硬件密钥          |

**MFA 验证流程**:

```
登录成功 → 检查 mfaEnabled → 显示 MFA 验证页面 → 验证通过 → 进入应用
```

#### 1.4 登出功能

- [ ] 当前设备登出
- [ ] 所有设备登出（调用 `revokeAllSessions`）
- [ ] 登出确认弹窗

---

### 2. 账户管理 (Account Management)

#### 2.1 个人信息查看

显示当前用户的 Account 信息：

| 字段         | 来源                         | 可编辑          |
| ------------ | ---------------------------- | --------------- |
| Email        | Account.email                | ❌ (需验证流程) |
| Username     | Account.username             | ✅              |
| Avatar       | IMC User.profile.avatar      | ✅              |
| Display Name | IMC User.profile.displayName | ✅              |
| Locale       | IMC User.profile.locale      | ✅              |

#### 2.2 认证方式管理

查看和管理已绑定的 AuthProviders：

```
┌─────────────────────────────────────────────┐
│  Authentication Methods                      │
├─────────────────────────────────────────────┤
│  ✅ Email (john@company.com)         Primary │
│     Password set • Last used: 2 hours ago   │
│                                             │
│  ✅ Google (john@company.com)               │
│     Connected • Last used: 5 days ago       │
│     [ Disconnect ]                          │
│                                             │
│  ➕ Connect Microsoft account               │
│  ➕ Connect more...                         │
└─────────────────────────────────────────────┘
```

**功能点**:

- [ ] 查看已绑定的认证方式列表
- [ ] 显示每个 provider 的状态（verified, lastUsedAt）
- [ ] 绑定新的 OAuth provider
- [ ] 解绑非 primary 的 provider
- [ ] 设置 primary provider

#### 2.3 MFA 管理

```
┌─────────────────────────────────────────────┐
│  Two-Factor Authentication                   │
├─────────────────────────────────────────────┤
│  Status: ✅ Enabled                         │
│                                             │
│  ✅ Authenticator App (TOTP)                │
│     Added: Nov 15, 2025                     │
│     [ Remove ]                              │
│                                             │
│  ➕ Add backup phone number (SMS)           │
│  ➕ Add email verification                  │
└─────────────────────────────────────────────┘
```

**功能点**:

- [ ] 启用/禁用 MFA
- [ ] 添加 TOTP（显示 QR Code）
- [ ] 添加 SMS（验证手机号）
- [ ] 添加 Email 验证
- [ ] 查看备份码
- [ ] 移除 MFA 方式

#### 2.4 密码管理

- [ ] 修改密码（需要当前密码验证）
- [ ] 密码强度提示（基于 tenant policy）
- [ ] 密码过期提醒

---

### 3. 权限状态查看

#### 3.1 当前身份上下文

显示 JWT 中的 Identity Context（四维模型）：

```
┌─────────────────────────────────────────────┐
│  Current Identity Context                    │
├─────────────────────────────────────────────┤
│  Zone:    cn (China)                        │
│  Realm:   finance                           │
│  Subject: usr-001                           │
│  Groups:  admin-group, finance-team         │
│                                             │
│  Tenant:  Tenant A (Primary)                │
│  Role:    Administrator                     │
└─────────────────────────────────────────────┘
```

#### 3.2 租户切换

如果用户有多个 TenantRole，支持切换：

```
┌─────────────────────────────────────────────┐
│  Switch Tenant                               │
├─────────────────────────────────────────────┤
│  ● Tenant A - Administrator        (Active) │
│  ○ Tenant B - Member                        │
│  ○ Tenant C - Viewer                        │
│                                             │
│  [ Switch ]                                 │
└─────────────────────────────────────────────┘
```

#### 3.3 活动会话查看

```
┌─────────────────────────────────────────────┐
│  Active Sessions                             │
├─────────────────────────────────────────────┤
│  🖥️ MacBook Pro - Chrome          Current   │
│     Tokyo, Japan • Active now               │
│                                             │
│  📱 iPhone 15 - Safari                      │
│     Osaka, Japan • 2 hours ago              │
│     [ Revoke ]                              │
│                                             │
│  [ Log out all other sessions ]             │
└─────────────────────────────────────────────┘
```

---

### 4. 密码重置流程

#### 4.1 忘记密码

```
Step 1: 输入 Email
Step 2: 发送重置链接到邮箱
Step 3: 点击链接，输入新密码
Step 4: 密码重置成功，跳转登录
```

---

## GraphQL API 需求

基于 AAC Service Interfaces，Customer Portal 需要以下 GraphQL 操作：

### Mutations

```graphql
# 认证
mutation Login($input: LoginInput!) {
  login(input: $input) {
    success
    tokens {
      accessToken
      refreshToken
      expiresIn
    }
    mfaRequired
    mfaChallenge {
      challengeId
      method
    }
    error {
      code
      message
    }
  }
}

mutation CompleteMFA($input: MFAInput!) {
  completeMFA(input: $input) {
    success
    tokens {
      accessToken
      refreshToken
      expiresIn
    }
    error {
      code
      message
    }
  }
}

mutation Logout {
  logout {
    success
  }
}

mutation LogoutAllSessions {
  logoutAllSessions {
    success
    revokedCount
  }
}

mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    refreshToken
    expiresIn
  }
}

# 账户管理
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    success
  }
}

mutation ChangePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    success
  }
}

mutation LinkAuthProvider($input: LinkProviderInput!) {
  linkAuthProvider(input: $input) {
    success
  }
}

mutation UnlinkAuthProvider($providerId: String!) {
  unlinkAuthProvider(providerId: $providerId) {
    success
  }
}

# MFA
mutation EnableMFA($method: MFAMethod!) {
  enableMFA(method: $method) {
    secret
    qrCode
    backupCodes
  }
}

mutation VerifyMFASetup($input: VerifyMFAInput!) {
  verifyMFASetup(input: $input) {
    success
  }
}

mutation DisableMFA {
  disableMFA {
    success
  }
}
```

### Queries

```graphql
query Me {
  me {
    accountId
    email
    username
    authProviders {
      providerId
      providerType
      identifier
      isPrimary
      isVerified
      lastUsedAt
    }
    mfaEnabled
    mfaSecrets {
      type
      isActive
    }
    tenantRoles {
      tenantId
      role
      isPrimary
    }
    status
    lastLoginAt
  }
}

query MyIdentityContext {
  myIdentityContext {
    zone
    realm
    subject
    groups
  }
}

query MyActiveSessions {
  myActiveSessions {
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
}

query AvailableTenants {
  availableTenants {
    tenantId
    tenantName
    role
    isPrimary
  }
}
```

---

## UI 组件需求

### 共享组件 (packages/ui)

| 组件             | 优先级 | 说明                                       |
| ---------------- | ------ | ------------------------------------------ |
| LoginForm        | P0     | 登录表单（email/password + OAuth buttons） |
| MFAVerification  | P0     | MFA 验证界面                               |
| UserAvatar       | P0     | 用户头像组件                               |
| UserMenu         | P0     | 用户下拉菜单（profile, settings, logout）  |
| AuthProviderList | P1     | 认证方式列表                               |
| SessionList      | P1     | 活动会话列表                               |
| TenantSwitcher   | P1     | 租户切换器                                 |
| PasswordStrength | P1     | 密码强度指示器                             |
| QRCodeDisplay    | P1     | TOTP QR Code 显示                          |

---

## 页面路由

| 路由                | 页面         | 权限                  |
| ------------------- | ------------ | --------------------- |
| `/login`            | 登录页面     | Public                |
| `/login/mfa`        | MFA 验证页面 | Requires auth session |
| `/forgot-password`  | 忘记密码     | Public                |
| `/reset-password`   | 重置密码     | Public (with token)   |
| `/`                 | Dashboard    | Authenticated         |
| `/profile`          | 个人信息     | Authenticated         |
| `/profile/security` | 安全设置     | Authenticated         |
| `/profile/sessions` | 活动会话     | Authenticated         |

---

## 非功能需求

### 安全

- HTTPS only
- CSRF protection
- XSS prevention (sanitize all inputs)
- Secure token storage (httpOnly cookies or secure localStorage)
- Rate limiting on login attempts

### 性能

- Login latency < 2s (including OAuth redirect)
- Token refresh should be transparent to user
- Lazy load non-critical components

### 可访问性

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible

### 国际化

- 支持中文、英文、日文
- 基于 User.profile.locale 自动切换
