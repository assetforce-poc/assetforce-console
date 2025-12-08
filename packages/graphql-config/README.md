# @assetforce/graphql-codegen-config

Shared GraphQL Codegen configuration for AssetForce projects.

## Usage

```typescript
// codegen.ts
import { createCodegenConfig } from '@assetforce/graphql-codegen-config';

export default createCodegenConfig({
  // Optional: customize schema URL
  schemaUrl: process.env.AAC_GRAPHQL_URL,

  // Optional: customize document patterns
  documents: ['*.gql', 'queries/**/*.gql'],

  // Optional: customize output directory
  outputDir: './generated/',
});
```

## Default Configuration

- **Schema**: `process.env.AAC_GRAPHQL_URL` or `http://localhost:8081/graphql`
- **Documents**: `['*.gql']`
- **Output**: `./generated/`
- **Preset**: `client` with fragment masking disabled
- **Config**: TypeScript imports, enums as types, document node mode
