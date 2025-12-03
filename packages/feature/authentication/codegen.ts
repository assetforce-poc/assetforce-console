import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8081/graphql', // AAC GraphQL endpoint
  documents: ['src/**/*.gql', 'src/**/*.graphql'],
  generates: {
    './src/graphql/generated/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
      config: {
        useTypeImports: true,
        skipTypename: false,
        enumsAsTypes: true,
        avoidOptionals: false,
        // 🔲 不生成 hooks - 手动在 src/hooks/ 编写
        withHooks: false,
        withComponent: false,
        withHOC: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
