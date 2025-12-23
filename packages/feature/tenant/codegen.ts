import { createCodegenConfig } from '@assetforce/graphql-config/codegen';

export default createCodegenConfig({
  // IMC provides tenant/invite GraphQL API
  schemaUrl: process.env.IMC_GRAPHQL_URL || 'http://localhost:8082/graphql',
  documents: ['graphql/**/*.gql'],
  outputDir: './generated/',
});
