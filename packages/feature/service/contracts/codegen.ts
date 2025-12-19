import { createCodegenConfig } from '@assetforce/graphql-config/codegen';

export default createCodegenConfig({
  schemaUrl: process.env.SGC_GRAPHQL_URL || 'http://localhost:8083/graphql',
  documents: ['**/*.gql'],
  outputDir: './generated/',
});
