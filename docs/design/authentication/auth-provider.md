# auth-provider - 认证方式管理子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能               | 组件               | GraphQL                       | 优先级 |
| ------------------ | ------------------ | ----------------------------- | ------ |
| 查看已绑定认证方式 | AuthProviderList   | `myAuthProviders` query       | P1     |
| 绑定新认证方式     | LinkProviderButton | `linkAuthProvider` mutation   | P1     |
| 解绑认证方式       | AuthProviderList   | `unlinkAuthProvider` mutation | P1     |

---

## 2. 数据流

```
用户在个人设置查看"认证方式"
        ↓
AuthProviderList → myAuthProviders query → AAC
        ↓
显示已绑定列表 (Google, Azure AD, Keycloak 等)
        ↓
┌───────────────┴───────────────┐
│                               │
点击"绑定"                    点击"解绑"
│                               │
↓                               ↓
LinkProviderButton          unlinkAuthProvider mutation
→ Keycloak OAuth 流程               ↓
→ linkAuthProvider mutation    刷新列表
        ↓
    刷新列表
```

---

## 3. 组件设计

### 3.1 AuthProviderList

```typescript
interface AuthProviderListProps {
  providers: AuthProviderInfo[];
  onLink: (providerId: string) => void;
  onUnlink: (providerId: string) => void;
  isLoading?: boolean;
}
```

### 3.2 LinkProviderButton

```typescript
interface LinkProviderButtonProps {
  providerId: 'google' | 'azure-ad' | 'keycloak';
  providerName: string;
  onSuccess: () => void;
  onError?: (error: AuthError) => void;
}
```

---

## 4. GraphQL

### 4.1 myAuthProviders.gql

```graphql
query myAuthProviders {
  myAuthProviders {
    ...AuthProviderInfo
  }
}
```

### 4.2 linkAuthProvider.gql

```graphql
mutation linkAuthProvider($input: LinkAuthProviderInput!) {
  linkAuthProvider(input: $input) {
    success
    provider {
      ...AuthProviderInfo
    }
  }
}
```

### 4.3 unlinkAuthProvider.gql

```graphql
mutation unlinkAuthProvider($providerId: ID!) {
  unlinkAuthProvider(providerId: $providerId) {
    success
  }
}
```

---

## 5. Fragments

```graphql
fragment AuthProviderInfo on AuthProvider {
  providerId # google | azure-ad | keycloak
  providerName
  email
  linkedAt
}
```

---

## 6. 待确认事项

- [ ] 解绑时是否需要验证密码
- [ ] 最后一个认证方式能否解绑（需保留至少一种登录方式）
- [ ] 绑定冲突处理（该 OAuth 账号已绑定其他用户）
