# AssetForce Console - 设计概览

- **Version**: 1.0
- **Created**: 2025-12-03
- **Last Updated**: 2025-12-03
- **Status**: Draft

---

## 1. 项目概述

AssetForce Console 是 AssetForce 平台的前端管理系统，包含两个独立应用：

| 应用 | 目标用户 | 主要职责 |
|------|---------|---------|
| **Customer Portal** | 企业员工、客户用户 | 用户自助服务（登录、个人设置、权限查看） |
| **Admin Console** | 系统管理员、租户管理员 | 用户和组织管理、安全策略配置、审计日志 |

---

## 2. 技术栈

| 层级 | 技术选型 | 版本 |
|------|---------|------|
| Monorepo | Turborepo | 2.x |
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| UI | MUI (Material UI) | 7.x |
| GraphQL | Apollo Client | 3.x |
| Package Manager | Yarn | 1.22.x |
| Env | dotenvx | latest |

---

## 3. 模块清单

### 3.1 整体结构 (Feature-based Co-location)

```
┌─────────────────────────────────────────────────────────────────┐
│                     assetforce-console                          │
├─────────────────────────────────────────────────────────────────┤
│  apps/                          # 应用入口 (仅路由和页面组装)     │
│  ├─ customer-portal/            # 客户门户入口                   │
│  │  └─ app/                     # Next.js App Router            │
│  └─ admin-console/              # 管理控制台入口                  │
│     └─ app/                     # Next.js App Router            │
│                                                                 │
│  packages/                                                      │
│  ├─ feature/                    # 功能模块 (业务逻辑)             │
│  │  ├─ authentication/          # @assetforce/authentication    │
│  │  │  ├─ login/                # 登录子功能                     │
│  │  │  ├─ mfa/                  # MFA 子功能                     │
│  │  │  └─ session/              # 会话管理子功能                  │
│  │  ├─ authorization/           # @assetforce/authorization     │
│  │  │  └─ (待接入 PME)           # Permission Management Engine │
│  │  ├─ user/                    # @assetforce/user              │
│  │  │  ├─ profile/              # 用户资料子功能                  │
│  │  │  ├─ password/             # 密码管理子功能                  │
│  │  │  └─ admin/                # 用户管理子功能 (Admin)          │
│  │  ├─ tenant/                  # @assetforce/tenant            │
│  │  │  ├─ settings/             # 租户设置子功能                  │
│  │  │  ├─ policy/               # 安全策略子功能                  │
│  │  │  └─ role/                 # 角色管理子功能                  │
│  │  ├─ organization/            # @assetforce/organization      │
│  │  │  └─ group/                # 组织结构子功能                  │
│  │  ├─ audit/                   # @assetforce/audit             │
│  │  │  └─ log/                  # 审计日志子功能                  │
│  │  └─ common/                  # @assetforce/common            │
│  │     ├─ constants/            # 全局常量                       │
│  │     ├─ hooks/                # 全局 hooks                    │
│  │     ├─ env/                  # 环境变量                       │
│  │     └─ graphql/              # Apollo Client 配置            │
│  │                                                              │
│  └─ material/                   # 设计系统 (无业务逻辑)           │
│     ├─ core/                    # MUI 重导出 + 主题              │
│     ├─ atoms/                   # 原子组件                       │
│     ├─ molecules/               # 分子组件                       │
│     └─ organisms/               # 有机组件                       │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 功能模块清单

| # | 包名 | 路径 | 优先级 | 功能概述 | 使用者 |
|---|------|------|--------|---------|--------|
| 1 | @assetforce/authentication | feature/authentication | P0 | 登录、登出、MFA、OAuth | 双应用 |
| 2 | @assetforce/authorization | feature/authorization | P2 | PME 权限管理 (待接入) | 双应用 |
| 3 | @assetforce/user | feature/user | P0 | 用户资料、密码、用户管理 | 双应用 |
| 4 | @assetforce/tenant | feature/tenant | P1 | 租户设置、策略、角色 | Admin |
| 5 | @assetforce/organization | feature/organization | P2 | 组织结构、Group | Admin |
| 6 | @assetforce/audit | feature/audit | P1 | 认证日志、操作日志 | Admin |
| 7 | @assetforce/common | feature/common | P0 | 常量、环境、Apollo | 双应用 |
| 8 | @assetforce/material | material | P0 | UI 组件库 | 双应用 |

---

## 4. 模块依赖关系

```
                         ┌──────────────────┐
                         │  @assetforce/    │
                         │     common       │
                         │  (constants,     │
                         │   env, apollo)   │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
    ┌─────────▼─────────┐ ┌───────▼───────┐ ┌────────▼────────┐
    │  @assetforce/     │ │ @assetforce/  │ │  @assetforce/   │
    │     material      │ │authentication │ │      user       │
    │  (UI 组件库)       │ │ (login, mfa,  │ │ (profile, pwd,  │
    │                   │ │  session)     │ │  admin)         │
    └─────────┬─────────┘ └───────┬───────┘ └────────┬────────┘
              │                   │                   │
              │     ┌─────────────┼───────────────────┤
              │     │             │                   │
              │     │   ┌─────────▼─────────┐         │
              │     │   │  @assetforce/     │         │
              │     │   │     tenant        │         │
              │     │   │ (settings, policy,│         │
              │     │   │  role)            │         │
              │     │   └─────────┬─────────┘         │
              │     │             │                   │
              │     │   ┌─────────┴─────────┐         │
              │     │   │                   │         │
              │  ┌──▼───▼───┐       ┌───────▼───┐     │
              │  │@assetforce│      │@assetforce│     │
              │  │organization│     │   audit   │     │
              │  │ (group)   │      │  (log)    │     │
              │  └─────┬─────┘      └─────┬─────┘     │
              │        │                  │           │
              └────────┼──────────────────┼───────────┘
                       │                  │
         ┌─────────────┴──────────────────┴─────────────┐
         │                                              │
┌────────▼────────┐                        ┌────────────▼────────┐
│ customer-portal │                        │    admin-console    │
│  (apps/入口)     │                        │    (apps/入口)       │
├─────────────────┤                        ├─────────────────────┤
│ 使用:            │                        │ 使用:                │
│ - authentication│                        │ - authentication    │
│ - user/profile  │                        │ - user/admin        │
│ - material      │                        │ - tenant            │
└─────────────────┘                        │ - organization      │
                                           │ - audit             │
                                           │ - material          │
                                           └─────────────────────┘
```

**依赖说明**:
- `@assetforce/common`: 被所有功能模块依赖（常量、环境变量、Apollo Client）
- `@assetforce/material`: 被两个应用依赖（纯 UI 组件，无业务逻辑）
- `@assetforce/authentication`: 双应用共用（Customer 用 login/mfa，Admin 用 session 管理）
- `@assetforce/authorization`: 待接入 PME（Permission Management Engine）
- `@assetforce/user`: 双应用共用（Customer 用 profile/password，Admin 用 admin 子功能）
- `@assetforce/tenant`, `organization`, `audit`: 仅 Admin Console 使用

---

## 5. 后端服务依赖

| 服务 | Endpoint | 提供功能 |
|------|----------|---------|
| **AAC** | `http://localhost:8081/graphql` | 认证、授权、Token、MFA、账户状态 |
| **IMC** | `http://localhost:8082/graphql` | 用户 Profile、组织结构、Group |
| **Keycloak** | `http://localhost:8080` | OAuth2/OIDC (Google, Azure AD) |

---

## 6. 设计文档路线图

按分层细化原则，设计文档将按以下顺序产出：

### 第一层：概览 (本文档) ✅

### 第二层：模块级设计

| 包名 | 文档路径 | 状态 |
|------|---------|------|
| @assetforce/authentication | `authentication/README.md` | 待写 |
| @assetforce/authorization | `authorization/README.md` | 待写 (PME 接入后) |
| @assetforce/user | `user/README.md` | 待写 |
| @assetforce/tenant | `tenant/README.md` | 待写 |
| @assetforce/organization | `organization/README.md` | 待写 |
| @assetforce/audit | `audit/README.md` | 待写 |
| @assetforce/common | `common/README.md` | 待写 |
| @assetforce/material | `material/README.md` | 待写 |

### 第三层：子功能级设计

每个模块内部按子功能细分，例如：
```
authentication/
├── README.md           # 模块概览
├── login.md            # 登录子功能设计
├── mfa.md              # MFA 子功能设计
└── session.md          # 会话管理子功能设计
```

---

## 7. 实施优先级

### Phase 1: 核心认证 (P0)

```
@assetforce/common → @assetforce/material → @assetforce/authentication → @assetforce/user (profile, password)
```

**产出**:
- Apollo Client 配置
- 基础 UI 组件
- 登录/登出/MFA 功能
- 用户资料、密码管理

### Phase 2: 用户管理 (P0)

```
@assetforce/user (admin) → @assetforce/tenant (role)
```

**产出**:
- 用户 CRUD
- 角色管理

### Phase 3: 高级功能 (P1-P2)

```
@assetforce/tenant (settings, policy) → @assetforce/audit → @assetforce/organization
```

**产出**:
- 租户设置、安全策略配置
- 审计日志查看
- 组织结构管理

---

## 8. 设计决策记录

| 项目 | 问题 | 决策 | 理由 |
|------|------|------|------|
| 注册功能 | Customer Portal 是否支持自助注册？ | ✅ 需要 | 完整认证服务必需 |
| 邀请流程 | Admin 创建用户后的邀请邮件模板？ | 后端处理 | 使用 Keycloak 默认模板 |
| 多语言 | i18n 框架选型 | react-i18next | 团队已有经验，无迁移成本 |
| 主题定制 | 租户级别的主题/品牌定制？ | ❌ 暂不需要 | 认证服务核心功能优先 |
| 离线支持 | PWA/离线模式是否需要？ | ❌ 暂不需要 | 后续按需添加 |

---

## 附录 A: 文档规范

本设计文档遵循以下规范：

1. **迭代循环**: 产出 → 审查 → 修正 → 提交 → 下一个
2. **分层细化**: 概览 → 模块 → 功能
3. **可追溯**: 每个设计决策记录在 discussions.md
4. **可恢复**: checkpoint 保存关键节点

---

## 附录 B: 相关文档

| 文档 | 路径 |
|------|------|
| Customer Portal 需求 | `requirements/customer-portal.md` |
| Admin Console 需求 | `requirements/admin-console.md` |
| 编码规范 | `standards/` |
| 讨论记录 | `.agent.workspace/tasks/028_*/discussions.md` |
