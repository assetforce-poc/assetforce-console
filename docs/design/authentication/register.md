# register - 用户注册子功能详细设计

- **Status**: Draft
- **Parent**: [authentication/README.md](./README.md)
- **Last Updated**: 2025-12-06
- **AAC Task**: 033 (已完成)

---

## 实现状态

| 项目                 | 设计 | 实现 | 说明            |
| -------------------- | ---- | ---- | --------------- |
| GraphQL schema (AAC) | ✅   | ✅   | Task 033 已实现 |
| @assetforce/form     | ✅   | ✅   | Task 036 已实现 |
| GraphQL .gql files   | ✅   | 🔲   | 待实现          |
| useRegister          | ✅   | 🔲   | 待实现          |
| useEmailAvailability | ✅   | 🔲   | 待实现          |
| useVerifyEmail       | ✅   | 🔲   | 待实现          |
| MUI Field adapters   | ✅   | 🔲   | 待实现          |
| RegisterForm         | ✅   | 🔲   | 待实现          |
| RegistrationSuccess  | ✅   | 🔲   | 待实现          |
| VerifyEmailResult    | ✅   | 🔲   | 待实现          |
| /auth/register page  | ✅   | 🔲   | 待实现          |
| /auth/verify-email   | ✅   | 🔲   | 待实现          |
| /auth/reg-success    | ✅   | 🔲   | 待实现          |

---

## 1. 功能清单

| 功能           | 组件                | GraphQL                           | 优先级 | AAC 状态 |
| -------------- | ------------------- | --------------------------------- | ------ | -------- |
| 邮箱可用性检查 | RegisterForm        | `checkEmailAvailability` query    | P0     | ✅       |
| 用户注册       | RegisterForm        | `register` mutation               | P0     | ✅       |
| 邮箱验证       | VerifyEmailResult   | `verifyEmailForRegistration` mut. | P0     | ✅       |
| 注册成功提示   | RegistrationSuccess | N/A                               | P0     | N/A      |

---

## 2. 用户流程

### 2.1 注册流程

```
用户点击 "Create Account"
        ↓
RegisterForm 显示
        ↓
用户输入 email → useEmailAvailability (debounced 500ms)
        ↓
    ┌───┴───┐
    │       │
  可用    不可用
    │       │
    ↓       ↓
  继续    显示错误
        ↓
用户填写 firstName, lastName, password, acceptTerms
        ↓
用户提交 → useRegister → register mutation → AAC
        ↓
    ┌───┴───┐
    │       │
  成功    失败
    │       │
    ↓       ↓
导航到     显示错误
RegistrationSuccess
(提示检查邮箱)
```

### 2.2 邮箱验证流程

```
用户点击邮件中的验证链接
(URL: /auth/verify-email?token=xxx)
        ↓
VerifyEmailPage 加载
        ↓
useVerifyEmail → verifyEmailForRegistration mutation → AAC
        ↓
    ┌───────┴───────┐
    │               │
  成功            失败
    │               │
    ↓               ↓
检查 tenantStatus  显示错误
    │              (TOKEN_EXPIRED 等)
    ↓
┌───┴───────────────┐
│                   │
requiresTenantSelection  pendingApproval / hasActiveTenants
│                   │
↓                   ↓
导航到              导航到 /auth/login
/auth/select-tenant (显示成功消息)
```

---

## 3. 组件设计

### 3.1 RegisterForm

```typescript
interface RegisterFormProps {
  /** 注册成功回调 */
  onSuccess?: (result: RegisterResult) => void;
  /** 错误回调 */
  onError?: (message: string) => void;
  /** 已有账号链接点击 */
  onLoginClick?: () => void;
}
```

**字段**:

| 字段        | 类型     | 必填 | 验证规则                    |
| ----------- | -------- | ---- | --------------------------- |
| email       | string   | ✅   | RFC 5322, 实时可用性检查    |
| password    | password | ✅   | >= 8 字符 (Keycloak policy) |
| firstName   | string   | ✅   | 1-50 字符                   |
| lastName    | string   | ✅   | 1-50 字符                   |
| acceptTerms | checkbox | ✅   | 必须勾选                    |

**可选字段** (Phase 2):

| 字段     | 类型   | 说明                          |
| -------- | ------ | ----------------------------- |
| username | string | 可选，3-50 字符，alphanumeric |
| realm    | string | 可选，指定申请加入的租户      |

### 3.2 RegistrationSuccess

```typescript
interface RegistrationSuccessProps {
  /** 用户邮箱 (用于显示) */
  email: string;
  /** 重新发送验证邮件回调 (Phase 2) */
  onResend?: () => void;
}
```

**显示内容**:

- 成功图标
- "Registration successful!"
- "Please check your email at {email} to verify your account."
- "Didn't receive the email? Check spam folder or [Resend]" (Phase 2)

### 3.3 VerifyEmailResult

```typescript
interface VerifyEmailResultProps {
  /** 验证 token (从 URL 获取) */
  token: string;
  /** 验证成功回调 */
  onSuccess?: (result: EmailVerificationResult) => void;
  /** 验证失败回调 */
  onError?: (message: string) => void;
}
```

**状态显示**:

| 状态             | 显示内容                         |
| ---------------- | -------------------------------- |
| loading          | Spinner + "Verifying..."         |
| success          | 成功图标 + "Email verified!"     |
| ALREADY_VERIFIED | 成功图标 + "Already verified"    |
| TOKEN_EXPIRED    | 错误图标 + "Link expired" + 重发 |
| TOKEN_NOT_FOUND  | 错误图标 + "Invalid link"        |

---

## 4. Hooks

### 4.1 useRegister

```typescript
interface UseRegisterReturn {
  /** 执行注册 */
  register: (input: RegisterInput) => Promise<RegisterResult>;
  /** 加载状态 */
  loading: boolean;
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  acceptTerms: boolean;
  username?: string; // 可选
  realm?: string; // 可选
  locale?: string; // 可选
}

interface RegisterResult {
  success: boolean;
  accountId?: string;
  message?: string;
  requiresVerification: boolean;
  appliedTenant?: string;
}
```

### 4.2 useEmailAvailability

```typescript
interface UseEmailAvailabilityOptions {
  /** Debounce 延迟 (ms)，默认 500 */
  debounceMs?: number;
}

interface UseEmailAvailabilityReturn {
  /** 检查邮箱可用性 */
  checkEmail: (email: string) => void;
  /** 是否可用 */
  available: boolean | null;
  /** 不可用原因 */
  reason: string | null;
  /** 加载状态 */
  loading: boolean;
}
```

**使用示例**:

```typescript
const { checkEmail, available, reason, loading } = useEmailAvailability();

// 在 email 输入变化时调用 (内部自动 debounce)
<TextField
  onChange={(e) => {
    setEmail(e.target.value);
    checkEmail(e.target.value);
  }}
  error={available === false}
  helperText={reason}
/>
```

### 4.3 useVerifyEmail

```typescript
interface UseVerifyEmailReturn {
  /** 执行验证 */
  verify: (token: string) => Promise<EmailVerificationResult>;
  /** 加载状态 */
  loading: boolean;
}

interface EmailVerificationResult {
  success: boolean;
  message?: string;
  accountId?: string;
  tenantStatus?: TenantStatus;
}

interface TenantStatus {
  hasTenants: boolean;
  requiresTenantSelection: boolean;
  pendingApproval: boolean;
  activeTenants: TenantInfo[];
  pendingTenants: TenantInfo[];
}
```

---

## 5. GraphQL

### 5.1 checkEmailAvailability.gql

```graphql
query CheckEmailAvailability($email: String!) {
  checkEmailAvailability(email: $email) {
    available
    reason
  }
}
```

**Response**:

- `available: true` - 邮箱可用
- `available: false, reason: "EMAIL_ALREADY_EXISTS"` - 已存在
- `available: false, reason: "INVALID_FORMAT"` - 格式无效

### 5.2 register.gql

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    success
    accountId
    message
    requiresVerification
    appliedTenant
  }
}
```

**Input**:

```graphql
input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  acceptTerms: Boolean!
  username: String # 可选
  realm: String # 可选
  locale: String # 可选
}
```

**Error Messages**:
| Code | 说明 |
| ------------------------- | ------------------------ |
| EMAIL_ALREADY_EXISTS | 邮箱已注册 |
| USERNAME_TAKEN | 用户名已被占用 |
| PASSWORD_POLICY_VIOLATION | 密码不符合策略 |
| INVALID_EMAIL_FORMAT | 邮箱格式无效 |
| INVALID_NAME_FORMAT | 姓名格式无效 |
| TERMS_NOT_ACCEPTED | 未接受服务条款 |

### 5.3 verifyEmailForRegistration.gql

```graphql
mutation VerifyEmailForRegistration($token: String!) {
  verifyEmailForRegistration(token: $token) {
    success
    message
    accountId
    tenantStatus {
      hasTenants
      requiresTenantSelection
      pendingApproval
      activeTenants {
        tenantId
        tenantName
        role
        isPrimary
        status
      }
      pendingTenants {
        tenantId
        tenantName
        role
        isPrimary
        status
      }
    }
  }
}
```

**Response Messages**:
| Message | 说明 |
| ------------------- | ------------------ |
| VERIFICATION_COMPLETE | 验证成功 |
| ALREADY_VERIFIED | 已验证 (幂等) |
| TOKEN_EXPIRED | Token 已过期 (24h) |
| TOKEN_NOT_FOUND | Token 不存在 |
| INVALID_TOKEN_FORMAT| Token 格式无效 |

---

## 6. 页面路由

### 6.1 /auth/register

```typescript
// apps/customer-portal/src/app/auth/register/page.tsx
export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Paper>
        <Typography variant="h4">Create Account</Typography>
        <RegisterForm
          onSuccess={handleSuccess}
          onLoginClick={() => router.push('/auth/login')}
        />
        <Link href="/auth/login">Already have an account? Sign in</Link>
      </Paper>
    </Container>
  );
}
```

### 6.2 /auth/verify-email

```typescript
// apps/customer-portal/src/app/auth/verify-email/page.tsx
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <ErrorMessage>Invalid verification link</ErrorMessage>;
  }

  return <VerifyEmailResult token={token} onSuccess={handleSuccess} />;
}
```

### 6.3 /auth/registration-success

```typescript
// apps/customer-portal/src/app/auth/registration-success/page.tsx
export default function RegistrationSuccessPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <RegistrationSuccess email={email} />;
}
```

---

## 7. 目录结构

```
packages/feature/authentication/
├── register/
│   ├── hooks/
│   │   ├── useRegister.ts
│   │   ├── useEmailAvailability.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── RegisterForm.tsx
│   │   ├── RegistrationSuccess.tsx
│   │   └── index.ts
│   ├── graphql/
│   │   ├── checkEmailAvailability.gql
│   │   ├── register.gql
│   │   └── index.ts
│   ├── types.ts
│   └── index.ts
│
└── verify-email/
    ├── hooks/
    │   ├── useVerifyEmail.ts
    │   └── index.ts
    ├── components/
    │   ├── VerifyEmailResult.tsx
    │   └── index.ts
    ├── graphql/
    │   ├── verifyEmailForRegistration.gql
    │   └── index.ts
    ├── types.ts
    └── index.ts

apps/customer-portal/src/app/auth/
├── register/
│   └── page.tsx
├── verify-email/
│   └── page.tsx
└── registration-success/
    └── page.tsx
```

---

## 8. 设计决策

| #   | 事项            | 决策                           | 理由                               |
| --- | --------------- | ------------------------------ | ---------------------------------- |
| 1   | Password Policy | Phase 1 仅显示 "8+ characters" | Keycloak 默认策略，后续可动态获取  |
| 2   | Username 字段   | Phase 1 不需要，仅用 email     | 简化流程，email 即 username        |
| 3   | Realm 指定      | Phase 1 不支持                 | 先完成基础注册，多租户申请 Phase 2 |
| 4   | Resend Email    | Phase 1 不需要                 | 简化 MVP，Phase 2 添加             |
| 5   | 表单库          | **@assetforce/form**           | Task 036 完成，统一表单抽象层      |

### 8.1 @assetforce/form 集成

使用 `@assetforce/form` 包进行表单管理：

```typescript
import { Form, Field, useFormContext } from '@assetforce/form';
import { z } from 'zod';

// Schema 定义
const registerSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  acceptTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
});

// RegisterForm 使用
<Form schema={registerSchema} onSubmit={handleSubmit}>
  <Field name="email" component={EmailField} />
  <Field name="password" component={PasswordField} />
  <Field name="firstName" component={TextField} />
  <Field name="lastName" component={TextField} />
  <Field name="acceptTerms" component={CheckboxField} />
</Form>
```

**优势**:

- 零 RHF 泄漏 - 业务代码不直接依赖 react-hook-form
- Namespace API - `form.values.get()`, `form.errors.set()`
- 类型安全 - zod schema 推断

---

## 9. API 集成方式

### 方案选择: 直接 GraphQL

注册流程不需要 session 管理，可以直接调用 AAC GraphQL API。

```typescript
// useRegister.ts
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql';

export function useRegister() {
  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION);

  const register = async (input: RegisterInput): Promise<RegisterResult> => {
    const { data } = await registerMutation({ variables: { input } });
    return data.register;
  };

  return { register, loading };
}
```

**原因**:

1. 注册不涉及 session/token 存储 (验证后才登录)
2. 减少 Next.js API Route 中间层
3. 与 login 的 `/api/auth/signin` 模式不同，login 需要存储 token

---

## 10. 实装细项清单

### Phase 1: 基础设施 (Step 1-3)

| Step | 任务               | 输出文件                          | 依赖             |
| ---- | ------------------ | --------------------------------- | ---------------- |
| 1.1  | GraphQL .gql 文件  | `register/graphql/*.gql`          | -                |
| 1.2  | 运行 codegen       | `register/graphql/generated/`     | 1.1              |
| 1.3  | MUI Field adapters | `packages/material/atoms/fields/` | @assetforce/form |

### Phase 2: Hooks (Step 4-6)

| Step | 任务                 | 输出文件                                 | 依赖 |
| ---- | -------------------- | ---------------------------------------- | ---- |
| 2.1  | useRegister          | `register/hooks/useRegister.ts`          | 1.2  |
| 2.2  | useEmailAvailability | `register/hooks/useEmailAvailability.ts` | 1.2  |
| 2.3  | useVerifyEmail       | `verify-email/hooks/useVerifyEmail.ts`   | 1.2  |

### Phase 3: 组件 (Step 7-9)

| Step | 任务                | 输出文件                                        | 依赖          |
| ---- | ------------------- | ----------------------------------------------- | ------------- |
| 3.1  | RegisterForm        | `register/components/RegisterForm.tsx`          | 1.3, 2.1, 2.2 |
| 3.2  | RegistrationSuccess | `register/components/RegistrationSuccess.tsx`   | -             |
| 3.3  | VerifyEmailResult   | `verify-email/components/VerifyEmailResult.tsx` | 2.3           |

### Phase 4: 页面 (Step 10-12)

| Step | 任务                       | 输出文件                                                 | 依赖 |
| ---- | -------------------------- | -------------------------------------------------------- | ---- |
| 4.1  | /auth/register             | `apps/customer-portal/.../register/page.tsx`             | 3.1  |
| 4.2  | /auth/registration-success | `apps/customer-portal/.../registration-success/page.tsx` | 3.2  |
| 4.3  | /auth/verify-email         | `apps/customer-portal/.../verify-email/page.tsx`         | 3.3  |

### Phase 5: 集成测试 (Step 13)

| Step | 任务     | 说明                        | 依赖         |
| ---- | -------- | --------------------------- | ------------ |
| 5.1  | E2E 测试 | 注册 → 收邮件 → 验证 → 登录 | 4.1-4.3, AAC |

---

## 附录: AAC API 规格参考

详细 API 规格见:

- Task 033: `.agent.workspace/tasks/033_aac_registration_api_implementation/implements/api-specification.md`
