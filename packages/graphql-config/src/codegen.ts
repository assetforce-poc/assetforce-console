import type { CodegenConfig } from '@graphql-codegen/cli';

/**
 * Creates a standard GraphQL Codegen configuration for AssetForce projects
 *
 * @param options - Configuration options
 * @returns CodegenConfig
 */
export function createCodegenConfig(options: {
  /**
   * GraphQL schema URL (defaults to AAC_GRAPHQL_URL env var or localhost:8081)
   */
  schemaUrl?: string;
  /**
   * Document patterns to include (defaults to ['*.gql'])
   */
  documents?: string[];
  /**
   * Output directory (defaults to './generated/')
   */
  outputDir?: string;
}): CodegenConfig {
  const {
    schemaUrl = process.env.AAC_GRAPHQL_URL || 'http://localhost:8081/graphql',
    documents = ['*.gql'],
    outputDir = './generated/',
  } = options;

  return {
    schema: schemaUrl,
    documents,
    generates: {
      [outputDir]: {
        preset: 'client',
        presetConfig: {
          fragmentMasking: false,
          gqlTagName: 'gql',
        },
        config: {
          useTypeImports: true,
          skipTypename: false,
          enumsAsTypes: true,
          documentMode: 'documentNode',
        },
      },
    },
    ignoreNoDocuments: true,
  };
}
