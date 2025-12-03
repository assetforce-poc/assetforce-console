# session - 会话管理子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能 | 组件 | GraphQL | 优先级 |
|------|------|---------|--------|
| Token 刷新 | (自动) | `refreshToken` mutation | P0 |
| 单设备登出 | LogoutConfirmDialog | `logout` mutation | P0 |
| 全设备登出 | SessionList | `logoutAllSessions` mutation | P1 |
| 查看活动会话 | SessionList | `myActiveSessions` query | P1 |
| 撤销指定会话 | SessionList | `revokeSession` mutation | P1 |

---

## 2. 数据流

### 2.1 Token 刷新流程

```
App 启动
    ↓
检查 accessToken 是否过期
    ↓
┌───┴───┐
│       │
有效    过期
│       │
↓       ↓
继续    useRefreshToken → refreshToken mutation → AAC
                                    ↓
                          ┌─────────┴─────────┐
                          │                   │
                       Success            Failure
                          │                   │
                          ↓                   ↓
                    Update tokens      Navigate to login
```

### 2.2 登出流程

```
用户点击"登出"
        ↓
LogoutConfirmDialog (确认对话框)
        ↓
┌───────┴───────┐
│               │
确认            取消
│               │
↓               ↓
logout mutation  关闭对话框
        ↓
清除本地 tokens
跳转登录页
```

---

## 3. 组件设计

### 3.1 SessionList

```typescript
interface SessionListProps {
  sessions: SessionInfo[];
  currentSessionId: string;
  onRevokeSession: (sessionId: string) => void;
  onRevokeAll: () => void;
}
```

### 3.2 LogoutConfirmDialog

```typescript
interface LogoutConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoggingOut?: boolean;
}
```

---

## 4. GraphQL

### 4.1 refreshToken.gql

```graphql
mutation refreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    ...AuthTokens
  }
}
```

### 4.2 logout.gql

```graphql
mutation logout {
  logout {
    success
  }
}
```

### 4.3 logoutAll.gql

```graphql
mutation logoutAllSessions {
  logoutAllSessions {
    success
    revokedCount
  }
}
```

### 4.4 myActiveSessions.gql

```graphql
query myActiveSessions {
  myActiveSessions {
    ...SessionInfo
  }
}
```

### 4.5 revokeSession.gql

```graphql
mutation revokeSession($sessionId: ID!) {
  revokeSession(sessionId: $sessionId) {
    success
  }
}
```

---

## 5. Fragments

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

---

## 6. 待确认事项

- [ ] accessToken 有效期
- [ ] refreshToken 有效期
- [ ] 自动刷新的时机（过期前多久刷新）
