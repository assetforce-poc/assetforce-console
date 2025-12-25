# GraphQL Playground - Federation Gateway

## Overview

The GraphQL Playground provides an interactive interface to test queries against the **SXP (Service Exchange Portal) Federation Gateway**.

**URL**: http://localhost:3200/playground

---

## Quick Start

### 1. Start the services

```bash
# Start all backend services (SGC, AAC, IMC)
cd /path/to/assetforce-infra
./scripts/start.sh -e dev -d all

# Or start only SGC if testing gateway
./scripts/start.sh -e dev -d sgc
```

### 2. Start Admin Console

```bash
cd apps/admin-console
yarn dev
```

### 3. Access Playground

Open http://localhost:3200/playground in your browser.

---

## Configuration

### Environment Variables

The Playground connects to the Federation Gateway via proxy:

```bash
# apps/admin-console/.env.local
SXP_GRAPHQL_URL=http://localhost:8083/exchange/graphql
```

**Flow**:

```
Browser → /api/graphql/sxp (Next.js proxy)
         → http://localhost:8083/exchange/graphql (SGC Gateway)
         → Subgraphs (AAC, IMC, SGC)
```

---

## Example Queries

### Test Gateway Health

```graphql
query HealthCheck {
  __typename
}
```

**Expected**: `{ "__typename": "Query" }`

### List Services

```graphql
query ListServices {
  service {
    list {
      items {
        id
        slug
        displayName
        status
      }
    }
  }
}
```

### List Registered Subgraphs

```graphql
query ListSubgraphs {
  exchange {
    subgraph {
      list {
        items {
          id
          name
          url
          status
          schema {
            hash
            lastFetched
          }
        }
      }
    }
  }
}
```

### Cross-Service Query (Future)

Once AAC and IMC subgraphs are registered:

```graphql
query CrossServiceQuery {
  # From SGC
  service {
    list {
      items {
        id
        slug
      }
    }
  }

  # From AAC (when federated)
  auth {
    me {
      id
      email
    }
  }

  # From IMC (when federated)
  user {
    profile {
      name
    }
  }
}
```

---

## Features

### Schema Explorer

Click **"Docs"** in the Playground to browse the complete GraphQL schema.

### Query History

Playground automatically saves your query history in browser localStorage.

### Variables & Headers

- **Variables**: Use the bottom-left panel to define query variables
- **Headers**: Click "Headers" to add custom headers (e.g., `Authorization: Bearer <token>`)

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (localhost:3200/playground)                │
│  ┌─────────────────────────────────────────────┐   │
│  │  GraphiQL UI                                │   │
│  │  - Schema Explorer                          │   │
│  │  - Query Editor                             │   │
│  │  - Response Viewer                          │   │
│  └──────────────────┬──────────────────────────┘   │
└─────────────────────┼────────────────────────────────┘
                      │ HTTP POST /api/graphql/sxp
                      ▼
┌─────────────────────────────────────────────────────┐
│  Next.js Proxy (apps/admin-console)                 │
│  /api/graphql/sxp/route.ts                          │
│  - Forwards requests to SXP Gateway                 │
│  - Handles CORS                                     │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP POST ${SXP_GRAPHQL_URL}
                   ▼
┌─────────────────────────────────────────────────────┐
│  SGC - SXP Gateway (localhost:8083)                 │
│  /exchange/graphql                                  │
│  - FederationRouter                                 │
│  - SubgraphClient                                   │
│  - Schema Composition                               │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    ┌─────┐   ┌─────┐   ┌─────┐
    │ AAC │   │ IMC │   │ SGC │
    │8081 │   │8082 │   │8083 │
    └─────┘   └─────┘   └─────┘
```

---

## Troubleshooting

### Error: "Failed to fetch schema"

**Cause**: SXP Gateway not running or unreachable

**Solution**:

```bash
# Check if SGC is running
docker ps | grep sgc

# Check SGC logs
docker logs sgc-dev

# Restart SGC
./scripts/restart.sh -e dev -d sgc
```

### Error: "No active subgraphs available"

**Cause**: No subgraphs registered to the gateway

**Solution**:

1. Check registered subgraphs:

   ```graphql
   query {
     exchange {
       subgraph {
         list {
           items {
             name
             status
           }
         }
       }
     }
   }
   ```

2. Register a subgraph via Admin Console:
   - Go to http://localhost:3200/exchange/subgraphs
   - Click "Register Subgraph"
   - Enter subgraph details (e.g., AAC: http://aac-dev:8081/graphql)

### Error: "CORS policy blocked"

**Cause**: CORS configuration issue

**Solution**: SGC SecurityConfig should allow `/exchange/**` endpoints:

```java
// SGC SecurityConfig.java
.requestMatchers("/exchange/**").permitAll()
```

---

## Development

### Testing Local Changes

1. Modify GraphQL schema in SGC
2. Rebuild SGC:
   ```bash
   ./scripts/build.sh -e dev -d sgc
   ```
3. Restart SGC:
   ```bash
   ./scripts/restart.sh -e dev -d sgc
   ```
4. Refresh schema in Playground (reload page)

### Debugging

Enable Chrome DevTools Network tab to inspect GraphQL requests:

- Request URL: `http://localhost:3200/api/graphql/sxp`
- Payload: GraphQL query + variables
- Response: JSON with data or errors

---

## Related Documentation

- **SGC Architecture**: `/service-governance-center/docs/architecture/platform-overview.md`
- **Federation Design**: `/.agent.workspace/tasks/055_sgc_service_contracts_federation_gateway/`
- **GraphQL Schema**: http://localhost:8083/graphql (direct SGC endpoint)

---

**Created**: 2025-12-25
**Last Updated**: 2025-12-25
**Maintainer**: AssetForce Platform Team
