# activation - 账户激活子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能                 | 组件           | GraphQL                         | 优先级 |
| -------------------- | -------------- | ------------------------------- | ------ |
| 账户激活（设置密码） | ActivationForm | `activateAccount` mutation      | P0     |
| 验证激活 Token       | -              | `validateActivationToken` query | P0     |

---

## 2. 使用场景

Admin 创建用户后，用户收到邀请邮件，点击链接激活账户：

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Admin Console                                 │
├─────────────────────────────────────────────────────────────────────┤
│  @assetforce/user (admin/)                                          │
│  CreateUserForm → createUser mutation → IMC                         │
│                                           ↓                         │
│                                   AAC 自动发送邀请邮件               │
└─────────────────────────────────────────────────────────────────────┘

                              ↓ 用户收到邮件，点击链接

┌─────────────────────────────────────────────────────────────────────┐
│                       Customer Portal                                │
├─────────────────────────────────────────────────────────────────────┤
│  @assetforce/authentication (activation/)                           │
│                                                                      │
│  1. 验证 Token                                                       │
│     validateActivationToken query → AAC                             │
│              ↓                                                       │
│     ┌────────┴────────┐                                             │
│     │                 │                                             │
│   有效              无效/过期                                        │
│     │                 │                                             │
│     ↓                 ↓                                             │
│  显示激活表单      显示错误页面                                       │
│                   (联系管理员重新邀请)                                │
│                                                                      │
│  2. 设置密码并激活                                                   │
│     ActivationForm → activateAccount mutation → AAC                 │
│              ↓                                                       │
│     激活成功，自动登录                                               │
│     跳转到应用首页                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. 数据流

```
用户点击邀请邮件中的链接
        ↓
/activate?token=xxx
        ↓
validateActivationToken query → AAC
        ↓
┌───────┴───────┐
│               │
有效          无效/过期
│               │
↓               ↓
ActivationForm  ActivationExpired
(设置密码)      (显示错误，联系管理员)
        ↓
输入新密码 + 确认密码
        ↓
PasswordStrength (实时显示强度)
        ↓
activateAccount mutation → AAC
        ↓
┌───────┴───────┐
│               │
成功          失败
│               │
↓               ↓
自动登录      显示错误
跳转首页
```

---

## 4. 组件设计

### 4.1 ActivationForm

```typescript
interface ActivationFormProps {
  token: string; // URL 中的激活 token
  userEmail: string; // 从 validateActivationToken 返回
  onSuccess: (tokens: AuthTokens) => void;
  onError?: (error: AuthError) => void;
}
```

### 4.2 ActivationExpired

```typescript
interface ActivationExpiredProps {
  onContactAdmin?: () => void;
  onBackToLogin?: () => void;
}
```

### 4.3 组件依赖

```
ActivationForm
    │
    └── PasswordStrength (来自 password/ 子功能)
            └── 实时显示密码强度
```

---

## 5. Hooks

### 5.1 useValidateActivationToken

```typescript
function useValidateActivationToken(token: string): {
  isValid: boolean;
  email: string | null;
  error: { code: string; message: string } | null;
  loading: boolean;
};
```

### 5.2 useActivateAccount

```typescript
function useActivateAccount(): {
  activate: (input: { token: string; password: string }) => Promise<AuthTokens>;
  loading: boolean;
  error: AuthError | null;
};
```

---

## 6. GraphQL

### 6.1 validateActivationToken.gql

```graphql
query validateActivationToken($token: String!) {
  validateActivationToken(token: $token) {
    valid
    email
    expiresAt
    error {
      code # EXPIRED | INVALID | ALREADY_ACTIVATED
      message
    }
  }
}
```

### 6.2 activateAccount.gql

```graphql
mutation activateAccount($input: ActivateAccountInput!) {
  activateAccount(input: $input) {
    success
    tokens {
      ...AuthTokens
    }
  }
}
```

---

## 7. 与 password-reset 的区别

| 方面       | password-reset         | activation                      |
| ---------- | ---------------------- | ------------------------------- |
| 触发者     | 用户自己（忘记密码）   | Admin（创建用户）               |
| 目的       | 重置已有密码           | 首次设置密码                    |
| Token 来源 | 用户请求发送           | Admin 创建用户时自动发送        |
| 激活后     | 跳转登录页，需手动登录 | 自动登录，直接进入应用          |
| UI         | 简单的重置表单         | 可包含欢迎信息、引导设置 MFA 等 |

---

## 8. 待确认事项

- [ ] 激活 Token 有效期（建议 72 小时）
- [ ] 激活后是否强制设置 MFA
- [ ] 激活链接可否重新发送（Admin 操作）
- [ ] AAC 是否有独立的 `activateAccount` API，还是复用 `resetPassword`
