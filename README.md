# AssetForce Console

Frontend applications for AssetForce platform.

## Apps

| App             | Port | Description                       |
| --------------- | ---- | --------------------------------- |
| Customer Portal | 3000 | Customer-facing web application   |
| Admin Console   | 3001 | Administrative management console |

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run type checking
yarn type-check
```

## Test Users

### Single Tenant Mode

| Username     | Password    | Description                                 |
| ------------ | ----------- | ------------------------------------------- |
| `singleuser` | `single123` | User with 1 tenant (auto-proceeds to login) |

### Multi Tenant Mode

| Username              | Password   | Tenants | Description                                         |
| --------------------- | ---------- | ------- | --------------------------------------------------- |
| `multi-tenant-user`   | `Test123!` | 2       | User with multiple tenants (shows tenant selection) |

**Available Tenants:**

| Realm ID          | Name            | Type       |
| ----------------- | --------------- | ---------- |
| `assetforce-test` | AssetForce Test | PRODUCTION |
| `company-demo`    | Demo Company    | DEMO       |

### Single Tenant Mode

| Username              | Password   | Tenants | Description                      |
| --------------------- | ---------- | ------- | -------------------------------- |
| `single-tenant-user`  | `Test123!` | 1       | User with single tenant (direct) |

## Login Page

Access the login page at: `http://localhost:3000/auth/login`

Use the dropdown to select login mode:

- **Single Tenant**: Direct login with realm specified
- **Multi Tenant**: Authenticate → Select tenant → Complete login

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Customer Portal                        │
│                    (Next.js App)                         │
└────────────────────────┬────────────────────────────────┘
                         │ /api/graphql (proxy)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                        AAC                               │
│          (Authentication & Authorization Center)         │
│                                                          │
│  - authenticate(username, password)                      │
│    → returns: subject, availableRealms                   │
│  - selectTenant(subject, realmId)                        │
│    → returns: token, identityContext                     │
│  - login(username, password, realm)                      │
│    → returns: token (single-tenant mode)                 │
└────────────────────────┬────────────────────────────────┘
                         │ internal call
                         ▼
┌─────────────────────────────────────────────────────────┐
│                        IMC                               │
│           (Identity Management Center)                   │
│                                                          │
│  - availableRealms(subject)                              │
│  - buildIdentityContext(zone, realm, subject)            │
│  - userBySubject(zone, realm, subject)                   │
└─────────────────────────────────────────────────────────┘
```

## Related Repositories

- [assetforce-infra](../assetforce-infra) - Docker/K8s infrastructure
- [authentication-authorization-center](../authentication-authorization-center) - AAC service
- [identity-management-center](../identity-management-center) - IMC service
