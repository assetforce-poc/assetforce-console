# @assetforce/auth-ui Documentation

Unified authentication UI component library for AssetForce platform.

## Contents

- [architecture.md](./architecture.md) — UI/UX layout architecture and component hierarchy
- [components.md](./components.md) — Component reference and API documentation
- [usage.md](./usage.md) — Usage examples and integration guide

## Overview

`@assetforce/auth-ui` provides reusable authentication components for both **Customer Portal** and **Admin Console**. All components support brand customization via `BrandConfig`.

## Package Structure

```
packages/auth-ui/src/
├── layouts/           Page layouts (AuthLayout, AuthCard)
├── components/        Base components (Header, Footer, TabBar, Inputs)
├── forms/             Complete forms (Login, Register, Password, etc.)
├── hooks/             React hooks
├── themes/            Theme configuration
└── adapter/           Platform adapters
```

## Target Applications

| Application | Brand | Primary Color |
|-------------|-------|---------------|
| Customer Portal | 🔐 AssetForce Portal | `#1976d2` |
| Admin Console | ⚙️ AssetForce Admin | `#9c27b0` |

---

**Version**: 1.0.0 (2025-12-15)
