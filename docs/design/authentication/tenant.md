# tenant - 多租户登录子功能详细设计

- **Status**: ✅ 已实现
- **Parent**: [authentication/README.md](./README.md)
- **Created**: 2025-12-04
- **Last Updated**: 2025-12-04

---

## 1. 功能概述

多租户登录流程处理用户在多个租户（Realm）中的身份认证。

**核心场景**：

- **单租户用户**：直接返回 token，无需选择
- **多租户用户**：显示租户选择器，用户选择后返回 token

---

## 2. 数据流

```
用户输入凭证
     ↓
MultiTenantLoginForm → useMultiTenantLogin → authenticate mutation → AAC
                                                     ↓
                                   ┌─────────────────┴─────────────────┐
                                   │                                   │
                          单租户 (accessToken 返回)          多租户 (availableRealms 返回)
                                   │                                   │
                                   ↓                                   ↓
                              onSuccess                         显示 TenantSelector
                              登录完成                                 ↓
                                                            用户选择 Realm
                                                                   ↓
                                                    selectTenant mutation → AAC
                                                                   ↓
                                                              onSuccess
                                                              登录完成
```

---

## 3. 组件设计

### 3.1 MultiTenantLoginForm

主登录表单，处理凭证输入和多租户选择流程。

```typescript
interface MultiTenantLoginFormProps {
  /** 登录成功回调 */
  onSuccess?: (result: AuthResult) => void;
  /** 错误回调 */
  onError?: (message: string) => void;
}
```

**状态机**：

| 步骤 | 状态               | 显示内容               |
| ---- | ------------------ | ---------------------- |
| 1    | `credentials`      | 凭证输入表单           |
| 2    | `tenant-selection` | 租户选择器（仅多租户） |
| 3    | `complete`         | 成功消息（等待重定向） |

**功能**：

- [x] Email/Username + Password 输入
- [x] 错误提示 (Alert)
- [x] Loading 状态
- [x] 返回登录按钮（从租户选择返回）

### 3.2 TenantSelector

租户选择列表组件。

```typescript
interface TenantSelectorProps {
  /** 可选租户列表 */
  realms: Realm[];
  /** 当前选中的租户 */
  selectedRealm?: Realm;
  /** Loading 状态 */
  loading?: boolean;
  /** 选择回调 */
  onSelect: (realm: Realm) => void;
  /** 错误消息 */
  error?: string;
}
```

**Realm 类型**：

```typescript
interface Realm {
  realmId: string;
  realmName: string;
  displayName?: string;
  zoneId: string;
  realmType: 'PRODUCTION' | 'TRIAL' | 'DEMO' | 'SANDBOX';
  description?: string;
  isActive: boolean;
  keycloakRealm?: string;
}
```

**功能**：

- [x] 租户列表展示 (MUI List)
- [x] 租户类型标签 (Production/Trial/Demo/Sandbox)
- [x] 选中状态高亮
- [x] Loading 指示器
- [x] Hover 效果

---

## 4. Hooks

### 4.1 useMultiTenantLogin

多租户登录状态管理 Hook。

```typescript
interface UseMultiTenantLoginOptions {
  onSuccess?: (result: AuthResult) => void;
  onError?: (error: string) => void;
}

interface UseMultiTenantLoginReturn {
  /** 当前状态 */
  state: MultiTenantLoginState;
  /** Loading 状态 */
  loading: boolean;
  /** Step 1: 凭证认证 */
  authenticate: (username: string, password: string) => Promise<void>;
  /** Step 2: 选择租户（仅多租户） */
  selectTenant: (realm: Realm) => Promise<void>;
  /** 重置流程 */
  reset: () => void;
}
```

**状态类型**：

```typescript
interface MultiTenantLoginState {
  step: 'credentials' | 'tenant-selection' | 'complete';
  subject?: string; // 用户标识（多租户时用于 selectTenant）
  availableRealms?: Realm[]; // 可选租户列表
  selectedRealm?: Realm; // 选中的租户
  error?: string; // 错误消息
}
```

**流程逻辑**：

1. **authenticate(username, password)**
   - 调用 `authenticate` mutation
   - 单租户：直接触发 onSuccess
   - 多租户：切换到 `tenant-selection` 步骤

2. **selectTenant(realm)**
   - 调用 `selectTenant` mutation
   - 成功后触发 onSuccess

3. **reset()**
   - 重置状态到 `credentials` 步骤

---

## 5. GraphQL

### 5.1 authenticate.gql

预认证 mutation，判断单租户/多租户。

```graphql
mutation Authenticate($username: String!, $password: String!) {
  authenticate(username: $username, password: $password) {
    success
    subject           # 用户标识（多租户时需要）
    # 多租户：返回可选租户列表
    availableRealms {
      realmId
      realmName
      displayName
      zoneId
      realmType
      description
      isActive
    }
    # 单租户：直接返回 token
    accessToken
    refreshToken
    expiresIn
    tokenType
    identityContext { ... }
    error
  }
}
```

**返回值逻辑**：
| 场景 | accessToken | availableRealms |
|------|-------------|-----------------|
| 单租户 | ✅ 有值 | null |
| 多租户 | null | ✅ 有值 |
| 错误 | null | null |

### 5.2 selectTenant.gql

租户选择 mutation，获取最终 token。

```graphql
mutation SelectTenant($subject: String!, $realmId: String!) {
  selectTenant(subject: $subject, realmId: $realmId) {
    success
    accessToken
    refreshToken
    expiresIn
    tokenType
    error
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

---

## 6. 目录结构

```
packages/feature/authentication/tenant/
├── index.ts                      # 公开导出
├── types.ts                      # 类型定义 (Realm, MultiTenantLoginState)
├── components/
│   ├── index.ts
│   ├── MultiTenantLoginForm/
│   │   ├── index.ts
│   │   └── MultiTenantLoginForm.tsx
│   └── TenantSelector/
│       ├── index.ts
│       └── TenantSelector.tsx
├── hooks/
│   ├── index.ts
│   └── useMultiTenantLogin.ts
└── graphql/
    ├── authenticate.gql
    ├── selectTenant.gql
    └── generated/               # codegen 生成
        ├── graphql.ts
        ├── gql.ts
        └── index.ts
```

---

## 7. 使用示例

```tsx
// apps/customer-portal/src/app/auth/login/page.tsx
import { MultiTenantLoginForm, type AuthResult } from '@assetforce/authentication/tenant';

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (result: AuthResult) => {
    // TODO: Store token
    console.log('Login successful:', result);
    router.push('/');
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4">Sign In</Typography>
        <MultiTenantLoginForm onSuccess={handleSuccess} onError={console.error} />
      </Paper>
    </Container>
  );
}
```

---

## 8. AAC 依赖

| API                     | AAC 状态  | 说明                   |
| ----------------------- | --------- | ---------------------- |
| `authenticate` mutation | ✅ 已实现 | 预认证 + 单/多租户判断 |
| `selectTenant` mutation | ✅ 已实现 | 租户选择后获取 token   |

---

## 附录: 相关文档

| 文档           | 路径                                    |
| -------------- | --------------------------------------- |
| login 子功能   | `authentication/login.md`               |
| AAC 多租户设计 | `assetforce-docs/.../aac/capabilities/` |
| Task 027       | Keycloak AAC IMC Prototype              |
