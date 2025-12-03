import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8081/graphql', // AAC GraphQL endpoint
  documents: ['src/**/*.gql', 'src/**/*.graphql'],
  generates: {
    './src/graphql/generated/': {
      preset: 'client',
      presetConfig: {
        fragmentMasking: false,
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
        skipTypename: false,
        enumsAsTypes: true,
        // 生成 typed document nodes，可以直接 import
        documentMode: 'documentNode',

        // 🔲 不生成 hooks/components/HOC - 手动在 src/hooks/ 编写
        // 注：client preset 默认不生成这些，以下配置为明确说明
        withHooks: false,
        withComponent: false,
        withHOC: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
