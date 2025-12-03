# mfa - 多因素认证子功能详细设计

- **Status**: Draft (暂存内容待规整)
- **Parent**: [authentication/README.md](./README.md)

---

## 1. 功能清单

| 功能          | 组件            | GraphQL                   | 优先级 |
| ------------- | --------------- | ------------------------- | ------ |
| TOTP 验证     | MFAVerification | `completeMFA` mutation    | P0     |
| SMS 验证      | MFAVerification | `completeMFA` mutation    | P1     |
| Email 验证    | MFAVerification | `completeMFA` mutation    | P2     |
| 启用 TOTP     | TOTPSetup       | `enableMFA` mutation      | P0     |
| 验证 MFA 设置 | TOTPSetup       | `verifyMFASetup` mutation | P0     |
| 禁用 MFA      | -               | `disableMFA` mutation     | P1     |
| 显示备份码    | BackupCodes     | `enableMFA` response      | P0     |

---

## 2. 数据流

### 2.1 MFA 验证流程

```
Login returns mfaRequired=true
        ↓
Navigate to /login/mfa
        ↓
MFAVerification → useCompleteMFA → completeMFA mutation → AAC
                                          ↓
                                   Success + Tokens
                                          ↓
                                   Store tokens
                                   Navigate to app
```

### 2.2 MFA 设置流程

```
用户在设置页面点击"启用 MFA"
        ↓
TOTPSetup → enableMFA mutation → AAC
        ↓
返回 QR Code + Secret + Backup Codes
        ↓
用户扫描 QR Code，输入验证码
        ↓
verifyMFASetup mutation → AAC
        ↓
MFA 启用成功
```

---

## 3. 组件设计

### 3.1 MFAVerification

```typescript
interface MFAVerificationProps {
  challenge: MFAChallenge;
  onSuccess: (tokens: AuthTokens) => void;
  onError?: (error: AuthError) => void;
  onCancel?: () => void;
}
```

### 3.2 TOTPSetup

```typescript
interface TOTPSetupProps {
  onSuccess: (backupCodes: string[]) => void;
  onError?: (error: AuthError) => void;
  onCancel?: () => void;
}
```

### 3.3 BackupCodes

```typescript
interface BackupCodesProps {
  codes: string[];
  onConfirm: () => void; // 用户确认已保存
  onDownload?: () => void;
  onPrint?: () => void;
}
```

---

## 4. GraphQL

### 4.1 completeMFA.gql

```graphql
mutation completeMFA($input: CompleteMFAInput!) {
  completeMFA(input: $input) {
    ...AuthTokens
  }
}
```

### 4.2 enableMFA.gql

```graphql
mutation enableMFA($method: MFAMethod!) {
  enableMFA(method: $method) {
    ...MFASetup
  }
}
```

### 4.3 verifyMFASetup.gql

```graphql
mutation verifyMFASetup($input: VerifyMFASetupInput!) {
  verifyMFASetup(input: $input) {
    success
    backupCodes
  }
}
```

### 4.4 disableMFA.gql

```graphql
mutation disableMFA($input: DisableMFAInput!) {
  disableMFA(input: $input) {
    success
  }
}
```

---

## 5. Fragments

```graphql
fragment MFAChallenge on MFAChallengeResponse {
  challengeId
  method # TOTP | SMS | EMAIL
  expiresAt
}

fragment MFASetup on MFASetupResponse {
  secret
  qrCodeUrl
  backupCodes
}
```

---

## 6. 待确认事项

- [ ] MFA 验证码有效期
- [ ] 备份码数量和格式
- [ ] SMS/Email 验证的发送频率限制
