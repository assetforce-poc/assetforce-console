# password-reset - 密码重置子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能         | 组件               | GraphQL                         | 优先级 |
| ------------ | ------------------ | ------------------------------- | ------ |
| 请求重置密码 | ForgotPasswordForm | `requestPasswordReset` mutation | P0     |
| 重置密码     | ResetPasswordForm  | `resetPassword` mutation        | P0     |

---

## 2. 数据流

```
用户点击"忘记密码"
        ↓
ForgotPasswordForm → useRequestPasswordReset → requestPasswordReset mutation → AAC
                                                        ↓
                                              发送重置邮件/SMS
                                                        ↓
                                              用户点击邮件链接
                                                        ↓
ResetPasswordForm → useResetPassword → resetPassword mutation → AAC
                                                        ↓
                                              密码重置成功
                                              跳转登录页
```

---

## 3. 组件设计

### 3.1 ForgotPasswordForm

```typescript
interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onError?: (error: AuthError) => void;
  onBackToLogin?: () => void;
}
```

### 3.2 ResetPasswordForm

```typescript
interface ResetPasswordFormProps {
  token: string; // URL 中的重置 token
  onSuccess: () => void;
  onError?: (error: AuthError) => void;
  onTokenExpired?: () => void;
}
```

---

## 4. GraphQL

### 4.1 requestPasswordReset.gql

```graphql
mutation requestPasswordReset($input: RequestPasswordResetInput!) {
  requestPasswordReset(input: $input) {
    success
    message # "如果该邮箱存在，我们已发送重置链接"
  }
}
```

### 4.2 resetPassword.gql

```graphql
mutation resetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
  }
}
```

---

## 5. 待确认事项

- [ ] 重置 token 有效期
- [ ] 重置链接发送频率限制
- [ ] 是否支持 SMS 重置
