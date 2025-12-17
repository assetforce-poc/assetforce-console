# Auth UI Components Reference

## Component Categories

| Category   | Components                                                                                                                  | Purpose                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Layouts    | AuthLayout, AuthCard                                                                                                        | Page structure and containers |
| Components | AuthHeader, AuthFooter, AuthTabBar, EmailInput, PasswordInput, FormError, SubmitButton                                      | Reusable UI elements          |
| Forms      | LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, ChangePasswordForm, ResendVerificationForm, VerifyEmailPage | Complete authentication flows |

---

## Layouts

### AuthLayout

Main page wrapper providing consistent structure.

**Props**:

| Prop       | Type                   | Default  | Description         |
| ---------- | ---------------------- | -------- | ------------------- |
| `children` | `ReactNode`            | required | Page content        |
| `brand`    | `BrandConfig`          | default  | Brand customization |
| `showLogo` | `boolean`              | `true`   | Show header logo    |
| `maxWidth` | `'xs' \| 'sm' \| 'md'` | `'sm'`   | Container width     |

**Example**:

```tsx
<AuthLayout brand={{ name: 'My App', logo: '🔐' }} maxWidth="sm">
  <AuthCard>{/* form */}</AuthCard>
</AuthLayout>
```

---

### AuthCard

Card container with optional tabs and divider.

**Props**:

| Prop          | Type        | Default  | Description       |
| ------------- | ----------- | -------- | ----------------- |
| `children`    | `ReactNode` | required | Card content      |
| `title`       | `string`    | -        | Card title        |
| `subtitle`    | `string`    | -        | Card subtitle     |
| `tabs`        | `AuthTab[]` | -        | Tab navigation    |
| `showDivider` | `boolean`   | `false`  | Show "or" divider |
| `elevation`   | `number`    | `3`      | Paper elevation   |

**Example**:

```tsx
<AuthCard
  title="Sign In"
  tabs={[
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Sign Up', href: '/auth/register' },
  ]}
>
  <LoginForm />
</AuthCard>
```

---

## Components

### AuthHeader

Displays brand logo and name.

**Props**:

| Prop    | Type          | Default | Description         |
| ------- | ------------- | ------- | ------------------- |
| `brand` | `BrandConfig` | default | Brand configuration |

---

### AuthFooter

Displays "Powered by" text/link.

**Props**:

| Prop    | Type          | Default | Description         |
| ------- | ------------- | ------- | ------------------- |
| `brand` | `BrandConfig` | default | Brand configuration |

---

### AuthTabBar

Navigation tabs for switching between pages.

**Props**:

| Prop        | Type        | Default  | Description          |
| ----------- | ----------- | -------- | -------------------- |
| `tabs`      | `AuthTab[]` | required | Array of tabs        |
| `activeTab` | `string`    | auto     | Currently active tab |

**AuthTab Type**:

```typescript
interface AuthTab {
  label: string;
  href: string;
}
```

---

### EmailInput

Email input field with validation styling.

**Props**:

| Prop       | Type                      | Default   | Description    |
| ---------- | ------------------------- | --------- | -------------- |
| `value`    | `string`                  | -         | Input value    |
| `onChange` | `(value: string) => void` | -         | Change handler |
| `error`    | `string`                  | -         | Error message  |
| `label`    | `string`                  | `'Email'` | Field label    |
| `disabled` | `boolean`                 | `false`   | Disabled state |

---

### PasswordInput

Password input with visibility toggle.

**Props**:

| Prop           | Type                      | Default      | Description             |
| -------------- | ------------------------- | ------------ | ----------------------- |
| `value`        | `string`                  | -            | Input value             |
| `onChange`     | `(value: string) => void` | -            | Change handler          |
| `error`        | `string`                  | -            | Error message           |
| `label`        | `string`                  | `'Password'` | Field label             |
| `showStrength` | `boolean`                 | `false`      | Show strength indicator |

---

### FormError

Displays form-level error messages.

**Props**:

| Prop      | Type        | Default | Description          |
| --------- | ----------- | ------- | -------------------- |
| `message` | `string`    | -       | Error message        |
| `action`  | `ReactNode` | -       | Optional action link |

---

### SubmitButton

Form submit button with loading state.

**Props**:

| Prop       | Type        | Default  | Description    |
| ---------- | ----------- | -------- | -------------- |
| `children` | `ReactNode` | required | Button text    |
| `loading`  | `boolean`   | `false`  | Loading state  |
| `disabled` | `boolean`   | `false`  | Disabled state |

---

## Forms

### LoginForm

Complete login form with validation.

**Props**:

| Prop           | Type                           | Description      |
| -------------- | ------------------------------ | ---------------- |
| `onSuccess`    | `(tokens: AuthTokens) => void` | Success callback |
| `onError`      | `(error: Error) => void`       | Error callback   |
| `defaultEmail` | `string`                       | Pre-filled email |

---

### RegisterForm

User registration form.

**Props**:

| Prop        | Type                     | Description      |
| ----------- | ------------------------ | ---------------- |
| `onSuccess` | `() => void`             | Success callback |
| `onError`   | `(error: Error) => void` | Error callback   |

---

### ForgotPasswordForm

Password reset request form.

**Props**:

| Prop        | Type                     | Description      |
| ----------- | ------------------------ | ---------------- |
| `onSuccess` | `() => void`             | Success callback |
| `onError`   | `(error: Error) => void` | Error callback   |

---

### ResetPasswordForm

Set new password form.

**Props**:

| Prop        | Type                     | Description          |
| ----------- | ------------------------ | -------------------- |
| `token`     | `string`                 | Reset token from URL |
| `onSuccess` | `() => void`             | Success callback     |
| `onError`   | `(error: Error) => void` | Error callback       |

---

### ChangePasswordForm

Change current password (authenticated users).

**Props**:

| Prop        | Type                     | Description      |
| ----------- | ------------------------ | ---------------- |
| `onSuccess` | `() => void`             | Success callback |
| `onError`   | `(error: Error) => void` | Error callback   |

---

### ResendVerificationForm

Resend email verification.

**Props**:

| Prop              | Type         | Description                   |
| ----------------- | ------------ | ----------------------------- |
| `defaultEmail`    | `string`     | Pre-filled email              |
| `cooldownSeconds` | `number`     | Cooldown period (default: 60) |
| `onSuccess`       | `() => void` | Success callback              |

---

### VerifyEmailPage

Email verification status display.

**Props**:

| Prop         | Type         | Description                   |
| ------------ | ------------ | ----------------------------- |
| `token`      | `string`     | Verification token from URL   |
| `onVerified` | `() => void` | Verification success callback |

---

## Theme Configuration

### BrandConfig

```typescript
interface BrandConfig {
  name: string; // Brand name
  logo: string | ReactNode; // Logo URL or component
  logoSize: 'sm' | 'md' | 'lg';
  primaryColor: string;
  showPoweredBy: boolean;
  poweredByText: string;
  poweredByLink: string;
}
```

### Default Brand

```typescript
const defaultBrandConfig: BrandConfig = {
  name: 'AssetForce',
  logo: '🔐',
  logoSize: 'md',
  primaryColor: '#1976d2',
  showPoweredBy: true,
  poweredByText: 'Powered by AssetForce',
  poweredByLink: 'https://assetforce.io',
};
```

---

**Version**: 1.0.0 (2025-12-15)
