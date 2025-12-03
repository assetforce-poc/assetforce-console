# @assetforce/authentication - 模块设计

- **Version**: 1.1
- **Created**: 2025-12-03
- **Status**: Draft
- **Package**: `packages/feature/authentication`

---

## 1. 模块职责

**认证模块**负责用户身份验证的完整生命周期：

| 职责 | 说明 |
|------|------|
| 登录 | Email/Username/OAuth 多方式登录 |
| MFA | 多因素认证验证和管理 |
| 会话 | Token 管理、刷新、登出 |
| 密码重置 | 忘记密码、重置密码流程 |
| 密码管理 | 修改密码、密码强度检测 |
| 认证方式管理 | OAuth Provider 绑定/解绑 |
| 账户激活 | Admin 邀请用户后的首次激活 |
| 用户注册 | 用户自助注册（创建 Account） |

**不包含**：
- 授权（PME，由 `@assetforce/authorization` 负责）
- 用户资料管理（由 `@assetforce/user` 负责）

---

## 2. 子功能清单

| 子功能 | 目录 | 说明 | 详细设计 |
|--------|------|------|----------|
| login | `login/` | 登录表单、OAuth | [login.md](./login.md) |
| mfa | `mfa/` | MFA 验证和设置 | [mfa.md](./mfa.md) |
| session | `session/` | 会话管理、登出 | [session.md](./session.md) |
| password-reset | `password-reset/` | 忘记密码流程 | [password-reset.md](./password-reset.md) |
| password | `password/` | 修改密码 | [password.md](./password.md) |
| auth-provider | `auth-provider/` | OAuth 绑定/解绑 | [auth-provider.md](./auth-provider.md) |
| activation | `activation/` | Admin 邀请激活 | [activation.md](./activation.md) |
| register | `register/` | 用户自助注册 | 待写 |

---

## 3. GraphQL API 映射

### 3.1 Mutations

| Operation | 子功能 | 说明 |
|-----------|--------|------|
| `login` | login | 登录 |
| `completeMFA` | mfa | MFA 验证 |
| `enableMFA` | mfa | 启用 MFA |
| `verifyMFASetup` | mfa | 验证 MFA 设置 |
| `disableMFA` | mfa | 禁用 MFA |
| `refreshToken` | session | 刷新 Token |
| `logout` | session | 登出 |
| `logoutAllSessions` | session | 全部登出 |
| `revokeSession` | session | 撤销会话 |
| `requestPasswordReset` | password-reset | 请求重置密码 |
| `resetPassword` | password-reset | 重置密码 |
| `changePassword` | password | 修改密码 |
| `linkAuthProvider` | auth-provider | 绑定认证方式 |
| `unlinkAuthProvider` | auth-provider | 解绑认证方式 |
| `activateAccount` | activation | 激活账户 |
| `register` | register | 用户注册 |
| `verifyEmailForRegistration` | register | 验证注册邮箱 |

### 3.2 Queries

| Operation | 子功能 | 说明 |
|-----------|--------|------|
| `myActiveSessions` | session | 活动会话列表 |
| `myAuthProviders` | auth-provider | 已绑定认证方式 |
| `validateActivationToken` | activation | 验证激活 Token |
| `checkEmailAvailability` | register | 检查邮箱是否可用 |

### 3.3 Fragments

详见 [fragments.md](./fragments.md)

---

## 4. 实施优先级

| Phase | 子功能 | 目标 | 优先级 | 工作模式 |
|-------|--------|------|--------|----------|
| 1 | login | Email + Password 登录可用 | P0 | 规整→实施→✅ |
| 2 | register | 用户自助注册可用 | P0 | 规整→实施→✅ |
| 3 | password-reset | 忘记密码流程可用 | P0 | 规整→实施→✅ |
| 4 | password | 用户可修改密码 | P0 | 规整→实施→✅ |
| 5 | activation | Admin 邀请激活可用 | P0 | 规整→实施→✅ |
| 6 | login (GitHub OAuth) | GitHub OAuth 登录可用 | P1 | 规整→实施→✅ |
| 7 | session | 查看和管理活动会话 | P1 | 规整→实施→✅ |
| 8 | mfa (验证) | TOTP 验证可用 | P1 | 规整→实施→✅ |
| 9 | mfa (设置) | 用户可启用/禁用 MFA | P1 | 规整→实施→✅ |
| 10 | auth-provider | 绑定/解绑 OAuth 认证方式 | P1 | 规整→实施→✅ |

**工作模式说明**：
- **增量交付**：每个子功能独立完成（文档规整 → 实施 → 测试 → checkpoint）
- **可展示标准**：实施完成 + 功能可用 = 可展示

---

## 5. 依赖关系

```
@assetforce/authentication
        │
        ├── @assetforce/common (constants, env, apollo)
        ├── @assetforce/material (UI 组件)
        └── AAC Backend (GraphQL API)
```

---

## 6. 设计文档路线图

| 文档 | 内容 | 状态 |
|------|------|------|
| README.md | 模块概览（本文档） | ✅ |
| login.md | 登录子功能 | ✅ |
| mfa.md | MFA 子功能 | Draft |
| session.md | 会话管理 | Draft |
| password-reset.md | 密码重置 | Draft |
| password.md | 密码管理 | Draft |
| auth-provider.md | 认证方式管理 | Draft |
| activation.md | 账户激活 | Draft |
| register.md | 用户注册 | 待写 |
| fragments.md | GraphQL Fragments | Draft |

---

## 附录: 相关文档

| 文档 | 路径 |
|------|------|
| 需求文档 | `requirements/customer-portal.md` |
| AAC 架构 | `assetforce-docs/platform/architecture/.../authentication-authorization-center/` |
| 编码规范 | `standards/coding-guidelines.md` |
