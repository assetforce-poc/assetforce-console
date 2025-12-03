# password - 密码管理子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能         | 组件               | GraphQL                   | 优先级 |
| ------------ | ------------------ | ------------------------- | ------ |
| 修改密码     | ChangePasswordForm | `changePassword` mutation | P0     |
| 密码强度检测 | PasswordStrength   | (前端计算)                | P0     |

---

## 2. 数据流

```
用户在个人设置点击"修改密码"
        ↓
ChangePasswordForm (输入当前密码 + 新密码)
        ↓
PasswordStrength (实时显示新密码强度)
        ↓
useChangePassword → changePassword mutation → AAC
        ↓
┌───────┴───────┐
│               │
成功          失败 (当前密码错误)
│               │
↓               ↓
显示成功     显示错误提示
```

---

## 3. 组件设计

### 3.1 ChangePasswordForm

```typescript
interface ChangePasswordFormProps {
  onSuccess: () => void;
  onError?: (error: AuthError) => void;
}
```

### 3.2 PasswordStrength

```typescript
interface PasswordStrengthProps {
  password: string;
  minLength?: number; // 默认 8
  showRequirements?: boolean; // 显示密码要求列表
}

// 密码强度级别
type PasswordStrengthLevel = 'weak' | 'fair' | 'good' | 'strong';
```

**密码强度规则**：

| 级别   | 条件                                                |
| ------ | --------------------------------------------------- |
| weak   | 长度 < minLength                                    |
| fair   | 长度 >= minLength，仅包含字母或数字                 |
| good   | 长度 >= minLength，包含字母 + 数字                  |
| strong | 长度 >= minLength，包含大小写字母 + 数字 + 特殊字符 |

---

## 4. GraphQL

### 4.1 changePassword.gql

```graphql
mutation changePassword($input: ChangePasswordInput!) {
  changePassword(input: $input) {
    success
  }
}
```

---

## 5. 待确认事项

- [ ] 密码复杂度要求（后端策略）
- [ ] 密码历史检查（不能使用最近 N 个密码）
- [ ] 修改密码后是否需要重新登录
