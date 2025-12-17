# Auth UI Usage Guide

## Installation

```bash
# Add to workspace dependencies
yarn add @assetforce/auth-ui
```

**Peer Dependencies**:

```json
{
  "@assetforce/material": "^6.0.0",
  "react": "^18.0.0",
  "next": "^15.0.0"
}
```

---

## Quick Start

### Basic Login Page

```tsx
// app/auth/login/page.tsx
import { AuthLayout, AuthCard, LoginForm } from '@assetforce/auth-ui';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        tabs={[
          { label: 'Sign In', href: '/auth/login' },
          { label: 'Sign Up', href: '/auth/register' },
        ]}
      >
        <LoginForm
          onSuccess={(tokens) => {
            // Handle successful login
            router.push('/dashboard');
          }}
          onError={(error) => {
            console.error('Login failed:', error);
          }}
        />
      </AuthCard>
    </AuthLayout>
  );
}
```

---

## Brand Customization

### Customer Portal

```tsx
const customerBrand = {
  name: 'AssetForce Portal',
  logo: '🔐',
  logoSize: 'md',
  primaryColor: '#1976d2',
  showPoweredBy: true,
  poweredByText: 'Powered by AssetForce',
};

<AuthLayout brand={customerBrand}>{/* ... */}</AuthLayout>;
```

### Admin Console

```tsx
const adminBrand = {
  name: 'AssetForce Admin',
  logo: '⚙️',
  logoSize: 'md',
  primaryColor: '#9c27b0',
  showPoweredBy: false,
};

<AuthLayout brand={adminBrand}>{/* ... */}</AuthLayout>;
```

---

## Page Examples

### Login with Tabs

```tsx
<AuthCard
  tabs={[
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Sign Up', href: '/auth/register' },
  ]}
>
  <LoginForm onSuccess={handleSuccess} />
</AuthCard>
```

### Register with Tabs

```tsx
<AuthCard
  tabs={[
    { label: 'Sign In', href: '/auth/login' },
    { label: 'Sign Up', href: '/auth/register' },
  ]}
>
  <RegisterForm onSuccess={handleSuccess} />
</AuthCard>
```

### Forgot Password (No Tabs)

```tsx
<AuthCard title="Forgot Password" subtitle="Enter your email to receive a reset link">
  <ForgotPasswordForm onSuccess={handleSuccess} />
</AuthCard>
```

### Verify Email

```tsx
<AuthCard title="Verify Email">
  <VerifyEmailPage token={searchParams.token} onVerified={handleVerified} />
</AuthCard>
```

---

## Custom Forms

### Using Base Components

```tsx
import { EmailInput, PasswordInput, SubmitButton, FormError } from '@assetforce/auth-ui';

function CustomLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // custom logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmailInput value={email} onChange={setEmail} error={/* field error */} />
      <PasswordInput value={password} onChange={setPassword} error={/* field error */} />
      {error && <FormError message={error} />}
      <SubmitButton loading={loading}>Sign In</SubmitButton>
    </form>
  );
}
```

---

## Integration with Next.js App Router

### Middleware Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### URL Redirects

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/auth/verify-email',
        destination: '/auth/verify/email',
        permanent: true,
      },
      {
        source: '/auth/registration-success',
        destination: '/auth/register/success',
        permanent: true,
      },
    ];
  },
};
```

---

## Testing

### Unit Test Example

```tsx
import { render, screen } from '@testing-library/react';
import { AuthCard } from '@assetforce/auth-ui';

describe('AuthCard', () => {
  it('renders title', () => {
    render(<AuthCard title="Sign In">Content</AuthCard>);
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test('login flow', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## Exports

```typescript
// Main exports
export {
  // Layouts
  AuthLayout,
  AuthCard,
  // Components
  AuthHeader,
  AuthFooter,
  AuthTabBar,
  EmailInput,
  PasswordInput,
  FormError,
  SubmitButton,
  // Forms
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  ChangePasswordForm,
  ResendVerificationForm,
  VerifyEmailPage,
  // Types
  type BrandConfig,
  type AuthTab,
} from '@assetforce/auth-ui';
```

---

**Version**: 1.0.0 (2025-12-15)
