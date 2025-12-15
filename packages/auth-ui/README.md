# @assetforce/auth-ui

Authentication UI components library with better-auth patterns and Material-UI.

## Features

- 🎨 **Unified Auth Layout** - Consistent design across all auth flows
- 🔐 **Better-Auth Patterns** - Security best practices built-in
- 🎭 **Brand Customizable** - Logo, colors, and text fully configurable
- 📱 **Responsive Design** - Mobile-first approach
- ♿ **Accessible** - ARIA labels and keyboard navigation
- 🧩 **Composable** - Use individual components or complete layouts

## Installation

```bash
yarn add @assetforce/auth-ui @assetforce/auth @assetforce/material
```

## Usage

### Basic Login Page

```tsx
import { AuthLayout, AuthCard } from '@assetforce/auth-ui';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Sign In"
        subtitle="Welcome back!"
        tabs={[
          { label: 'Sign In', href: '/auth/login' },
          { label: 'Sign Up', href: '/auth/register' },
        ]}
        activeTab="login"
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
```

### Custom Branding

```tsx
<AuthLayout
  brand={{
    name: 'My Company',
    logo: '/logo.png',
    logoSize: 'lg',
    showPoweredBy: false,
  }}
  maxWidth="md"
>
  <AuthCard>...</AuthCard>
</AuthLayout>
```

### Supported Scenarios

- Login (`/auth/login`)
- Register (`/auth/register`)
- Email Verification (`/auth/verify/email`)
- Resend Verification (`/auth/verify/email/resend`)
- Forgot Password (`/auth/forgot/password`)
- Reset Password (`/auth/reset/password`)

## Components

### AuthLayout

Main layout wrapper for all authentication pages.

**Props**:

- `brand` - Brand configuration (name, logo, powered by text)
- `maxWidth` - Container max width ('xs' | 'sm' | 'md')
- `showLogo` - Show logo in header (default: true)
- `children` - Page content

### AuthCard

Reusable card component for auth forms.

**Props**:

- `title` - Card title
- `subtitle` - Card subtitle
- `tabs` - Tab navigation (Login ↔ Register)
- `activeTab` - Currently active tab
- `showDivider` - Show "or" divider (default: false)
- `socialProviders` - Social login buttons (future)
- `children` - Form content

### AuthHeader

Header component with logo and title.

### AuthFooter

Footer component with "Powered by" text.

### AuthTabBar

Tab navigation component for switching between auth flows.

## Design Principles

1. **Security First** - Implements better-auth patterns (anti-enumeration, rate limiting)
2. **Accessibility** - WCAG 2.1 Level AA compliant
3. **Responsive** - Mobile-first design
4. **Customizable** - All branding and styling can be overridden
5. **Composable** - Use components individually or as complete layouts

## License

MIT © AssetForce
