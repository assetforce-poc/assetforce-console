import { createCodegenConfig } from '@assetforce/graphql-config/codegen';

export default createCodegenConfig({
  documents: ['**/*.gql'],
  outputDir: './generated/',
});
